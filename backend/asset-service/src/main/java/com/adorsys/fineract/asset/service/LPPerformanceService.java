package com.adorsys.fineract.asset.service;

import com.adorsys.fineract.asset.client.FineractClient;
import com.adorsys.fineract.asset.dto.LPPerformanceResponse;
import com.adorsys.fineract.asset.entity.Asset;
import com.adorsys.fineract.asset.repository.AssetRepository;
import com.adorsys.fineract.asset.repository.TradeLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;
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
    private final FineractClient fineractClient;

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

        // Build per-LP summaries with LSAV/LSPD/LTAX balances
        List<LPPerformanceResponse.LPSummary> perLP = buildPerLPSummaries(assetMap.values());

        return new LPPerformanceResponse(totalSpread, totalBuyback, totalFee, netMargin, totalTrades, perAsset, perLP);
    }

    private List<LPPerformanceResponse.LPSummary> buildPerLPSummaries(Collection<Asset> assets) {
        // Group assets by LP client ID
        Map<Long, List<Asset>> lpAssets = assets.stream()
                .filter(a -> a.getLpClientId() != null)
                .collect(Collectors.groupingBy(Asset::getLpClientId));

        // Pre-fetch all account balances in bulk (reduces N+1 to single pass)
        Set<Long> allAccountIds = new HashSet<>();
        for (List<Asset> assetList : lpAssets.values()) {
            for (Asset asset : assetList) {
                if (asset.getLpCashAccountId() != null) allAccountIds.add(asset.getLpCashAccountId());
                if (asset.getLpSpreadAccountId() != null) allAccountIds.add(asset.getLpSpreadAccountId());
                if (asset.getLpTaxAccountId() != null) allAccountIds.add(asset.getLpTaxAccountId());
            }
        }
        Map<Long, BigDecimal> balanceCache = new HashMap<>();
        for (Long accountId : allAccountIds) {
            balanceCache.put(accountId, getAccountBalance(accountId));
        }

        List<LPPerformanceResponse.LPSummary> summaries = new ArrayList<>();
        for (Map.Entry<Long, List<Asset>> entry : lpAssets.entrySet()) {
            Long lpClientId = entry.getKey();
            List<Asset> lpAssetList = entry.getValue();
            String lpName = lpAssetList.get(0).getLpClientName();

            BigDecimal lsavTotal = BigDecimal.ZERO;
            BigDecimal lspdTotal = BigDecimal.ZERO;
            BigDecimal ltaxTotal = BigDecimal.ZERO;

            for (Asset asset : lpAssetList) {
                lsavTotal = lsavTotal.add(balanceCache.getOrDefault(asset.getLpCashAccountId(), BigDecimal.ZERO));
                lspdTotal = lspdTotal.add(balanceCache.getOrDefault(asset.getLpSpreadAccountId(), BigDecimal.ZERO));
                if (asset.getLpTaxAccountId() != null) {
                    ltaxTotal = ltaxTotal.add(balanceCache.getOrDefault(asset.getLpTaxAccountId(), BigDecimal.ZERO));
                }
            }

            BigDecimal unsettled = lsavTotal.add(lspdTotal).subtract(ltaxTotal);
            summaries.add(new LPPerformanceResponse.LPSummary(
                    lpClientId, lpName, lsavTotal, lspdTotal, ltaxTotal, unsettled, lpAssetList.size()));
        }
        return summaries;
    }

    private BigDecimal getAccountBalance(Long accountId) {
        if (accountId == null) return BigDecimal.ZERO;
        try {
            return fineractClient.getAccountBalance(accountId);
        } catch (Exception e) {
            log.warn("Failed to fetch balance for account {}: {}", accountId, e.getMessage());
            return BigDecimal.ZERO;
        }
    }
}
