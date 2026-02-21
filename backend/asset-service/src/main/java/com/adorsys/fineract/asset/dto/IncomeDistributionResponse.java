package com.adorsys.fineract.asset.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

/**
 * Response DTO for a single income distribution payment record.
 * Used in the admin income distribution history endpoint.
 */
@Schema(description = "Income distribution audit record for a non-bond asset.")
public record IncomeDistributionResponse(
    /** Payment record ID. */
    Long id,
    /** Fineract client ID of the user who received the payment. */
    Long userId,
    /** Income type: DIVIDEND, RENT, HARVEST_YIELD, PROFIT_SHARE. */
    String incomeType,
    /** Number of asset units held by the user at payment time. */
    BigDecimal units,
    /** Annual income rate used for calculation (e.g. 8.00). */
    BigDecimal rateApplied,
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
    /** Distribution date that triggered this payment. */
    LocalDate distributionDate
) {}
