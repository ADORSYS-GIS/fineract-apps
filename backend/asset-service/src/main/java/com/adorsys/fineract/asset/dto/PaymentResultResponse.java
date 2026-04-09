package com.adorsys.fineract.asset.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * Individual payment record for a single holder within a scheduled payment run.
 *
 * <p>Returned as a list by {@code GET /api/admin/payments/{paymentId}/results}
 * after a scheduled payment has been confirmed and executed. Each record represents
 * one cash disbursement to one user who held the asset at the payment snapshot date.
 *
 * <p>This DTO is polymorphic: it covers both bond coupon payments (fields from
 * {@code InterestPayment} entities, populated via {@link #fromCoupon}) and income
 * distributions such as dividends, rent, or profit-share (fields from
 * {@code IncomeDistribution} entities, populated via {@link #fromIncome}).
 * The two variants share the common header fields but differ in their type-specific
 * detail fields — exactly one set of type-specific fields is populated; the other is null.
 *
 * <p>All monetary amounts are in the settlement currency (XAF).
 */
@Schema(description = "Individual payment result record for a holder.")
public record PaymentResultResponse(

    /** Database primary key of the coupon or income distribution record. */
    Long id,

    /**
     * Fineract client ID of the holder who received (or was attempted to receive) this payment.
     * Use to look up the user's identity and account detail in Fineract or Keycloak.
     */
    Long userId,

    /**
     * Number of asset units held by this user at the payment snapshot date.
     * Determines the proportional share of the total payment pool allocated to this holder.
     * In asset units, not XAF.
     */
    BigDecimal units,

    /**
     * Cash amount disbursed (or attempted) to this user, in XAF.
     * Calculated as {@code units × ratePerUnit} (where the rate depends on the payment type).
     * This is the gross amount before any withholding taxes that may apply at a future processing step.
     */
    BigDecimal amount,

    /**
     * Outcome of the payment attempt for this holder.
     * Typical values: {@code "SUCCESS"}, {@code "FAILED"}.
     * A FAILED record means the Fineract transfer was rejected for this specific user
     * but does not affect other holders in the same run.
     */
    String status,

    /**
     * Human-readable explanation of why the payment failed for this holder.
     * Null when {@code status} is {@code "SUCCESS"} or when the payment is pending.
     * Examples: {@code "Account not found"}, {@code "Savings account closed"}.
     */
    String failureReason,

    /**
     * Timestamp when the cash was successfully transferred to this holder's Fineract account.
     * Null if {@code status} is {@code "FAILED"} or if the payment has not yet been executed.
     */
    Instant paidAt,

    // ── Coupon-specific fields (null for income distributions) ──────────────────

    /**
     * Bond face value (nominal value per unit) used to calculate this coupon payment, in XAF.
     * Null for income distribution payments ({@code incomeType} and {@code rateApplied} are set instead).
     */
    BigDecimal faceValue,

    /**
     * Annual coupon rate applied to the bond face value for this payment period, as a percentage.
     * Example: {@code 6.5} means 6.5% per annum. The per-period rate is derived from this
     * in combination with {@code periodMonths}.
     * Null for income distribution payments.
     */
    BigDecimal annualRate,

    /**
     * Duration of the coupon period in months, e.g. {@code 6} for a semi-annual coupon.
     * Together with {@code annualRate} and {@code faceValue}, determines the gross coupon
     * amount per unit: {@code faceValue × (annualRate/100) × (periodMonths/12)}.
     * Null for income distribution payments.
     */
    Integer periodMonths,

    // ── Income-specific fields (null for coupon payments) ───────────────────────

    /**
     * Category of income distribution, identifying the source of the payout.
     * Examples: {@code "DIVIDEND"}, {@code "RENT"}, {@code "HARVEST_YIELD"}, {@code "PROFIT_SHARE"}.
     * Null for bond coupon payments ({@code faceValue}, {@code annualRate}, and {@code periodMonths}
     * are set instead).
     */
    String incomeType,

    /**
     * Rate applied to calculate the per-unit income amount for this distribution, as a percentage.
     * Interpretation varies by {@code incomeType}: for dividends it is yield per unit; for rent
     * it is the periodic distribution rate. The gross amount per unit is derived from this rate
     * and the asset's face value or NAV at the snapshot date.
     * Null for bond coupon payments.
     */
    BigDecimal rateApplied

) {

    /** Map from an InterestPayment entity. */
    public static PaymentResultResponse fromCoupon(
            Long id, Long userId, BigDecimal units, BigDecimal cashAmount,
            String status, String failureReason, Instant paidAt,
            BigDecimal faceValue, BigDecimal annualRate, Integer periodMonths) {
        return new PaymentResultResponse(
                id, userId, units, cashAmount, status, failureReason, paidAt,
                faceValue, annualRate, periodMonths, null, null);
    }

    /** Map from an IncomeDistribution entity. */
    public static PaymentResultResponse fromIncome(
            Long id, Long userId, BigDecimal units, BigDecimal cashAmount,
            String status, String failureReason, Instant paidAt,
            String incomeType, BigDecimal rateApplied) {
        return new PaymentResultResponse(
                id, userId, units, cashAmount, status, failureReason, paidAt,
                null, null, null, incomeType, rateApplied);
    }
}
