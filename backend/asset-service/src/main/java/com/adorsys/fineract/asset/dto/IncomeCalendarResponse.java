package com.adorsys.fineract.asset.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

/**
 * Projected income calendar across the authenticated user's entire portfolio, returned
 * by {@code GET /portfolio/income-calendar}. Aggregates all upcoming coupon payments
 * (bond assets) and periodic income distributions (non-bond assets) into a unified
 * event list and monthly totals, giving investors a forward-looking cash flow view.
 *
 * <p>Events are projected based on the user's current positions, the configured payment
 * schedules of each asset, and the assumption that the user holds the same units until
 * each payment date. All amounts are in XAF and are estimates — actual payouts may
 * differ if the user buys or sells units before a payment date.</p>
 */
@Schema(description = "Projected income calendar across a user's entire portfolio.")
public record IncomeCalendarResponse(
    /**
     * Chronologically ordered list of individual income events across all portfolio assets.
     * Each event represents a single scheduled payment from one asset to this user.
     */
    List<IncomeEvent> events,
    /**
     * Monthly aggregation of projected income, useful for rendering a calendar heatmap
     * or monthly income chart. Each entry covers one calendar month.
     */
    List<MonthlyAggregate> monthlyTotals,
    /**
     * Sum of all expected income across all events in XAF, before IRCM withholding.
     * For the value the user will actually receive, see {@link #totalNetIncome}.
     */
    BigDecimal totalExpectedIncome,
    /**
     * Expected income broken down by income type in XAF. Keys are income type strings
     * (e.g. "COUPON", "DIVIDEND", "RENT") and values are the total projected income
     * from that type. Useful for showing income source composition.
     */
    Map<String, BigDecimal> totalByIncomeType,
    /**
     * Sum of {@link IncomeEvent#netAmount} across all events in XAF — the total net
     * cash that will land in the user's wallet after IRCM withholding over the forecast
     * horizon. Display this rather than {@link #totalExpectedIncome} to give an honest
     * "what you'll receive" headline.
     */
    BigDecimal totalNetIncome
) {

    /**
     * A single projected income event for one asset on one payment date.
     * The combination of {@code assetId} and {@code paymentDate} uniquely identifies
     * which payment schedule entry this event corresponds to.
     */
    public record IncomeEvent(
        /** Internal identifier of the asset generating this income event. */
        String assetId,
        /** Ticker symbol of the asset (e.g. "OTA2026"). */
        String symbol,
        /** Full name of the asset for display in the calendar UI. */
        String assetName,
        /**
         * Income classification for this event. One of: COUPON (bond interest),
         * DIVIDEND (equity), RENT (real estate), HARVEST_YIELD (agriculture),
         * PROFIT_SHARE (fund), or PRINCIPAL_REDEMPTION (bond maturity payback).
         */
        String incomeType,
        /** The date on which this income payment is scheduled to be distributed. */
        LocalDate paymentDate,
        /**
         * Projected XAF amount the user will receive for this event, based on current
         * unit holdings. Not adjusted for future price changes or tax withholding.
         */
        BigDecimal expectedAmount,
        /**
         * Number of units the user currently holds in this asset. Used as the multiplier
         * for the income calculation.
         */
        BigDecimal units,
        /**
         * The rate applied to compute {@code expectedAmount} for this event. For COUPON events
         * this is the annual coupon rate (e.g. 5.80). For income events this is the annual
         * income rate (e.g. 8.00). For PRINCIPAL_REDEMPTION this is null.
         * <p><strong>This is NOT the IRCM rate.</strong> Multiplying it against
         * {@code grossPerUnit} gives nonsensical IRCM amounts. Use {@code ircmPerUnit}
         * (already withholding-adjusted) when displaying tax breakdowns.
         */
        BigDecimal rateApplied,
        /**
         * Gross income per unit for this event in XAF, equal to
         * {@code expectedAmount / units}. Server-side derivation so the frontend does not
         * need to recompute it. Null only when {@code units} is null or zero.
         */
        BigDecimal grossPerUnit,
        /**
         * IRCM withholding per unit in XAF, computed as
         * {@code grossPerUnit × TaxService.getEffectiveIrcmRate(asset)}. Honours per-asset
         * IRCM overrides, government-bond exemptions, and the BVMAC rate, so the value
         * represents what the asset-service will actually withhold at distribution time.
         * Zero if IRCM is disabled or the asset is exempt.
         */
        BigDecimal ircmPerUnit,
        /**
         * Net income per unit credited to the holder, equal to
         * {@code grossPerUnit - ircmPerUnit}. Display this as the "you'll receive" value.
         */
        BigDecimal netPerUnit,
        /**
         * Total net XAF amount the user will receive for this event after IRCM withholding,
         * equal to {@code netPerUnit × units}. The headline number to show beside the
         * payment date.
         */
        BigDecimal netAmount
    ) {}

    /**
     * Aggregated income total for a single calendar month across all assets and income types.
     */
    public record MonthlyAggregate(
        /**
         * Month identifier in "YYYY-MM" format (e.g. "2026-06"). Used as the key
         * when mapping events to calendar cells in the frontend.
         */
        String month,
        /** Total projected XAF income from all events falling within this month. */
        BigDecimal totalAmount,
        /** Number of distinct income events scheduled within this month. */
        int eventCount
    ) {}
}
