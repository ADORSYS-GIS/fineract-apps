package com.adorsys.fineract.asset.dto;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * Order history entry for user's trade history.
 */
public record OrderResponse(
    String orderId,
    String assetId,
    String symbol,
    TradeSide side,
    BigDecimal units,
    BigDecimal pricePerUnit,
    BigDecimal totalAmount,
    BigDecimal fee,
    OrderStatus status,
    Instant createdAt
) {}
