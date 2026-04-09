package com.adorsys.fineract.asset.dto;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * A single price observation on a price history chart.
 *
 * <p>Used as the element type in {@link PriceHistoryResponse#points()}.
 * Represents one admin-set price event stored in the price history table.
 * All prices are LP ask prices (what buyers pay) in the settlement currency (XAF).
 *
 * <p>Charting clients should plot {@code price} on the y-axis and {@code capturedAt}
 * on the x-axis. Points are guaranteed to be ordered chronologically (oldest first)
 * by the query that produces them.
 */
public record PricePointDto(

    /**
     * LP ask price recorded at this point in time, in XAF.
     * This is the price a buyer would have paid at {@code capturedAt}.
     * Sourced from the {@code AssetPrice} history table, not the live Redis cache.
     */
    BigDecimal price,

    /**
     * UTC timestamp when this price was recorded in the system.
     * Corresponds to the moment an admin submitted a SetPrice request that was accepted.
     * Use this value to position the data point on the time axis of the chart.
     */
    Instant capturedAt

) {}
