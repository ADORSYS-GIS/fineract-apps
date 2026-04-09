package com.adorsys.fineract.asset.dto;

import java.util.List;

/**
 * Historical price data for an asset over a selected time window, used to render price charts.
 *
 * <p>Returned by {@code GET /api/prices/{assetId}/history?period={period}}.
 * All prices in the contained {@link PricePointDto} entries are LP ask prices (what buyers
 * pay), not mid-market or bid prices, and are denominated in XAF.
 *
 * <p>Supported period values and their approximate resolution:
 * <ul>
 *   <li>{@code "1D"} — every price update recorded today (typically low frequency for MANUAL mode)</li>
 *   <li>{@code "1W"} — one data point per day for the last 7 days</li>
 *   <li>{@code "1M"} — one data point per day for the last 30 days</li>
 *   <li>{@code "3M"} — one data point per day for the last 90 days</li>
 *   <li>{@code "1Y"} — one data point per week for the last 52 weeks</li>
 *   <li>{@code "ALL"} — one data point per month from the first price entry to today</li>
 * </ul>
 *
 * <p>The list is ordered chronologically (oldest first). When the asset has fewer price
 * updates than expected for the period, the returned list is shorter than the theoretical
 * maximum — no synthetic fill-forward points are inserted.
 */
public record PriceHistoryResponse(

    /** Internal asset identifier (UUID string). Identifies which asset's price history is returned. */
    String assetId,

    /**
     * The requested time period, echoed back from the query parameter.
     * Examples: {@code "1D"}, {@code "1W"}, {@code "1M"}, {@code "3M"}, {@code "1Y"}, {@code "ALL"}.
     */
    String period,

    /**
     * Chronologically ordered list of price snapshots within the requested period.
     * Each entry contains the ask price at a specific timestamp.
     * Empty only if the asset has no price history at all (i.e. was just created and
     * no price has been set yet via the admin SetPrice API).
     */
    List<PricePointDto> points

) {}
