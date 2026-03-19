package com.adorsys.fineract.asset.service;

import com.adorsys.fineract.asset.entity.Asset;
import com.adorsys.fineract.asset.entity.PortfolioSnapshot;
import com.adorsys.fineract.asset.entity.UserPosition;
import com.adorsys.fineract.asset.repository.CategorySnapshotRepository;
import com.adorsys.fineract.asset.repository.PortfolioSnapshotRepository;
import com.adorsys.fineract.asset.repository.UserPositionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Writes portfolio and category snapshots within a single transaction.
 * Extracted from PortfolioSnapshotScheduler so that Spring's @Transactional
 * proxy works correctly (self-invocation on the scheduler class bypasses the proxy).
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class PortfolioSnapshotWriter {

    private final UserPositionRepository userPositionRepository;
    private final PortfolioSnapshotRepository portfolioSnapshotRepository;
    private final CategorySnapshotRepository categorySnapshotRepository;

    @Transactional
    public void snapshotUser(Long userId, LocalDate date, Map<String, BigDecimal> priceMap,
                             Map<String, Asset> assetMap) {
        List<UserPosition> positions = userPositionRepository.findByUserId(userId);

        BigDecimal totalValue = BigDecimal.ZERO;
        BigDecimal totalCostBasis = BigDecimal.ZERO;
        int positionCount = 0;
        Map<String, BigDecimal> categoryValues = new LinkedHashMap<>();

        for (UserPosition pos : positions) {
            if (pos.getTotalUnits().compareTo(BigDecimal.ZERO) <= 0) continue;
            BigDecimal price = priceMap.getOrDefault(pos.getAssetId(), BigDecimal.ZERO);
            BigDecimal posValue = pos.getTotalUnits().multiply(price);
            totalValue = totalValue.add(posValue);
            totalCostBasis = totalCostBasis.add(pos.getTotalCostBasis());
            positionCount++;

            // Accumulate per-category values
            Asset asset = assetMap.get(pos.getAssetId());
            String category = asset != null && asset.getCategory() != null
                    ? asset.getCategory().name() : "UNKNOWN";
            categoryValues.merge(category, posValue, BigDecimal::add);
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

        // Upsert per-category snapshots for sparkline charts (idempotent on duplicate runs)
        for (Map.Entry<String, BigDecimal> entry : categoryValues.entrySet()) {
            categorySnapshotRepository.upsert(userId, date, entry.getKey(),
                    entry.getValue().setScale(0, RoundingMode.HALF_UP));
        }
    }
}
