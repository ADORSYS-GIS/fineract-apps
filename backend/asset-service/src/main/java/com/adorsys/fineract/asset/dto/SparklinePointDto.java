package com.adorsys.fineract.asset.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Single data point on a category sparkline chart, used in
 * {@code GET /api/assets/categories/sparklines} and related dashboard endpoints.
 *
 * <p>A sparkline is a compact time-series chart that shows trend direction without axis
 * labels. Each point records the aggregate portfolio value (or price) for a given date.
 * Points are returned in ascending date order. The {@code value} unit depends on the
 * chart context — typically total XAF portfolio value for a category, or the LP ask
 * price for a single asset sparkline.</p>
 */
public record SparklinePointDto(
    /**
     * Calendar date this data point represents.
     * Points are daily snapshots taken at market close or end-of-day.
     */
    LocalDate date,

    /**
     * Aggregate value for this date.
     * Units depend on context: XAF for portfolio/category sparklines,
     * or asset price in XAF per unit for price sparklines.
     */
    BigDecimal value
) {}
