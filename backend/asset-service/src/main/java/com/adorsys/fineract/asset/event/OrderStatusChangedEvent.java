package com.adorsys.fineract.asset.event;

import com.adorsys.fineract.asset.dto.OrderStatus;
import com.adorsys.fineract.asset.dto.TradeSide;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * Published on every order status transition. Consumed by SSE emitters and
 * the notification system for real-time order tracking.
 * <p>
 * Intentionally NOT part of the sealed {@link AssetServiceEvent} hierarchy
 * to avoid breaking existing exhaustive switches in NotificationService.
 */
public record OrderStatusChangedEvent(
        String orderId,
        Long userId,
        String assetId,
        String assetSymbol,
        TradeSide side,
        OrderStatus previousStatus,
        OrderStatus newStatus,
        BigDecimal units,
        BigDecimal executionPrice,
        BigDecimal cashAmount,
        BigDecimal fee,
        String failureReason,
        Instant timestamp
) {}
