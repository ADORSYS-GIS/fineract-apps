package com.adorsys.fineract.asset.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Admin request to create a new tradeable asset, sent to {@code POST /api/admin/assets}.
 *
 * <p>Creating an asset triggers several provisioning steps in Fineract: a savings product
 * is created for the asset, the LP's savings account is credited with {@code totalSupply}
 * units at {@code issuerPrice}, and initial GL journal entries are posted. The asset starts
 * in {@code PENDING} status until explicitly activated.</p>
 *
 * <p>Fields are grouped by concern:</p>
 * <ul>
 *   <li>Core identity: {@code name}, {@code symbol}, {@code currencyCode}, {@code description},
 *       {@code imageUrl}, {@code category}</li>
 *   <li>Pricing: {@code issuerPrice}, {@code faceValue}, {@code totalSupply}, {@code decimalPlaces},
 *       {@code tradingFeePercent}, {@code spreadPercent}, {@code lpAskPrice}, {@code lpBidPrice}</li>
 *   <li>Exposure limits: {@code maxPositionPercent}, {@code maxOrderSize}, {@code dailyTradeLimitXaf},
 *       {@code lockupDays}, {@code minOrderSize}, {@code minOrderCashAmount}</li>
 *   <li>Bond fields (required when {@code category = BONDS}): {@code bondType}, {@code dayCountConvention},
 *       {@code issuerCountry}, {@code issuerName}, {@code isinCode}, {@code maturityDate},
 *       {@code interestRate}, {@code couponFrequencyMonths}, {@code nextCouponDate}</li>
 *   <li>Income distribution (for non-bond income assets): {@code incomeType}, {@code incomeRate},
 *       {@code distributionFrequencyMonths}, {@code nextDistributionDate}</li>
 *   <li>Tax configuration (Cameroon/CEMAC): all {@code *Enabled}, {@code *Rate}, and flag fields</li>
 * </ul>
 */
