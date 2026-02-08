package com.adorsys.fineract.asset.dto;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * Response after executing a trade.
 */
public record TradeResponse(
    String orderId,
    OrderStatus status,
    TradeSide side,
    BigDecimal units,
    BigDecimal pricePerUnit,
    BigDecimal totalAmount,
    BigDecimal fee,
    BigDecimal realizedPnl,
    Instant executedAt
) {}
