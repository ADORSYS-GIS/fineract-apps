package com.adorsys.fineract.asset.service;

import com.adorsys.fineract.asset.entity.Asset;
import com.adorsys.fineract.asset.entity.UserPosition;
import com.adorsys.fineract.asset.exception.TradingException;
import com.adorsys.fineract.asset.metrics.AssetMetrics;
import com.adorsys.fineract.asset.repository.UserPositionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

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
    private final AssetMetrics assetMetrics;

    /**
     * Validate that the user's position is past the lock-up period.
     * Called from TradingService on SELL orders only.
     *
     * @throws TradingException if the position is still within the lock-up period
     */
    public void validateLockup(Asset asset, Long userId) {
        if (asset.getLockupDays() == null || asset.getLockupDays() <= 0) return;

        Optional<UserPosition> position = userPositionRepository.findByUserIdAndAssetId(userId, asset.getId());
        if (position.isEmpty()) return; // no position means no lock-up to check

        Instant firstPurchase = position.get().getFirstPurchaseDate();
        if (firstPurchase == null) return; // legacy position without first_purchase_date

        LocalDate purchaseDate = firstPurchase.atZone(ZoneId.systemDefault()).toLocalDate();
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
     * Get the unlock date for a user's position in an asset.
     * Returns null if no lock-up applies.
     */
    public LocalDate getUnlockDate(Asset asset, Long userId) {
        if (asset.getLockupDays() == null || asset.getLockupDays() <= 0) return null;

        Optional<UserPosition> position = userPositionRepository.findByUserIdAndAssetId(userId, asset.getId());
        if (position.isEmpty()) return null;

        Instant firstPurchase = position.get().getFirstPurchaseDate();
        if (firstPurchase == null) return null;

        return firstPurchase.atZone(ZoneId.systemDefault()).toLocalDate().plusDays(asset.getLockupDays());
    }
}