public record CreateAssetRequest(
    /**
     * Human-readable display name for the asset shown in the UI and notifications.
     * Must not be blank.
     */
    @NotBlank String name,

    /**
     * Short ticker symbol uniquely identifying the asset (e.g. {@code "BRVM"}).
     * Max 10 characters. Must be unique across all assets. Used in order books and reports.
     */
    @NotBlank @Size(max = 10) String symbol,

    /**
     * ISO-style currency code used for the Fineract savings product backing this asset
     * (e.g. {@code "BRV"}). Max 10 characters. Must be unique. Determines the savings
     * product currency configured in Fineract.
     */
    @NotBlank @Size(max = 10) String currencyCode,

    /**
     * Optional long-form description of the asset, its investment thesis, or issuer details.
     * Max 1000 characters. Displayed on the asset detail page.
     */
    @Size(max = 1000) String description,

    /**
     * Optional URL pointing to the asset's logo or promotional image.
     * Max 500 characters.
     */
    @Size(max = 500) String imageUrl,

    /**
     * Classification of this asset.
     * One of: {@code REAL_ESTATE}, {@code COMMODITIES}, {@code AGRICULTURE},
     * {@code STOCKS}, {@code CRYPTO}, {@code BONDS}.
     * Determines which bond fields are required and which income model applies.
     */
    @NotNull AssetCategory category,

    /**
     * The LP's acquisition cost per unit, in XAF.
     * For DISCOUNT bonds (BTA), this is the discounted purchase price from the BEAC auction,
     * which is lower than {@code faceValue}. For COUPON bonds and other assets, this is
     * typically equal to the face/par value.
     * Used as the LP's cost basis for PnL and margin calculations.
     */
    @NotNull @Positive BigDecimal issuerPrice,

    /**
     * Par/redemption value per unit, in XAF.
     * Required for DISCOUNT bonds, where {@code faceValue > issuerPrice} — the difference
     * represents the holder's gain at maturity. For COUPON bonds, defaults to {@code issuerPrice}
     * when not provided. Null for non-bond assets.
     */
    @Schema(description = "Face/par value per unit. Required for DISCOUNT bonds.")
    @Positive BigDecimal faceValue,

    /**
     * Maximum total units that can ever exist for this asset.
     * The LP's Fineract savings account is pre-credited with this quantity at creation.
     * Must be positive.
     */
    @NotNull @Positive BigDecimal totalSupply,

    /**
     * Number of decimal places supported for fractional unit trading.
     * {@code 0} means whole units only; {@code 8} allows the finest granularity.
     * Determines how unit amounts are rounded in order calculations.
     */
    @NotNull @Min(0) @Max(8) Integer decimalPlaces,

    /**
     * Platform trading fee as a percentage (e.g. {@code 0.005} = 0.5%).
     * Applied to the gross trade value on every BUY and SELL order.
     * Max 50%. Null means no fee is charged.
     */
    @PositiveOrZero @DecimalMax("0.50") BigDecimal tradingFeePercent,

    /**
     * Spread percentage used to auto-derive ask and bid prices from {@code issuerPrice}
     * when {@code lpAskPrice} and {@code lpBidPrice} are not explicitly provided.
     * For example, {@code 0.003} = 0.3% means:
     * {@code askPrice = issuerPrice * (1 + spread)}, {@code bidPrice = issuerPrice * (1 - spread)}.
     * Defaults to {@code 0.003} when null. Ignored when explicit ask/bid prices are given.
     * Max 50%.
     */
    @Schema(description = "Spread % to auto-derive ask/bid from issuerPrice (e.g. 0.003 = 0.3%). Default: 0.003.")
    @PositiveOrZero @DecimalMax("0.50") BigDecimal spreadPercent,

    /**
     * LP ask price — the price investors pay when buying units, in XAF.
     * If null, auto-derived as {@code issuerPrice * (1 + spreadPercent)}.
     * Providing this explicitly sets the asset to MANUAL price mode.
     */
    @Positive BigDecimal lpAskPrice,

    /**
     * LP bid price — the price investors receive when selling units, in XAF.
     * If null, auto-derived as {@code issuerPrice * (1 - spreadPercent)}.
     * Providing this explicitly sets the asset to MANUAL price mode.
     */
    @Positive BigDecimal lpBidPrice,

    /**
     * Fineract client ID of the liquidity partner (LP/reseller) who holds this asset's
     * inventory. The LP's savings account is credited with {@code totalSupply} units at creation.
     * Required.
     */
    @NotNull Long lpClientId,

    // ── Exposure limits (all optional) ──

    /**
     * Maximum percentage of {@code totalSupply} that a single user may hold
     * (e.g. {@code 10} = 10% of supply). Orders that would push a user over this
     * threshold are rejected. Null means no per-user cap.
     */
    @Schema(description = "Max position as percentage of total supply.")
    @PositiveOrZero BigDecimal maxPositionPercent,

    /**
     * Maximum number of units allowed in a single order.
     * Orders exceeding this are rejected. Null means no per-order unit cap.
     */
    @Schema(description = "Max units per single order.")
    @PositiveOrZero BigDecimal maxOrderSize,

    /**
     * Maximum XAF trade volume allowed per user per calendar day.
     * The daily volume resets at midnight in the server's configured timezone.
     * Null means no daily cap.
     */
    @Schema(description = "Max XAF volume per user per day.")
    @PositiveOrZero BigDecimal dailyTradeLimitXaf,

    /**
     * Lock-up period in days measured from the user's first purchase of this asset.
     * During the lock-up window, SELL orders are rejected. Null or zero means no lock-up.
     */
    @Schema(description = "Lock-up period in days after first purchase.")
    @Min(0) Integer lockupDays,

    /**
     * Minimum number of units required per order.
     * Orders below this threshold are rejected. Null or zero means no minimum.
     */
    @Schema(description = "Minimum units per single order.")
    @PositiveOrZero BigDecimal minOrderSize,

    /**
     * Minimum XAF cash amount required per order.
     * Orders below this cash value are rejected. Null or zero means no minimum.
     */
    @Schema(description = "Minimum XAF amount per single order.")
    @PositiveOrZero BigDecimal minOrderCashAmount,

    // ── Bond / fixed-income fields (required when category = BONDS) ──

    /**
     * Bond type: {@code COUPON} for OTA (Obligations du Trésor Assimilables / T-Bonds with
     * periodic interest), or {@code DISCOUNT} for BTA (Bons du Trésor Assimilables / T-Bills
     * that trade at a discount to face value). Required when {@code category = BONDS}.
     */
    @Schema(description = "Bond type: COUPON (OTA) or DISCOUNT (BTA). Required when category is BONDS.")
    BondType bondType,

    /**
     * Day count convention used for accrued interest calculations between coupon dates.
     * Defaults to {@code ACT_365} for COUPON bonds and {@code ACT_360} for DISCOUNT bonds
     * when not specified. Common values: {@code ACT_360}, {@code ACT_365}, {@code THIRTY_360}.
     */
    @Schema(description = "Day count convention for interest calculations.")
    DayCountConvention dayCountConvention,

    /**
     * CEMAC member state that issued this bond (e.g. {@code "CAMEROUN"}, {@code "CONGO"},
     * {@code "TCHAD"}). Max 50 characters. Optional.
     */
    @Schema(description = "Issuer country name (CEMAC member state).")
    @Size(max = 50) String issuerCountry,

    /**
     * Full name of the asset issuer (e.g. {@code "Etat du Cameroun"}, {@code "BEAC"}).
     * Max 255 characters. Required for BONDS; optional for other categories.
     */
    @Schema(description = "Asset issuer name. Required when category is BONDS.")
    @Size(max = 255) String issuerName,

    /**
     * International Securities Identification Number (ISO 6166).
     * Max 12 characters. Optional, but recommended for BONDS traded on BVMAC.
     */
    @Schema(description = "International Securities Identification Number (ISO 6166).")
    @Size(max = 12) String isinCode,

    /**
     * Bond maturity date — the date on which principal is repaid to holders.
     * Must be in the future. Required for BONDS.
     */
    @Schema(description = "Bond maturity date. Required when category is BONDS.")
    LocalDate maturityDate,

    /**
     * Annual coupon interest rate as a percentage (e.g. {@code 5.80} = 5.80% per year).
     * Required for COUPON bonds; null (and ignored) for DISCOUNT bonds.
     */
    @Schema(description = "Annual coupon interest rate as percentage. Required for COUPON bonds.")
    @PositiveOrZero BigDecimal interestRate,

    /**
     * Coupon payment frequency in months.
     * Allowed values: {@code 1} (monthly), {@code 3} (quarterly), {@code 6} (semi-annual),
     * {@code 12} (annual). Required for COUPON bonds; null for DISCOUNT bonds.
     */
    @Schema(description = "Coupon frequency in months: 1, 3, 6, or 12. Required for COUPON bonds.")
    Integer couponFrequencyMonths,

    /**
     * First scheduled coupon payment date.
     * Must be on or before {@code maturityDate}. Required for COUPON bonds.
     * Subsequent coupon dates are calculated by adding {@code couponFrequencyMonths}.
     */
    @Schema(description = "First coupon payment date. Required for COUPON bonds.")
    LocalDate nextCouponDate,

    // ── Income distribution fields (optional, for non-bond income-bearing assets) ──

    /**
     * Income distribution type for non-bond assets.
     * Allowed values: {@code DIVIDEND}, {@code RENT}, {@code HARVEST_YIELD}, {@code PROFIT_SHARE}.
     * Null means this asset does not distribute income.
     */
    @Schema(description = "Income type: DIVIDEND, RENT, HARVEST_YIELD, PROFIT_SHARE.")
    String incomeType,

    /**
     * Expected annual income rate as a percentage per distribution period
     * (e.g. {@code 5.0} = 5% annually). Used to estimate per-period payouts.
     */
    @PositiveOrZero BigDecimal incomeRate,

    /**
     * Income distribution frequency in months.
     * Allowed values: {@code 1}, {@code 3}, {@code 6}, {@code 12}.
     * Must be at least 1 when {@code incomeType} is provided.
     */
    @Min(1) Integer distributionFrequencyMonths,

    /**
     * First scheduled income distribution date.
     * Subsequent dates are calculated by adding {@code distributionFrequencyMonths}.
     */
    LocalDate nextDistributionDate,

    // ── Tax configuration (Cameroon/CEMAC) ──

    /**
     * Whether registration duty applies to trades of this asset.
     * Registration duty is charged on the gross trade value at the rate defined by
     * {@code registrationDutyRate} (default 2%). Default: {@code false}.
     */
    @Schema(description = "Enable registration duty (2%) on trades of this asset. Default: false.")
    Boolean registrationDutyEnabled,

    /**
     * Registration duty rate override as a decimal (e.g. {@code 0.02} = 2%).
     * Null uses the global default rate of 2%. Only applies when {@code registrationDutyEnabled} is true.
     */
    @Schema(description = "Registration duty rate override (e.g. 0.02 = 2%).")
    @PositiveOrZero BigDecimal registrationDutyRate,

    /**
     * Whether IRCM (Impôt sur le Revenu des Capitaux Mobiliers) withholding applies
     * to income and coupon distributions from this asset. Default: {@code false}.
     */
    @Schema(description = "Enable IRCM withholding on income distributions. Default: false.")
    Boolean ircmEnabled,

    /**
     * IRCM withholding rate override as a decimal.
     * Null triggers auto-determination: 16.5% standard, 11% for BVMAC-listed assets,
     * 0% for government bonds. Only applies when {@code ircmEnabled} is true.
     */
    @Schema(description = "IRCM rate override (e.g. 0.165 = 16.5%).")
    @PositiveOrZero BigDecimal ircmRateOverride,

    /**
     * Whether this asset is exempt from IRCM withholding.
     * Government bonds are typically IRCM-exempt under CEMAC regulations.
     * When true, overrides {@code ircmEnabled} and no withholding is applied.
     */
    @Schema(description = "Exempt from IRCM (e.g. government bonds).")
    Boolean ircmExempt,

    /**
     * Whether capital gains tax applies to profitable sales of this asset.
     * When enabled, realized gains are taxed at {@code capitalGainsRate} on SELL orders.
     * Holders whose annual gains are below 500,000 XAF receive an exemption. Default: {@code false}.
     */
    @Schema(description = "Enable capital gains tax on profitable sales. Default: false.")
    Boolean capitalGainsTaxEnabled,

    /**
     * Capital gains tax rate override as a decimal (e.g. {@code 0.165} = 16.5%).
     * Null uses the global default rate of 16.5%. Only applies when {@code capitalGainsTaxEnabled} is true.
     */
    @Schema(description = "Capital gains tax rate override (e.g. 0.165 = 16.5%).")
    @PositiveOrZero BigDecimal capitalGainsRate,

    /**
     * Whether this asset is listed on the BVMAC (Bourse des Valeurs Mobilières de l'Afrique Centrale).
     * BVMAC listing triggers the reduced 11% IRCM withholding rate on distributions
     * instead of the standard 16.5%.
     */
    @Schema(description = "Listed on BVMAC (triggers reduced 11% IRCM rate).")
    Boolean isBvmacListed,

    /**
     * Whether this is a government bond.
     * Government bonds are exempt from IRCM withholding. Setting this to {@code true}
     * has the same effect as {@code ircmExempt = true}, but is stored separately for reporting.
     */
    @Schema(description = "Government bond (triggers IRCM exemption).")
    Boolean isGovernmentBond,

    /**
     * Whether TVA (Taxe sur la Valeur Ajoutée / VAT) applies to trades of this asset.
     * TVA is applied to the trading fee amount at {@code tvaRate}. Default: {@code true}.
     */
    @Schema(description = "Enable TVA (VAT) on trades. Default: true.")
    Boolean tvaEnabled,

    /**
     * TVA rate override as a decimal (e.g. {@code 0.1925} = 19.25%).
     * Null uses the global default rate of 19.25%. Max 1.0 (100%).
     * Only applies when {@code tvaEnabled} is true.
     */
    @Schema(description = "TVA rate override (e.g. 0.1925 = 19.25%). Max: 1.0.")
    @PositiveOrZero @DecimalMax("1.00") BigDecimal tvaRate
) {}
