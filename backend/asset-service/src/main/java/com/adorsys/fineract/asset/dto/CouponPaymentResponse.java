package com.adorsys.fineract.asset.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

/**
 * Audit record for a single coupon (bond interest) payment, returned by the admin
 * coupon payment history endpoint ({@code GET /admin/assets/{id}/coupon-payments}).
 * Each record represents one payment attempt for one user on one coupon date. When a
 * coupon date triggers payouts to N holders, N records are created — one per holder.
 *
 * <p>The {@code status} field indicates whether the Fineract transfer succeeded.
 * Failed records should be investigated: they indicate the holder did not receive
 * their coupon and the LP's cash account may be in an inconsistent state.</p>
 */
@Schema(description = "Coupon payment audit record for a bond asset.")
public record CouponPaymentResponse(
    /** Auto-generated payment record ID (sequential). */
    Long id,
    /**
     * Fineract client ID of the investor who should receive this coupon payment.
     * Used to look up the user's savings account in Fineract.
     */
    Long userId,
    /**
     * Number of bond units held by this investor at the time the coupon was processed.
     * Determines the proportional share of the total coupon payout.
     */
    BigDecimal units,
    /**
     * Par value per unit in XAF at the time of payment. Stored on the record so that
     * historical payments reflect the face value that was in effect when they were made,
     * in case the asset configuration is updated later.
     */
    BigDecimal faceValue,
    /**
     * Annual coupon rate used to calculate this payment, as a percentage (e.g. 5.80).
     * Stored on the record so historical amounts can be verified even if the rate changes.
     */
    BigDecimal annualRate,
    /**
     * Coupon period duration in months (e.g. 6 for semi-annual). Combined with
     * {@code annualRate} and {@code faceValue} to verify the {@code cashAmount}:
     * {@code units × faceValue × (annualRate/100) × (periodMonths/12)}.
     */
    Integer periodMonths,
    /**
     * XAF amount transferred to the investor's cash account for this coupon payment.
     * Equals {@code units × faceValue × (annualRate/100) × (periodMonths/12)},
     * net of any applicable IRCM withholding tax.
     */
    BigDecimal cashAmount,
    /**
     * Fineract account transfer ID confirming the cash movement between the LP's cash
     * account and the investor's savings account. Null if the Fineract transfer failed
     * or was never attempted (e.g. the job was aborted mid-run).
     */
    Long fineractTransferId,
    /**
     * Outcome of the payment attempt: "SUCCESS" if the Fineract transfer completed,
     * "FAILED" if an error occurred. Use {@code failureReason} to understand the cause.
     */
    String status,
    /**
     * Description of why this payment failed. Contains the exception message or the
     * Fineract API error response. Null when {@code status} is "SUCCESS".
     */
    String failureReason,
    /** Timestamp when this payment record was processed (success or failure), in UTC. */
    Instant paidAt,
    /**
     * The scheduled coupon date that triggered this payment run. Multiple payment records
     * share the same {@code couponDate} when they are part of the same distribution cycle.
     */
    LocalDate couponDate
) {}
