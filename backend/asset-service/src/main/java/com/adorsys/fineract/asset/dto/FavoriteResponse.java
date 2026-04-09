package com.adorsys.fineract.asset.dto;

import java.math.BigDecimal;

/**
 * Watchlist entry returned by the user favorites endpoint ({@code GET /user/favorites}).
 * Each entry represents one asset that the authenticated user has bookmarked. Shows
 * the minimum data needed to render a compact watchlist row — identity, current price,
 * and the 24-hour trend — without fetching full asset detail.
 *
 * <p>Favorites are stored per-user and survive across sessions. A user may favorite
 * any asset regardless of its status, including PENDING assets from the Discover page.</p>
 */
public record FavoriteResponse(
    /** Internal asset identifier (UUID). Used when navigating to the asset detail page. */
    String assetId,
    /** Ticker symbol displayed in the watchlist row (e.g. "BRVM"). */
    String symbol,
    /** Full human-readable asset name shown as secondary text in the watchlist. */
    String name,
    /**
     * Current LP ask price in XAF — what a buyer would pay per unit right now.
     * May be null for PENDING assets that have not yet had a price configured.
     */
    BigDecimal askPrice,
    /**
     * Percentage price change over the past 24 hours relative to the opening price.
     * Positive values indicate appreciation; negative values indicate decline.
     * Expressed as a percentage (e.g. 2.5 means +2.5%). May be null for assets
     * with no intraday price history.
     */
    BigDecimal change24hPercent
) {}
