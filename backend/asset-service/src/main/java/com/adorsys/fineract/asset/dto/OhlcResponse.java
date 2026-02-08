package com.adorsys.fineract.asset.dto;

import java.math.BigDecimal;

/**
 * OHLC (Open/High/Low/Close) data for an asset.
 */
public record OhlcResponse(
    String assetId,
    BigDecimal open,
    BigDecimal high,
    BigDecimal low,
    BigDecimal close
) {}
