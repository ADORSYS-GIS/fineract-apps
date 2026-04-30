package com.adorsys.fineract.asset.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Projected financial benefit of holding a bond, embedded in trade preview responses
 * ({@code POST /orders/preview}) and portfolio position responses. Gives investors
 * a forward-looking picture of what a bond investment is expected to yield — coupon
 * income, principal repayment, and net profit — based on the current ask price and
 * residual term to maturity.
 *
 * <p>All monetary amounts are in XAF (Central African Franc). For DISCOUNT (BTA) bonds
 * there are no coupon payments; the investor's gain is entirely the difference between
 * what they paid and the {@code faceValue} returned at maturity, so coupon-related fields
 * ({@code interestRate}, {@code couponFrequencyMonths}, {@code nextCouponDate},
 * {@code couponPerPeriod}, {@code remainingCouponPayments}, {@code totalCouponIncome}) will be
 * zero or null. Fields marked "Null in portfolio context" are only populated during trade
 * preview, because portfolio projections are based on historical cost rather than a new trade.</p>
 */
public record BondBenefitProjection(
    /** Whether this is a COUPON (OTA) bond with periodic interest or a DISCOUNT (BTA) zero-coupon bond. */
    BondType bondType,
    /**
     * Par or redemption value per unit in XAF. Coupon amounts are calculated on this value,
     * and investors receive this amount per unit at maturity regardless of what they paid.
     */
    BigDecimal faceValue,
    /**
     * Annual nominal coupon rate as a percentage (e.g. 5.80 = 5.80% per year).
     * Null for DISCOUNT bonds, which carry no periodic coupon.
     */
    BigDecimal interestRate,
    /**
     * How often coupon payments are made, in months (e.g. 6 = semi-annual, 12 = annual).
     * Null for DISCOUNT bonds.
     */
    Integer couponFrequencyMonths,
    /** Date on which the bond principal is repaid and the asset reaches maturity. */
    LocalDate maturityDate,
    /**
     * The next scheduled coupon payment date from today. Null if all coupon periods have
     * already elapsed (bond is past its last coupon date but not yet matured) or if the
     * bond is DISCOUNT type.
     */
    LocalDate nextCouponDate,
    /**
     * Projected income per coupon period for the given unit quantity, in XAF. Computed as:
     * {@code units × faceValue × (interestRate / 100) × (couponFrequencyMonths / 12)}.
     * Zero for DISCOUNT bonds.
     */
    BigDecimal couponPerPeriod,
    /**
     * Number of coupon payment dates remaining between today and the maturity date.
     * Drives the {@code totalCouponIncome} calculation. Zero for DISCOUNT bonds.
     */
    int remainingCouponPayments,
    /**
     * Total projected coupon income over the remaining life of the bond, in XAF:
     * {@code couponPerPeriod × remainingCouponPayments}. Zero for DISCOUNT bonds.
     */
    BigDecimal totalCouponIncome,
    /**
     * Cash returned to the investor at maturity in XAF: {@code units × faceValue}.
     * For DISCOUNT bonds this is the primary source of return; for COUPON bonds
     * it is in addition to the coupon income stream.
     */
    BigDecimal principalAtMaturity,
    /**
     * Total cost of the new investment in XAF: {@code grossAmount + fee}.
     * Null in the portfolio context, where the cost basis comes from historical purchases
     * rather than a new order being previewed.
     */
    BigDecimal investmentCost,
    /**
     * Total projected cash return from holding to maturity in XAF:
     * {@code totalCouponIncome + principalAtMaturity}.
     */
    BigDecimal totalProjectedReturn,
    /**
     * Projected net profit in XAF: {@code totalProjectedReturn - investmentCost}.
     * Null in portfolio context (no new investment cost to compare against).
     */
    BigDecimal netProjectedProfit,
    /**
     * Simple annualised yield as a percentage:
     * {@code (netProjectedProfit / investmentCost) × (365 / daysToMaturity) × 100}.
     * Null in portfolio context. Not equivalent to YTM (Yield to Maturity) — this is
     * a simplified straight-line approximation suitable for display purposes.
     */
    BigDecimal annualizedYieldPercent,
    /**
     * Calendar days from today to the maturity date, clamped to zero if the maturity
     * date has already passed. Used to annualise the yield and display a countdown.
     */
    long daysToMaturity,
    /**
     * Projected IRCM withholding on the bond's projected income, in XAF, computed via
     * {@link com.adorsys.fineract.asset.service.TaxService#getEffectiveIrcmRate}. Honours
     * per-asset IRCM overrides, government-bond exemptions, and the BVMAC rate.
     * <p>For COUPON (OTA) bonds: applied to {@code totalCouponIncome} (coupon income is
     * the taxable distribution; principal at par is not taxed).
     * <p>For DISCOUNT (BTA) bonds: applied to {@code max(netProjectedProfit, 0)} (the
     * capital gain at maturity is the taxable event; principal at face is not taxed
     * separately). Whether IRCM is actually withheld at BTA maturity is a backend
     * policy decision (see PrincipalRedemptionService) — this is the projected value
     * the buyer should plan around.
     * <p>Null in portfolio (holding) context where {@code investmentCost} is also null.
     */
    BigDecimal projectedIrcm,
    /**
     * Projected net profit after IRCM withholding, in XAF:
     * {@code netProjectedProfit - projectedIrcm}. The "you'll keep" headline number
     * for buy-review screens. Null in portfolio context.
     */
    BigDecimal netProjectedProfitAfterIrcm
) {}
