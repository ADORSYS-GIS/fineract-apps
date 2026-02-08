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

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "assets")
public class Asset {

    @Id
    private String id;

    @Column(name = "fineract_product_id", unique = true)
    private Integer fineractProductId;

    @Column(nullable = false, unique = true, length = 10)
    private String symbol;

    @Column(name = "currency_code", nullable = false, unique = true, length = 10)
    private String currencyCode;

    @Column(nullable = false)
    private String name;

    @Column(length = 1000)
    private String description;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private AssetCategory category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private AssetStatus status;

    @Enumerated(EnumType.STRING)
    @Column(name = "price_mode", nullable = false, length = 10)
    private PriceMode priceMode;

    @Column(name = "manual_price", precision = 20, scale = 8)
    private BigDecimal manualPrice;

    @Column(name = "decimal_places", nullable = false)
    private Integer decimalPlaces;

    @Column(name = "total_supply", nullable = false, precision = 20, scale = 8)
    private BigDecimal totalSupply;

    @Column(name = "circulating_supply", nullable = false, precision = 20, scale = 8)
    private BigDecimal circulatingSupply;

    @Column(name = "annual_yield", precision = 5, scale = 2)
    private BigDecimal annualYield;

    @Column(name = "trading_fee_percent", precision = 5, scale = 4)
    private BigDecimal tradingFeePercent;

    @Column(name = "spread_percent", precision = 5, scale = 4)
    private BigDecimal spreadPercent;

    @Column(name = "expected_launch_date")
    private LocalDate expectedLaunchDate;

    @Column(name = "treasury_client_id", nullable = false)
    private Long treasuryClientId;

    @Column(name = "treasury_asset_account_id")
    private Long treasuryAssetAccountId;

    @Column(name = "treasury_cash_account_id", nullable = false)
    private Long treasuryCashAccountId;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;

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
