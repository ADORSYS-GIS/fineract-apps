package com.adorsys.fineract.asset.scheduler;

import com.adorsys.fineract.asset.entity.Asset;
import com.adorsys.fineract.asset.entity.UserPosition;
import com.adorsys.fineract.asset.event.AdminAlertEvent;
import com.adorsys.fineract.asset.repository.AssetRepository;
import com.adorsys.fineract.asset.repository.UserPositionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

/**
 * Daily scheduler that accrues interest on bond positions.
 * For each ACTIVE bond, for each holder: dailyAccrual = units * issuerPrice * rate / 36500
 * Runs at 00:30 WAT daily, after interest payment processing.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class AccruedInterestScheduler {

    private final AssetRepository assetRepository;
    private final UserPositionRepository userPositionRepository;
    private final ApplicationEventPublisher eventPublisher;

    private static final BigDecimal DAYS_PER_YEAR = new BigDecimal("365");

    @Scheduled(cron = "0 30 0 * * *", zone = "Africa/Douala")
    public void accrueDaily() {
        try {
            List<Asset> activeBonds = assetRepository.findActiveBondsWithInterestRate();

            if (activeBonds.isEmpty()) {
                log.debug("No active bonds for daily accrual.");
                return;
            }

            log.info("Running daily accrued interest for {} bond(s)", activeBonds.size());
            int totalPositions = 0;
            int failed = 0;

            for (Asset bond : activeBonds) {
                try {
                    totalPositions += accrueBond(bond);
                } catch (Exception e) {
                    failed++;
                    log.error("Failed to accrue interest for bond {}: {}", bond.getId(), e.getMessage(), e);
                }
            }

            log.info("Accrued interest for {} position(s) across {} bond(s)", totalPositions, activeBonds.size());

            if (failed > 0) {
                eventPublisher.publishEvent(new AdminAlertEvent(
                        "SCHEDULER_FAILURE", "Accrued interest scheduler partial failure",
                        String.format("%d of %d bond accruals failed", failed, activeBonds.size()),
                        null, "SCHEDULER"));
            }
        } catch (Exception e) {
            log.error("Accrued interest scheduler failed: {}", e.getMessage(), e);
            eventPublisher.publishEvent(new AdminAlertEvent(
                    "SCHEDULER_FAILURE", "Accrued interest scheduler failed",
                    e.getMessage(), null, "SCHEDULER"));
        }
    }

    @Transactional
    public int accrueBond(Asset bond) {
        List<UserPosition> holders = userPositionRepository.findByAssetId(bond.getId());
        int updated = 0;

        for (UserPosition pos : holders) {
            if (pos.getTotalUnits().compareTo(BigDecimal.ZERO) <= 0) continue;

            // dailyAccrual = units * issuerPrice * (rate / 100) / 365
            BigDecimal dailyAccrual = pos.getTotalUnits()
                    .multiply(bond.getIssuerPrice())
                    .multiply(bond.getInterestRate())
                    .divide(new BigDecimal("100"), 4, RoundingMode.HALF_UP)
                    .divide(DAYS_PER_YEAR, 0, RoundingMode.HALF_UP);

            BigDecimal current = pos.getAccruedInterest() != null ? pos.getAccruedInterest() : BigDecimal.ZERO;
            pos.setAccruedInterest(current.add(dailyAccrual));
            userPositionRepository.save(pos);
            updated++;
        }

        return updated;
    }

    /**
     * Reset accrued interest to zero for all holders of a bond.
     * Called after a coupon payment is executed.
     */
    @Transactional
    public void resetAccruedInterest(String assetId) {
        List<UserPosition> holders = userPositionRepository.findByAssetId(assetId);
        for (UserPosition pos : holders) {
            pos.setAccruedInterest(BigDecimal.ZERO);
            userPositionRepository.save(pos);
        }
        log.info("Reset accrued interest for {} holder(s) of asset {}", holders.size(), assetId);
    }
}
