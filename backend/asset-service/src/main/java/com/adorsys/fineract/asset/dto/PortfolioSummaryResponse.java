package com.adorsys.fineract.asset.dto;

import java.math.BigDecimal;
import java.util.List;

/**
 * Full portfolio summary aggregated across all of a user's positions.
 */
public record PortfolioSummaryResponse(
    /** Total current market value of all positions combined, in settlement currency. */
    BigDecimal totalValue,
    /** Total amount spent to acquire all positions, in settlement currency. */
    BigDecimal totalCostBasis,
    /** Aggregate unrealized P&L: totalValue - totalCostBasis, in settlement currency. Positive = paper profit. */
    BigDecimal unrealizedPnl,
    /** Aggregate unrealized P&L as a percentage of totalCostBasis (e.g. 25.0 = +25%). Zero if totalCostBasis is zero. */
    BigDecimal unrealizedPnlPercent,
    /** Per-asset position breakdown with individual P&L. */
    List<PositionResponse> positions,
    /** Allocation breakdown by asset category. */
    List<CategoryAllocationResponse> allocations,
    /** Estimated annual yield (total return) as a percentage — includes unrealized gains and projected bond coupon income. */
    BigDecimal estimatedAnnualYieldPercent,
    /** Number of distinct asset categories in the portfolio. */
    int categoryCount
) {}
