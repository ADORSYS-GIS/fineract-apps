package com.adorsys.fineract.asset.dto;

import java.math.BigDecimal;

/**
 * Favorite/watchlist entry.
 */
public record FavoriteResponse(
    String assetId,
    String symbol,
    String name,
    BigDecimal currentPrice,
    BigDecimal change24hPercent
) {}
