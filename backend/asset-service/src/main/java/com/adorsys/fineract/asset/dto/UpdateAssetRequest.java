package com.adorsys.fineract.asset.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Admin request to update an asset's metadata. Only non-null fields are applied (partial update).
 */
public record UpdateAssetRequest(
    /** New display name. Null to keep current. */
    @Size(max = 200) String name,
    /** New description. Null to keep current. */
    @Size(max = 1000) String description,
    /** New image URL. Null to keep current. */
    @Size(max = 500) String imageUrl,
    /** New category. Null to keep current. */
    AssetCategory category,
    /** New trading fee percentage (e.g. 0.005 = 0.5%). Null to keep current. */
    @PositiveOrZero BigDecimal tradingFeePercent,
    /** New LP ask price (what investors pay to buy). Null to keep current. */
    @Positive BigDecimal lpAskPrice,
    /** New LP bid price (what investors receive when selling). Null to keep current. */
    @Positive BigDecimal lpBidPrice,

    // ── Exposure limits ──

    /** New max position percent. Null to keep current. */
    @Schema(description = "Max position as percentage of total supply.")
    @PositiveOrZero BigDecimal maxPositionPercent,
    /** New max order size. Null to keep current. */
    @Schema(description = "Max units per single order.")
    @PositiveOrZero BigDecimal maxOrderSize,
    /** New daily trade limit in XAF. Null to keep current. */
    @Schema(description = "Max XAF volume per user per day.")
    @PositiveOrZero BigDecimal dailyTradeLimitXaf,
    /** New lock-up period in days. Null to keep current. */
    @Schema(description = "Lock-up period in days after first purchase.")
    Integer lockupDays,
    /** New min order size in units. Null to keep current. */
    @Schema(description = "Minimum units per single order.")
    @PositiveOrZero BigDecimal minOrderSize,
    /** New min order cash amount in XAF. Null to keep current. */
    @Schema(description = "Minimum XAF amount per single order.")
    @PositiveOrZero BigDecimal minOrderCashAmount,

    // ── Income distribution ──

    /** New income type. Null to keep current. */
    @Schema(description = "Income type: DIVIDEND, RENT, HARVEST_YIELD, PROFIT_SHARE.")
    String incomeType,
    /** New annual income rate as percentage. Null to keep current. */
    @Schema(description = "Annual income rate as percentage.")
    @PositiveOrZero BigDecimal incomeRate,
    /** New distribution frequency in months. Null to keep current. */
    @Schema(description = "Distribution frequency in months: 1, 3, 6, or 12.")
    Integer distributionFrequencyMonths,
    /** New next distribution date. Null to keep current. */
    @Schema(description = "Next income distribution date.")
    LocalDate nextDistributionDate,

    // ── Bond-specific updatable fields ──

    /** New annual coupon rate as percentage. Null to keep current. */
    @Schema(description = "New annual coupon interest rate as percentage.")
    @PositiveOrZero BigDecimal interestRate,
    /** New maturity date. Null to keep current. */
    @Schema(description = "New bond maturity date.")
    LocalDate maturityDate,
    /** New next coupon date. Null to keep current. */
    @Schema(description = "Next scheduled coupon payment date.")
    LocalDate nextCouponDate,

    // ── Tax configuration (Cameroon/CEMAC) ──

    /** Enable/disable registration duty. Null to keep current. */
    @Schema(description = "Enable registration duty on trades.")
    Boolean registrationDutyEnabled,
    /** Registration duty rate override. Null to keep current. */
    @Schema(description = "Registration duty rate (e.g. 0.02 = 2%).")
    @PositiveOrZero BigDecimal registrationDutyRate,
    /** Enable/disable IRCM. Null to keep current. */
    @Schema(description = "Enable IRCM withholding on income distributions.")
    Boolean ircmEnabled,
    /** IRCM rate override. Null to keep current. */
    @Schema(description = "IRCM rate override.")
    @PositiveOrZero BigDecimal ircmRateOverride,
    /** IRCM exemption flag. Null to keep current. */
    @Schema(description = "Exempt from IRCM.")
    Boolean ircmExempt,
    /** Enable/disable capital gains tax. Null to keep current. */
    @Schema(description = "Enable capital gains tax on sales.")
    Boolean capitalGainsTaxEnabled,
    /** Capital gains rate override. Null to keep current. */
    @Schema(description = "Capital gains tax rate.")
    @PositiveOrZero BigDecimal capitalGainsRate,
    /** BVMAC listing flag. Null to keep current. */
    @Schema(description = "Listed on BVMAC.")
    Boolean isBvmacListed,
    /** Government bond flag. Null to keep current. */
    @Schema(description = "Government bond.")
    Boolean isGovernmentBond,
    /** Enable/disable TVA (VAT). Null to keep current. */
    @Schema(description = "Enable TVA (VAT) on trades.")
    Boolean tvaEnabled,
    /** TVA rate override. Null to keep current. */
    @Schema(description = "TVA rate (e.g. 0.1925 = 19.25%).")
    @PositiveOrZero BigDecimal tvaRate,

    // ── PENDING-only fields (rejected if asset is not PENDING) ──

    /** New issuer/face price. Only updatable when asset is PENDING. */
    @Schema(description = "Issuer price (face value). Only updatable when PENDING.")
    @Positive BigDecimal issuerPrice,
    /** New total supply. Only updatable when asset is PENDING. Adjusts LP account balance. */
    @Schema(description = "Total supply. Only updatable when PENDING.")
    @Positive BigDecimal totalSupply,
    /** New issuer name. Only updatable when asset is PENDING. */
    @Schema(description = "Issuer name. Only updatable when PENDING.")
    @Size(max = 255) String issuerName,
    /** New ISIN code. Only updatable when asset is PENDING. */
    @Schema(description = "ISIN code (ISO 6166). Only updatable when PENDING.")
    @Size(max = 12) String isinCode,
    /** New coupon frequency. Only updatable when asset is PENDING. */
    @Schema(description = "Coupon frequency in months (1, 3, 6, or 12). Only updatable when PENDING.")
    Integer couponFrequencyMonths
) {}
