package com.adorsys.fineract.asset.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * Time-series record of an asset's mid price. One row per price capture event,
 * written by the PriceHistoryScheduler on a configurable interval (default: hourly)
 * and also written immediately whenever an admin manually sets the price.
 * <p>
 * Used to build price charts on the asset detail screen and to calculate
 * historical performance for portfolio snapshots. Rows are immutable after
 * creation — corrections are handled by inserting a new row, not by updating
 * an existing one.
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

    /**
     * Mid-market price of the asset at {@code capturedAt}, in XAF (whole francs,
     * scale 0). For MANUAL-mode assets this equals {@link Asset#manualPrice}.
     * For AUTO-mode assets this is derived from the exchange feed.
     */
    @Column(nullable = false, precision = 20, scale = 0)
    private BigDecimal price;

    /**
     * Timestamp when this price was captured. Set automatically to {@code Instant.now()}
     * on insert if not explicitly provided. Forms the X-axis of the price chart.
     */
    @Column(name = "captured_at", nullable = false)
    private Instant capturedAt;

    @PrePersist
    protected void onCreate() {
        if (capturedAt == null) capturedAt = Instant.now();
    }
}
