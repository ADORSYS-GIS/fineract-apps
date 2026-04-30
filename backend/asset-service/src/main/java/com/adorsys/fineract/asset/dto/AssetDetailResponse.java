package com.adorsys.fineract.asset.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

/**
 * Full asset detail including OHLC data, supply stats, fee configuration, Fineract account links,
 * and bond-specific fields (when category is BONDS). Returned by both the admin asset detail
 * endpoint ({@code GET /admin/assets/{id}}) and the authenticated customer detail endpoint
 * ({@code GET /assets/{id}}). This is the most complete representation of an asset — the
 * public variant ({@link AssetPublicDetailResponse}) strips internal Fineract infrastructure
 * IDs before returning to the client.
 *
 * <p>All bond-specific fields ({@code bondType}, {@code interestRate}, {@code maturityDate}, etc.)
 * are null for non-bond assets. All monetary amounts are in XAF (Central African Franc) unless
 * a specific currency code is noted.</p>
 */
public record AssetDetailResponse(
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
    @Schema(nullable = true)
    String description,
    /** URL to the asset's logo or promotional image. Null if not provided. */
    @Schema(nullable = true)
    String imageUrl,
    /** Classification bucket for this asset (e.g. BONDS, REAL_ESTATE). */
    AssetCategory category,
    /** Current lifecycle status controlling what operations are permitted. */
    AssetStatus status,
    /**
     * How the current ask price is determined. AUTO means the price is derived from
     * external market feeds; MANUAL means an admin sets it explicitly via {@code SetPriceRequest}.
     */
    PriceMode priceMode,
    /**
     * Percentage price change over the past 24 hours relative to the opening price.
     * Positive values indicate appreciation; negative values indicate depreciation.
     * Expressed as a percentage (e.g. 2.5 means +2.5%).
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
    /** Units currently held by users (in their Fineract savings accounts). */
    BigDecimal circulatingSupply,
    /**
     * Units the LP still has available to sell: {@code totalSupply - circulatingSupply}.
     * When this reaches zero, no further BUY orders can be filled.
     */
    BigDecimal availableSupply,
    /**
     * Platform trading fee as a decimal percentage charged on every filled order.
     * Applied to the gross trade amount (e.g. 0.005 = 0.5%). Stored per-asset so that
     * different asset classes can carry different fee tiers.
     */
    BigDecimal tradingFeePercent,
    /**
     * Number of decimal places allowed for fractional unit quantities (0–8).
     * Controls order validation and display rounding in the frontend.
     */
    Integer decimalPlaces,

    // ── Issuer info ──

    /**
     * Name of the entity that issued or backs this asset (e.g. "Etat du Sénégal").
     * Required for bond assets; optional for other categories.
     */
    @Schema(description = "Asset issuer name. Required for bonds, optional for others.", nullable = true)
    String issuerName,
    /**
     * The LP's cost basis per unit — the price at which the liquidity partner acquired the asset
     * from the issuer. For bonds, this is the subscription price (often below face value for
     * DISCOUNT/BTA bonds). All markup calculations use this as the base. In XAF.
     */
    @Schema(description = "LP acquisition cost per unit.", nullable = true)
    BigDecimal issuerPrice,
    /**
     * The par or redemption value per unit. For DISCOUNT (BTA) bonds this is higher than
     * {@code issuerPrice} — the difference is the investor's gain at maturity. For COUPON (OTA)
     * bonds, coupon amounts are calculated on this value. Null defaults to {@code issuerPrice}.
     * In XAF.
     */
    @Schema(description = "Face/par value per unit for redemption and coupon calculations.", nullable = true)
    BigDecimal faceValue,

    // ── Liquidity Partner info ──

    /**
     * Nested LP info block: client ID, asset account, cash/spread/tax accounts, and display name.
     * Null if the asset has no LP configured.
     */
    @Schema(description = "Liquidity partner accounts and identity.", nullable = true)
    LpInfo lp,
    /** Fineract savings product ID that backs the user-facing token accounts for this asset. */
    Integer fineractProductId,
    /**
     * Name of the Fineract savings product associated with this asset, typically
     * derived as {@code "<asset name> Token"}. Null if the product lookup fails.
     */
    @Schema(description = "Fineract savings product name.", nullable = true)
    String fineractProductName,
    /**
     * LP margin per unit in XAF: the difference between the current ask price and
     * {@code issuerPrice}. Represents gross revenue to the LP on each unit sold.
     * Null if the ask price has not been set.
     */
    @Schema(description = "LP margin per unit in settlement currency.", nullable = true)
    BigDecimal lpMarginPerUnit,
    /**
     * LP margin expressed as a percentage of {@code issuerPrice}:
     * {@code (askPrice - issuerPrice) / issuerPrice * 100}.
     * Null if {@code issuerPrice} is zero or the ask price has not been set.
     */
    @Schema(description = "LP margin as percentage of issuer price.", nullable = true)
    BigDecimal lpMarginPercent,

    /** Timestamp when the asset record was created in the system, in UTC. */
    Instant createdAt,
    /** Timestamp of the last update to any field on this asset. Null if never modified after creation. */
    @Schema(nullable = true)
    Instant updatedAt,

    // ── Bond / fixed-income fields (null for non-bond assets) ──

    /**
     * Distinguishes between coupon-paying bonds (OTA / T-Bonds) and zero-coupon discount
     * bonds (BTA / T-Bills). Controls which yield formula is used. Null for non-bond assets.
     */
    @Schema(description = "Bond type: COUPON (OTA/T-Bonds) or DISCOUNT (BTA/T-Bills).", nullable = true)
    BondType bondType,
    /**
     * Convention used to count days for accrued interest calculations.
     * ACT_360 is standard for BTA instruments in CEMAC; ACT_365 for OTA instruments.
     * Null for non-bond assets.
     */
    @Schema(description = "Day count convention: ACT_360, ACT_365, or THIRTY_360.", nullable = true)
    DayCountConvention dayCountConvention,
    /**
     * CEMAC member state that issued this bond (e.g. "Cameroun", "Sénégal"). Used for
     * display and filtering purposes. Null for non-bond assets.
     */
    @Schema(description = "Issuer country name.", nullable = true)
    String issuerCountry,
    /**
     * International Securities Identification Number (ISO 6166) for this bond, if assigned.
     * Null for non-bond assets or bonds not yet assigned an ISIN.
     */
    @Schema(description = "ISIN code (ISO 6166). Null for non-bond assets.", nullable = true)
    String isinCode,
    /**
     * Date on which the bond principal is due for repayment. After this date the asset
     * transitions to MATURED status and trading is blocked. Null for non-bond assets.
     */
    @Schema(description = "Bond maturity date. Null for non-bond assets.", nullable = true)
    LocalDate maturityDate,
    /**
     * Date on which the bond was originally issued. Used for BTA price accretion
     * and accrued interest calculations. Null for non-bond assets.
     */
    @Schema(description = "Bond issue date. Null for non-bond assets.", nullable = true)
    LocalDate issueDate,
    /**
     * Annual nominal coupon rate as a percentage (e.g. 5.80 means 5.80% per year).
     * Used with {@code faceValue} and {@code couponFrequencyMonths} to compute each
     * periodic payment. Null for DISCOUNT bonds and non-bond assets.
     */
    @Schema(description = "Annual coupon interest rate as percentage (e.g. 5.80).", nullable = true)
    BigDecimal interestRate,
    /**
     * Effective annual yield based on the current ask price rather than face value.
     * For COUPON bonds: {@code (couponAmountPerUnit × periodsPerYear) / askPrice × 100}.
     * For DISCOUNT bonds: derived from the discount-to-face-value spread over residual days.
     * Null for non-bond assets. Recomputed at query time.
     */
    @Schema(description = "Current yield: effective annual return based on ask price. Bonds only.", nullable = true)
    BigDecimal currentYield,
    /**
     * How often coupon payments are made, in months. Common values: 1 (monthly), 3 (quarterly),
     * 6 (semi-annual), 12 (annual). Null for DISCOUNT bonds and non-bond assets.
     */
    @Schema(description = "Coupon frequency in months: 1, 3, 6, or 12.", nullable = true)
    Integer couponFrequencyMonths,
    /**
     * The next date on which a coupon payment will be distributed to unit holders.
     * Advances by {@code couponFrequencyMonths} after each successful payout.
     * Null for DISCOUNT bonds and non-bond assets.
     */
    @Schema(description = "Next scheduled coupon payment date.", nullable = true)
    LocalDate nextCouponDate,
    /**
     * Calendar days remaining between today and {@code maturityDate}, clamped to zero
     * once the bond has matured. Computed at query time — not persisted. Null for non-bond assets.
     */
    @Schema(description = "Days remaining until maturity date. Computed at query time.", nullable = true)
    Long residualDays,
    /**
     * Coupon income paid per unit per payment period, in XAF. Computed as:
     * {@code faceValue × (interestRate / 100) × (couponFrequencyMonths / 12)}.
     * Null for DISCOUNT bonds and non-bond assets.
     */
    @Schema(description = "Coupon amount per unit per period, based on issuer price.", nullable = true)
    BigDecimal couponAmountPerUnit,

    // ── Bid/Ask prices ──

    /**
     * The price at which the LP will buy units back from sellers (bid side), in XAF.
     * Sellers receive this amount per unit less any applicable fees.
     * Null if prices have not been set for this asset.
     */
    @Schema(description = "LP bid price: what sellers receive.", nullable = true)
    BigDecimal bidPrice,
    /**
     * The price at which the LP sells units to buyers (ask side), in XAF.
     * Buyers pay this amount per unit plus any applicable fees.
     * Null if prices have not been set for this asset.
     */
    @Schema(description = "LP ask price: what buyers pay.", nullable = true)
    BigDecimal askPrice,

    // ── Exposure limits ──

    /**
     * Maximum position a single user can hold, expressed as a percentage of {@code totalSupply}.
     * BUY orders that would cause a holder to exceed this threshold are rejected.
     * Null means no per-user position cap is enforced.
     */
    @Schema(description = "Max position as percentage of total supply.", nullable = true)
    BigDecimal maxPositionPercent,
    /**
     * Maximum number of units allowed in a single order. Orders exceeding this are rejected
     * at validation time. Null means no per-order unit cap is enforced.
     */
    @Schema(description = "Max units per single order.", nullable = true)
    BigDecimal maxOrderSize,
    /**
     * Maximum gross XAF trading volume a single user may transact in a rolling 24-hour window.
     * Orders that would push the user over this limit are rejected. Null means no daily cap.
     */
    @Schema(description = "Max XAF volume per user per day.", nullable = true)
    BigDecimal dailyTradeLimitXaf,

    // ── Min order size ──

    /**
     * Minimum number of units required for a single order. Orders below this threshold
     * are rejected at validation. Null means no minimum unit quantity is enforced.
     */
    @Schema(description = "Minimum units per single order.", nullable = true)
    BigDecimal minOrderSize,
    /**
     * Minimum gross XAF amount required for a single order. Orders with a computed
     * {@code units × price} below this threshold are rejected. Null means no minimum cash amount.
     */
    @Schema(description = "Minimum XAF amount per single order.", nullable = true)
    BigDecimal minOrderCashAmount,

    // ── Lock-up ──

    /**
     * Number of days from a user's first purchase during which SELL orders are blocked.
     * Designed to discourage short-term speculation on illiquid assets. Null means
     * holdings can be sold immediately after purchase.
     */
    @Schema(description = "Lock-up period in days. Null means no lock-up.", nullable = true)
    Integer lockupDays,

    // ── Income distribution (non-bond) ──

    /**
     * Type of periodic income distributed to unit holders for non-bond assets.
     * Possible values: DIVIDEND (equities), RENT (real estate), HARVEST_YIELD (agriculture),
     * PROFIT_SHARE (funds). Null for bond assets and assets with no income configuration.
     */
    @Schema(description = "Income type: DIVIDEND, RENT, HARVEST_YIELD, PROFIT_SHARE.", nullable = true)
    String incomeType,
    /**
     * Annual income rate as a percentage of the current market price per unit
     * (e.g. 8.0 means 8% per year). Unlike bond coupon rates, this applies to
     * the market price, not a fixed face value, so payouts vary over time.
     * Null for bond assets and assets with no income configuration.
     */
    @Schema(description = "Annual income rate as percentage.", nullable = true)
    BigDecimal incomeRate,
    /**
     * How often income is distributed, in months. Common values: 1 (monthly),
     * 3 (quarterly), 6 (semi-annual), 12 (annual). Null for bond assets.
     */
    @Schema(description = "Distribution frequency in months.", nullable = true)
    Integer distributionFrequencyMonths,
    /**
     * The next date on which income will be distributed to holders. Advances by
     * {@code distributionFrequencyMonths} after each successful run.
     * Null for bond assets and assets with no income configuration.
     */
    @Schema(description = "Next scheduled income distribution date.", nullable = true)
    LocalDate nextDistributionDate,

    // ── Delisting ──

    /**
     * The date on which the forced buyback will execute for a DELISTING asset.
     * After this date all remaining holders are automatically paid {@code delistingRedemptionPrice}
     * per unit and the asset transitions to DELISTED. Null for assets not in the delisting process.
     */
    @Schema(description = "Date on which delisting / forced buyback occurs.", nullable = true)
    LocalDate delistingDate,
    /**
     * Per-unit price used for the forced buyback when the delisting date is reached, in XAF.
     * Typically set to the last traded price or a negotiated redemption price.
     * Null for assets not in the delisting process.
     */
    @Schema(description = "Price at which forced buyback is executed.", nullable = true)
    BigDecimal delistingRedemptionPrice,

    // ── Tax configuration (Cameroon/CEMAC) ──

    /**
     * Whether registration duty (droit d'enregistrement) is charged on trades of this asset.
     * When true, the {@code registrationDutyRate} is applied to the gross trade amount
     * and collected from the buyer at settlement.
     */
    @Schema(description = "Registration duty enabled for trades of this asset.")
    Boolean registrationDutyEnabled,
    /**
     * Registration duty rate as a decimal (e.g. 0.02 = 2%). Applied to the gross trade
     * amount when {@code registrationDutyEnabled} is true. Null when duty is disabled.
     */
    @Schema(description = "Registration duty rate (e.g. 0.02 = 2%).", nullable = true)
    BigDecimal registrationDutyRate,
    /**
     * Whether IRCM (Impôt sur le Revenu des Capitaux Mobiliers) withholding applies
     * to income distributions (coupons, dividends, rent, etc.) for this asset.
     */
    @Schema(description = "IRCM withholding enabled for income distributions.")
    Boolean ircmEnabled,
    /**
     * Asset-specific IRCM rate override as a decimal. When set, overrides the system default
     * IRCM rate. Null means the system default applies. Ignored when {@code ircmExempt} is true.
     */
    @Schema(description = "IRCM rate override.", nullable = true)
    BigDecimal ircmRateOverride,
    /**
     * Whether this asset is fully exempt from IRCM withholding. Government bonds (OTAs/BTAs)
     * issued by CEMAC member states are typically IRCM-exempt under regional tax treaties.
     * When true, no IRCM is withheld regardless of {@code ircmEnabled} or {@code ircmRateOverride}.
     */
    @Schema(description = "Exempt from IRCM (e.g. government bonds).")
    Boolean ircmExempt,
    /**
     * Whether capital gains tax is charged on profitable SELL orders for this asset.
     * When true, the platform withholds {@code capitalGainsRate} on the realized gain
     * (sell price minus cost basis) at settlement.
     */
    @Schema(description = "Capital gains tax enabled for profitable sales.")
    Boolean capitalGainsTaxEnabled,
    /**
     * Capital gains tax rate as a decimal (e.g. 0.05 = 5%). Applied to the realized gain
     * when {@code capitalGainsTaxEnabled} is true. Null when capital gains tax is disabled.
     */
    @Schema(description = "Capital gains tax rate.", nullable = true)
    BigDecimal capitalGainsRate,
    /**
     * Whether this asset is officially listed on the BVMAC (Bourse des Valeurs Mobilières
     * de l'Afrique Centrale). Informational flag used for display and regulatory classification.
     */
    @Schema(description = "Listed on BVMAC.")
    Boolean isBvmacListed,
    /**
     * Whether this is a sovereign government bond issued by a CEMAC member state.
     * Government bonds are generally IRCM-exempt; this flag helps enforce that rule
     * automatically without requiring manual configuration of {@code ircmExempt}.
     */
    @Schema(description = "Government bond (IRCM exempt).")
    Boolean isGovernmentBond,
    /**
     * Whether TVA (Taxe sur la Valeur Ajoutée / VAT) applies to trades of this asset.
     * When true, TVA at {@code tvaRate} is charged on the trading fee portion of each order.
     */
    @Schema(description = "TVA (VAT) enabled for trades.")
    Boolean tvaEnabled,
    /**
     * TVA rate as a decimal (e.g. 0.1925 = 19.25%, the standard Cameroon VAT rate).
     * Null when {@code tvaEnabled} is false. Overrides the system default rate when set.
     */
    @Schema(description = "TVA rate override.", nullable = true)
    BigDecimal tvaRate,

    /**
     * Current market pricing snapshot for this asset, computed at query time.
     * Contains clean price (LP bid), accrued interest per unit, dirty price, current yield,
     * and the computation date. Null for non-bond assets.
     */
    @Schema(description = "Current market pricing snapshot. Null for non-bond assets.", nullable = true)
    CurrentMarketData currentMarketData
) {
    /**
     * Nested liquidity partner info block bundling all LP account identifiers and display name.
     */
    public record LpInfo(
        /** Fineract client ID of the LP. */
        Long clientId,
        /** Fineract savings account ID where the LP holds token inventory. */
        Long assetAccountId,
        /** Fineract savings account ID for the LP's XAF cash. */
        Long cashAccountId,
        /** LP spread collection account ID. Null if spread not configured. */
        @Schema(nullable = true) Long spreadAccountId,
        /** LP tax withholding account ID. Null if tax withholding not configured. */
        @Schema(nullable = true) Long taxAccountId,
        /** LP cash account number (human-readable). Null if not set. */
        @Schema(nullable = true) String cashAccountNo,
        /** LP spread account number. Null if not set. */
        @Schema(nullable = true) String spreadAccountNo,
        /** LP tax account number. Null if not set. */
        @Schema(nullable = true) String taxAccountNo,
        /** Display name of the LP (e.g. "LP Cameroun SA"). */
        @Schema(nullable = true) String clientName
    ) {}
}
