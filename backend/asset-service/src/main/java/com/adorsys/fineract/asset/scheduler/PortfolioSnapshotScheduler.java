package com.adorsys.fineract.asset.scheduler;

import com.adorsys.fineract.asset.config.AssetServiceConfig;
import com.adorsys.fineract.asset.entity.Asset;
import com.adorsys.fineract.asset.entity.AssetPrice;
import com.adorsys.fineract.asset.event.AdminAlertEvent;
import com.adorsys.fineract.asset.repository.AssetPriceRepository;
import com.adorsys.fineract.asset.repository.AssetRepository;
import com.adorsys.fineract.asset.repository.UserPositionRepository;
import com.adorsys.fineract.asset.service.PortfolioSnapshotWriter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * Daily scheduler that snapshots portfolio values for all users with positions.
 * <p>
 * Runs at 20:30 WAT (Africa/Douala) — 30 minutes after market close.
 * Each user's snapshot is saved independently; one failure does not block others.
 * The unique constraint on (user_id, snapshot_date) prevents duplicate snapshots.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class PortfolioSnapshotScheduler {

    private final UserPositionRepository userPositionRepository;
    private final AssetRepository assetRepository;
    private final AssetPriceRepository assetPriceRepository;
    private final PortfolioSnapshotWriter snapshotWriter;
    private final AssetServiceConfig config;
    private final ApplicationEventPublisher eventPublisher;

    @Scheduled(cron = "${asset-service.portfolio.snapshot-cron:0 30 20 * * *}",
               zone = "Africa/Douala")
    @SchedulerLock(name = "portfolio-snapshot-scheduler", lockAtMostFor = "PT30M", lockAtLeastFor = "PT10M")
    public void takeSnapshots() {
        try {
            log.info("Portfolio snapshot scheduler started");

            List<Long> userIds = userPositionRepository.findDistinctUserIdsWithPositions();
            if (userIds.isEmpty()) {
                log.info("No users with positions — skipping snapshots");
                return;
            }

            // Bulk-load all prices and assets once
            Map<String, BigDecimal> priceMap = assetPriceRepository.findAll().stream()
                    .collect(Collectors.toMap(AssetPrice::getAssetId, AssetPrice::getAskPrice,
                            (a, b) -> b));
            Map<String, Asset> assetMap = assetRepository.findAll().stream()
                    .collect(Collectors.toMap(Asset::getId, Function.identity(), (a, b) -> b));

            LocalDate today = LocalDate.now();
            int success = 0;
            int failed = 0;

            for (Long userId : userIds) {
                try {
                    snapshotWriter.snapshotUser(userId, today, priceMap, assetMap);
                    success++;
                } catch (Exception e) {
                    failed++;
                    log.error("Failed to snapshot portfolio for userId={}: {}", userId, e.getMessage());
                }
            }

            log.info("Portfolio snapshot scheduler completed: {} success, {} failed out of {} users",
                    success, failed, userIds.size());

            if (failed > 0) {
                eventPublisher.publishEvent(new AdminAlertEvent(
                        "SCHEDULER_FAILURE", "Portfolio snapshot scheduler partial failure",
                        String.format("%d of %d user snapshots failed", failed, userIds.size()),
                        null, "SCHEDULER"));
            }
        } catch (Exception e) {
            log.error("Portfolio snapshot scheduler failed: {}", e.getMessage(), e);
            eventPublisher.publishEvent(new AdminAlertEvent(
                    "SCHEDULER_FAILURE", "Portfolio snapshot scheduler failed",
                    e.getMessage(), null, "SCHEDULER"));
        }
    }
}
