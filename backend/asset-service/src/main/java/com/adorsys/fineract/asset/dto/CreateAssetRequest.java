package com.adorsys.fineract.asset.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Admin request to create a new asset. Triggers Fineract savings product provisioning.
 */
public record CreateAssetRequest(
    /** Human-readable display name for the asset. */
    @NotBlank String name,
    /** Short ticker symbol, e.g. "BRVM". Max 10 characters, must be unique. */
    @NotBlank @Size(max = 10) String symbol,
    /** ISO-style currency code for the Fineract savings product, e.g. "BRV". Max 10 characters, must be unique. */
    @NotBlank @Size(max = 10) String currencyCode,
    /** Optional long-form description. Max 1000 characters. */
    @Size(max = 1000) String description,
    /** Optional URL to the asset's logo or image. Max 500 characters. */
    @Size(max = 500) String imageUrl,
    /** Classification: REAL_ESTATE, COMMODITIES, AGRICULTURE, STOCKS, CRYPTO, or BONDS. */
    @NotNull AssetCategory category,
    /** Starting price per unit, in settlement currency. Must be positive. Used as the initial manual price. */
    @NotNull @Positive BigDecimal initialPrice,
    /** Maximum total units that can ever exist. Must be positive. */
    @NotNull @Positive BigDecimal totalSupply,
    /** Number of decimal places for fractional units (0 = whole units only, max 8). */
    @NotNull @Min(0) @Max(8) Integer decimalPlaces,
    /** Optional trading fee as a percentage (e.g. 0.005 = 0.5%). Null means no fee. */
    @PositiveOrZero @DecimalMax("0.50") BigDecimal tradingFeePercent,
    /** Optional bid-ask spread as a percentage (e.g. 0.01 = 1%). Null means no spread. */
    @PositiveOrZero @DecimalMax("0.50") BigDecimal spreadPercent,
    /** Start of the subscription period. BUY orders rejected before this date. */
    @NotNull LocalDate subscriptionStartDate,
    /** End of the subscription period. BUY orders rejected after this date; SELL always allowed. */
    @NotNull LocalDate subscriptionEndDate,
    /** Percentage of capital opened for subscription (e.g. 44.44). */
    @PositiveOrZero @DecimalMax("100.00") BigDecimal capitalOpenedPercent,
    /** Fineract client ID of the treasury that will hold this asset's reserves. */
    @NotNull Long treasuryClientId,

    // ── Exposure limits (all optional) ──

    /** Max % of totalSupply a single user can hold (e.g. 10 = 10%). Null = unlimited. */
    @Schema(description = "Max position as percentage of total supply.")
    @PositiveOrZero BigDecimal maxPositionPercent,
    /** Max units per single order. Null = unlimited. */
    @Schema(description = "Max units per single order.")
    @PositiveOrZero BigDecimal maxOrderSize,
    /** Max XAF volume per user per day. Null = unlimited. */
    @Schema(description = "Max XAF volume per user per day.")
    @PositiveOrZero BigDecimal dailyTradeLimitXaf,
    /** Lock-up period in days from first purchase. Null = no lock-up. */
    @Schema(description = "Lock-up period in days after first purchase.")
    @Min(0) Integer lockupDays,

    // ── Bond / fixed-income fields (required when category = BONDS) ──

    /** Bond issuer name (e.g. "Etat du Sénégal"). Required for BONDS. */
    @Schema(description = "Bond issuer name. Required when category is BONDS.")
    @Size(max = 255) String issuer,
    /** ISIN code (ISO 6166). Optional, max 12 characters. */
    @Schema(description = "International Securities Identification Number (ISO 6166).")
    @Size(max = 12) String isinCode,
    /** Bond maturity date. Required for BONDS, must be in the future. */
    @Schema(description = "Bond maturity date. Required when category is BONDS.")
    LocalDate maturityDate,
    /** Annual coupon rate as a percentage (e.g. 5.80 = 5.80%). Required for BONDS. */
    @Schema(description = "Annual coupon interest rate as percentage. Required when category is BONDS.")
    @PositiveOrZero BigDecimal interestRate,
    /** Coupon payment frequency: 1=Monthly, 3=Quarterly, 6=Semi-Annual, 12=Annual. Required for BONDS. */
    @Schema(description = "Coupon frequency in months: 1, 3, 6, or 12. Required when category is BONDS.")
    Integer couponFrequencyMonths,
    /** First coupon payment date. Required for BONDS, must be on or before maturityDate. */
    @Schema(description = "First coupon payment date. Required when category is BONDS.")
    LocalDate nextCouponDate,

    // ── Income distribution fields (optional, for non-bond income-bearing assets) ──

    /** Income distribution type: DIVIDEND, RENT, HARVEST_YIELD, PROFIT_SHARE. Null means no income. */
    @Schema(description = "Income type: DIVIDEND, RENT, HARVEST_YIELD, PROFIT_SHARE.")
    String incomeType,
    /** Income rate as a percentage per distribution period. */
    @PositiveOrZero BigDecimal incomeRate,
    /** Distribution frequency in months (1, 3, 6, or 12). */
    @Min(1) Integer distributionFrequencyMonths,
    /** First scheduled distribution date. */
    LocalDate nextDistributionDate
) {}
