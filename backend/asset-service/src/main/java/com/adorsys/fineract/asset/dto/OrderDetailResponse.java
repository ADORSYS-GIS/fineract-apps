package com.adorsys.fineract.asset.dto;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * Extended order detail for the admin order detail endpoint.
 * Includes all fields from AdminOrderResponse plus additional metadata.
 */
public record OrderDetailResponse(
        String orderId,
        String assetId,
        String symbol,
        String assetName,
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
        String idempotencyKey,
        String fineractBatchId,
        Long version,
        String resolvedBy,
        Instant resolvedAt,
        Instant createdAt,
        Instant updatedAt
) {
}
