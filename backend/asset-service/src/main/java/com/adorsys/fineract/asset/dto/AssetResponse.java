package com.adorsys.fineract.asset.dto;

import java.math.BigDecimal;

/**
 * Asset summary for marketplace listing.
 */
public record AssetResponse(
    String id,
    String name,
    String symbol,
    String imageUrl,
    AssetCategory category,
    AssetStatus status,
    BigDecimal currentPrice,
    BigDecimal change24hPercent,
    BigDecimal availableSupply,
    BigDecimal totalSupply
) {}
