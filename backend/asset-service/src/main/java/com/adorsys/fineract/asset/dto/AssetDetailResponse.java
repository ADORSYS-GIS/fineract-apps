package com.adorsys.fineract.asset.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

/**
 * Full asset detail including OHLC data, supply stats, fee configuration, Fineract links,
 * and bond-specific fields (when category is BONDS).
 * Returned by the admin and customer asset detail endpoints.
 */
public record AssetDetailResponse(
    /** Internal asset identifier. */
    String id,
    /** Human-readable asset name. */
    String name,
    /** Ticker symbol, e.g. "BRVM". */
    String symbol,
    /** ISO-style currency code for this asset in Fineract, e.g. "BRV". */
    String currencyCode,
    /** Long-form description of the asset. */
    @Schema(nullable = true)
    String description,
    /** URL to the asset's logo or image. */
    @Schema(nullable = true)
    String imageUrl,
    /** Classification: REAL_ESTATE, COMMODITIES, AGRICULTURE, STOCKS, CRYPTO, or BONDS. */
    AssetCategory category,
    /** Lifecycle status: PENDING, ACTIVE, HALTED, DELISTED, or MATURED. */
    AssetStatus status,
    /** How the price is determined: AUTO or MANUAL. */
    PriceMode priceMode,
    /** Latest price per unit, in settlement currency. */
    BigDecimal currentPrice,
    /** 24-hour price change as a percentage (e.g. 2.5 = +2.5%). */
    BigDecimal change24hPercent,
    /** Opening price for the current trading day, in settlement currency. */
    BigDecimal dayOpen,
    /** Highest price reached during the current trading day, in settlement currency. */
    BigDecimal dayHigh,
    /** Lowest price reached during the current trading day, in settlement currency. */
    BigDecimal dayLow,
    /** Closing price for the current trading day, in settlement currency. */
    BigDecimal dayClose,
    /** Maximum total units that can ever exist. */
    BigDecimal totalSupply,
    /** Units currently in circulation (held by users). */
    BigDecimal circulatingSupply,
    /** Units available for purchase: totalSupply - circulatingSupply. */
    BigDecimal availableSupply,
    /** Trading fee as a percentage (e.g. 0.005 = 0.5%). */
    BigDecimal tradingFeePercent,
    /** Bid-ask spread as a percentage (e.g. 0.01 = 1%). */
    BigDecimal spreadPercent,
    /** Number of decimal places for fractional units (0-8). */
    Integer decimalPlaces,
    /** Start of the subscription period. */
    LocalDate subscriptionStartDate,
    /** End of the subscription period. */
    LocalDate subscriptionEndDate,
    /** Percentage of capital opened for subscription. */
    @Schema(nullable = true)
    BigDecimal capitalOpenedPercent,
    /** Fineract client ID of the treasury holding this asset's reserves. */
    Long treasuryClientId,
    /** Fineract savings account ID for the treasury's asset units. */
    Long treasuryAssetAccountId,
    /** Fineract savings account ID for the treasury's cash. */
    Long treasuryCashAccountId,
    /** Corresponding Fineract savings product ID. */
    Integer fineractProductId,
    /** Display name of the treasury client in Fineract. */
    @Schema(description = "Treasury client display name from Fineract.", nullable = true)
    String treasuryClientName,
    /** Derived name of the Fineract savings product (asset name + " Token"). */
    @Schema(description = "Fineract savings product name.", nullable = true)
    String fineractProductName,
    /** Timestamp when the asset was created. */
    Instant createdAt,
    /** Timestamp of the last update. Null if never updated. */
    @Schema(nullable = true)
    Instant updatedAt,

    // ── Bond / fixed-income fields (null for non-bond assets) ──

    /** Bond issuer name. Null for non-bond assets. */
    @Schema(description = "Bond issuer name (e.g. 'Etat du Sénégal'). Null for non-bond assets.", nullable = true)
    String issuer,
    /** International Securities Identification Number. Null for non-bond assets. */
    @Schema(description = "ISIN code (ISO 6166). Null for non-bond assets.", nullable = true)
    String isinCode,
    /** Bond maturity date. Null for non-bond assets. */
    @Schema(description = "Bond maturity date. Null for non-bond assets.", nullable = true)
    LocalDate maturityDate,
    /** Annual coupon rate as a percentage. Null for non-bond assets. */
    @Schema(description = "Annual coupon interest rate as percentage (e.g. 5.80).", nullable = true)
    BigDecimal interestRate,
    /** Coupon payment frequency in months. Null for non-bond assets. */
    @Schema(description = "Coupon frequency in months: 1, 3, 6, or 12.", nullable = true)
    Integer couponFrequencyMonths,
    /** Next scheduled coupon payment date. Null for non-bond assets. */
    @Schema(description = "Next scheduled coupon payment date.", nullable = true)
    LocalDate nextCouponDate,
    /** Days remaining until maturity. Null for non-bond assets. Computed, not stored. */
    @Schema(description = "Days remaining until maturity date. Computed at query time.", nullable = true)
    Long residualDays,
    /** Whether the subscription period has ended. */
    @Schema(description = "True if subscriptionEndDate has passed and new BUY orders are blocked.")
    Boolean subscriptionClosed,

    // ── Bid/Ask prices ──

    /** Best price a seller receives (currentPrice - spread). */
    @Schema(description = "Bid price: what sellers receive (mid - spread).", nullable = true)
    BigDecimal bidPrice,
    /** Price a buyer pays (currentPrice + spread). */
    @Schema(description = "Ask price: what buyers pay (mid + spread).", nullable = true)
    BigDecimal askPrice,

    // ── Exposure limits ──

    /** Max % of totalSupply a single user can hold. Null = unlimited. */
    @Schema(description = "Max position as percentage of total supply.", nullable = true)
    BigDecimal maxPositionPercent,
    /** Max units per single order. Null = unlimited. */
    @Schema(description = "Max units per single order.", nullable = true)
    BigDecimal maxOrderSize,
    /** Max XAF trading volume per user per day. Null = unlimited. */
    @Schema(description = "Max XAF volume per user per day.", nullable = true)
    BigDecimal dailyTradeLimitXaf,

    // ── Lock-up ──

    /** Lock-up period in days from first purchase. Null = no lock-up. */
    @Schema(description = "Lock-up period in days. Null means no lock-up.", nullable = true)
    Integer lockupDays,

    // ── Income distribution (non-bond) ──

    /** Income type: DIVIDEND, RENT, HARVEST_YIELD, PROFIT_SHARE. Null for non-income assets. */
    @Schema(description = "Income type: DIVIDEND, RENT, HARVEST_YIELD, PROFIT_SHARE.", nullable = true)
    String incomeType,
    /** Annual income rate as a percentage. Null for non-income assets. */
    @Schema(description = "Annual income rate as percentage.", nullable = true)
    BigDecimal incomeRate,
    /** Distribution frequency in months: 1, 3, 6, or 12. Null for non-income assets. */
    @Schema(description = "Distribution frequency in months.", nullable = true)
    Integer distributionFrequencyMonths,
    /** Next scheduled income distribution date. Null for non-income assets. */
    @Schema(description = "Next scheduled income distribution date.", nullable = true)
    LocalDate nextDistributionDate
) {}
