package com.adorsys.fineract.asset.dto;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * Admin view of an order, including resolution details and user identifiers.
 */
public record AdminOrderResponse(
    String orderId,
    String assetId,
    String symbol,
    TradeSide side,
    BigDecimal units,
    BigDecimal pricePerUnit,
    BigDecimal totalAmount,
    BigDecimal fee,
    BigDecimal spreadAmount,
    OrderStatus status,
    String failureReason,
    String userExternalId,
    Long userId,
    String resolvedBy,
    Instant resolvedAt,
    Instant createdAt,
    Instant updatedAt
) {}
