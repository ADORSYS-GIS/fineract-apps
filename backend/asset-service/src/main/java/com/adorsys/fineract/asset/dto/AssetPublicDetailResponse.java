package com.adorsys.fineract.asset.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

/**
 * Public asset detail response returned by the customer-facing asset detail endpoint
 * ({@code GET /assets/{id}}). Contains the same market data, bond fields, and exposure
 * limits as {@link AssetDetailResponse} but strips all internal Fineract infrastructure
 * identifiers (LP client ID, savings account IDs, product ID) that must not be exposed
 * to end users. The LP is identified only by name ({@code lpName}).
 *
 * <p>Bond-specific fields ({@code bondType}, {@code interestRate}, {@code maturityDate}, etc.)
 * are null for non-bond assets. All monetary amounts are in XAF unless noted.</p>
 */
public record AssetPublicDetailResponse(
    /** Internal asset identifier (UUID). */
    String id,
    /** Human-readable asset name (e.g. "Bon du Trésor Assimilable 2024"). */
    String name,
    /** Ticker symbol used in trading (e.g. "BTA2024"). */
    String symbol,
    /**
     * ISO-style currency code used to identify this asset's savings product in Fineract
     * (e.g. "BRV"). Not an ISO 4217 currency code — it is a Fineract product shortcode.
     */
    String currencyCode,
    /** Long-form marketing description of the asset. Null if not provided at creation. */
    String description,
    /** URL to the asset's logo or promotional image. Null if not provided. */
    String imageUrl,
    /** Classification bucket for this asset (e.g. BONDS, REAL_ESTATE). */
    AssetCategory category,
    /** Current lifecycle status controlling what operations are permitted. */
    AssetStatus status,
    /**
     * How the current ask price is determined. AUTO means the price is derived from
     * external market feeds; MANUAL means an admin sets it explicitly.
     */
    PriceMode priceMode,
    /**
     * Percentage price change over the past 24 hours relative to the opening price.
     * Expressed as a percentage (e.g. 2.5 means +2.5%). Negative values indicate decline.
     */
    BigDecimal change24hPercent,
    /** Opening ask price for the current calendar trading day, in XAF. */
    BigDecimal dayOpen,
    /** Highest ask price reached during the current calendar trading day, in XAF. */
    BigDecimal dayHigh,
    /** Lowest ask price reached during the current calendar trading day, in XAF. */
    BigDecimal dayLow,
    /** Closing ask price for the current calendar trading day, in XAF. */
    BigDecimal dayClose,
    /** Maximum number of units that can ever exist for this asset. Set at creation and immutable. */
    BigDecimal totalSupply,
    /** Units currently held by users across all their Fineract savings accounts. */
    BigDecimal circulatingSupply,
    /**
     * Units the LP still has available to sell: {@code totalSupply - circulatingSupply}.
     * When this reaches zero, BUY orders cannot be filled.
     */
    BigDecimal availableSupply,
    /**
     * Platform trading fee as a decimal percentage charged on every filled order
     * (e.g. 0.005 = 0.5%). Applied to the gross trade amount.
     */
    BigDecimal tradingFeePercent,
    /**
     * Number of decimal places allowed for fractional unit quantities (0–8).
     * Controls order validation and display rounding in the frontend.
     */
    Integer decimalPlaces,
    /** Timestamp when the asset record was first created, in UTC. */
    Instant createdAt,
    /** Timestamp of the most recent update to this asset's configuration. Null if never updated. */
    Instant updatedAt,

    // ── Issuer & LP info (visible to investors) ──

    /**
     * Name of the entity that issued or backs this asset (e.g. "Etat du Sénégal").
     * Required for bond assets; optional for other categories.
     */
    @Schema(description = "Asset issuer name. Required for bonds, optional for others.", nullable = true)
    String issuerName,
    /**
     * The LP's cost basis per unit in XAF — the price at which the liquidity partner acquired
     * the asset. For DISCOUNT (BTA) bonds, this is lower than {@code faceValue}.
     * Shown to investors so they can understand the LP margin.
     */
    @Schema(description = "LP acquisition cost per unit.", nullable = true)
    BigDecimal issuerPrice,
    /**
     * Par or redemption value per unit in XAF. For DISCOUNT bonds, investors receive this
     * amount at maturity regardless of what they paid. For COUPON bonds, coupons are
     * calculated on this value. Null if not configured (defaults to {@code issuerPrice}).
     */
    @Schema(description = "Face/par value per unit for redemption.", nullable = true)
    BigDecimal faceValue,
    /**
     * Display name of the liquidity partner (reseller) for this asset. Shown on the asset
     * detail page so investors know who acts as the market counterparty.
     * Null if the LP has no registered display name.
     */
    @Schema(description = "Liquidity partner (reseller) name.", nullable = true)
    String lpName,

    // ── Bond / fixed-income fields (null for non-bond assets) ──

    /**
     * Distinguishes between COUPON bonds (OTA / T-Bonds with periodic interest) and
     * DISCOUNT bonds (BTA / T-Bills with zero-coupon discount). Null for non-bond assets.
     */
    @Schema(description = "Bond type: COUPON (OTA) or DISCOUNT (BTA). Null for non-bond assets.", nullable = true)
    BondType bondType,
    /**
     * Day count convention for accrued interest calculations. ACT_360 is standard for
     * BTA instruments in CEMAC; ACT_365 for OTA instruments. Null for non-bond assets.
     */
    @Schema(description = "Day count convention: ACT_360, ACT_365, or THIRTY_360.", nullable = true)
    DayCountConvention dayCountConvention,
    /**
     * CEMAC member state that issued this bond (e.g. "Cameroun"). Used for display
     * and regional filtering. Null for non-bond assets.
     */
    @Schema(description = "Issuer country name.", nullable = true)
    String issuerCountry,
    /**
     * International Securities Identification Number (ISO 6166) assigned to this bond.
     * Null for non-bond assets or bonds not yet assigned an ISIN.
     */
    @Schema(description = "ISIN code (ISO 6166). Null for non-bond assets.")
    String isinCode,
    /**
     * Date on which the bond principal is due for repayment. After this date the asset
     * transitions to MATURED status. Null for non-bond assets.
     */
    @Schema(description = "Bond maturity date. Null for non-bond assets.")
    LocalDate maturityDate,
    /**
     * Date on which the bond was originally issued. Used for BTA price accretion
     * and accrued interest calculations. Null for non-bond assets.
     */
    @Schema(description = "Bond issue date. Null for non-bond assets.", nullable = true)
    LocalDate issueDate,
    /**
     * Annual nominal coupon rate as a percentage (e.g. 5.80 = 5.80% per year).
     * Null for DISCOUNT bonds and non-bond assets.
     */
    @Schema(description = "Annual coupon interest rate as percentage.")
    BigDecimal interestRate,
    /**
     * Effective annual yield based on the current ask price rather than face value.
     * Recomputed at query time. Null for non-bond assets.
     */
    @Schema(description = "Current yield: effective annual return based on ask price. Bonds only.", nullable = true)
    BigDecimal currentYield,
    /**
     * How often coupon payments are made, in months (e.g. 6 = semi-annual).
     * Null for DISCOUNT bonds and non-bond assets.
     */
    @Schema(description = "Coupon frequency in months: 1, 3, 6, or 12.")
    Integer couponFrequencyMonths,
    /**
     * The next date on which a coupon payment will be distributed to unit holders.
     * Null for DISCOUNT bonds and non-bond assets.
     */
    @Schema(description = "Next scheduled coupon payment date.")
    LocalDate nextCouponDate,
    /**
     * Calendar days remaining from today to {@code maturityDate}. Clamped to zero once
     * the bond has matured. Computed at query time. Null for non-bond assets.
     */
    @Schema(description = "Days remaining until maturity date. Computed at query time.")
    Long residualDays,
    /**
     * Coupon income per unit per payment period in XAF. Computed as:
     * {@code faceValue × (interestRate / 100) × (couponFrequencyMonths / 12)}.
     * Null for DISCOUNT bonds and non-bond assets.
     */
    @Schema(description = "Coupon amount per unit per period, based on issuer price.", nullable = true)
    BigDecimal couponAmountPerUnit,
    /**
     * Effective IRCM (Impôt sur Revenus des Capitaux Mobiliers) withholding rate
     * applied to income or capital gains on this asset, as a decimal (e.g. 0.165 = 16.5%).
     * Resolved by {@code TaxService.getEffectiveIrcmRate}: returns 0 if IRCM is disabled
     * or if the asset is exempt (government bonds, IRCM-exempt overrides), uses the
     * per-asset rate override when set, otherwise selects between the bond rate (5.5%
     * for ≥5y maturity), BVMAC rate (11%), or default dividend rate (16.5%).
     * <p>Frontends should display this rate alongside the bond detail and use it as the
     * authoritative source for any per-unit IRCM derivation rather than hardcoding a
     * constant.
     */
    @Schema(description = "Effective IRCM withholding rate (e.g. 0.165 = 16.5%). 0 if disabled or exempt.", nullable = true)
    BigDecimal ircmRate,
    /**
     * Implied annual yield-to-maturity for a DISCOUNT (BTA) bond, computed from the
     * issuer price and face value over the bond's tenor:
     * {@code (faceValue / issuerPrice - 1) × (360 / originalTotalDays)}.
     * <p>Distinct from {@code currentYield}, which is a forward-looking yield based on
     * the current ask price. {@code impliedRate} reflects the original issuance discount
     * and is the value the asset-service uses internally for daily price accretion.
     * Null for COUPON bonds and non-bond assets, and when issuer price or dates are missing.
     */
    @Schema(description = "BTA implied yield (issuance discount). Null for COUPON bonds.", nullable = true)
    BigDecimal impliedRate,
    /**
     * Accrued interest per unit since the last coupon payment, in XAF. The buyer
     * compensates the seller for this amount on top of the clean price during a trade
     * between coupon dates. Computed by {@code AccruedInterestCalculator}.
     * Null for DISCOUNT bonds (no coupons accrue) and non-bond assets.
     */
    @Schema(description = "OTA accrued interest per unit since last coupon. Null for DISCOUNT bonds.", nullable = true)
    BigDecimal accruedInterestPerUnit,

    // ── Bid/Ask prices ──

    /**
     * The price at which the LP buys units back from sellers, in XAF.
     * Sellers receive this amount per unit minus applicable fees.
     * Null if prices have not been configured.
     */
    @Schema(description = "LP bid price: what sellers receive.", nullable = true)
    BigDecimal bidPrice,
    /**
     * The price at which the LP sells units to buyers, in XAF.
     * Buyers pay this amount per unit plus applicable fees.
     * Null if prices have not been configured.
     */
    @Schema(description = "LP ask price: what buyers pay.", nullable = true)
    BigDecimal askPrice,

    // ── Exposure limits ──

    /**
     * Maximum position a single user may hold as a percentage of {@code totalSupply}.
     * BUY orders that would breach this threshold are rejected. Null means no cap.
     */
    @Schema(description = "Max position as percentage of total supply.", nullable = true)
    BigDecimal maxPositionPercent,
    /**
     * Maximum number of units allowed in a single order. Null means no per-order cap.
     */
    @Schema(description = "Max units per single order.", nullable = true)
    BigDecimal maxOrderSize,
    /**
     * Maximum XAF trading volume a single user may transact within a rolling 24-hour window.
     * Null means no daily cap is enforced.
     */
    @Schema(description = "Max XAF volume per user per day.", nullable = true)
    BigDecimal dailyTradeLimitXaf,

    // ── Min order size ──

    /**
     * Minimum number of units required for a single order.
     * Null means no minimum unit quantity is enforced.
     */
    @Schema(description = "Minimum units per single order.", nullable = true)
    BigDecimal minOrderSize,
    /**
     * Minimum gross XAF amount required for a single order ({@code units × price}).
     * Null means no minimum cash amount is enforced.
     */
    @Schema(description = "Minimum XAF amount per single order.", nullable = true)
    BigDecimal minOrderCashAmount,

    // ── Lock-up ──

    /**
     * Number of days from a user's first purchase during which SELL orders are blocked.
     * Null means holdings can be sold immediately after purchase.
     */
    @Schema(description = "Lock-up period in days. Null means no lock-up.", nullable = true)
    Integer lockupDays,

    // ── Income distribution (non-bond) ──

    /**
     * Type of periodic income distributed to holders for non-bond assets.
     * Possible values: DIVIDEND, RENT, HARVEST_YIELD, PROFIT_SHARE.
     * Null for bond assets and assets without income configuration.
     */
    @Schema(description = "Income type: DIVIDEND, RENT, HARVEST_YIELD, PROFIT_SHARE.", nullable = true)
    String incomeType,
    /**
     * Annual income rate as a percentage of the current market price per unit.
     * Unlike bond coupons, this is applied to the market price so payouts vary.
     * Null for bond assets and assets without income configuration.
     */
    @Schema(description = "Annual income rate as percentage.", nullable = true)
    BigDecimal incomeRate,
    /**
     * How often income is distributed, in months.
     * Null for bond assets and assets without income configuration.
     */
    @Schema(description = "Distribution frequency in months.", nullable = true)
    Integer distributionFrequencyMonths,
    /**
     * The next date on which income will be distributed to holders.
     * Null for bond assets and assets without income configuration.
     */
    @Schema(description = "Next scheduled income distribution date.", nullable = true)
    LocalDate nextDistributionDate
) {}
