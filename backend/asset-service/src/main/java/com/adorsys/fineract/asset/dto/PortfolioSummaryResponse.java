package com.adorsys.fineract.asset.dto;

import java.math.BigDecimal;
import java.util.List;

/**
 * Full portfolio summary aggregated across all of a user's positions.
 */
public record PortfolioSummaryResponse(
    /** Total current market value of all positions combined, in XAF. */
    BigDecimal totalValue,
    /** Total amount spent to acquire all positions, in XAF. */
    BigDecimal totalCostBasis,
    /** Aggregate unrealized P&L: totalValue - totalCostBasis, in XAF. Positive = paper profit. */
    BigDecimal unrealizedPnl,
    /** Aggregate unrealized P&L as a percentage of totalCostBasis (e.g. 25.0 = +25%). Zero if totalCostBasis is zero. */
    BigDecimal unrealizedPnlPercent,
    /** Per-asset position breakdown with individual P&L. */
    List<PositionResponse> positions,
    /** Simplified holdings view for the customer dashboard. */
    List<HoldingResponse> holdings
) {}
