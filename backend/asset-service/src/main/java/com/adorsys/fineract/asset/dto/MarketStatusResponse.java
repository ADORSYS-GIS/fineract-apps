package com.adorsys.fineract.asset.dto;

/**
 * Current market status with trading schedule and countdown timers.
 * Market hours: 8AM-8PM WAT (Africa/Lagos).
 */
public record MarketStatusResponse(
    /** Whether the market is currently open for trading. */
    boolean isOpen,
    /** Human-readable schedule description, e.g. "Mon-Sun 08:00-20:00 WAT". */
    String schedule,
    /** Seconds remaining until market closes. Zero if market is already closed. */
    long secondsUntilClose,
    /** Seconds remaining until market opens. Zero if market is already open. */
    long secondsUntilOpen,
    /** Timezone ID, e.g. "Africa/Lagos". */
    String timezone
) {}
