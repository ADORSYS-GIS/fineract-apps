package com.adorsys.fineract.asset.dto;

import java.math.BigDecimal;

/**
 * Lightweight, Redis-cached price snapshot for a single asset.
 * Returns the same price as {@link AssetDetailResponse#currentPrice} but via a faster path
 * (Redis cache with 1-minute TTL → database fallback). Used internally by the trading engine
 * for BUY/SELL execution price lookups, and exposed at GET /api/prices/{assetId}.
 *
 * @see AssetDetailResponse for the full asset detail (28 fields, always reads from database)
 * @see AssetResponse for the marketplace listing (10 fields, always reads from database)
 */
public record CurrentPriceResponse(
    /** Internal asset identifier. */
    String assetId,
    /** Latest price per unit, in settlement currency. */
    BigDecimal currentPrice,
    /** 24-hour price change as a percentage (e.g. 2.5 = +2.5%). */
    BigDecimal change24hPercent,
    /** Best price a seller receives (currentPrice - spread). Null if spread not configured. */
    BigDecimal bidPrice,
    /** Price a buyer pays (currentPrice + spread). Null if spread not configured. */
    BigDecimal askPrice
) {
    /** Backward-compatible constructor without bid/ask. */
    public CurrentPriceResponse(String assetId, BigDecimal currentPrice, BigDecimal change24hPercent) {
        this(assetId, currentPrice, change24hPercent, null, null);
    }
}
