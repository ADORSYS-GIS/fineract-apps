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
 * Used to render per-category sparkline charts on the mobile Portfolio screen.
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

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "snapshot_date", nullable = false)
    private LocalDate snapshotDate;

    @Column(name = "category", nullable = false, length = 30)
    private String category;

    @Column(name = "total_value", nullable = false, precision = 20, scale = 0)
    private BigDecimal totalValue;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = Instant.now();
    }
}
