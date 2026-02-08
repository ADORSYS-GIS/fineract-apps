package com.adorsys.fineract.asset.dto;

import java.time.LocalDate;

/**
 * Pending asset card for the "Discover" page.
 */
public record DiscoverAssetResponse(
    String id,
    String name,
    String symbol,
    String imageUrl,
    AssetCategory category,
    AssetStatus status,
    LocalDate expectedLaunchDate,
    long daysUntilLaunch
) {}
