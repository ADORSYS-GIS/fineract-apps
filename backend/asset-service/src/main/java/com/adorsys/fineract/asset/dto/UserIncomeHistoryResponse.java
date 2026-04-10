package com.adorsys.fineract.asset.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * Response for {@code GET /portfolio/income-history}.
 * Returns a paginated list of past paid coupon/income events and upcoming scheduled events
 * for the authenticated user, along with a running summary.
 */
@Schema(description = "Paginated income history (paid and scheduled) for the authenticated user.")
public record UserIncomeHistoryResponse(
        /**
         * Chronologically descending list of income events for this page.
         * Paid events come before scheduled events within the same page ordering.
         */
        List<UserIncomeEvent> content,
        /** Total number of events across all pages (paid + scheduled). */
        long totalElements,
        /** Aggregate totals across the user's complete income history (not just this page). */
        UserIncomeSummary summary
) {

    /**
     * A single income event — either a past paid coupon/income distribution or a
     * future scheduled one.
     */
    @Schema(description = "A single coupon/income event for a position held by the user.")
    public record UserIncomeEvent(
            /** Internal asset identifier. */
            String assetId,
            /** Short ticker symbol (e.g. \"OTA2026\"). */
            String symbol,
            /** Display name of the asset. */
            String name,
            /**
             * Category of income event: {@code COUPON} (bond interest),
             * {@code INCOME} (dividend/rent/harvest yield), or {@code MATURITY}
             * (bond principal redemption).
             */
            String eventType,
            /** Payment date (past for PAID, future for SCHEDULED). */
            LocalDate paymentDate,
            /** Number of units the user held at payment time (or currently, for SCHEDULED). */
            BigDecimal unitsHeld,
            /** Gross income amount per unit before IRCM withholding. */
            BigDecimal grossAmountPerUnit,
            /** IRCM withheld per unit (0 if exempt or not applicable). */
            BigDecimal ircmWithheldPerUnit,
            /** Net income amount per unit after IRCM withholding. */
            BigDecimal netAmountPerUnit,
            /** Total gross amount for all units held (grossAmountPerUnit × unitsHeld). */
            BigDecimal totalGross,
            /** Total IRCM withheld for all units held. */
            BigDecimal totalIrcmWithheld,
            /** Total net cash received or expected (totalGross − totalIrcmWithheld). */
            BigDecimal totalNet,
            /** Whether IRCM withholding was exempt for this event. */
            boolean ircmExempt,
            /** Lifecycle state: {@code PAID} for confirmed past payments, {@code SCHEDULED} for future events. */
            String status
    ) {}

    /**
     * Aggregate summary of all income events across the user's complete history,
     * not limited to the current page.
     */
    @Schema(description = "Aggregate income totals across the user's full income history.")
    public record UserIncomeSummary(
            /** Sum of all net amounts from PAID events. */
            BigDecimal totalPaid,
            /** Sum of all projected net amounts from SCHEDULED future events. */
            BigDecimal totalScheduled,
            /** Sum of all IRCM amounts withheld from PAID events. */
            BigDecimal totalIrcmWithheld
    ) {}
}
