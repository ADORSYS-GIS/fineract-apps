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

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

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

    private static final int USER_ID_PAGE_SIZE = 500;

    @Scheduled(cron = "${asset-service.portfolio.snapshot-cron:0 30 20 * * *}",
               zone = "Africa/Douala")
    @SchedulerLock(name = "portfolio-snapshot-scheduler", lockAtMostFor = "PT30M", lockAtLeastFor = "PT10M")
    public void takeSnapshots() {
        try {
            log.info("Portfolio snapshot scheduler started");

            Map<String, BigDecimal> priceMap = loadPriceMapPaged();
            Map<String, Asset> assetMap = loadAssetMapPaged();

            LocalDate today = LocalDate.now();
            int success = 0;
            int failed = 0;
            int totalUsers = 0;

            // Paginate over user IDs to avoid loading the entire set into memory at once.
            int pageNumber = 0;
            Page<Long> userPage;
            do {
                userPage = userPositionRepository.findDistinctUserIdsWithPositions(
                        PageRequest.of(pageNumber++, USER_ID_PAGE_SIZE));

                for (Long userId : userPage.getContent()) {
                    totalUsers++;
                    try {
                        snapshotWriter.snapshotUser(userId, today, priceMap, assetMap);
                        success++;
                    } catch (Exception e) {
                        failed++;
                        log.error("Failed to snapshot portfolio for userId={}: {}", userId, e.getMessage());
                    }
                }
            } while (!userPage.isLast());

            if (totalUsers == 0) {
                log.info("No users with positions — skipping snapshots");
                return;
            }

            log.info("Portfolio snapshot scheduler completed: {} success, {} failed out of {} users",
                    success, failed, totalUsers);

            if (failed > 0) {
                eventPublisher.publishEvent(new AdminAlertEvent(
                        "SCHEDULER_FAILURE", "Portfolio snapshot scheduler partial failure",
                        String.format("%d of %d user snapshots failed", failed, totalUsers),
                        null, "SCHEDULER"));
            }
        } catch (Exception e) {
            log.error("Portfolio snapshot scheduler failed: {}", e.getMessage(), e);
            eventPublisher.publishEvent(new AdminAlertEvent(
                    "SCHEDULER_FAILURE", "Portfolio snapshot scheduler failed",
                    e.getMessage(), null, "SCHEDULER"));
        }
    }

    private Map<String, BigDecimal> loadPriceMapPaged() {
        Map<String, BigDecimal> result = new HashMap<>();
        int page = 0;
        Page<AssetPrice> current;
        do {
            current = assetPriceRepository.findAll(PageRequest.of(page++, 200));
            current.forEach(p -> result.merge(p.getAssetId(), p.getAskPrice(), (a, b) -> b));
        } while (!current.isLast());
        return result;
    }

    private Map<String, Asset> loadAssetMapPaged() {
        Map<String, Asset> result = new HashMap<>();
        int page = 0;
        Page<Asset> current;
        do {
            current = assetRepository.findAll(PageRequest.of(page++, 200));
            current.forEach(a -> result.merge(a.getId(), a, (x, y) -> y));
        } while (!current.isLast());
        return result;
    }
}
