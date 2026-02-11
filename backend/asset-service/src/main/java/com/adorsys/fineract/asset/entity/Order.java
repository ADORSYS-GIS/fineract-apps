package com.adorsys.fineract.asset.entity;

import com.adorsys.fineract.asset.dto.OrderStatus;
import com.adorsys.fineract.asset.dto.TradeSide;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * Represents a BUY or SELL order placed by a user. Tracks the order through its lifecycle:
 * PENDING → EXECUTING → FILLED or FAILED/REJECTED.
 */
@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "orders")
public class Order {

    /** UUID primary key, generated at order creation. */
    @Id
    private String id;

    /** Client-provided idempotency key to prevent duplicate order submission. Must be unique. */
    @Column(name = "idempotency_key", unique = true)
    private String idempotencyKey;

    /** Fineract user/client ID that placed this order. */
    @Column(name = "user_id", nullable = false)
    private Long userId;

    /** External ID of the user in Fineract (e.g. phone number or UUID). */
    @Column(name = "user_external_id", nullable = false)
    private String userExternalId;

    /** ID of the asset being traded. References {@link Asset#id}. */
    @Column(name = "asset_id", nullable = false)
    private String assetId;

    /** Lazy-loaded reference to the Asset entity. Read-only (not insertable/updatable). */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "asset_id", insertable = false, updatable = false)
    private Asset asset;

    /** Direction of the trade: BUY or SELL. */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 4)
    private TradeSide side;

    /** Total XAF amount for this order. For BUY: amount spent. For SELL: net proceeds after fees. */
    @Column(name = "xaf_amount", nullable = false, precision = 20, scale = 0)
    private BigDecimal xafAmount;

    /** Number of asset units traded. Set after execution; null while PENDING. */
    @Column(precision = 20, scale = 8)
    private BigDecimal units;

    /** Price per unit at which the order was executed, in XAF. Set after execution; null while PENDING. */
    @Column(name = "execution_price", precision = 20, scale = 0)
    private BigDecimal executionPrice;

    /** Trading fee charged for this order, in XAF. Set after execution; null while PENDING. */
    @Column(precision = 20, scale = 0)
    private BigDecimal fee;

    /** Spread amount for this order, in XAF. Zero if spread is disabled. */
    @Column(name = "spread_amount", precision = 20, scale = 0)
    private BigDecimal spreadAmount;

    /** Current order status. Defaults to PENDING. */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 25)
    private OrderStatus status;

    /** Human-readable reason if the order FAILED or was REJECTED. Null for successful orders. */
    @Column(name = "failure_reason", length = 500)
    private String failureReason;

    /** Timestamp when the order was created. Set automatically, never updated. */
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    /** Timestamp of the last status change. Null until first update. */
    @Column(name = "updated_at")
    private Instant updatedAt;

    /** Optimistic locking version. Incremented on each update to prevent concurrent modification. */
    @Version
    private Long version;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = Instant.now();
        if (status == null) status = OrderStatus.PENDING;
        if (spreadAmount == null) spreadAmount = BigDecimal.ZERO;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = Instant.now();
    }
}
