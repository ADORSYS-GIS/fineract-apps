package com.adorsys.fineract.asset.entity;

import com.adorsys.fineract.asset.dto.AssetCategory;
import com.adorsys.fineract.asset.dto.AssetStatus;
import com.adorsys.fineract.asset.dto.BondType;
import com.adorsys.fineract.asset.dto.DayCountConvention;
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

    /** Classification category: REAL_ESTATE, COMMODITIES, AGRICULTURE, STOCKS, CRYPTO, or BONDS. */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private AssetCategory category;

    /** Lifecycle status: PENDING → ACTIVE → HALTED or DELISTED. Defaults to PENDING on creation. */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private AssetStatus status;

    /** How the asset price is determined: MANUAL (admin-set) or AUTO (market-driven). Defaults to MANUAL. */
    @Enumerated(EnumType.STRING)
    @Column(name = "price_mode", nullable = false, length = 10)
    private PriceMode priceMode;

    /** Admin-set price used when priceMode is MANUAL, in settlement currency. Null when priceMode is AUTO. */
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

    /** Trading fee as a percentage (e.g. 0.005 = 0.5%). Applied to each trade's cash amount. */
    @Column(name = "trading_fee_percent", precision = 5, scale = 4)
    private BigDecimal tradingFeePercent;

    /** LP's acquisition cost per unit. For COUPON bonds, equals face value. For DISCOUNT bonds, the discounted purchase price from BEAC auction. Used for spread calculation: spread = executionPrice - issuerPrice. */
    @Column(name = "issuer_price", precision = 20, scale = 8)
    private BigDecimal issuerPrice;

    /** Par/redemption value per unit. What the investor receives at maturity. For DISCOUNT bonds (BTA), this is higher than issuerPrice. Null defaults to issuerPrice for backward compatibility. */
    @Column(name = "face_value", precision = 20, scale = 8)
    private BigDecimal faceValue;

    /**
     * Returns the effective face value for coupon/income/redemption calculations.
     * Falls back to issuerPrice when faceValue is not set (backward compatibility).
     */
    public BigDecimal getEffectiveFaceValue() {
        return faceValue != null ? faceValue : issuerPrice;
    }

    // ── Exposure limits (all nullable — null means no limit) ───────────────

    /** Maximum percentage of totalSupply a single user can hold (e.g. 10.00 = 10%). */
    @Column(name = "max_position_percent", precision = 5, scale = 2)
    private BigDecimal maxPositionPercent;

    /** Maximum units a single order can trade. */
    @Column(name = "max_order_size", precision = 20, scale = 8)
    private BigDecimal maxOrderSize;

    /** Maximum XAF volume a single user can trade per day. */
    @Column(name = "daily_trade_limit_xaf", precision = 20, scale = 0)
    private BigDecimal dailyTradeLimitXaf;

    /** Lock-up period in days from first purchase. SELL blocked until lock-up expires. Null = no lock-up. */
    @Column(name = "lockup_days")
    private Integer lockupDays;

    /** Minimum units per single order. Null = no minimum. */
    @Column(name = "min_order_size", precision = 20, scale = 8)
    private BigDecimal minOrderSize;

    /** Minimum XAF amount per single order. Null = no minimum. */
    @Column(name = "min_order_cash_amount", precision = 20, scale = 0)
    private BigDecimal minOrderCashAmount;

    // ── Income distribution fields (non-bond: dividends, rent, harvest yield) ──

    /** Type of income distribution: DIVIDEND, RENT, HARVEST_YIELD, etc. Null means no income. */
    @Column(name = "income_type", length = 30)
    private String incomeType;

    /** Income rate as a percentage per distribution period. Null means no income. */
    @Column(name = "income_rate", precision = 8, scale = 4)
    private BigDecimal incomeRate;

    /** Distribution frequency in months (1, 3, 6, or 12). Null means no income. */
    @Column(name = "distribution_frequency_months")
    private Integer distributionFrequencyMonths;

    /** Next scheduled income distribution date. Auto-advanced after each distribution. */
    @Column(name = "next_distribution_date")
    private LocalDate nextDistributionDate;

    // ── Bond / fixed-income fields (null for non-bond assets) ──────────────

    /** Bond payment type: COUPON (OTA/T-Bonds) or DISCOUNT (BTA/T-Bills). Null for non-bond assets. */
    @Enumerated(EnumType.STRING)
    @Column(name = "bond_type", length = 10)
    private BondType bondType;

    /** Day count convention for interest calculations: ACT_360, ACT_365, or THIRTY_360. */
    @Enumerated(EnumType.STRING)
    @Column(name = "day_count_convention", length = 10)
    private DayCountConvention dayCountConvention;

    /** ISO country name of the issuing sovereign/entity (e.g. "CAMEROUN", "CONGO", "TCHAD"). */
    @Column(name = "issuer_country", length = 50)
    private String issuerCountry;

    /** Issuer name (e.g. "Etat du Sénégal"). Required for bonds, optional for others. */
    @Column(name = "issuer_name", length = 255)
    private String issuerName;

    /** International Securities Identification Number (ISO 6166). Null for non-bond assets. */
    @Column(name = "isin_code", length = 12)
    private String isinCode;

    /** Bond maturity date. When reached, the MaturityScheduler transitions status to MATURED. */
    @Column(name = "maturity_date")
    private LocalDate maturityDate;

    /** Annual coupon rate as a percentage (e.g. 5.80 = 5.80%). Null for non-bond assets. */
    @Column(name = "interest_rate", precision = 8, scale = 4)
    private BigDecimal interestRate;

    /** Coupon payment frequency in months: 1=Monthly, 3=Quarterly, 6=Semi-Annual, 12=Annual. */
    @Column(name = "coupon_frequency_months")
    private Integer couponFrequencyMonths;

    /** Next scheduled coupon payment date. Auto-advanced by InterestPaymentScheduler after each payment. */
    @Column(name = "next_coupon_date")
    private LocalDate nextCouponDate;

    // ── Delisting fields ─────────────────────────────────────────────────────

    /** Date on which forced buyback will occur. Set when delisting is initiated. */
    @Column(name = "delisting_date")
    private LocalDate delistingDate;

    /** Price at which forced buyback is executed. Null uses last traded price. */
    @Column(name = "delisting_redemption_price", precision = 20, scale = 0)
    private BigDecimal delistingRedemptionPrice;

    // ── End bond fields ────────────────────────────────────────────────────

    // ── Tax configuration (Cameroon/CEMAC) ───────────────────────────────

    /** Whether registration duty (2% droit d'enregistrement) applies to trades of this asset. */
    @Column(name = "registration_duty_enabled", nullable = false)
    @Builder.Default
    private Boolean registrationDutyEnabled = true;

    /** Registration duty rate override. Null uses global default (0.02). */
    @Column(name = "registration_duty_rate", precision = 5, scale = 4)
    private BigDecimal registrationDutyRate;

    /** Whether IRCM withholding applies to income distributions from this asset. */
    @Column(name = "ircm_enabled", nullable = false)
    @Builder.Default
    private Boolean ircmEnabled = true;

    /** IRCM rate override. Null uses auto-determination based on asset type/listing status. */
    @Column(name = "ircm_rate_override", precision = 5, scale = 4)
    private BigDecimal ircmRateOverride;

    /** Whether this asset is exempt from IRCM (e.g. government bonds). */
    @Column(name = "ircm_exempt", nullable = false)
    @Builder.Default
    private Boolean ircmExempt = false;

    /** Whether capital gains tax applies to profitable sales of this asset. */
    @Column(name = "capital_gains_tax_enabled", nullable = false)
    @Builder.Default
    private Boolean capitalGainsTaxEnabled = true;

    /** Capital gains tax rate override. Null uses global default (0.165). */
    @Column(name = "capital_gains_rate", precision = 5, scale = 4)
    private BigDecimal capitalGainsRate;

    /** Whether this asset is listed on the BVMAC (triggers reduced 11% IRCM rate). */
    @Column(name = "is_bvmac_listed", nullable = false)
    @Builder.Default
    private Boolean isBvmacListed = false;

    /** Whether this is a government bond (triggers IRCM exemption). */
    @Column(name = "is_government_bond", nullable = false)
    @Builder.Default
    private Boolean isGovernmentBond = false;

    // ── End tax configuration ────────────────────────────────────────────

    /** Fineract client ID of the liquidity partner (reseller) for this asset. */
    @Column(name = "lp_client_id", nullable = false)
    private Long lpClientId;

    /** Display name of the liquidity partner in Fineract. Stored at creation time. */
    @Column(name = "lp_client_name", length = 200)
    private String lpClientName;

    /** Fineract savings account ID where the LP holds asset units (inventory). */
    @Column(name = "lp_asset_account_id")
    private Long lpAssetAccountId;

    /** Fineract savings account ID where the LP holds settlement currency cash. */
    @Column(name = "lp_cash_account_id")
    private Long lpCashAccountId;

    /** Fineract savings account ID where the LP collects spread income (margin). */
    @Column(name = "lp_spread_account_id")
    private Long lpSpreadAccountId;

    /** Fineract savings account ID where tax is withheld from the LP on sell transactions. */
    @Column(name = "lp_tax_account_id")
    private Long lpTaxAccountId;

    /** Whether TVA (VAT) is enabled for this asset. */
    @Column(name = "tva_enabled")
    @Builder.Default
    private Boolean tvaEnabled = false;

    /** TVA rate override for this asset. Null = use global default. */
    @Column(name = "tva_rate", precision = 5, scale = 4)
    private BigDecimal tvaRate;

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
