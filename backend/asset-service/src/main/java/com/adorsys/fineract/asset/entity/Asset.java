package com.adorsys.fineract.asset.entity;

import com.adorsys.fineract.asset.dto.AssetCategory;
import com.adorsys.fineract.asset.dto.AssetStatus;
import com.adorsys.fineract.asset.dto.PriceMode;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

/**
 * Represents a tradeable asset (e.g. real estate token, commodity unit).
 * Each asset is backed by a Fineract savings product and has its own treasury accounts.
 */
@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "assets")
public class Asset {

    /** UUID primary key, generated at creation time. */
    @Id
    private String id;

    /** Corresponding savings product ID in Apache Fineract. Null until the Fineract product is linked. */
    @Column(name = "fineract_product_id", unique = true)
    private Integer fineractProductId;

    /** Short ticker symbol, e.g. "BRVM" or "GOLD". Max 10 characters, must be unique. */
    @Column(nullable = false, unique = true, length = 10)
    private String symbol;

    /** ISO-style currency code for this asset in Fineract, e.g. "BRV". Must be unique. */
    @Column(name = "currency_code", nullable = false, unique = true, length = 10)
    private String currencyCode;

    /** Human-readable display name, e.g. "BRVM Composite Index". */
    @Column(nullable = false)
    private String name;

    /** Optional long-form description of the asset. Max 1000 characters. */
    @Column(length = 1000)
    private String description;

    /** Optional URL to the asset's logo or image. Max 500 characters. */
    @Column(name = "image_url", length = 500)
    private String imageUrl;

    /** Classification category: REAL_ESTATE, COMMODITIES, AGRICULTURE, STOCKS, or CRYPTO. */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private AssetCategory category;

    /** Lifecycle status: PENDING → ACTIVE → HALTED or DELISTED. Defaults to PENDING on creation. */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private AssetStatus status;

    /** How the asset price is determined: MANUAL (admin-set) or AUTO (market-driven). Defaults to MANUAL. */
    @Enumerated(EnumType.STRING)
    @Column(name = "price_mode", nullable = false, length = 10)
    private PriceMode priceMode;

    /** Admin-set price used when priceMode is MANUAL, in XAF. Null when priceMode is AUTO. */
    @Column(name = "manual_price", precision = 20, scale = 8)
    private BigDecimal manualPrice;

    /** Number of decimal places for fractional units (0 = whole units only, up to 8). */
    @Column(name = "decimal_places", nullable = false)
    private Integer decimalPlaces;

    /** Maximum number of units that can ever exist for this asset. */
    @Column(name = "total_supply", nullable = false, precision = 20, scale = 8)
    private BigDecimal totalSupply;

    /** Number of units currently in circulation (held by users). Starts at 0, increases on BUY, decreases on SELL. */
    @Column(name = "circulating_supply", nullable = false, precision = 20, scale = 8)
    private BigDecimal circulatingSupply;

    /** Trading fee as a percentage (e.g. 0.005 = 0.5%). Applied to each trade's XAF amount. */
    @Column(name = "trading_fee_percent", precision = 5, scale = 4)
    private BigDecimal tradingFeePercent;

    /** Bid-ask spread as a percentage (e.g. 0.01 = 1%). Used to adjust buy/sell execution prices. */
    @Column(name = "spread_percent", precision = 5, scale = 4)
    private BigDecimal spreadPercent;

    /** Planned launch date for PENDING assets. Null for already-active assets. */
    @Column(name = "expected_launch_date")
    private LocalDate expectedLaunchDate;

    /** Fineract client ID of the treasury that holds this asset's reserves. */
    @Column(name = "treasury_client_id", nullable = false)
    private Long treasuryClientId;

    /** Fineract savings account ID where the treasury holds asset units. */
    @Column(name = "treasury_asset_account_id")
    private Long treasuryAssetAccountId;

    /** Fineract savings account ID where the treasury holds XAF cash for this asset. */
    @Column(name = "treasury_cash_account_id")
    private Long treasuryCashAccountId;

    /** Timestamp when this asset record was created. Set automatically, never updated. */
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    /** Timestamp of the last update to this asset record. Null until first update. */
    @Column(name = "updated_at")
    private Instant updatedAt;

    /** Optimistic locking version. Incremented on each update to prevent concurrent modification. */
    @Version
    private Long version;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = Instant.now();
        if (status == null) status = AssetStatus.PENDING;
        if (priceMode == null) priceMode = PriceMode.MANUAL;
        if (circulatingSupply == null) circulatingSupply = BigDecimal.ZERO;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = Instant.now();
    }
}
