package com.adorsys.fineract.asset.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

/**
 * Public asset detail response — same as AssetDetailResponse but omits internal
 * Fineract infrastructure IDs (treasury accounts, product ID) that should not
 * be exposed to end users. Includes bond-specific fields when category is BONDS.
 */
public record AssetPublicDetailResponse(
    String id,
    String name,
    String symbol,
    String currencyCode,
    String description,
    String imageUrl,
    AssetCategory category,
    AssetStatus status,
    PriceMode priceMode,
    BigDecimal currentPrice,
    BigDecimal change24hPercent,
    BigDecimal dayOpen,
    BigDecimal dayHigh,
    BigDecimal dayLow,
    BigDecimal dayClose,
    BigDecimal totalSupply,
    BigDecimal circulatingSupply,
    BigDecimal availableSupply,
    BigDecimal tradingFeePercent,
    BigDecimal spreadPercent,
    Integer decimalPlaces,
    LocalDate subscriptionStartDate,
    LocalDate subscriptionEndDate,
    BigDecimal capitalOpenedPercent,
    Instant createdAt,
    Instant updatedAt,

    // ── Bond / fixed-income fields (null for non-bond assets) ──

    @Schema(description = "Bond issuer name. Null for non-bond assets.")
    String issuer,
    @Schema(description = "ISIN code (ISO 6166). Null for non-bond assets.")
    String isinCode,
    @Schema(description = "Bond maturity date. Null for non-bond assets.")
    LocalDate maturityDate,
    @Schema(description = "Annual coupon interest rate as percentage.")
    BigDecimal interestRate,
    @Schema(description = "Coupon frequency in months: 1, 3, 6, or 12.")
    Integer couponFrequencyMonths,
    @Schema(description = "Next scheduled coupon payment date.")
    LocalDate nextCouponDate,
    @Schema(description = "Days remaining until maturity date. Computed at query time.")
    Long residualDays,
    @Schema(description = "True if subscriptionEndDate has passed and new BUY orders are blocked.")
    Boolean subscriptionClosed
) {}
