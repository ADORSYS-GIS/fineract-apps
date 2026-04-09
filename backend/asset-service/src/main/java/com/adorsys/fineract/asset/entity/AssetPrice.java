package com.adorsys.fineract.asset.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * Stores the live and intra-day price data for a single asset.
 * One row per asset (1:1 with {@link Asset}), created when the asset is activated
 * and updated in-place on every price tick. The ask/bid spread is the LP's quoted
 * market for that asset: buyers pay {@code askPrice}, sellers receive {@code bidPrice}.
 * <p>
 * Day OHLC values (open/high/low/close) are reset at market open (08:00 WAT) by
 * the PriceScheduler and finalized at market close (20:00 WAT). The
 * {@code previousClose} and {@code change24hPercent} are computed from the prior
 * day's {@code dayClose} when the day resets.
 */
@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "asset_prices")
public class AssetPrice {

    /** Foreign key to {@link Asset#id}. Also serves as the primary key (1:1 relationship). */
    @Id
    @Column(name = "asset_id")
    private String assetId;

    /** Lazy-loaded reference to the parent Asset. Read-only (not insertable/updatable). */
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "asset_id", insertable = false, updatable = false)
    private Asset asset;

    /** Closing price from the previous trading day, in settlement currency. Null if no previous close exists. */
    @Column(name = "previous_close", precision = 20, scale = 0)
    private BigDecimal previousClose;

    /** Price change over the last 24 hours, as a percentage (e.g. 2.5 = +2.5%). */
    @Column(name = "change_24h_percent", precision = 10, scale = 4)
    private BigDecimal change24hPercent;

    /** Opening price for the current trading day, in settlement currency. */
    @Column(name = "day_open", precision = 20, scale = 0)
    private BigDecimal dayOpen;

    /** Highest price reached during the current trading day, in settlement currency. */
    @Column(name = "day_high", precision = 20, scale = 0)
    private BigDecimal dayHigh;

    /** Lowest price reached during the current trading day, in settlement currency. */
    @Column(name = "day_low", precision = 20, scale = 0)
    private BigDecimal dayLow;

    /** Closing price for the current trading day, in settlement currency. Set at market close. */
    @Column(name = "day_close", precision = 20, scale = 0)
    private BigDecimal dayClose;

    /** Best price a seller receives. Set by LP or auto-derived when reference price changes. */
    @Column(name = "bid_price", nullable = false, precision = 20, scale = 0)
    private BigDecimal bidPrice;

    /** Price a buyer pays. Set by LP or auto-derived when reference price changes. */
    @Column(name = "ask_price", nullable = false, precision = 20, scale = 0)
    private BigDecimal askPrice;

    /** Timestamp of the last price update. Auto-set on insert and update. */
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @PrePersist
    @PreUpdate
    protected void onPersist() {
        updatedAt = Instant.now();
    }
}
