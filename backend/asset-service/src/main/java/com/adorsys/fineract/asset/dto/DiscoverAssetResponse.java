package com.adorsys.fineract.asset.dto;

/**
 * Lightweight asset card returned by the "Discover" endpoint ({@code GET /assets/discover}).
 * Shows upcoming assets that are not yet available for trading — they are in PENDING status
 * while the admin completes configuration or while a bond is awaiting its subscription window.
 * The frontend uses this to build a teaser page that lets users track and favorite
 * assets before they go live.
 *
 * <p>No pricing or supply fields are included because PENDING assets have not yet had
 * prices or supply configured. The card is intentionally minimal — just enough to identify
 * and categorise the upcoming asset.</p>
 */
public record DiscoverAssetResponse(
    /** Internal asset identifier (UUID). Used when adding the asset to a user's watchlist. */
    String id,
    /** Human-readable asset name (e.g. "Obligation du Trésor 2026"). */
    String name,
    /** Ticker symbol that will be used when the asset goes live (e.g. "OTA2026"). */
    String symbol,
    /** URL to the asset's logo or promotional image. Null if not provided at creation. */
    String imageUrl,
    /**
     * Classification bucket for this asset (e.g. BONDS, REAL_ESTATE). Shown on the
     * discover card so users can filter by category.
     */
    AssetCategory category,
    /**
     * Always {@link AssetStatus#PENDING} for discover assets — only PENDING assets
     * appear in this endpoint's result set.
     */
    AssetStatus status
) {}
