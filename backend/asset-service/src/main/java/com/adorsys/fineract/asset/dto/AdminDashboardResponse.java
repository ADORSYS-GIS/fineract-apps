package com.adorsys.fineract.asset.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;

@Schema(description = "Aggregated admin dashboard summary with platform-wide metrics.")
public record AdminDashboardResponse(
    AssetMetrics assets,
    TradingMetrics trading,
    OrderHealthMetrics orders,
    ReconMetrics reconciliation,
    long activeInvestors
) {
    public record AssetMetrics(
        long total,
        long active,
        long halted,
        long pending,
        long delisting,
        long matured,
        long delisted
    ) {}

    public record TradingMetrics(
        long tradeCount24h,
        BigDecimal buyVolume24h,
        BigDecimal sellVolume24h,
        long activeTraders24h
    ) {}

    public record OrderHealthMetrics(
        long needsReconciliation,
        long failed,
        long manuallyClosed
    ) {}

    public record ReconMetrics(
        long openReports,
        long criticalOpen,
        long warningOpen
    ) {}
}
