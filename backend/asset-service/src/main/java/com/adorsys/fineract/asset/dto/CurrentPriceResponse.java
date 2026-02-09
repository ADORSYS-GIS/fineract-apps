package com.adorsys.fineract.asset.dto;

import java.math.BigDecimal;

/**
 * Current price snapshot with 24-hour change for a single asset.
 */
public record CurrentPriceResponse(
    /** Internal asset identifier. */
    String assetId,
    /** Latest price per unit, in XAF. */
    BigDecimal currentPrice,
    /** 24-hour price change as a percentage (e.g. 2.5 = +2.5%). */
    BigDecimal change24hPercent
) {}
