package com.adorsys.fineract.asset.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * Stores the current and intra-day price data for an asset.
 * One row per asset (1:1 with Asset). Updated by the price scheduler or admin price-set operations.
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

    /** Latest known price of the asset, in settlement currency (whole units, no decimals). */
    @Column(name = "current_price", nullable = false, precision = 20, scale = 0)
    private BigDecimal currentPrice;

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

    /** Best price a seller receives (currentPrice - spread). Computed, not manually set. */
    @Column(name = "bid_price", precision = 20, scale = 0)
    private BigDecimal bidPrice;

    /** Price a buyer pays (currentPrice + spread). Computed, not manually set. */
    @Column(name = "ask_price", precision = 20, scale = 0)
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
