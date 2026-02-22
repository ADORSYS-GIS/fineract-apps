package com.adorsys.fineract.asset.service;

import com.adorsys.fineract.asset.client.FineractClient;
import com.adorsys.fineract.asset.config.AssetServiceConfig;
import com.adorsys.fineract.asset.dto.AssetStatus;
import com.adorsys.fineract.asset.entity.Asset;
import com.adorsys.fineract.asset.entity.UserPosition;
import com.adorsys.fineract.asset.event.DelistingAnnouncedEvent;
import com.adorsys.fineract.asset.exception.AssetException;
import com.adorsys.fineract.asset.metrics.AssetMetrics;
import com.adorsys.fineract.asset.repository.AssetPriceRepository;
import com.adorsys.fineract.asset.repository.AssetRepository;
import com.adorsys.fineract.asset.repository.UserPositionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;

/**
 * Manages the asset delisting lifecycle:
 * 1. Admin initiates delist → status=DELISTING, BUY blocked, SELL allowed
 * 2. On delisting date → forced buyback of remaining positions, status=DELISTED
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class DelistingService {

    private final AssetRepository assetRepository;
    private final AssetPriceRepository assetPriceRepository;
    private final UserPositionRepository userPositionRepository;
    private final FineractClient fineractClient;
    private final AssetServiceConfig assetServiceConfig;
    private final ApplicationEventPublisher eventPublisher;
    private final AssetMetrics assetMetrics;

    /**
     * Initiate delisting for an asset. Sets status to DELISTING and notifies all holders.
     */
    @Transactional
    @PreAuthorize("@adminSecurity.isOpen() or hasRole('ASSET_MANAGER')")
    public void initiateDelist(String assetId, LocalDate delistingDate, BigDecimal redemptionPrice) {
        Asset asset = assetRepository.findById(assetId)
                .orElseThrow(() -> new AssetException("Asset not found: " + assetId));

        if (asset.getStatus() != AssetStatus.ACTIVE && asset.getStatus() != AssetStatus.HALTED) {
            throw new AssetException("Only ACTIVE or HALTED assets can be delisted. Current: " + asset.getStatus());
        }

        if (delistingDate != null && delistingDate.isBefore(LocalDate.now())) {
            throw new AssetException("Delisting date must be in the future");
        }

        asset.setStatus(AssetStatus.DELISTING);
        asset.setDelistingDate(delistingDate != null ? delistingDate : LocalDate.now().plusDays(30));
        asset.setDelistingRedemptionPrice(redemptionPrice);
        assetRepository.save(asset);

        assetMetrics.recordDelistingInitiated();

        // Notify all holders
        List<UserPosition> holders = userPositionRepository.findHoldersByAssetId(
                assetId, BigDecimal.ZERO);
        for (UserPosition holder : holders) {
            eventPublisher.publishEvent(new DelistingAnnouncedEvent(
                    holder.getUserId(), assetId, asset.getSymbol(),
                    asset.getDelistingDate(), redemptionPrice));
        }

        log.info("Delisting initiated for asset {}: date={}, redemptionPrice={}, holders={}",
                asset.getSymbol(), asset.getDelistingDate(), redemptionPrice, holders.size());
    }

    /**
     * Cancel delisting (before the delisting date). Reverts to ACTIVE.
     */
    @Transactional
    @PreAuthorize("@adminSecurity.isOpen() or hasRole('ASSET_MANAGER')")
    public void cancelDelisting(String assetId) {
        Asset asset = assetRepository.findById(assetId)
                .orElseThrow(() -> new AssetException("Asset not found: " + assetId));

        if (asset.getStatus() != AssetStatus.DELISTING) {
            throw new AssetException("Only DELISTING assets can have delisting cancelled. Current: " + asset.getStatus());
        }

        asset.setStatus(AssetStatus.ACTIVE);
        asset.setDelistingDate(null);
        asset.setDelistingRedemptionPrice(null);
        assetRepository.save(asset);

        assetMetrics.recordDelistingCancelled();
        log.info("Delisting cancelled for asset {}", asset.getSymbol());
    }

    /**
     * Execute forced buyback for a delisted asset. Called by scheduler on delisting date.
     */
    @Transactional
    public void executeForcedBuyback(Asset asset) {
        List<UserPosition> holders = userPositionRepository.findHoldersByAssetId(
                asset.getId(), BigDecimal.ZERO);

        if (holders.isEmpty()) {
            log.info("No holders for asset {} — marking DELISTED directly", asset.getSymbol());
            asset.setStatus(AssetStatus.DELISTED);
            assetRepository.save(asset);
            assetMetrics.recordDelistingCompleted();
            return;
        }

        BigDecimal redemptionPrice = asset.getDelistingRedemptionPrice();
        if (redemptionPrice == null) {
            // Use current price as fallback
            redemptionPrice = assetPriceRepository.findById(asset.getId())
                    .map(p -> p.getCurrentPrice())
                    .orElse(BigDecimal.ZERO);
        }

        String currency = assetServiceConfig.getSettlementCurrency();
        int successCount = 0;
        BigDecimal totalCashPaid = BigDecimal.ZERO;

        for (UserPosition holder : holders) {
            BigDecimal cashAmount = holder.getTotalUnits().multiply(redemptionPrice)
                    .setScale(0, RoundingMode.HALF_UP);

            try {
                Long userCashAccountId = fineractClient.findClientSavingsAccountByCurrency(
                        holder.getUserId(), currency);
                if (userCashAccountId == null) {
                    log.error("No cash account for user {} during delisting buyback of {}",
                            holder.getUserId(), asset.getSymbol());
                    continue;
                }

                // Return asset units to treasury
                fineractClient.createAccountTransfer(
                        holder.getFineractSavingsAccountId(),
                        asset.getTreasuryAssetAccountId(),
                        holder.getTotalUnits(),
                        "Delisting buyback: " + asset.getSymbol());

                // Pay cash to holder
                fineractClient.createAccountTransfer(
                        asset.getTreasuryCashAccountId(), userCashAccountId,
                        cashAmount,
                        "Delisting redemption: " + asset.getSymbol());

                // Zero out the position
                holder.setTotalUnits(BigDecimal.ZERO);
                holder.setTotalCostBasis(BigDecimal.ZERO);
                userPositionRepository.save(holder);

                successCount++;
                totalCashPaid = totalCashPaid.add(cashAmount);

            } catch (Exception e) {
                log.error("Forced buyback failed for user {} on asset {}: {}",
                        holder.getUserId(), asset.getSymbol(), e.getMessage());
            }
        }

        // Adjust circulating supply back to zero
        asset.setCirculatingSupply(BigDecimal.ZERO);
        asset.setStatus(AssetStatus.DELISTED);
        assetRepository.save(asset);

        assetMetrics.recordDelistingCompleted();
        if (totalCashPaid.compareTo(BigDecimal.ZERO) > 0) {
            assetMetrics.recordDelistingBuybackAmount(totalCashPaid.doubleValue());
        }
        log.info("Forced buyback complete for asset {}: {} holders paid, total={} {}",
                asset.getSymbol(), successCount, totalCashPaid, currency);
    }
}
