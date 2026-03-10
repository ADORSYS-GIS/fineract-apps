package com.adorsys.fineract.asset.service;

import com.adorsys.fineract.asset.dto.LPPerformanceResponse;
import com.adorsys.fineract.asset.entity.Asset;
import com.adorsys.fineract.asset.repository.AssetRepository;
import com.adorsys.fineract.asset.repository.TradeLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * Aggregates LP performance metrics from the trade log.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class LPPerformanceService {

    private final TradeLogRepository tradeLogRepository;
    private final AssetRepository assetRepository;

    @Transactional(readOnly = true)
    public LPPerformanceResponse getPerformanceSummary() {
        List<Object[]> totalRows = tradeLogRepository.aggregateTotalLPPerformance();
        Object[] totals = totalRows.isEmpty() ? new Object[]{BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO, 0L} : totalRows.get(0);
        BigDecimal totalSpread = (BigDecimal) totals[0];
        BigDecimal totalBuyback = (BigDecimal) totals[1];
        BigDecimal totalFee = (BigDecimal) totals[2];
        long totalTrades = (Long) totals[3];
        BigDecimal netMargin = totalSpread.add(totalFee).subtract(totalBuyback);

        List<Object[]> perAssetData = tradeLogRepository.aggregateLPPerformanceByAsset();
        List<String> assetIds = perAssetData.stream().map(r -> (String) r[0]).toList();
        Map<String, Asset> assetMap = assetRepository.findAllById(assetIds).stream()
                .collect(Collectors.toMap(Asset::getId, Function.identity()));

        List<LPPerformanceResponse.AssetPerformance> perAsset = new ArrayList<>();
        for (Object[] row : perAssetData) {
            String assetId = (String) row[0];
            BigDecimal spread = (BigDecimal) row[1];
            BigDecimal buyback = (BigDecimal) row[2];
            BigDecimal fee = (BigDecimal) row[3];
            long count = (Long) row[4];
            Asset asset = assetMap.get(assetId);
            perAsset.add(new LPPerformanceResponse.AssetPerformance(
                    assetId,
                    asset != null ? asset.getSymbol() : null,
                    spread, buyback, fee,
                    spread.add(fee).subtract(buyback),
                    count
            ));
        }

        return new LPPerformanceResponse(totalSpread, totalBuyback, totalFee, netMargin, totalTrades, perAsset);
    }
}
