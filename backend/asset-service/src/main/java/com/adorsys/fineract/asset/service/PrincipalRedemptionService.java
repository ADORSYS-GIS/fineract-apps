package com.adorsys.fineract.asset.service;

import com.adorsys.fineract.asset.client.FineractClient;
import com.adorsys.fineract.asset.client.FineractClient.BatchOperation;
import com.adorsys.fineract.asset.client.FineractClient.BatchTransferOp;
import com.adorsys.fineract.asset.config.AssetServiceConfig;
import com.adorsys.fineract.asset.dto.AssetStatus;
import com.adorsys.fineract.asset.dto.BondType;
import com.adorsys.fineract.asset.dto.RedemptionTriggerResponse;
import com.adorsys.fineract.asset.dto.RedemptionTriggerResponse.HolderRedemptionDetail;
import com.adorsys.fineract.asset.entity.Asset;
import com.adorsys.fineract.asset.entity.FineractOutboxEntry;
import com.adorsys.fineract.asset.entity.PrincipalRedemption;
import com.adorsys.fineract.asset.entity.UserPosition;
import com.adorsys.fineract.asset.exception.AssetException;
import com.adorsys.fineract.asset.metrics.AssetMetrics;
import com.adorsys.fineract.asset.repository.AssetRepository;
import com.adorsys.fineract.asset.repository.PrincipalRedemptionRepository;
import com.adorsys.fineract.asset.repository.ScheduledPaymentRepository;
import com.adorsys.fineract.asset.repository.UserPositionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Handles principal redemption for matured bonds.
 * <p>
 * Admin triggers redemption via POST /api/admin/assets/{id}/redeem.
 * For each holder: returns asset units to LP and pays face value from LP cash.
 * No fee or spread — principal is returned at par.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class PrincipalRedemptionService {

    private final AssetRepository assetRepository;
    private final UserPositionRepository userPositionRepository;
    private final PrincipalRedemptionRepository principalRedemptionRepository;
    private final ScheduledPaymentRepository scheduledPaymentRepository;
    private final FineractClient fineractClient;
    private final AssetServiceConfig assetServiceConfig;
    private final PortfolioService portfolioService;
    private final TaxService taxService;
    private final AssetMetrics assetMetrics;
    private final FineractOutboxService outboxService;

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

        if (bond.getLpCashAccountId() == null || bond.getLpAssetAccountId() == null) {
            throw new AssetException("Bond " + bond.getSymbol() + " is missing LP account configuration");
        }

        // Block redemption when there are pending coupon schedules.
        // Coupon holders must receive their final coupon before the bond is redeemed,
        // otherwise the income history will be incomplete and the IRCM obligation unresolved.
        if (scheduledPaymentRepository.existsByAssetIdAndPaymentTypeAndStatus(
                assetId, "COUPON", "PENDING")) {
            throw new AssetException(
                    "Bond " + bond.getSymbol() + " has a PENDING coupon payment that must be confirmed "
                    + "before redemption can be processed. Confirm or cancel the pending coupon first.");
        }

        BigDecimal faceValue = bond.getEffectiveFaceValue();
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
                assetRepository.updateStatus(bond.getId(), AssetStatus.REDEEMED);
            }
            return new RedemptionTriggerResponse(
                    assetId, bond.getSymbol(), redemptionDate,
                    holders.size(), alreadySucceeded.size(), 0,
                    BigDecimal.ZERO, BigDecimal.ZERO,
                    AssetStatus.REDEEMED.name(), List.of());
        }

        if (holders.isEmpty()) {
            // No holders at all — mark as REDEEMED immediately
            assetRepository.updateStatus(bond.getId(), AssetStatus.REDEEMED);
            return new RedemptionTriggerResponse(
                    assetId, bond.getSymbol(), redemptionDate,
                    0, 0, 0, BigDecimal.ZERO, BigDecimal.ZERO,
                    AssetStatus.REDEEMED.name(), List.of());
        }

        // 4. Pre-flight: calculate total obligation and check LP cash balance
        BigDecimal totalObligation = pendingHolders.stream()
                .map(h -> h.getTotalUnits().multiply(faceValue).setScale(0, RoundingMode.HALF_UP))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal lpCashBalance = BigDecimal.ZERO;
        try {
            lpCashBalance = fineractClient.getAccountBalance(bond.getLpCashAccountId());
        } catch (Exception e) {
            log.warn("Could not check LP cash balance for bond {}: {}", bond.getSymbol(), e.getMessage());
        }

        if (lpCashBalance.compareTo(totalObligation) < 0) {
            throw new AssetException(String.format(
                    "Insufficient LP cash balance for bond %s. "
                    + "Required: %s XAF, Available: %s XAF, Shortfall: %s XAF",
                    bond.getSymbol(), totalObligation, lpCashBalance,
                    totalObligation.subtract(lpCashBalance)));
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

        // 6. Update bond status — use @Modifying query to avoid a full-entity save
        //    that would overwrite circulatingSupply set by adjustCirculatingSupply()
        boolean allSucceeded = failCount == 0;
        if (allSucceeded) {
            assetRepository.updateStatus(bond.getId(), AssetStatus.REDEEMED);
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
     *
     * <p>For DISCOUNT (BTA) bonds with IRCM enabled: IRCM is applied to the capital gain
     * (faceValue - avgPurchasePrice) per unit. The net cash amount after IRCM deduction is
     * transferred to the user; the IRCM amount is transferred to the tax authority account.
     */
    private RedeemResult redeemHolder(Asset bond, UserPosition holder,
                                      BigDecimal faceValue, LocalDate redemptionDate,
                                      String currency) {
        BigDecimal units = holder.getTotalUnits();
        BigDecimal grossCashAmount = units.multiply(faceValue).setScale(0, RoundingMode.HALF_UP);

        // For BTA discount bonds, compute IRCM on the capital gain (faceValue - avgPurchasePrice)
        BigDecimal ircmAmount = BigDecimal.ZERO;
        if (bond.getBondType() == BondType.DISCOUNT) {
            BigDecimal ircmRate = taxService.getEffectiveIrcmRate(bond);
            if (ircmRate.compareTo(BigDecimal.ZERO) > 0 && holder.getAvgPurchasePrice() != null) {
                BigDecimal gainPerUnit = faceValue.subtract(holder.getAvgPurchasePrice());
                if (gainPerUnit.compareTo(BigDecimal.ZERO) > 0) {
                    BigDecimal totalGain = gainPerUnit.multiply(units).setScale(0, RoundingMode.HALF_UP);
                    ircmAmount = totalGain.multiply(ircmRate).setScale(0, RoundingMode.HALF_UP);
                }
            }
        }
        BigDecimal cashAmount = grossCashAmount.subtract(ircmAmount);

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

            // b. Build atomic batch: all 3 legs in one transaction
            List<BatchOperation> ops = new ArrayList<>();
            ops.add(new BatchTransferOp(
                    holder.getFineractSavingsAccountId(), bond.getLpAssetAccountId(),
                    units, "Principal redemption — asset return: " + bond.getSymbol()));
            ops.add(new BatchTransferOp(
                    bond.getLpCashAccountId(), userCashAccountId,
                    cashAmount, String.format("Principal redemption: %s (net of IRCM %s)", bond.getSymbol(), ircmAmount)));
            if (ircmAmount.compareTo(BigDecimal.ZERO) > 0) {
                ops.add(new BatchTransferOp(
                        bond.getLpCashAccountId(), taxService.getIrcmAccountId(),
                        ircmAmount, "IRCM on BTA capital gain: " + bond.getSymbol() + " user=" + holder.getUserId()));
            }

            // c. Write outbox before Fineract (REQUIRES_NEW — persists regardless of outer TX)
            String idempotencyKey = "REDEEM-" + bond.getId() + "-" + holder.getUserId();
            FineractOutboxEntry outbox = outboxService.writePendingEntry(
                    "PRINCIPAL_REDEMPTION", "PRINCIPAL_REDEMPTION", bond.getId() + ":" + holder.getUserId(),
                    idempotencyKey, buildRedemptionPayload(bond, holder, units, cashAmount, ircmAmount, grossCashAmount, userCashAccountId));

            // d. Execute atomic batch
            List<Map<String, Object>> batchResult;
            try {
                batchResult = fineractClient.executeAtomicBatch(ops);
            } catch (Exception batchError) {
                outboxService.markAborted(outbox.getId(), batchError.getMessage());
                throw batchError;
            }
            outboxService.markDispatched(outbox.getId(), Map.of("batchResult", "ok"));

            // e. DB finalization: position, supply, audit record
            Long assetTransferId = extractFirstResourceId(batchResult, 1);
            Long cashTransferId  = extractFirstResourceId(batchResult, 2);

            BigDecimal realizedPnl = portfolioService.updatePositionAfterSell(
                    holder.getUserId(), bond.getId(), units, faceValue, null, null);
            assetRepository.adjustCirculatingSupply(bond.getId(), units.negate());

            if (ircmAmount.compareTo(BigDecimal.ZERO) > 0) {
                BigDecimal ircmRate = taxService.getEffectiveIrcmRate(bond);
                taxService.recordTaxTransaction(null, null, holder.getUserId(), bond.getId(),
                        "IRCM", grossCashAmount, ircmRate, ircmAmount, null);
                log.debug("IRCM withheld on BTA redemption: bond={}, user={}, gross={}, ircm={}, net={}",
                        bond.getSymbol(), holder.getUserId(), grossCashAmount, ircmAmount, cashAmount);
            }

            record.fineractCashTransferId(cashTransferId)
                  .fineractAssetTransferId(assetTransferId)
                  .realizedPnl(realizedPnl)
                  .status("SUCCESS");
            principalRedemptionRepository.save(record.build());
            outboxService.markConfirmed(outbox.getId());

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

    /**
     * Retry DB finalization for a DISPATCHED outbox entry. Called by FineractOutboxProcessor.
     */
    @Transactional
    public void finalizeRedemptionFromOutbox(FineractOutboxEntry entry) {
        Map<String, Object> payload = outboxService.parsePayload(entry);

        String bondId = (String) payload.get("bondId");
        Long userId = ((Number) payload.get("userId")).longValue();

        // Idempotency: already finalized if SUCCESS record exists
        if (principalRedemptionRepository.findByAssetId(bondId).stream()
                .anyMatch(r -> "SUCCESS".equals(r.getStatus()) && userId.equals(r.getUserId()))) {
            outboxService.markConfirmed(entry.getId());
            return;
        }

        Asset bond = assetRepository.findById(bondId)
                .orElseThrow(() -> new IllegalStateException("Bond not found for outbox retry: " + bondId));
        UserPosition holder = userPositionRepository.findByUserIdAndAssetId(userId, bondId)
                .orElseThrow(() -> new IllegalStateException("Position not found: user=" + userId + " bond=" + bondId));

        BigDecimal units        = new BigDecimal((String) payload.get("units"));
        BigDecimal faceValue    = new BigDecimal((String) payload.get("faceValue"));
        BigDecimal cashAmount   = new BigDecimal((String) payload.get("cashAmount"));
        BigDecimal ircmAmount   = new BigDecimal((String) payload.get("ircmAmount"));
        BigDecimal grossCash    = new BigDecimal((String) payload.get("grossCashAmount"));

        BigDecimal realizedPnl = portfolioService.updatePositionAfterSell(userId, bondId, units, faceValue, null, null);
        assetRepository.adjustCirculatingSupply(bondId, units.negate());

        if (ircmAmount.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal ircmRate = taxService.getEffectiveIrcmRate(bond);
            taxService.recordTaxTransaction(null, null, userId, bondId,
                    "IRCM", grossCash, ircmRate, ircmAmount, null);
        }

        PrincipalRedemption rec = PrincipalRedemption.builder()
                .assetId(bondId).userId(userId).units(units).faceValue(faceValue)
                .cashAmount(cashAmount).redemptionDate(java.time.LocalDate.now())
                .realizedPnl(realizedPnl).status("SUCCESS").build();
        principalRedemptionRepository.save(rec);
        outboxService.markConfirmed(entry.getId());

        log.info("Outbox retry: principal redemption finalized bond={}, user={}", bond.getSymbol(), userId);
    }

    private Map<String, Object> buildRedemptionPayload(Asset bond, UserPosition holder,
            BigDecimal units, BigDecimal cashAmount, BigDecimal ircmAmount,
            BigDecimal grossCashAmount, Long userCashAccountId) {
        Map<String, Object> p = new HashMap<>();
        p.put("bondId", bond.getId());
        p.put("userId", holder.getUserId());
        p.put("units", units.toPlainString());
        p.put("faceValue", bond.getEffectiveFaceValue().toPlainString());
        p.put("cashAmount", cashAmount.toPlainString());
        p.put("ircmAmount", ircmAmount.toPlainString());
        p.put("grossCashAmount", grossCashAmount.toPlainString());
        p.put("userCashAccountId", userCashAccountId);
        return p;
    }

    @SuppressWarnings("unchecked")
    private Long extractFirstResourceId(List<Map<String, Object>> batchResult, int requestId) {
        for (Map<String, Object> resp : batchResult) {
            Object rid = resp.get("requestId");
            if (rid != null && ((Number) rid).intValue() == requestId) {
                Object body = resp.get("body");
                if (body instanceof Map<?, ?> bodyMap) {
                    Object id = bodyMap.get("resourceId");
                    return id != null ? ((Number) id).longValue() : null;
                }
            }
        }
        return null;
    }

    private record RedeemResult(String status, String failureReason) {}

    private static String truncate(String s, int maxLen) {
        return s != null && s.length() > maxLen ? s.substring(0, maxLen) : s;
    }
}
