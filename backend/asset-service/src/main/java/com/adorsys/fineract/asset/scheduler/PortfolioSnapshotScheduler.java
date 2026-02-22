package com.adorsys.fineract.asset.scheduler;

import com.adorsys.fineract.asset.config.AssetServiceConfig;
import com.adorsys.fineract.asset.entity.AssetPrice;
import com.adorsys.fineract.asset.entity.PortfolioSnapshot;
import com.adorsys.fineract.asset.entity.UserPosition;
import com.adorsys.fineract.asset.repository.AssetPriceRepository;
import com.adorsys.fineract.asset.repository.PortfolioSnapshotRepository;
import com.adorsys.fineract.asset.repository.UserPositionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
    private final AssetPriceRepository assetPriceRepository;
    private final PortfolioSnapshotRepository portfolioSnapshotRepository;
    private final AssetServiceConfig config;

    @Scheduled(cron = "${asset-service.portfolio.snapshot-cron:0 30 20 * * *}",
               zone = "Africa/Douala")
    public void takeSnapshots() {
        log.info("Portfolio snapshot scheduler started");

        List<Long> userIds = userPositionRepository.findDistinctUserIdsWithPositions();
        if (userIds.isEmpty()) {
            log.info("No users with positions — skipping snapshots");
            return;
        }

        // Bulk-load all prices once
        Map<String, BigDecimal> priceMap = assetPriceRepository.findAll().stream()
                .collect(Collectors.toMap(AssetPrice::getAssetId, AssetPrice::getCurrentPrice,
                        (a, b) -> b));

        LocalDate today = LocalDate.now();
        int success = 0;
        int failed = 0;

        for (Long userId : userIds) {
            try {
                snapshotUser(userId, today, priceMap);
                success++;
            } catch (Exception e) {
                failed++;
                log.error("Failed to snapshot portfolio for userId={}: {}", userId, e.getMessage());
            }
        }

        log.info("Portfolio snapshot scheduler completed: {} success, {} failed out of {} users",
                success, failed, userIds.size());
    }

    private void snapshotUser(Long userId, LocalDate date, Map<String, BigDecimal> priceMap) {
        List<UserPosition> positions = userPositionRepository.findByUserId(userId);

        BigDecimal totalValue = BigDecimal.ZERO;
        BigDecimal totalCostBasis = BigDecimal.ZERO;
        int positionCount = 0;

        for (UserPosition pos : positions) {
            if (pos.getTotalUnits().compareTo(BigDecimal.ZERO) <= 0) continue;
            BigDecimal price = priceMap.getOrDefault(pos.getAssetId(), BigDecimal.ZERO);
            totalValue = totalValue.add(pos.getTotalUnits().multiply(price));
            totalCostBasis = totalCostBasis.add(pos.getTotalCostBasis());
            positionCount++;
        }

        PortfolioSnapshot snapshot = PortfolioSnapshot.builder()
                .userId(userId)
                .snapshotDate(date)
                .totalValue(totalValue)
                .totalCostBasis(totalCostBasis)
                .unrealizedPnl(totalValue.subtract(totalCostBasis))
                .positionCount(positionCount)
                .build();

        portfolioSnapshotRepository.save(snapshot);
    }
}
