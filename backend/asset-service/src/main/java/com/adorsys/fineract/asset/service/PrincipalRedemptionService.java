package com.adorsys.fineract.asset.service;

import com.adorsys.fineract.asset.client.FineractClient;
import com.adorsys.fineract.asset.config.AssetServiceConfig;
import com.adorsys.fineract.asset.dto.AssetStatus;
import com.adorsys.fineract.asset.dto.RedemptionTriggerResponse;
import com.adorsys.fineract.asset.dto.RedemptionTriggerResponse.HolderRedemptionDetail;
import com.adorsys.fineract.asset.entity.Asset;
import com.adorsys.fineract.asset.entity.PrincipalRedemption;
import com.adorsys.fineract.asset.entity.UserPosition;
import com.adorsys.fineract.asset.exception.AssetException;
import com.adorsys.fineract.asset.metrics.AssetMetrics;
import com.adorsys.fineract.asset.repository.AssetRepository;
import com.adorsys.fineract.asset.repository.PrincipalRedemptionRepository;
import com.adorsys.fineract.asset.repository.UserPositionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Handles principal redemption for matured bonds.
 * <p>
 * Admin triggers redemption via POST /api/admin/assets/{id}/redeem.
 * For each holder: returns asset units to treasury and pays face value from treasury cash.
 * No fee or spread — principal is returned at par.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class PrincipalRedemptionService {

    private final AssetRepository assetRepository;
    private final UserPositionRepository userPositionRepository;
    private final PrincipalRedemptionRepository principalRedemptionRepository;
    private final FineractClient fineractClient;
    private final AssetServiceConfig assetServiceConfig;
    private final PortfolioService portfolioService;
    private final AssetMetrics assetMetrics;

    /**
     * Redeem principal for all holders of a matured bond.
     * <p>
     * Pre-conditions: bond must be MATURED, treasury accounts configured, sufficient funds.
     * Per-holder failures are isolated — failed holders can be retried by calling again.
     *
     * @param assetId the bond asset ID
     * @return summary of the redemption run
     */
    @Transactional
    public RedemptionTriggerResponse redeemBond(String assetId) {
        // 1. Load and validate bond
        Asset bond = assetRepository.findById(assetId)
                .orElseThrow(() -> new AssetException("Asset not found: " + assetId));

        if (bond.getStatus() != AssetStatus.MATURED) {
            throw new AssetException(
                    "Bond " + bond.getSymbol() + " is not MATURED (status=" + bond.getStatus() + "). "
                    + "Only MATURED bonds can be redeemed.");
        }

        if (bond.getTreasuryCashAccountId() == null || bond.getTreasuryAssetAccountId() == null) {
            throw new AssetException("Bond " + bond.getSymbol() + " is missing treasury account configuration");
        }

        BigDecimal faceValue = bond.getManualPrice();
        if (faceValue == null || faceValue.compareTo(BigDecimal.ZERO) <= 0) {
            throw new AssetException("Bond " + bond.getSymbol() + " has no face value configured");
        }

        LocalDate redemptionDate = LocalDate.now();

        // 2. Find all holders with positive units
        List<UserPosition> holders = userPositionRepository.findHoldersByAssetId(assetId, BigDecimal.ZERO);

        // 3. Filter out already-redeemed holders (enables retry on partial failure)
        List<PrincipalRedemption> existing = principalRedemptionRepository.findByAssetId(assetId);
        Set<Long> alreadySucceeded = existing.stream()
                .filter(r -> "SUCCESS".equals(r.getStatus()))
                .map(PrincipalRedemption::getUserId)
                .collect(Collectors.toSet());

        List<UserPosition> pendingHolders = holders.stream()
                .filter(h -> !alreadySucceeded.contains(h.getUserId()))
                .toList();

        if (pendingHolders.isEmpty() && !holders.isEmpty()) {
            // All holders already redeemed — ensure bond is marked REDEEMED
            if (bond.getStatus() != AssetStatus.REDEEMED) {
                bond.setStatus(AssetStatus.REDEEMED);
                assetRepository.save(bond);
            }
            return new RedemptionTriggerResponse(
                    assetId, bond.getSymbol(), redemptionDate,
                    holders.size(), alreadySucceeded.size(), 0,
                    BigDecimal.ZERO, BigDecimal.ZERO,
                    AssetStatus.REDEEMED.name(), List.of());
        }

        if (holders.isEmpty()) {
            // No holders at all — mark as REDEEMED immediately
            bond.setStatus(AssetStatus.REDEEMED);
            assetRepository.save(bond);
            return new RedemptionTriggerResponse(
                    assetId, bond.getSymbol(), redemptionDate,
                    0, 0, 0, BigDecimal.ZERO, BigDecimal.ZERO,
                    AssetStatus.REDEEMED.name(), List.of());
        }

        // 4. Pre-flight: calculate total obligation and check treasury balance
        BigDecimal totalObligation = pendingHolders.stream()
                .map(h -> h.getTotalUnits().multiply(faceValue).setScale(0, RoundingMode.HALF_UP))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal treasuryBalance = BigDecimal.ZERO;
        try {
            treasuryBalance = fineractClient.getAccountBalance(bond.getTreasuryCashAccountId());
        } catch (Exception e) {
            log.warn("Could not check treasury balance for bond {}: {}", bond.getSymbol(), e.getMessage());
        }

        if (treasuryBalance.compareTo(totalObligation) < 0) {
            throw new AssetException(String.format(
                    "Insufficient treasury balance for bond %s. "
                    + "Required: %s XAF, Available: %s XAF, Shortfall: %s XAF",
                    bond.getSymbol(), totalObligation, treasuryBalance,
                    totalObligation.subtract(treasuryBalance)));
        }

        log.info("Starting principal redemption for bond {}: {} pending holders (of {} total), obligation={}",
                bond.getSymbol(), pendingHolders.size(), holders.size(), totalObligation);

        // 5. Process each holder individually (failures isolated)
        String currency = assetServiceConfig.getSettlementCurrency();
        int successCount = 0;
        int failCount = 0;
        BigDecimal totalPaid = BigDecimal.ZERO;
        BigDecimal totalFailed = BigDecimal.ZERO;
        List<HolderRedemptionDetail> details = new ArrayList<>();

        for (UserPosition holder : pendingHolders) {
            RedeemResult result = redeemHolder(bond, holder, faceValue, redemptionDate, currency);
            BigDecimal holderCash = holder.getTotalUnits().multiply(faceValue).setScale(0, RoundingMode.HALF_UP);

            details.add(new HolderRedemptionDetail(
                    holder.getUserId(), holder.getTotalUnits(), holderCash,
                    result.status, result.failureReason));

            if ("SUCCESS".equals(result.status)) {
                successCount++;
                totalPaid = totalPaid.add(holderCash);
            } else {
                failCount++;
                totalFailed = totalFailed.add(holderCash);
            }
        }

        // 6. Update bond status
        boolean allSucceeded = failCount == 0;
        if (allSucceeded) {
            bond.setStatus(AssetStatus.REDEEMED);
            assetRepository.save(bond);
            log.info("Bond {} fully redeemed: {} holders paid, total={} XAF",
                    bond.getSymbol(), successCount + alreadySucceeded.size(), totalPaid);
        } else {
            log.warn("Bond {} partial redemption: {} paid, {} failed. Bond remains MATURED for retry.",
                    bond.getSymbol(), successCount, failCount);
        }

        String finalStatus = allSucceeded ? AssetStatus.REDEEMED.name() : AssetStatus.MATURED.name();
        assetMetrics.recordBondRedeemed(successCount, totalPaid.doubleValue());

        return new RedemptionTriggerResponse(
                assetId, bond.getSymbol(), redemptionDate,
                pendingHolders.size(), successCount, failCount,
                totalPaid, totalFailed, finalStatus, details);
    }

    /**
     * Redeem principal for a single holder. Never throws — all failures captured.
     * Asset leg executes first (safer: if cash fails, treasury still has the money).
     */
    private RedeemResult redeemHolder(Asset bond, UserPosition holder,
                                      BigDecimal faceValue, LocalDate redemptionDate,
                                      String currency) {
        BigDecimal units = holder.getTotalUnits();
        BigDecimal cashAmount = units.multiply(faceValue).setScale(0, RoundingMode.HALF_UP);

        PrincipalRedemption.PrincipalRedemptionBuilder record = PrincipalRedemption.builder()
                .assetId(bond.getId())
                .userId(holder.getUserId())
                .units(units)
                .faceValue(faceValue)
                .cashAmount(cashAmount)
                .redemptionDate(redemptionDate);

        try {
            // a. Find user's XAF cash account
            Long userCashAccountId = fineractClient.findClientSavingsAccountByCurrency(
                    holder.getUserId(), currency);
            if (userCashAccountId == null) {
                throw new RuntimeException("No active " + currency
                        + " account for user " + holder.getUserId());
            }

            // b. Asset leg first: user asset account → treasury asset account
            String assetDescription = String.format("Principal redemption — asset return: %s (%.8f units)",
                    bond.getSymbol(), units);
            Long assetTransferId = fineractClient.createAccountTransfer(
                    holder.getFineractSavingsAccountId(), bond.getTreasuryAssetAccountId(),
                    units, assetDescription);

            // c. Cash leg: treasury cash account → user XAF account
            String cashDescription = String.format("Principal redemption: %s (%.8f units @ %s face value)",
                    bond.getSymbol(), units, faceValue);
            Long cashTransferId = fineractClient.createAccountTransfer(
                    bond.getTreasuryCashAccountId(), userCashAccountId,
                    cashAmount, cashDescription);

            // d. Update position: zero out units, record realized P&L
            BigDecimal realizedPnl = portfolioService.updatePositionAfterSell(
                    holder.getUserId(), bond.getId(), units, faceValue);

            // e. Decrement circulating supply
            assetRepository.adjustCirculatingSupply(bond.getId(), units.negate());

            // f. Save audit record
            record.fineractCashTransferId(cashTransferId)
                  .fineractAssetTransferId(assetTransferId)
                  .realizedPnl(realizedPnl)
                  .status("SUCCESS");
            principalRedemptionRepository.save(record.build());

            log.info("Principal redeemed: bond={}, user={}, units={}, cash={}, pnl={}, cashTx={}, assetTx={}",
                    bond.getSymbol(), holder.getUserId(), units, cashAmount, realizedPnl,
                    cashTransferId, assetTransferId);

            return new RedeemResult("SUCCESS", null);

        } catch (Exception e) {
            String reason = truncate(e.getMessage(), 500);
            record.status("FAILED").failureReason(reason);
            log.error("Redemption failed: bond={}, user={}, units={}, error={}",
                    bond.getSymbol(), holder.getUserId(), units, e.getMessage());
            principalRedemptionRepository.save(record.build());
            return new RedeemResult("FAILED", reason);
        }
    }

    private record RedeemResult(String status, String failureReason) {}

    private static String truncate(String s, int maxLen) {
        return s != null && s.length() > maxLen ? s.substring(0, maxLen) : s;
    }
}
