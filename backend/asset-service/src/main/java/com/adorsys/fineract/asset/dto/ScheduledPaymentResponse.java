package com.adorsys.fineract.asset.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

/**
 * Summary view of a scheduled income or coupon payment, returned in paginated lists by
 * {@code GET /api/admin/scheduled-payments}.
 *
 * <p>Contains the same fields as {@link ScheduledPaymentDetailResponse} but omits the
 * per-holder breakdown ({@code holders} list). Use this for list views and dashboards;
 * fetch the detail endpoint for per-holder data.</p>
 *
 * <p>Payments are created automatically by the scheduling job when a new coupon date or
 * distribution date is reached. Admins must confirm before the system executes payment.</p>
 */
public record ScheduledPaymentResponse(
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
     * For coupon bonds, this is the coupon date. For income assets, it is the distribution date.
     */
    LocalDate scheduleDate,

    /**
     * Lifecycle state of this scheduled payment.
     * Typical values: {@code PENDING}, {@code CONFIRMED}, {@code EXECUTED}, {@code CANCELLED}, {@code FAILED}.
     */
    String status,

    /**
     * Projected annual rate used to estimate the payment, as a percentage (e.g. 5.80 = 5.80%).
     * For COUPON payments, this is the bond's coupon rate. For INCOME payments, the distribution rate.
     */
    BigDecimal estimatedRate,

    /**
     * Estimated XAF payment per unit.
     * For coupon bonds: {@code faceValue * (rate/100) * (couponFrequencyMonths/12)}.
     */
    BigDecimal estimatedAmountPerUnit,

    /**
     * Estimated total XAF to be paid to all holders combined.
     * Equals {@code estimatedAmountPerUnit * totalUnitsHeld} at scheduling time.
     */
    BigDecimal estimatedTotal,

    /**
     * Number of holders eligible to receive this payment at the time of scheduling.
     */
    int holderCount,

    /**
     * Actual confirmed XAF payment per unit set during admin confirmation.
     * Null when {@code status} is {@code PENDING}.
     */
    BigDecimal actualAmountPerUnit,

    /**
     * Username or identifier of the admin who confirmed this payment.
     * Null when not yet confirmed.
     */
    String confirmedBy,

    /**
     * UTC timestamp when an admin confirmed this payment.
     * Null when not yet confirmed.
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
     * Number of holders who successfully received payment.
     * Null before execution.
     */
    Integer holdersPaid,

    /**
     * Number of holders for whom payment failed during execution.
     * Null before execution.
     */
    Integer holdersFailed,

    /**
     * Total XAF actually disbursed across all holders.
     * Null before execution.
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
     * Null if the balance could not be resolved.
     */
    BigDecimal lpCashBalance
) {}
