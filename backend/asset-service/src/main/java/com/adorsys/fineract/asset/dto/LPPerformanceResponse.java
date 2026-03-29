package com.adorsys.fineract.asset.dto;

import java.math.BigDecimal;
import java.util.List;

/**
 * LP performance metrics aggregated from trade log.
 */
public record LPPerformanceResponse(
    BigDecimal totalSpreadEarned,
    BigDecimal totalBuybackPremiumPaid,
    BigDecimal totalFeeCommission,
    BigDecimal netMargin,
    long totalTrades,
    List<AssetPerformance> perAsset,
    List<LPSummary> perLP
) {
    public record AssetPerformance(
        String assetId,
        String symbol,
        BigDecimal spreadEarned,
        BigDecimal buybackPremiumPaid,
        BigDecimal feeCommission,
        BigDecimal netMargin,
        long tradeCount
    ) {}

    public record LPSummary(
        Long lpClientId,
        String lpClientName,
        BigDecimal lsavBalance,
        BigDecimal lspdBalance,
        BigDecimal ltaxBalance,
        BigDecimal unsettledTotal,
        int assetCount
    ) {}
}
