package com.adorsys.fineract.asset.dto;

import java.time.LocalDate;

/**
 * Pending asset card for the "Discover" page. Shows upcoming assets not yet available for trading.
 */
public record DiscoverAssetResponse(
    /** Internal asset identifier. */
    String id,
    /** Human-readable asset name. */
    String name,
    /** Ticker symbol, e.g. "BRVM". */
    String symbol,
    /** URL to the asset's logo or image. */
    String imageUrl,
    /** Classification: REAL_ESTATE, COMMODITIES, AGRICULTURE, STOCKS, or CRYPTO. */
    AssetCategory category,
    /** Always PENDING for discover assets. */
    AssetStatus status,
    /** Start of the subscription period. */
    LocalDate subscriptionStartDate,
    /** Countdown: number of days until subscriptionStartDate. Calculated at read time. */
    long daysUntilSubscription
) {}
