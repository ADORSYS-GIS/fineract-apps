package com.adorsys.fineract.asset.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

/**
 * Daily snapshot of a user's total portfolio value across all assets and categories.
 * Written once per (userId, snapshotDate) by the nightly portfolio snapshot job.
 * The unique constraint ensures idempotent re-runs do not produce duplicate rows.
 * <p>
 * Used to render the overall portfolio performance sparkline and calculate
 * time-weighted returns on the mobile Portfolio screen.
 */
@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "portfolio_snapshots", uniqueConstraints = {
    @UniqueConstraint(name = "uq_portfolio_snapshot", columnNames = {"user_id", "snapshot_date"})
})
public class PortfolioSnapshot {

    /** Auto-generated sequential primary key. */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Fineract client ID of the user whose portfolio is being snapshotted. */
    @Column(name = "user_id", nullable = false)
    private Long userId;

    /** Calendar date of this snapshot. Set to the date the nightly job ran. */
    @Column(name = "snapshot_date", nullable = false)
    private LocalDate snapshotDate;

    /**
     * Total market value of all the user's open positions at {@code snapshotDate},
     * in XAF. Computed as the sum of {@code position.totalUnits * currentPrice}
     * across every asset the user holds.
     */
    @Column(name = "total_value", nullable = false, precision = 20, scale = 0)
    private BigDecimal totalValue;

    /**
     * Total amount originally invested across all open positions, in XAF.
     * Equal to the sum of {@link UserPosition#totalCostBasis} across all positions.
     * Used together with {@code totalValue} to compute the unrealized gain/loss.
     */
    @Column(name = "total_cost_basis", nullable = false, precision = 20, scale = 0)
    private BigDecimal totalCostBasis;

    /**
     * Portfolio-level unrealized profit or loss at {@code snapshotDate}, in XAF.
     * Computed as {@code totalValue - totalCostBasis}. Positive means the portfolio
     * is in profit; negative means it is at a loss.
     */
    @Column(name = "unrealized_pnl", nullable = false, precision = 20, scale = 0)
    private BigDecimal unrealizedPnl;

    /**
     * Number of distinct assets in which the user holds a non-zero position.
     * Used to surface portfolio diversity metrics.
     */
    @Column(name = "position_count", nullable = false)
    private int positionCount;

    /** Timestamp when this row was created. Set once on insert; never changed. */
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = Instant.now();
    }
}
