package com.adorsys.fineract.asset.scheduler;

import com.adorsys.fineract.asset.entity.Asset;
import com.adorsys.fineract.asset.repository.AssetRepository;
import com.adorsys.fineract.asset.service.ScheduledPaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/**
 * Daily scheduler that creates PENDING scheduled payment records for income distributions
 * (dividends, rent, harvest yields) for non-bond assets.
 * <p>
 * Actual payment execution requires admin confirmation via the scheduled-payments API.
 * <p>
 * Runs at 00:20 WAT, after InterestPaymentScheduler (00:15).
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class IncomeDistributionScheduler {

    private final AssetRepository assetRepository;
    private final ScheduledPaymentService scheduledPaymentService;

    @Scheduled(cron = "0 20 0 * * *", zone = "Africa/Douala")
    public void processDistributions() {
        LocalDate today = LocalDate.now();
        List<Asset> dueAssets = assetRepository.findAssetsWithDueDistributions(today);

        if (dueAssets.isEmpty()) {
            log.debug("No income distributions due today ({})", today);
            return;
        }

        log.info("Creating pending income schedules for {} asset(s) on {}", dueAssets.size(), today);

        for (Asset asset : dueAssets) {
            try {
                createPendingAndAdvance(asset);
            } catch (Exception e) {
                log.error("Failed to create income schedule for asset {}: {}",
                        asset.getId(), e.getMessage(), e);
            }
        }
    }

    @Transactional
    public void createPendingAndAdvance(Asset asset) {
        LocalDate distributionDate = asset.getNextDistributionDate();
        boolean created = scheduledPaymentService.createPendingSchedule(asset, "INCOME", distributionDate);

        if (created) {
            advanceDistributionDate(asset);
        }
    }

    private void advanceDistributionDate(Asset asset) {
        LocalDate nextDate = asset.getNextDistributionDate()
                .plusMonths(asset.getDistributionFrequencyMonths());
        asset.setNextDistributionDate(nextDate);
        assetRepository.save(asset);
        log.info("Asset {} next distribution date advanced to {}", asset.getSymbol(), nextDate);
    }
}
