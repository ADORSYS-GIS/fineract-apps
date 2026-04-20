package com.adorsys.fineract.asset.dto;

/**
 * Current market open/closed state together with schedule metadata and countdown timers.
 *
 * <p>Returned by {@code GET /api/market/status}. The market operates Monday through Sunday,
 * 08:00–20:00 WAT (West Africa Time, {@code Africa/Douala}, UTC+1). All order placement
 * endpoints check this state before accepting a trade; orders submitted outside market hours
 * are either rejected (REJECTED status) or queued for the next open, depending on asset
 * configuration.
 *
 * <p>The two countdown fields ({@code secondsUntilClose} and {@code secondsUntilOpen}) are
 * mutually exclusive in practice: when the market is open, {@code secondsUntilOpen} is zero
 * and {@code secondsUntilClose} is positive; when closed, the reverse holds.
 */
public record MarketStatusResponse(

    /**
     * {@code true} if the market is currently within its operating hours and accepting orders;
     * {@code false} if the market is closed. Clients should poll this endpoint (or use the
     * countdown timers) to determine when to re-enable the trade button in the UI.
     */
    boolean isOpen,

    /**
     * Human-readable description of the trading schedule.
     * Example value: {@code "Mon-Sun 08:00-20:00 WAT"}.
     */
    String schedule,

    /**
     * Seconds remaining until the market closes today.
     * Zero when the market is already closed. Counts down to zero as closing time approaches.
     * Use this to display a "market closes in X" countdown on the trading UI.
     */
    long secondsUntilClose,

    /**
     * Seconds remaining until the market opens next.
     * Zero when the market is already open. When positive, this is the wait time until the
     * next opening — either later today (if it is before 08:00 WAT) or the following day
     * (if it is after 20:00 WAT).
     */
    long secondsUntilOpen,

    /**
     * IANA timezone identifier used for market hours calculation.
     * Always {@code "Africa/Douala"} (UTC+1, no DST). Included so clients can display
     * times in the canonical market timezone without hardcoding it.
     */
    String timezone

) {}
