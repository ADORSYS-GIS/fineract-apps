package com.adorsys.fineract.asset.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

/**
 * Compact payment history summary for an asset, shown on the asset detail page.
 *
 * <p>Returned by {@code GET /api/assets/{assetId}/payment-summary}. Covers both bond coupon
 * history and income distribution history depending on the asset type. Intended as a
 * lightweight alternative to the paginated full payment history table — it surfaces only the
 * key headline metrics a retail user needs to assess payment reliability.
 *
 * <p>All {@code LocalDate} fields are in the configured market calendar timezone (WAT).
 * All monetary amounts are in the settlement currency (XAF).
 * All "last payment" fields are null when no payments have been made yet for this asset.
 */
@Schema(description = "Payment history summary for an asset (coupon or income).")
public record PaymentSummaryResponse(

    /**
     * Calendar date of the most recent successfully executed payment event.
     * Null if no payments have ever been made for this asset.
     * A "payment event" is one scheduled payment run covering all eligible holders.
     */
    LocalDate lastPaymentDate,

    /**
     * Total cash disbursed across all holders in the most recent payment event, in XAF.
     * Null if no payments have ever been made. This is the sum of all individual
     * {@link PaymentResultResponse#amount()} values for the last confirmed payment run.
     */
    BigDecimal lastPaymentAmountPaid,

    /**
     * Exact UTC timestamp of the most recent payment execution.
     * Null if no payments have ever been made. More precise than {@code lastPaymentDate}
     * — useful when intraday ordering matters.
     */
    Instant lastPaymentAt,

    /**
     * Calendar date of the next pending scheduled payment for this asset.
     * Null if no future payment is currently scheduled (e.g. the asset has matured or
     * the payment schedule has not yet been configured by an admin).
     */
    LocalDate nextScheduledDate,

    /**
     * Cumulative cash paid to all holders across every successful payment run, in XAF.
     * Counts only records with {@code status = "SUCCESS"}; failed individual payments are excluded.
     * Resets if the payment history is purged, but is otherwise monotonically increasing.
     */
    BigDecimal totalPaidToDate,

    /**
     * Number of individual holder payment records that ended in failure across all payment runs.
     * A single payment run can have partial failures (some holders succeed, others fail).
     * A non-zero count here indicates some holders may not have received expected income.
     */
    long failedPaymentCount,

    /**
     * Total number of individual holder payment records across all payment runs and all statuses
     * (SUCCESS + FAILED). Divide {@code failedPaymentCount} by this to get the failure rate.
     * Zero if no payments have been initiated.
     */
    long totalPaymentCount

) {}
