package com.adorsys.fineract.asset.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

/**
 * Audit record for a single non-bond income distribution payment, returned by the admin
 * income distribution history endpoint ({@code GET /admin/assets/{id}/income-distributions}).
 * Each record represents one payment attempt for one investor on one distribution date.
 * When a distribution date triggers payouts to N holders, N records are created.
 *
 * <p>Non-bond income includes DIVIDEND (equities), RENT (real estate),
 * HARVEST_YIELD (agriculture), and PROFIT_SHARE (funds). For bond coupon payments,
 * see {@link CouponPaymentResponse} instead.</p>
 *
 * <p>The {@code status} field indicates whether the Fineract transfer succeeded.
 * Failed records indicate the holder did not receive their income and should be
 * retried or investigated.</p>
 */
@Schema(description = "Income distribution audit record for a non-bond asset.")
public record IncomeDistributionResponse(
    /** Auto-generated payment record ID (sequential). */
    Long id,
    /**
     * Fineract client ID of the investor who should receive this distribution.
     * Used to look up the user's cash savings account in Fineract.
     */
    Long userId,
    /**
     * Category of income distributed in this payment: DIVIDEND, RENT, HARVEST_YIELD,
     * or PROFIT_SHARE. Matches the asset's configured {@code incomeType}.
     */
    String incomeType,
    /**
     * Number of asset units held by this investor at the time the distribution was processed.
     * Determines the proportional share of the total payout.
     */
    BigDecimal units,
    /**
     * Annual income rate applied to calculate this payment, as a percentage (e.g. 8.00).
     * Stored on the record so historical amounts can be verified even if the rate is
     * later updated on the asset.
     */
    BigDecimal rateApplied,
    /**
     * XAF amount transferred to the investor's cash savings account for this distribution.
     * Computed as: {@code units × priceAtDistribution × (rateApplied/100) × (months/12)},
     * net of any applicable IRCM withholding. The price used is the ask price at the
     * time the distribution job ran.
     */
    BigDecimal cashAmount,
    /**
     * Fineract account transfer ID confirming the cash movement from the LP's cash account
     * to the investor's account. Null if the Fineract transfer failed or was not attempted.
     */
    Long fineractTransferId,
    /**
     * Outcome of the payment attempt: "SUCCESS" if the Fineract transfer completed,
     * "FAILED" if an error occurred. Use {@code failureReason} to understand the cause.
     */
    String status,
    /**
     * Description of why this payment failed. Contains the exception message or Fineract
     * API error response. Null when {@code status} is "SUCCESS".
     */
    String failureReason,
    /** Timestamp when this payment record was processed (success or failure), in UTC. */
    Instant paidAt,
    /**
     * The scheduled distribution date that triggered this payment run. Multiple payment
     * records share the same {@code distributionDate} when part of the same distribution cycle.
     */
    LocalDate distributionDate
) {}
