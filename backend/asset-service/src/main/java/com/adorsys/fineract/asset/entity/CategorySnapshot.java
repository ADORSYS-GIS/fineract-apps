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
 * Daily snapshot of a user's portfolio value for a single asset category.
 * Written once per (userId, snapshotDate, category) tuple by the nightly
 * portfolio snapshot job. Used to render per-category sparkline charts on
 * the mobile Portfolio screen.
 * <p>
 * The unique constraint prevents duplicate snapshots for the same user,
 * date, and category — the job is idempotent by design.
 */
@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "category_snapshots", uniqueConstraints = {
    @UniqueConstraint(name = "uq_category_snapshot", columnNames = {"user_id", "snapshot_date", "category"})
})
public class CategorySnapshot {

    /** Auto-generated sequential primary key. */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Fineract client ID of the user whose portfolio is being snapshotted. */
    @Column(name = "user_id", nullable = false)
    private Long userId;

    /** Calendar date of this snapshot. Always the date the nightly job ran, never intra-day. */
    @Column(name = "snapshot_date", nullable = false)
    private LocalDate snapshotDate;

    /**
     * Asset category this snapshot covers — one of the {@code AssetCategory} enum
     * values serialized as a string (e.g. REAL_ESTATE, BONDS, COMMODITIES).
     */
    @Column(name = "category", nullable = false, length = 30)
    private String category;

    /**
     * Total market value of all the user's positions in this category at
     * {@code snapshotDate}, in XAF. Computed as the sum of
     * {@code position.totalUnits * currentPrice} across all assets in the category.
     */
    @Column(name = "total_value", nullable = false, precision = 20, scale = 0)
    private BigDecimal totalValue;

    /** Timestamp when this row was created. Set once on insert; never changed. */
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = Instant.now();
    }
}
