package com.adorsys.fineract.asset.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

/**
 * Response DTO for a single coupon (interest) payment record.
 * Used in the admin coupon history endpoint.
 */
@Schema(description = "Coupon payment audit record for a bond asset.")
public record CouponPaymentResponse(
    /** Payment record ID. */
    Long id,
    /** Fineract client ID of the user who received the payment. */
    Long userId,
    /** Number of bond units held by the user at payment time. */
    BigDecimal units,
    /** Face value per unit (asset price) at payment time, in settlement currency. */
    BigDecimal faceValue,
    /** Annual coupon rate used for calculation (e.g. 5.80). */
    BigDecimal annualRate,
    /** Coupon period in months (e.g. 6 for semi-annual). */
    Integer periodMonths,
    /** Settlement currency amount transferred to the user. */
    BigDecimal cashAmount,
    /** Fineract account transfer ID. Null if the transfer failed. */
    Long fineractTransferId,
    /** Payment status: SUCCESS or FAILED. */
    String status,
    /** Reason for failure. Null if status is SUCCESS. */
    String failureReason,
    /** Timestamp when the payment was processed. */
    Instant paidAt,
    /** Coupon date that triggered this payment. */
    LocalDate couponDate
) {}
