package com.adorsys.fineract.asset.dto;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * Order history entry for a user's trade history page.
 */
public record OrderResponse(
    /** UUID of the order. */
    String orderId,
    /** ID of the asset that was traded. */
    String assetId,
    /** Ticker symbol of the traded asset, e.g. "BRVM". */
    String symbol,
    /** Direction of the trade: BUY or SELL. */
    TradeSide side,
    /** Number of asset units traded. */
    BigDecimal units,
    /** Execution price per unit, in settlement currency. */
    BigDecimal pricePerUnit,
    /** Total settlement currency amount of the order. */
    BigDecimal totalAmount,
    /** Trading fee charged, in settlement currency. */
    BigDecimal fee,
    /** Spread amount for this order, in settlement currency. Zero if spread is disabled. */
    BigDecimal spreadAmount,
    /** Final order status: PENDING, EXECUTING, FILLED, FAILED, or REJECTED. */
    OrderStatus status,
    /** Timestamp when the order was created. */
    Instant createdAt
) {}
