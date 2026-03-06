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
 * Daily snapshot of a user's portfolio value for performance charting.
 * One row per (userId, snapshotDate) pair; unique constraint prevents duplicates.
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

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "snapshot_date", nullable = false)
    private LocalDate snapshotDate;

    @Column(name = "total_value", nullable = false, precision = 20, scale = 0)
    private BigDecimal totalValue;

    @Column(name = "total_cost_basis", nullable = false, precision = 20, scale = 0)
    private BigDecimal totalCostBasis;

    @Column(name = "unrealized_pnl", nullable = false, precision = 20, scale = 0)
    private BigDecimal unrealizedPnl;

    @Column(name = "position_count", nullable = false)
    private int positionCount;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = Instant.now();
    }
}
