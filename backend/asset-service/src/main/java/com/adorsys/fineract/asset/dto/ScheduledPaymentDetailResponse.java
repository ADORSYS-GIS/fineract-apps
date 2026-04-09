package com.adorsys.fineract.asset.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

/**
 * Full detail view of a single scheduled income or coupon payment, returned by
 * {@code GET /api/admin/scheduled-payments/{id}}.
 *
 * <p>Extends the list-level {@link ScheduledPaymentResponse} with execution results
 * and a per-holder breakdown. Used by admins to review payment status, confirm upcoming
 * payments, or investigate failures after execution.</p>
 *
 * <p>The {@code holders} list is populated only when the payment is in {@code PENDING}
 * or {@code CONFIRMED} status. Once executed, per-holder outcomes are stored in the
 * payment result records instead.</p>
 */
public record ScheduledPaymentDetailResponse(
    /** Internal database identifier of this scheduled payment record. */
    Long id,

    /** Internal asset ID that this payment belongs to. */
    String assetId,

    /** Ticker symbol of the asset (e.g. {@code OTA_10Y_2034}). */
    String symbol,

    /** Display name of the asset. */
    String assetName,

    /**
     * Category of payment.
     * Typical values: {@code COUPON} for bond interest, {@code INCOME} for dividend/rent distributions.
     */
    String paymentType,

    /**
     * Scheduled calendar date for this payment.
     * For coupon bonds, this is the coupon payment date. For income assets, it is the distribution date.
     */
    LocalDate scheduleDate,

    /**
     * Lifecycle state of this scheduled payment.
     * Typical values: {@code PENDING}, {@code CONFIRMED}, {@code EXECUTED}, {@code CANCELLED}, {@code FAILED}.
     */
    String status,

    /**
     * Projected annual rate used to estimate the payment amount, as a percentage (e.g. 5.80 = 5.80%).
     * For COUPON payments, this is the bond's annual interest rate.
     * For INCOME payments, this is the asset's income rate.
     */
    BigDecimal estimatedRate,

    /**
     * Estimated XAF payment per unit, calculated from {@code estimatedRate} and the payment period.
     * For coupon bonds: {@code faceValue * (rate/100) * (couponFrequencyMonths/12)}.
     */
    BigDecimal estimatedAmountPerUnit,

    /**
     * Estimated total XAF amount to be paid across all holders.
     * Equals {@code estimatedAmountPerUnit * totalUnitsHeld} at the time of scheduling.
     */
    BigDecimal estimatedTotal,

    /**
     * Number of holders eligible to receive this payment at the time of scheduling.
     * May differ from the number actually paid if holder positions changed before execution.
     */
    int holderCount,

    /**
     * Actual confirmed XAF payment per unit, set by an admin during confirmation.
     * Null when {@code status} is {@code PENDING}; replaces the estimate for execution.
     */
    BigDecimal actualAmountPerUnit,

    /**
     * Username or identifier of the admin who confirmed this payment.
     * Null when the payment has not been confirmed.
     */
    String confirmedBy,

    /**
     * UTC timestamp when an admin confirmed this payment.
     * Null when {@code status} is not {@code CONFIRMED} or later.
     */
    Instant confirmedAt,

    /**
     * Username or identifier of the admin who cancelled this payment.
     * Null unless {@code status} is {@code CANCELLED}.
     */
    String cancelledBy,

    /**
     * UTC timestamp when this payment was cancelled.
     * Null unless {@code status} is {@code CANCELLED}.
     */
    Instant cancelledAt,

    /**
     * Admin-supplied reason for cancelling this payment.
     * Null unless {@code status} is {@code CANCELLED}.
     */
    String cancelReason,

    /**
     * Number of holders who successfully received payment during execution.
     * Null before execution. After execution: {@code holdersPaid + holdersFailed == holderCount}.
     */
    Integer holdersPaid,

    /**
     * Number of holders for whom payment failed during execution (e.g. Fineract transfer error).
     * Null before execution.
     */
    Integer holdersFailed,

    /**
     * Total XAF actually disbursed to holders during execution.
     * Null before execution. Sum of individual cash transfers made.
     */
    BigDecimal totalAmountPaid,

    /**
     * UTC timestamp when the execution job ran.
     * Null if the payment has not been executed yet.
     */
    Instant executedAt,

    /** UTC timestamp when this scheduled payment record was first created. */
    Instant createdAt,

    /**
     * Current XAF cash balance of the LP's trust account at the time of query.
     * Used by admins to verify sufficient funds before confirming the payment.
     * Null if the balance could not be resolved.
     */
    BigDecimal lpCashBalance,

    /**
     * Per-holder breakdown of units held and estimated payout.
     * Present when {@code status} is {@code PENDING} or {@code CONFIRMED}.
     * Empty or null after execution — use payment result records for post-execution detail.
     */
    List<HolderBreakdown> holders
) {

    /**
     * Estimated payout detail for a single holder within a scheduled payment.
     *
     * <p>Used by admins to review the holder list before confirming or cancelling a payment.</p>
     */
    public record HolderBreakdown(
        /** Fineract client ID of the holder. */
        Long userId,

        /** Units of the asset held by this holder, used to calculate their payment. */
        BigDecimal units,

        /**
         * Estimated XAF payment for this holder.
         * Equals {@code units * estimatedAmountPerUnit}.
         */
        BigDecimal estimatedPayment
    ) {}
}
