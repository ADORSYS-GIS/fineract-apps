package com.adorsys.fineract.asset.dto;

import java.math.BigDecimal;

/**
 * Lightweight, real-time price snapshot for a single asset.
 *
 * <p>Returned by {@code GET /api/prices/{assetId}} and also used internally by the
 * trading engine to lock in the execution price when an order moves from PENDING to EXECUTING.
 *
 * <p>Prices are served via a fast path: Redis cache (1-minute TTL) → database fallback.
 * Under normal operation clients receive a cached value, keeping latency low even under load.
 * The cache is invalidated immediately when an admin sets a new price via the SetPrice API.
 *
 * <p>All price fields are in the settlement currency (XAF). {@code askPrice} and {@code bidPrice}
 * bracket the LP spread — the difference between them is the LP's gross revenue per unit traded.
 */
public record PriceResponse(

    /** Internal asset identifier (UUID string). Matches the requested path parameter. */
    String assetId,

    /**
     * LP ask price: the price a buyer pays per unit, in XAF.
     * Used at BUY order execution time. Always {@code >= bidPrice}.
     * Set by the admin via {@code POST /api/admin/assets/{assetId}/price}.
     */
    BigDecimal askPrice,

    /**
     * LP bid price: the price a seller receives per unit, in XAF.
     * Used at SELL order execution time. Always {@code <= askPrice}.
     * The spread (LP revenue per unit) is {@code askPrice - bidPrice}.
     */
    BigDecimal bidPrice,

    /**
     * 24-hour price change as a percentage of the price 24 hours ago.
     * Example: {@code 2.5} means the ask price rose 2.5% in the last 24 hours;
     * {@code -1.2} means it fell 1.2%. Zero if no historical data is available
     * from 24 hours prior (e.g. the asset was listed less than a day ago).
     */
    BigDecimal change24hPercent

) {}
