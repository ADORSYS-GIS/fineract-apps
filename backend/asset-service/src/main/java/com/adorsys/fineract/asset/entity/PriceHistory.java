package com.adorsys.fineract.asset.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * Time-series record of asset prices. One row per price snapshot.
 * Used to build price charts and calculate historical performance.
 */
@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "price_history")
public class PriceHistory {

    /** Auto-generated sequential primary key. */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** ID of the asset this price snapshot belongs to. References {@link Asset#id}. */
    @Column(name = "asset_id", nullable = false)
    private String assetId;

    /** Snapshot price of the asset at capturedAt, in settlement currency (whole units). */
    @Column(nullable = false, precision = 20, scale = 0)
    private BigDecimal price;

    /** Timestamp when this price was captured. Defaults to now if not set. */
    @Column(name = "captured_at", nullable = false)
    private Instant capturedAt;

    @PrePersist
    protected void onCreate() {
        if (capturedAt == null) capturedAt = Instant.now();
    }
}
