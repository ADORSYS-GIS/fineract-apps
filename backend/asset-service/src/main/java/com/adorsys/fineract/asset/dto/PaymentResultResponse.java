package com.adorsys.fineract.asset.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * Unified response for an individual payment result (coupon or income).
 * Used to display per-holder payment records from a confirmed scheduled payment.
 */
@Schema(description = "Individual payment result record for a holder.")
public record PaymentResultResponse(
    Long id,
    Long userId,
    BigDecimal units,
    BigDecimal amount,
    String status,
    String failureReason,
    Instant paidAt,
    // Coupon-specific fields (null for income)
    BigDecimal faceValue,
    BigDecimal annualRate,
    Integer periodMonths,
    // Income-specific fields (null for coupon)
    String incomeType,
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
