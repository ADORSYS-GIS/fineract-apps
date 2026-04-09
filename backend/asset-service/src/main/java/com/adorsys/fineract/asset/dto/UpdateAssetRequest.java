package com.adorsys.fineract.asset.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Admin request to update an existing asset's metadata, sent to
 * {@code PATCH /api/admin/assets/{id}}.
 *
 * <p>This is a partial update — only non-null fields are applied. Null means "leave unchanged".
 * Fields that control the asset's core financial structure (e.g. {@code totalSupply},
 * {@code issuerPrice}, {@code faceValue}) can only be changed while the asset is in
 * {@code PENDING} status; attempting to set them on an {@code ACTIVE} or {@code SUSPENDED}
 * asset will result in a 400 error.</p>
 *
 * <p>Price fields ({@code lpAskPrice}, {@code lpBidPrice}) update the Redis price cache
 * immediately and implicitly switch the asset to {@code MANUAL} price mode. Use
 * {@link SetPriceRequest} for explicit mode control.</p>
 */
public record UpdateAssetRequest(
    /**
     * New display name for the asset. Max 200 characters.
     * Null to leave the current name unchanged.
     */
    @Size(max = 200) String name,

    /**
     * New long-form description. Max 1000 characters.
     * Null to leave the current description unchanged.
     */
    @Size(max = 1000) String description,

    /**
     * New URL for the asset's logo or promotional image. Max 500 characters.
     * Null to leave the current image URL unchanged.
     */
    @Size(max = 500) String imageUrl,

    /**
     * New asset classification.
     * Null to keep the current category.
     */
    AssetCategory category,

    /**
     * New trading fee as a percentage (e.g. {@code 0.005} = 0.5%).
     * Applied to the gross amount of every buy and sell trade.
     * Null to keep the current fee. Must be zero or positive.
     */
    @PositiveOrZero BigDecimal tradingFeePercent,

    /**
     * New LP ask price — the price investors pay when buying, in XAF.
     * Null to keep the current ask price. Must be positive when provided.
     * Setting this switches the asset to MANUAL price mode.
     */
    @Positive BigDecimal lpAskPrice,

    /**
     * New LP bid price — the price investors receive when selling, in XAF.
     * Null to keep the current bid price. Must be positive when provided.
     * Setting this switches the asset to MANUAL price mode.
     */
    @Positive BigDecimal lpBidPrice,

    // ── Exposure limits ──

    /**
     * New maximum position a single user may hold, expressed as a percentage of
     * {@code totalSupply} (e.g. {@code 10} = 10% of supply). Null to keep current.
     */
    @Schema(description = "Max position as percentage of total supply.")
    @PositiveOrZero BigDecimal maxPositionPercent,

    /**
     * New maximum number of units allowed in a single order. Null to keep current.
     * Zero means no per-order cap.
     */
    @Schema(description = "Max units per single order.")
    @PositiveOrZero BigDecimal maxOrderSize,

    /**
     * New maximum XAF trade volume allowed per user per calendar day. Null to keep current.
     * Zero means no daily cap.
     */
    @Schema(description = "Max XAF volume per user per day.")
    @PositiveOrZero BigDecimal dailyTradeLimitXaf,

    /**
     * New lock-up period in days measured from a user's first purchase of this asset.
     * During the lock-up window, the user cannot sell. Null to keep current.
     * Zero means no lock-up.
     */
    @Schema(description = "Lock-up period in days after first purchase.")
    Integer lockupDays,

    /**
     * New minimum number of units required per order. Null to keep current.
     * Zero means no minimum.
     */
    @Schema(description = "Minimum units per single order.")
    @PositiveOrZero BigDecimal minOrderSize,

    /**
     * New minimum XAF cash amount required per order. Null to keep current.
     * Zero means no minimum.
     */
    @Schema(description = "Minimum XAF amount per single order.")
    @PositiveOrZero BigDecimal minOrderCashAmount,

    // ── Income distribution ──

    /**
     * New income type for non-bond income-bearing assets.
     * Allowed values: {@code DIVIDEND}, {@code RENT}, {@code HARVEST_YIELD}, {@code PROFIT_SHARE}.
     * Null to keep current.
     */
    @Schema(description = "Income type: DIVIDEND, RENT, HARVEST_YIELD, PROFIT_SHARE.")
    String incomeType,

    /**
     * New annual income rate as a percentage (e.g. {@code 5.0} = 5% per year).
     * Used to estimate per-period payouts. Null to keep current.
     */
    @Schema(description = "Annual income rate as percentage.")
    @PositiveOrZero BigDecimal incomeRate,

    /**
     * New distribution frequency in months.
     * Allowed values: {@code 1} (monthly), {@code 3} (quarterly), {@code 6} (semi-annual), {@code 12} (annual).
     * Null to keep current.
     */
    @Schema(description = "Distribution frequency in months: 1, 3, 6, or 12.")
    Integer distributionFrequencyMonths,

    /**
     * New next income distribution date.
     * After each distribution, the system advances this date by {@code distributionFrequencyMonths}.
     * Null to keep current.
     */
    @Schema(description = "Next income distribution date.")
    LocalDate nextDistributionDate,

    // ── Bond-specific updatable fields ──

    /**
     * New annual coupon interest rate as a percentage (e.g. {@code 5.80} = 5.80%).
     * Applies only to COUPON bonds. Null to keep current.
     */
    @Schema(description = "New annual coupon interest rate as percentage.")
    @PositiveOrZero BigDecimal interestRate,

    /**
     * New bond maturity date. Must be in the future.
     * Null to keep current.
     */
    @Schema(description = "New bond maturity date.")
    LocalDate maturityDate,

    /**
     * New next scheduled coupon payment date.
     * After each coupon payment, the system advances this date by {@code couponFrequencyMonths}.
     * Null to keep current.
     */
    @Schema(description = "Next scheduled coupon payment date.")
    LocalDate nextCouponDate,

    // ── Tax configuration (Cameroon/CEMAC) ──

    /**
     * Whether to enable or disable registration duty on trades of this asset.
     * Null to keep current setting.
     */
    @Schema(description = "Enable registration duty on trades.")
    Boolean registrationDutyEnabled,

    /**
     * Registration duty rate override as a decimal (e.g. {@code 0.02} = 2%).
     * Null to keep current rate (defaults to the global setting of 2%).
     */
    @Schema(description = "Registration duty rate (e.g. 0.02 = 2%).")
    @PositiveOrZero BigDecimal registrationDutyRate,

    /**
     * Whether to enable or disable IRCM withholding on income and coupon distributions.
     * Null to keep current setting.
     */
    @Schema(description = "Enable IRCM withholding on income distributions.")
    Boolean ircmEnabled,

    /**
     * IRCM withholding rate override as a decimal.
     * Null to use auto-determination (16.5% standard, 11% for BVMAC-listed, 0% for government bonds).
     */
    @Schema(description = "IRCM rate override.")
    @PositiveOrZero BigDecimal ircmRateOverride,

    /**
     * Whether this asset is exempt from IRCM withholding (e.g. government bonds).
     * Null to keep current setting.
     */
    @Schema(description = "Exempt from IRCM.")
    Boolean ircmExempt,

    /**
     * Whether to enable or disable capital gains tax on profitable sales of this asset.
     * Null to keep current setting.
     */
    @Schema(description = "Enable capital gains tax on sales.")
    Boolean capitalGainsTaxEnabled,

    /**
     * Capital gains tax rate override as a decimal (e.g. {@code 0.165} = 16.5%).
     * Null to keep current rate (defaults to the global setting of 16.5%).
     */
    @Schema(description = "Capital gains tax rate.")
    @PositiveOrZero BigDecimal capitalGainsRate,

    /**
     * Whether this asset is listed on the BVMAC (Bourse des Valeurs Mobilières de l'Afrique Centrale).
     * BVMAC listing triggers the reduced 11% IRCM rate rather than the standard 16.5%.
     * Null to keep current setting.
     */
    @Schema(description = "Listed on BVMAC.")
    Boolean isBvmacListed,

    /**
     * Whether this is a government bond.
     * Government bonds qualify for IRCM exemption under CEMAC regulations.
     * Null to keep current setting.
     */
    @Schema(description = "Government bond.")
    Boolean isGovernmentBond,

    /**
     * Whether to enable or disable TVA (VAT) on trades of this asset.
     * Null to keep current setting.
     */
    @Schema(description = "Enable TVA (VAT) on trades.")
    Boolean tvaEnabled,

    /**
     * TVA rate override as a decimal (e.g. {@code 0.1925} = 19.25%).
     * Null to keep current rate (defaults to the global setting of 19.25%).
     */
    @Schema(description = "TVA rate (e.g. 0.1925 = 19.25%).")
    @PositiveOrZero BigDecimal tvaRate,

    // ── PENDING-only fields (rejected if asset is not PENDING) ──

    /**
     * New LP acquisition cost per unit (the price the LP paid to source the asset), in XAF.
     * For DISCOUNT bonds, this is the discounted purchase price from the BEAC auction.
     * Only accepted when the asset is in {@code PENDING} status. Null to keep current.
     */
    @Schema(description = "Issuer price (LP acquisition cost). Only updatable when PENDING.")
    @Positive BigDecimal issuerPrice,

    /**
     * New face/par value per unit — the amount repaid to holders at maturity, in XAF.
     * Required for DISCOUNT bonds where {@code faceValue > issuerPrice} represents the investor's gain.
     * Only accepted when the asset is in {@code PENDING} status. Null to keep current.
     */
    @Schema(description = "Face/par value. Only updatable when PENDING.")
    @Positive BigDecimal faceValue,

    /**
     * New total supply of this asset (maximum units that can exist).
     * Changing this also adjusts the LP's Fineract savings account balance accordingly.
     * Only accepted when the asset is in {@code PENDING} status. Null to keep current.
     */
    @Schema(description = "Total supply. Only updatable when PENDING.")
    @Positive BigDecimal totalSupply,

    /**
     * New issuer name (e.g. "Etat du Cameroun"). Max 255 characters.
     * Only accepted when the asset is in {@code PENDING} status. Null to keep current.
     */
    @Schema(description = "Issuer name. Only updatable when PENDING.")
    @Size(max = 255) String issuerName,

    /**
     * New ISIN code (ISO 6166, e.g. {@code "CM0000000123"}). Max 12 characters.
     * Only accepted when the asset is in {@code PENDING} status. Null to keep current.
     */
    @Schema(description = "ISIN code (ISO 6166). Only updatable when PENDING.")
    @Size(max = 12) String isinCode,

    /**
     * New coupon payment frequency in months for COUPON bonds.
     * Allowed values: {@code 1}, {@code 3}, {@code 6}, {@code 12}.
     * Only accepted when the asset is in {@code PENDING} status. Null to keep current.
     */
    @Schema(description = "Coupon frequency in months (1, 3, 6, or 12). Only updatable when PENDING.")
    Integer couponFrequencyMonths,

    /**
     * New bond type: {@code COUPON} (OTA / T-Bond with periodic interest) or
     * {@code DISCOUNT} (BTA / T-Bill that trades below face value).
     * Only accepted when the asset is in {@code PENDING} status. Null to keep current.
     */
    @Schema(description = "Bond type. Only updatable when PENDING.")
    BondType bondType,

    /**
     * New day count convention for accrued interest calculations.
     * Common values: {@code ACT_360}, {@code ACT_365}, {@code THIRTY_360}.
     * Only accepted when the asset is in {@code PENDING} status. Null to keep current.
     */
    @Schema(description = "Day count convention. Only updatable when PENDING.")
    DayCountConvention dayCountConvention,

    /**
     * New issuer country name (e.g. "CAMEROUN", "CONGO", "TCHAD"). Max 50 characters.
     * Only accepted when the asset is in {@code PENDING} status. Null to keep current.
     */
    @Schema(description = "Issuer country. Only updatable when PENDING.")
    @Size(max = 50) String issuerCountry
) {}
