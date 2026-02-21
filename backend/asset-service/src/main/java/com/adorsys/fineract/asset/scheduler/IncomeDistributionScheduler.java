package com.adorsys.fineract.asset.scheduler;

import com.adorsys.fineract.asset.entity.Asset;
import com.adorsys.fineract.asset.repository.AssetRepository;
import com.adorsys.fineract.asset.service.IncomeDistributionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

/**
 * Daily scheduler that processes income distributions (dividends, rent, harvest yields)
 * for non-bond assets. Runs at 00:20 WAT, after InterestPaymentScheduler (00:15).
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class IncomeDistributionScheduler {

    private final AssetRepository assetRepository;
    private final IncomeDistributionService incomeDistributionService;

    @Scheduled(cron = "0 20 0 * * *", zone = "Africa/Douala")
    public void processDistributions() {
        LocalDate today = LocalDate.now();
        List<Asset> dueAssets = assetRepository.findAssetsWithDueDistributions(today);

        if (dueAssets.isEmpty()) {
            log.debug("No income distributions due today ({})", today);
            return;
        }

        log.info("Processing income distributions for {} asset(s) on {}", dueAssets.size(), today);

        for (Asset asset : dueAssets) {
            try {
                incomeDistributionService.processDistribution(asset, today);
            } catch (Exception e) {
                log.error("Failed to process income distribution for asset {}: {}",
                        asset.getId(), e.getMessage(), e);
            }
        }
    }
}
