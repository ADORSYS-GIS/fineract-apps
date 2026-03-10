package com.adorsys.fineract.asset.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * Tracks an individual purchase lot for FIFO cost basis and per-lot lockup.
 * Created on each BUY. Consumed (remainingUnits decremented) on each SELL in FIFO order.
 */
@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "purchase_lots", indexes = {
    @Index(name = "idx_lots_user_asset", columnList = "user_id, asset_id, purchased_at")
})
public class PurchaseLot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Fineract user/client ID that owns this lot. */
    @Column(name = "user_id", nullable = false)
    private Long userId;

    /** ID of the asset purchased. */
    @Column(name = "asset_id", nullable = false)
    private String assetId;

    /** Number of units originally purchased in this lot. */
    @Column(nullable = false, precision = 20, scale = 8)
    private BigDecimal units;

    /** Units not yet sold (decremented during FIFO consumption). */
    @Column(name = "remaining_units", nullable = false, precision = 20, scale = 8)
    private BigDecimal remainingUnits;

    /** Price per unit at time of purchase, in settlement currency. */
    @Column(name = "purchase_price", nullable = false, precision = 20, scale = 4)
    private BigDecimal purchasePrice;

    /** Timestamp when this lot was purchased. */
    @Column(name = "purchased_at", nullable = false)
    private Instant purchasedAt;

    /** When the per-lot lockup expires. Null means no lockup on this lot. */
    @Column(name = "lockup_expires_at")
    private Instant lockupExpiresAt;

    @Version
    private Long version;

    @PrePersist
    protected void onCreate() {
        if (purchasedAt == null) purchasedAt = Instant.now();
        if (remainingUnits == null) remainingUnits = units;
    }
}
