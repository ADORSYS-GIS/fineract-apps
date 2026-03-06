package com.adorsys.fineract.asset.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

/**
 * Compact summary of coupon or income payment history for an asset.
 * Used on the asset detail page as a lightweight alternative to the full history table.
 */
@Schema(description = "Payment history summary for an asset (coupon or income).")
public record PaymentSummaryResponse(
    /** Date of the most recent payment. Null if no payments yet. */
    LocalDate lastPaymentDate,
    /** Total amount paid in the most recent payment event. Null if no payments yet. */
    BigDecimal lastPaymentAmountPaid,
    /** Timestamp of the most recent payment. Null if no payments yet. */
    Instant lastPaymentAt,
    /** Date of the next pending scheduled payment. Null if none scheduled. */
    LocalDate nextScheduledDate,
    /** Total amount paid to date across all successful payments. */
    BigDecimal totalPaidToDate,
    /** Number of individual payment records that failed. */
    long failedPaymentCount,
    /** Total number of individual payment records (all statuses). */
    long totalPaymentCount
) {}
