package com.adorsys.fineract.asset.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Asset summary card returned by the marketplace listing endpoint
 * ({@code GET /assets}). Contains enough information to render a browseable
 * asset card — current price, supply, and key bond identifiers — without exposing
 * internal Fineract infrastructure details.
 *
 * <p>Bond-specific fields ({@code bondType}, {@code interestRate}, {@code maturityDate}, etc.)
 * are null for non-bond assets, allowing the frontend to conditionally render bond-specific
 * UI elements (e.g. yield badge, maturity countdown) based on the presence of these fields.
 * All monetary amounts are in XAF.</p>
 */
public record AssetResponse(
    /** Internal asset identifier (UUID). */
    String id,
    /** Human-readable asset name (e.g. "Bon du Trésor Assimilable 2024"). */
    String name,
    /** Ticker symbol displayed on the asset card (e.g. "BTA2024"). */
    String symbol,
    /** URL to the asset's logo or promotional image. May be null if not configured. */
    String imageUrl,
    /** Classification bucket used for category-filter tabs (e.g. BONDS, REAL_ESTATE). */
    AssetCategory category,
    /**
     * Current lifecycle status. Cards for HALTED or DELISTING assets may render
     * a warning badge; PENDING assets should not appear in the public marketplace.
     */
    AssetStatus status,
    /**
     * The price at which the LP sells units to buyers, in XAF. Displayed as the
     * primary price on the asset card. Null if prices have not been configured yet.
     */
    BigDecimal askPrice,
    /**
     * Percentage price change over the past 24 hours relative to the opening price.
     * Positive values indicate appreciation; negative values indicate decline.
     * Expressed as a percentage (e.g. 2.5 means +2.5%).
     */
    BigDecimal change24hPercent,
    /**
     * Units the LP still has available to sell: {@code totalSupply - circulatingSupply}.
     * When zero, BUY orders cannot be filled and the asset card may show a "sold out" indicator.
     */
    BigDecimal availableSupply,
    /** Maximum number of units that can ever exist for this asset. Set at creation and immutable. */
    BigDecimal totalSupply,

    // ── Issuer & LP info ──

    /**
     * Name of the entity that issued or backs this asset (e.g. "Etat du Sénégal").
     * Shown as a subtitle on bond cards. Null for non-bond assets without an issuer.
     */
    @Schema(description = "Asset issuer name. Required for bonds, optional for others.", nullable = true)
    String issuerName,
    /**
     * Display name of the liquidity partner that acts as market counterparty.
     * Shown on the card so investors can identify who they are trading with.
     * Null if the LP has no registered display name.
     */
    @Schema(description = "Liquidity partner (reseller) name.", nullable = true)
    String lpName,
    /**
     * Coupon income per unit per payment period in XAF for COUPON bonds. Computed as:
     * {@code faceValue × (interestRate / 100) × (couponFrequencyMonths / 12)}.
     * Null for DISCOUNT bonds and non-bond assets.
     */
    @Schema(description = "Coupon amount per unit per period (bonds only). Based on issuer price.", nullable = true)
    BigDecimal couponAmountPerUnit,

    // ── Bond summary fields (null for non-bond assets) ──

    /**
     * Distinguishes between COUPON bonds (OTA / T-Bonds with periodic interest) and
     * DISCOUNT bonds (BTA / T-Bills redeemed at face value). Null for non-bond assets.
     */
    @Schema(description = "Bond type: COUPON (OTA) or DISCOUNT (BTA). Null for non-bond assets.", nullable = true)
    BondType bondType,
    /**
     * International Securities Identification Number (ISO 6166) for this bond.
     * Null for non-bond assets or bonds not yet assigned an ISIN.
     */
    @Schema(description = "ISIN code (ISO 6166). Null for non-bond assets.")
    String isinCode,
    /**
     * Date on which the bond principal is repaid. Shown as a countdown on bond cards.
     * Null for non-bond assets.
     */
    @Schema(description = "Bond maturity date. Null for non-bond assets.")
    LocalDate maturityDate,
    /**
     * Date on which the bond was originally issued. Used for BTA price accretion
     * (elapsed days since issue) and accrued interest calculations.
     * Null for non-bond assets.
     */
    @Schema(description = "Bond issue date. Used for BTA accretion and accrued interest. Null for non-bond assets.")
    LocalDate issueDate,
    /**
     * Annual nominal coupon rate as a percentage (e.g. 5.80 = 5.80% per year).
     * Shown on COUPON bond cards. Null for DISCOUNT bonds and non-bond assets.
     */
    @Schema(description = "Annual coupon interest rate as percentage.")
    BigDecimal interestRate,
    /**
     * Effective annual yield based on the current ask price, recomputed at query time.
     * More meaningful to investors than the nominal rate when prices differ from face value.
     * Null for non-bond assets.
     */
    @Schema(description = "Current yield: effective annual return based on ask price. Bonds only.", nullable = true)
    BigDecimal currentYield,
    /**
     * Calendar days remaining from today to {@code maturityDate}. Clamped to zero once matured.
     * Computed at query time. Null for non-bond assets.
     */
    @Schema(description = "Days remaining until maturity date. Computed at query time.")
    Long residualDays
) {}
