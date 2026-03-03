package com.adorsys.fineract.asset.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Asset summary for the marketplace listing page. Includes bond-specific fields
 * when the asset category is BONDS so that users can see yield, issuer, and expiry at a glance.
 */
public record AssetResponse(
    /** Internal asset identifier. */
    String id,
    /** Human-readable asset name. */
    String name,
    /** Ticker symbol, e.g. "BRVM". */
    String symbol,
    /** URL to the asset's logo or image. */
    String imageUrl,
    /** Classification: REAL_ESTATE, COMMODITIES, AGRICULTURE, STOCKS, CRYPTO, or BONDS. */
    AssetCategory category,
    /** Lifecycle status: PENDING, ACTIVE, HALTED, DELISTED, or MATURED. */
    AssetStatus status,
    /** LP ask price: what buyers pay. */
    BigDecimal askPrice,
    /** 24-hour price change as a percentage (e.g. 2.5 = +2.5%). */
    BigDecimal change24hPercent,
    /** Units available for purchase: totalSupply - circulatingSupply. */
    BigDecimal availableSupply,
    /** Maximum total units that can ever exist. */
    BigDecimal totalSupply,
    /** Start of the subscription period. */
    LocalDate subscriptionStartDate,
    /** End of the subscription period. */
    LocalDate subscriptionEndDate,
    /** Percentage of capital opened for subscription. */
    BigDecimal capitalOpenedPercent,

    // ── Issuer & LP info ──

    @Schema(description = "Asset issuer name. Required for bonds, optional for others.", nullable = true)
    String issuerName,
    @Schema(description = "Liquidity partner (reseller) name.", nullable = true)
    String lpName,
    @Schema(description = "Coupon amount per unit per period (bonds only). Based on issuer price.", nullable = true)
    BigDecimal couponAmountPerUnit,

    // ── Bond summary fields (null for non-bond assets) ──

    @Schema(description = "ISIN code (ISO 6166). Null for non-bond assets.")
    String isinCode,
    @Schema(description = "Bond maturity date. Null for non-bond assets.")
    LocalDate maturityDate,
    @Schema(description = "Annual coupon interest rate as percentage.")
    BigDecimal interestRate,
    @Schema(description = "Days remaining until maturity date. Computed at query time.")
    Long residualDays,
    @Schema(description = "True if subscriptionEndDate has passed and new BUY orders are blocked.")
    Boolean subscriptionClosed
) {}
