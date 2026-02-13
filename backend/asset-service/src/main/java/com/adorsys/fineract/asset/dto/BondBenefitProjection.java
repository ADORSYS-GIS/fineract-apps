package com.adorsys.fineract.asset.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Bond investment benefit projections, embedded in trade preview and portfolio responses.
 * All monetary amounts are in settlement currency. Null for non-bond assets.
 */
public record BondBenefitProjection(
    /** Face value per unit (same as asset's manualPrice). */
    BigDecimal faceValue,
    /** Annual coupon rate as percentage (e.g. 5.80). */
    BigDecimal interestRate,
    /** Coupon payment frequency in months (1, 3, 6, or 12). */
    Integer couponFrequencyMonths,
    /** Bond maturity date. */
    LocalDate maturityDate,
    /** Next scheduled coupon payment date. Null if all coupons have been paid. */
    LocalDate nextCouponDate,
    /** Coupon income per period: units * faceValue * (rate/100) * (months/12). */
    BigDecimal couponPerPeriod,
    /** Number of coupon payments remaining from today until maturity. */
    int remainingCouponPayments,
    /** Total projected coupon income: couponPerPeriod * remainingCouponPayments. */
    BigDecimal totalCouponIncome,
    /** Principal returned at maturity: units * faceValue. */
    BigDecimal principalAtMaturity,
    /** Total cost to buy (grossAmount + fee). Null in portfolio context. */
    BigDecimal investmentCost,
    /** totalCouponIncome + principalAtMaturity. */
    BigDecimal totalProjectedReturn,
    /** totalProjectedReturn - investmentCost. Null in portfolio context. */
    BigDecimal netProjectedProfit,
    /** Simple annualized yield: (netProfit/investmentCost) * (365/daysToMaturity) * 100. Null in portfolio context. */
    BigDecimal annualizedYieldPercent,
    /** Days from today to maturity date, clamped >= 0. */
    long daysToMaturity
) {}
