package com.adorsys.fineract.asset.scheduler;

import com.adorsys.fineract.asset.dto.AssetStatus;
import com.adorsys.fineract.asset.entity.Asset;
import com.adorsys.fineract.asset.repository.AssetRepository;
import com.adorsys.fineract.asset.service.DelistingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

/**
 * Daily scheduler that executes forced buybacks for assets whose delisting date has arrived.
 * Runs at 00:45 WAT, after income distribution (00:20).
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class DelistingScheduler {

    private final AssetRepository assetRepository;
    private final DelistingService delistingService;

    @Scheduled(cron = "0 45 0 * * *", zone = "Africa/Douala")
    public void processDelistings() {
        LocalDate today = LocalDate.now();

        List<Asset> delistingAssets = assetRepository.findByStatusIn(List.of(AssetStatus.DELISTING));
        List<Asset> dueAssets = delistingAssets.stream()
                .filter(a -> a.getDelistingDate() != null && !a.getDelistingDate().isAfter(today))
                .toList();

        if (dueAssets.isEmpty()) {
            log.debug("No assets due for delisting today ({})", today);
            return;
        }

        log.info("Processing forced buyback for {} asset(s) on {}", dueAssets.size(), today);

        for (Asset asset : dueAssets) {
            try {
                delistingService.executeForcedBuyback(asset);
            } catch (Exception e) {
                log.error("Failed to execute forced buyback for asset {}: {}",
                        asset.getId(), e.getMessage(), e);
            }
        }
    }
}
