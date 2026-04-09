package com.adorsys.fineract.asset.dto;

import java.math.BigDecimal;
import java.util.List;

/**
 * Complete portfolio summary for an authenticated user, aggregated across all open positions.
 *
 * <p>Returned by {@code GET /api/portfolio/summary}. Computed in real time using live ask
 * prices from the Redis price cache; values are not persisted and change with market price
 * updates.
 *
 * <p>All monetary amounts are in the settlement currency (XAF). Percentage fields use the
 * convention that {@code 25.0} means 25%, not 0.25.
 *
 * <p>The response combines three views:
 * <ul>
 *   <li>Top-level aggregates ({@code totalValue}, {@code totalCostBasis}, {@code unrealizedPnl},
 *       {@code unrealizedPnlPercent}) for the portfolio header card.</li>
 *   <li>{@code positions} — per-asset breakdown for the holdings table.</li>
 *   <li>{@code allocations} — category-level pie/donut chart data.</li>
 * </ul>
 */
public record PortfolioSummaryResponse(

    /**
     * Total current market value of all open positions combined, in XAF.
     * Sum of {@code marketValue} across all entries in {@code positions}.
     * This is the "portfolio worth" figure shown in the header.
     */
    BigDecimal totalValue,

    /**
     * Total amount originally spent to acquire all currently held positions, in XAF.
     * Sum of {@code costBasis} across all entries in {@code positions}.
     * Represents the portfolio's break-even point: if {@code totalValue > totalCostBasis}
     * the portfolio is in profit overall.
     */
    BigDecimal totalCostBasis,

    /**
     * Aggregate unrealized profit or loss across all positions, in XAF.
     * Formula: {@code totalValue - totalCostBasis}.
     * Positive means the portfolio has appreciated; negative means it has declined.
     * Only realised upon selling.
     */
    BigDecimal unrealizedPnl,

    /**
     * Aggregate unrealized P&L expressed as a percentage of {@code totalCostBasis}.
     * Formula: {@code (unrealizedPnl / totalCostBasis) × 100}.
     * Example: {@code 12.5} means the portfolio is up 12.5% on cost.
     * Zero when {@code totalCostBasis} is zero (no open positions yet).
     */
    BigDecimal unrealizedPnlPercent,

    /**
     * Per-asset position detail, one entry per asset the user currently holds.
     * Each {@link PositionResponse} contains its own market value, cost basis, P&L,
     * bond benefit projections, and full order history for that instrument.
     * Empty list when the user has no open positions.
     */
    List<PositionResponse> positions,

    /**
     * Portfolio allocation breakdown by asset category (e.g. BOND, EQUITY, REAL_ESTATE_FUND).
     * Used to render the allocation pie/donut chart. Each entry contains the category name,
     * total value within that category, percentage of the overall portfolio, and a sparkline.
     * Empty when there are no positions.
     */
    List<CategoryAllocationResponse> allocations,

    /**
     * Estimated blended annual yield for the entire portfolio, as a percentage.
     * Combines unrealized price appreciation with projected income streams (bond coupons,
     * dividends, rent). Calculated at query time from current prices and asset schedules.
     * This is an estimate, not a guaranteed return. Null when no positions are held.
     */
    BigDecimal estimatedAnnualYieldPercent,

    /**
     * Number of distinct asset categories represented in the portfolio.
     * Matches the length of the {@code allocations} list. Useful for displaying a
     * "diversified across N categories" badge in the UI.
     */
    int categoryCount

) {}
