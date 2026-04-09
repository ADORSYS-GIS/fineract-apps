package com.adorsys.fineract.asset.dto;

import java.math.BigDecimal;
import java.util.List;

/**
 * Portfolio allocation breakdown for a single asset category, returned as part of the
 * portfolio summary response ({@code GET /portfolio/summary}). Each instance represents
 * one category bucket (e.g. "BONDS" or "REAL_ESTATE") and its share of the user's
 * total portfolio value. The list of all category allocations sums to 100% of the portfolio.
 *
 * <p>The {@code sparkline} provides a lightweight price trend for visual display in the
 * portfolio allocation chart without requiring a separate price-history API call.</p>
 */
public record CategoryAllocationResponse(
    /**
     * Name of the asset category this entry represents (e.g. "BONDS", "REAL_ESTATE").
     * Matches the string representation of {@link AssetCategory}.
     */
    String category,
    /**
     * Aggregate current market value of all positions in this category, in XAF.
     * Computed as the sum of (units × current ask price) for each position in the category.
     */
    BigDecimal totalValue,
    /**
     * This category's share of the user's total portfolio value, expressed as a percentage
     * (e.g. 42.5 means 42.5%). All category percentages sum to 100 for the portfolio.
     */
    BigDecimal percentage,
    /**
     * Recent price trend data points for this category, used to render a small inline
     * sparkline chart. Each point carries a timestamp and a value. May be empty if
     * price history is not available for the assets in this category.
     */
    List<SparklinePointDto> sparkline
) {}
