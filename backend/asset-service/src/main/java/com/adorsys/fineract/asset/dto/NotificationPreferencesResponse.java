package com.adorsys.fineract.asset.dto;

/**
 * A user's current notification opt-in preferences for all supported event types.
 *
 * <p>Returned by {@code GET /api/notifications/preferences} for the authenticated user.
 * Updated via {@code PUT /api/notifications/preferences} using
 * {@link UpdateNotificationPreferencesRequest}.
 *
 * <p>Each field is a boolean flag: {@code true} means the user wants to receive
 * in-app (and optionally push) notifications for that event; {@code false} means
 * they have opted out. All flags default to {@code true} when a user account is created.
 *
 * <p>These preferences apply to in-app notifications only. Email notification settings
 * are managed separately.
 */
public record NotificationPreferencesResponse(

    /**
     * Whether to notify the user when a BUY or SELL order transitions to FILLED.
     * Covers both market-hours execution and dequeued orders from off-hours placement.
     */
    boolean tradeExecuted,

    /**
     * Whether to notify the user when a bond coupon payment is disbursed to their account.
     * Triggered after a scheduled coupon payment run completes for an asset they hold.
     */
    boolean couponPaid,

    /**
     * Whether to notify the user when a bond or fund position matures and the principal
     * (redemption proceeds) is returned to their account.
     */
    boolean redemptionCompleted,

    /**
     * Whether to notify the user when the lifecycle status of a held asset changes
     * (e.g. ACTIVE → HALTED, or ACTIVE → DELISTED). Allows the user to take action
     * before trading windows close.
     */
    boolean assetStatusChanged,

    /**
     * Whether to notify the user when one of their orders has been stuck in EXECUTING
     * state and flagged as NEEDS_RECONCILIATION. Prompts the user to contact support.
     */
    boolean orderStuck,

    /**
     * Whether to notify the user when an income distribution (dividend, rent, profit-share)
     * is paid out to their account from a held income-bearing asset.
     */
    boolean incomePaid,

    /**
     * Whether to notify the user (LP or admin role) when the treasury reserve falls below
     * the configured minimum threshold, triggering a rebalance warning.
     * Typically only meaningful for LP and admin accounts.
     */
    boolean treasuryShortfall,

    /**
     * Whether to notify the user when an asset they hold has a delisting announcement,
     * giving advance notice before the asset moves to DELISTED status.
     */
    boolean delistingAnnounced

) {}
