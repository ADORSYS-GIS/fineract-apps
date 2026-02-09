package com.adorsys.fineract.asset.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * Tracks a user's holding in a specific asset. One row per (userId, assetId) pair.
 * Updated on each BUY (increases units/cost) and SELL (decreases units, accumulates realizedPnl).
 */
@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "user_positions", uniqueConstraints = {
    @UniqueConstraint(name = "uq_user_positions", columnNames = {"user_id", "asset_id"})
})
public class UserPosition {

    /** Auto-generated sequential primary key. */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Fineract user/client ID that owns this position. */
    @Column(name = "user_id", nullable = false)
    private Long userId;

    /** ID of the asset held. References {@link Asset#id}. */
    @Column(name = "asset_id", nullable = false)
    private String assetId;

    /** Lazy-loaded reference to the Asset entity. Read-only (not insertable/updatable). */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "asset_id", insertable = false, updatable = false)
    private Asset asset;

    /** Fineract savings account ID where the user's asset units are held. */
    @Column(name = "fineract_savings_account_id", nullable = false)
    private Long fineractSavingsAccountId;

    /** Total number of asset units the user currently holds. Increases on BUY, decreases on SELL. */
    @Column(name = "total_units", nullable = false, precision = 20, scale = 8)
    private BigDecimal totalUnits;

    /** Weighted average purchase price per unit, in XAF. Recalculated on each BUY using the formula: (oldCost + newCost) / (oldUnits + newUnits). */
    @Column(name = "avg_purchase_price", nullable = false, precision = 20, scale = 4)
    private BigDecimal avgPurchasePrice;

    /** Total amount spent acquiring the current position, in XAF. Equal to avgPurchasePrice × totalUnits. */
    @Column(name = "total_cost_basis", nullable = false, precision = 20, scale = 0)
    private BigDecimal totalCostBasis;

    /** Cumulative realized profit/loss from all completed SELL trades for this position, in XAF. Starts at 0. Updated on each SELL as: realizedPnl += (sellPrice - avgPurchasePrice) × unitsSold. */
    @Column(name = "realized_pnl", nullable = false, precision = 20, scale = 0)
    private BigDecimal realizedPnl;

    /** Timestamp of the most recent BUY or SELL trade on this position. */
    @Column(name = "last_trade_at", nullable = false)
    private Instant lastTradeAt;

    /** Optimistic locking version. Incremented on each update to prevent concurrent modification. */
    @Version
    private Long version;

    @PrePersist
    protected void onCreate() {
        if (totalUnits == null) totalUnits = BigDecimal.ZERO;
        if (avgPurchasePrice == null) avgPurchasePrice = BigDecimal.ZERO;
        if (totalCostBasis == null) totalCostBasis = BigDecimal.ZERO;
        if (realizedPnl == null) realizedPnl = BigDecimal.ZERO;
        if (lastTradeAt == null) lastTradeAt = Instant.now();
    }
}
