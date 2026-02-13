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
    /** Planned date when the asset will become ACTIVE and tradeable. */
    LocalDate expectedLaunchDate,
    /** Countdown: number of days until expectedLaunchDate. Calculated at read time. */
    long daysUntilLaunch
) {}
