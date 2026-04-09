package com.adorsys.fineract.asset.dto;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * Admin view of an order returned by the admin order-listing and order-detail endpoints
 * ({@code GET /admin/orders} and {@code GET /admin/orders/{orderId}}). Extends the
 * customer-facing {@link OrderResponse} with operator-only fields: internal user identifiers,
 * failure details, and resolution metadata. Admins use this to investigate stuck or failed
 * orders and audit manual interventions.
 */
public record AdminOrderResponse(
    /** Unique order identifier (UUID). */
    String orderId,
    /** Identifier of the asset this order was placed against. */
    String assetId,
    /** Ticker symbol of the asset (e.g. "BRVM"). */
    String symbol,
    /** Direction of the trade: BUY or SELL. */
    TradeSide side,
    /** Number of asset units in this order. */
    BigDecimal units,
    /** Price per unit at the time the order was placed, in XAF. */
    BigDecimal pricePerUnit,
    /** Gross order value: units × pricePerUnit, in XAF. */
    BigDecimal totalAmount,
    /**
     * Platform trading fee charged for this order, in XAF.
     * Calculated as totalAmount × tradingFeePercent at execution time.
     */
    BigDecimal fee,
    /**
     * LP spread captured on this order, in XAF. Represents the difference between
     * the LP ask/bid price and the mid-market price, multiplied by units.
     */
    BigDecimal spreadAmount,
    /** Current lifecycle status of the order (e.g. FILLED, FAILED, PENDING). */
    OrderStatus status,
    /**
     * Human-readable explanation of why the order failed. Null when status is not FAILED.
     * Contains the exception message or business rule that caused the rejection.
     */
    String failureReason,
    /**
     * Keycloak subject (sub claim) of the user who placed the order. Used to cross-reference
     * the user in Keycloak without needing the Fineract client ID.
     */
    String userExternalId,
    /**
     * Fineract client ID of the user who placed the order. Used to look up the user's
     * savings accounts in Fineract. May be null for legacy orders created before the
     * custodial model was introduced.
     */
    Long userId,
    /**
     * Keycloak subject (sub claim) of the admin who manually resolved this order.
     * Null when the order was settled automatically by the normal processing flow.
     */
    String resolvedBy,
    /**
     * Timestamp when an admin manually resolved this order. Null for orders resolved
     * automatically or not yet resolved.
     */
    Instant resolvedAt,
    /** Timestamp when the order was first submitted, in UTC. */
    Instant createdAt,
    /** Timestamp of the most recent status change (e.g. PENDING → FILLED), in UTC. */
    Instant updatedAt
) {}
