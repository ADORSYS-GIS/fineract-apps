package com.adorsys.fineract.asset.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Bond coupon obligation forecast returned by the admin treasury forecast endpoint
 * ({@code GET /admin/assets/{id}/coupon-forecast}). Gives operators a forward-looking
 * view of the LP's total remaining coupon liabilities and whether the current treasury
 * cash balance is sufficient to cover them. Used for liquidity planning and to identify
 * potential shortfalls before the next payment date.
 *
 * <p>All monetary amounts are in XAF. The forecast uses the current outstanding unit
 * count and the bond's configured coupon parameters; it does not account for future
 * changes in circulating supply.</p>
 */
@Schema(description = "Bond coupon obligation forecast showing remaining liabilities and treasury coverage.")
public record CouponForecastResponse(
    /** Internal identifier of the bond asset this forecast covers. */
    String assetId,
    /** Ticker symbol of the bond (e.g. "OTA2026"). */
    String symbol,
    /**
     * Annual nominal coupon rate as a percentage (e.g. 5.80 = 5.80% per year).
     * Used alongside {@code faceValuePerUnit} and {@code couponFrequencyMonths} to
     * compute each period's obligation.
     */
    BigDecimal interestRate,
    /**
     * Coupon payment frequency in months (e.g. 6 = semi-annual, 12 = annual).
     * Determines how many payment dates remain until maturity.
     */
    Integer couponFrequencyMonths,
    /** Bond maturity date — the final coupon and principal are paid on or after this date. */
    LocalDate maturityDate,
    /**
     * The next coupon payment date from today. If this date is in the past (the scheduled
     * payment was delayed), the shortfall may be critical.
     */
    LocalDate nextCouponDate,
    /**
     * Total outstanding units currently held by all investors. Used as the multiplier
     * for all per-unit obligation calculations.
     */
    BigDecimal totalUnitsOutstanding,
    /**
     * Par value per unit in XAF — the basis for coupon calculations.
     * Coupon per period = {@code totalUnitsOutstanding × faceValuePerUnit × (interestRate/100) × (couponFrequencyMonths/12)}.
     */
    BigDecimal faceValuePerUnit,
    /**
     * Total coupon obligation per payment period across all outstanding units, in XAF.
     * This is the cash the LP must pay on each coupon date.
     */
    BigDecimal couponPerPeriod,
    /**
     * Number of coupon payment periods remaining from today to the maturity date.
     * Drives the {@code totalRemainingCouponObligation} calculation.
     */
    Integer remainingCouponPeriods,
    /**
     * Total future coupon cash outflow remaining, in XAF:
     * {@code couponPerPeriod × remainingCouponPeriods}. Does not include principal.
     */
    BigDecimal totalRemainingCouponObligation,
    /**
     * Principal returned to all unit holders at maturity in XAF:
     * {@code totalUnitsOutstanding × faceValuePerUnit}. Represents the single largest
     * cash outflow at the end of the bond's life.
     */
    BigDecimal principalAtMaturity,
    /**
     * Grand total of all future cash obligations in XAF:
     * {@code totalRemainingCouponObligation + principalAtMaturity}.
     * The LP's treasury must eventually fund this full amount.
     */
    BigDecimal totalObligation,
    /**
     * Current XAF balance in the LP's dedicated treasury cash account for this asset
     * ({@code lpCashAccountId}). Sourced from Fineract at query time.
     */
    @Schema(description = "Balance of this asset's dedicated treasury cash account")
    BigDecimal lpCashBalance,
    /**
     * Funding gap in XAF: {@code totalObligation - lpCashBalance}. A positive value means
     * the treasury does not have enough cash to cover all remaining obligations and the LP
     * must top up. Zero or negative means the treasury is fully funded.
     */
    BigDecimal shortfall,
    /**
     * Number of upcoming coupon periods the current treasury balance can cover, computed as:
     * {@code floor(lpCashBalance / couponPerPeriod)}. A value of zero means the LP cannot
     * even fund the next coupon payment from the current balance.
     */
    Integer couponsCoveredByBalance
) {}
