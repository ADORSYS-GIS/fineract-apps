package com.adorsys.fineract.asset.dto;

import java.math.BigDecimal;

/**
 * High-level summary of scheduled payments, returned by
 * {@code GET /api/admin/scheduled-payments/summary}.
 *
 * <p>Intended for the admin dashboard widget that surfaces at-a-glance payment health.
 * All monetary amounts are in XAF. "This month" refers to the current calendar month
 * in the server's configured timezone.</p>
 */
public record ScheduledPaymentSummaryResponse(
    /**
     * Number of scheduled payments currently in {@code PENDING} status across all assets.
     * These require admin confirmation before they will be executed.
     */
    long pendingCount,

    /**
     * Number of payments that were confirmed (moved from {@code PENDING} to {@code CONFIRMED}
     * or {@code EXECUTED}) within the current calendar month.
     */
    long confirmedThisMonth,

    /**
     * Total XAF paid out to holders across all executed payments this calendar month.
     * Reflects the sum of {@code totalAmountPaid} for all payments with {@code status = EXECUTED}
     * and an {@code executedAt} timestamp within the current month.
     */
    BigDecimal totalPaidThisMonth
) {}
