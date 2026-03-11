package com.adorsys.fineract.asset.service;

import com.adorsys.fineract.asset.entity.Asset;
import com.adorsys.fineract.asset.entity.UserPosition;
import com.adorsys.fineract.asset.exception.TradingException;
import com.adorsys.fineract.asset.metrics.AssetMetrics;
import com.adorsys.fineract.asset.repository.PurchaseLotRepository;
import com.adorsys.fineract.asset.repository.UserPositionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Optional;

/**
 * Enforces lock-up periods on SELL trades. If an asset has a lockupDays
 * configured, users cannot sell until that many days after their first purchase.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class LockupService {

    private final UserPositionRepository userPositionRepository;
    private final PurchaseLotRepository purchaseLotRepository;
    private final AssetMetrics assetMetrics;

    /**
     * Validate that enough unlocked units are available for a SELL of the given size.
     * Uses per-lot lockup if lots exist, otherwise falls back to global firstPurchaseDate check.
     *
     * @throws TradingException if not enough unlocked units are available
     */
    public void validateLockup(Asset asset, Long userId, BigDecimal requestedUnits) {
        if (asset.getLockupDays() == null || asset.getLockupDays() <= 0) return;

        // Per-lot lockup: check how many units have expired lockup
        BigDecimal unlockedUnits = getUnlockedUnits(asset, userId);
        if (unlockedUnits != null) {
            if (requestedUnits.compareTo(unlockedUnits) > 0) {
                assetMetrics.recordLockupRejection(asset.getId());
                throw new TradingException(
                        "Only " + unlockedUnits + " units are unlocked (requested: " + requestedUnits
                                + "). Lock-up period: " + asset.getLockupDays() + " days per lot.",
                        "LOCKUP_PERIOD_ACTIVE");
            }
            return;
        }

        // Fallback: global firstPurchaseDate check for legacy positions without lots
        Optional<UserPosition> position = userPositionRepository.findByUserIdAndAssetId(userId, asset.getId());
        if (position.isEmpty()) return;

        Instant firstPurchase = position.get().getFirstPurchaseDate();
        if (firstPurchase == null) return;

        LocalDate purchaseDate = firstPurchase.atZone(ZoneId.of("Africa/Douala")).toLocalDate();
        LocalDate unlockDate = purchaseDate.plusDays(asset.getLockupDays());

        if (LocalDate.now().isBefore(unlockDate)) {
            assetMetrics.recordLockupRejection(asset.getId());
            long daysRemaining = java.time.temporal.ChronoUnit.DAYS.between(LocalDate.now(), unlockDate);
            throw new TradingException(
                    "Position is locked until " + unlockDate + " (" + daysRemaining +
                            " days remaining). Lock-up period: " + asset.getLockupDays() + " days.",
                    "LOCKUP_PERIOD_ACTIVE");
        }
    }

    /**
     * Get unlocked units from per-lot lockup tracking.
     * Returns null if no lots exist (legacy position).
     */
    public BigDecimal getUnlockedUnits(Asset asset, Long userId) {
        BigDecimal unlocked = purchaseLotRepository.sumUnlockedUnits(userId, asset.getId(), Instant.now());
        // If no lots exist at all, return null to signal legacy fallback
        long lotCount = purchaseLotRepository
                .countByUserIdAndAssetIdAndRemainingUnitsGreaterThan(userId, asset.getId(), BigDecimal.ZERO);
        return lotCount > 0 ? unlocked : null;
    }

    /**
     * Get the unlock date for a user's position in an asset.
     * Returns null if no lock-up applies.
     */
    public LocalDate getUnlockDate(Asset asset, Long userId) {
        if (asset.getLockupDays() == null || asset.getLockupDays() <= 0) return null;

        Optional<UserPosition> position = userPositionRepository.findByUserIdAndAssetId(userId, asset.getId());
        if (position.isEmpty()) return null;

        Instant firstPurchase = position.get().getFirstPurchaseDate();
        if (firstPurchase == null) return null;

        return firstPurchase.atZone(ZoneId.of("Africa/Douala")).toLocalDate().plusDays(asset.getLockupDays());
    }
}
