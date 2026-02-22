package com.adorsys.fineract.asset.dto;

import java.math.BigDecimal;

/**
 * Favorite/watchlist entry for a user's saved assets.
 */
public record FavoriteResponse(
    /** Internal asset identifier. */
    String assetId,
    /** Ticker symbol, e.g. "BRVM". */
    String symbol,
    /** Human-readable asset name. */
    String name,
    /** Latest price per unit, in settlement currency. */
    BigDecimal currentPrice,
    /** 24-hour price change as a percentage (e.g. 2.5 = +2.5%). */
    BigDecimal change24hPercent
) {}
