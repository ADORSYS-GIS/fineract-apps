package com.adorsys.fineract.asset.dto;

import java.math.BigDecimal;

/**
 * OHLC (Open / High / Low / Close) candlestick data for the current trading day.
 *
 * <p>Returned by {@code GET /api/prices/{assetId}/ohlc}. Values are computed from the
 * price history table for the current market day (midnight to midnight WAT). When the
 * market has not yet had any price updates today, all four price fields reflect the most
 * recent historical price (carry-forward behaviour).
 *
 * <p>All prices are in the settlement currency (XAF) and represent LP ask prices
 * (what a buyer would pay at that moment), not mid-market prices.
 */
public record OhlcResponse(

    /** Internal asset identifier (UUID string). Identifies which asset these candles belong to. */
    String assetId,

    /**
     * First recorded ask price of the current trading day, in XAF.
     * Captures the price at the start of today's market session (08:00 WAT).
     * If no price update has occurred yet today, this is the last price from the previous day.
     */
    BigDecimal open,

    /**
     * Highest ask price reached during the current trading day, in XAF.
     * Updates whenever a new price exceeds the previous intraday high.
     * Equal to {@code open} if only one price point exists for today.
     */
    BigDecimal high,

    /**
     * Lowest ask price reached during the current trading day, in XAF.
     * Updates whenever a new price falls below the previous intraday low.
     * Equal to {@code open} if only one price point exists for today.
     */
    BigDecimal low,

    /**
     * Most recent ask price recorded for the current trading day, in XAF.
     * This is the live "last price" and matches {@link PriceResponse#askPrice()} at the
     * moment the OHLC snapshot is generated. Updates with every admin price-set operation.
     */
    BigDecimal close

) {}
