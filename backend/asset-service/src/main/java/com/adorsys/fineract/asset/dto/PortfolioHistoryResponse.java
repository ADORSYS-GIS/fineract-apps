package com.adorsys.fineract.asset.dto;

import java.util.List;

/**
 * Portfolio total-value history over a user-selected time period, for chart rendering.
 *
 * <p>Returned by {@code GET /api/portfolio/history?period={period}} for the authenticated user.
 * The period parameter controls the resolution and lookback window. Supported values:
 * {@code "1W"} (daily for 7 days), {@code "1M"} (daily for 30 days),
 * {@code "3M"} (daily for 90 days), {@code "1Y"} (weekly for 52 weeks),
 * {@code "ALL"} (monthly from the user's first trade to today).
 *
 * <p>Each snapshot in {@code snapshots} is one data point on the portfolio value line chart.
 * Snapshots are computed end-of-day for historical dates and in real time for today.
 * If the user had no positions on a given date, that date's snapshot still appears with
 * zero values to produce a continuous chart line.
 *
 * <p>The list is ordered chronologically (oldest first).
 */
public record PortfolioHistoryResponse(

    /**
     * The requested time period, echoed back from the query parameter.
     * Examples: {@code "1W"}, {@code "1M"}, {@code "3M"}, {@code "1Y"}, {@code "ALL"}.
     * Clients can use this to label the chart's x-axis range without parsing the snapshot dates.
     */
    String period,

    /**
     * Chronologically ordered list of portfolio value snapshots covering the requested period.
     * Each entry carries total value, cost basis, unrealized P&L, and position count for one day.
     * Empty only if the user has no trade history at all.
     */
    List<PortfolioSnapshotDto> snapshots

) {}
