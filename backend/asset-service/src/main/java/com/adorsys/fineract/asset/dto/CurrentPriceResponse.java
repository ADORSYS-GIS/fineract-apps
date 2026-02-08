package com.adorsys.fineract.asset.dto;

import java.math.BigDecimal;

/**
 * Current price with 24h change for an asset.
 */
public record CurrentPriceResponse(
    String assetId,
    BigDecimal currentPrice,
    BigDecimal change24hPercent
) {}
