package com.adorsys.fineract.asset.dto;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * Response returned immediately after executing a BUY or SELL trade.
 */
public record TradeResponse(
    /** UUID of the order that was executed. */
    String orderId,
    /** Final order status (typically FILLED). */
    OrderStatus status,
    /** Direction of the trade: BUY or SELL. */
    TradeSide side,
    /** Number of asset units traded. */
    BigDecimal units,
    /** Execution price per unit, in settlement currency. */
    BigDecimal pricePerUnit,
    /** Total settlement currency amount. For BUY: amount spent. For SELL: net proceeds after fees. */
    BigDecimal totalAmount,
    /** Trading fee charged, in settlement currency. */
    BigDecimal fee,
    /** Spread amount for this trade, in settlement currency. Zero if spread is disabled. */
    BigDecimal spreadAmount,
    /** Realized P&L from this trade, in settlement currency. Only present for SELL trades: (sellPrice - avgPurchasePrice) × units. Null for BUY trades. */
    @io.swagger.v3.oas.annotations.media.Schema(nullable = true)
    BigDecimal realizedPnl,
    /** Timestamp when the trade was executed. */
    Instant executedAt
) {}
