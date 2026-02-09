package com.adorsys.fineract.asset.dto;

import java.math.BigDecimal;

/**
 * OHLC (Open/High/Low/Close) candlestick data for the current trading day.
 */
public record OhlcResponse(
    /** Internal asset identifier. */
    String assetId,
    /** Opening price for the current trading day, in XAF. */
    BigDecimal open,
    /** Highest price reached during the current trading day, in XAF. */
    BigDecimal high,
    /** Lowest price reached during the current trading day, in XAF. */
    BigDecimal low,
    /** Closing price for the current trading day, in XAF. */
    BigDecimal close
) {}
