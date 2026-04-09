package com.adorsys.fineract.asset.dto;

/**
 * Request body for updating a user's notification preferences, sent to
 * {@code PUT /api/users/notification-preferences}.
 *
 * <p>Each field is a boolean toggle for a specific notification event type.
 * Null means "leave this preference unchanged" — only non-null fields are applied.
 * All preferences default to {@code true} when a user account is first created.</p>
 *
 * <p>Notifications are delivered via the configured channels (in-app, email, or SMS)
 * based on separate channel preferences not managed by this request.</p>
 */
public record UpdateNotificationPreferencesRequest(
    /**
     * Whether to notify the user when a trade order they placed is executed.
     * Covers both BUY and SELL orders that complete successfully.
     * Null to leave current preference unchanged.
     */
    Boolean tradeExecuted,

    /**
     * Whether to notify the user when a coupon payment is credited to their account.
     * Applies only to users holding COUPON bond positions.
     * Null to leave current preference unchanged.
     */
    Boolean couponPaid,

    /**
     * Whether to notify the user when principal redemption at bond maturity is completed.
     * Applies only to users holding positions in bonds that have reached maturity.
     * Null to leave current preference unchanged.
     */
    Boolean redemptionCompleted,

    /**
     * Whether to notify the user when the status of an asset they hold changes
     * (e.g. from {@code ACTIVE} to {@code SUSPENDED} or {@code DELISTED}).
     * Null to leave current preference unchanged.
     */
    Boolean assetStatusChanged,

    /**
     * Whether to notify the user when one of their orders is stuck in a pending state
     * for longer than the expected processing window.
     * Null to leave current preference unchanged.
     */
    Boolean orderStuck,

    /**
     * Whether to notify the user when an income distribution (dividend, rent, etc.)
     * is credited to their account from a non-bond income-bearing asset.
     * Null to leave current preference unchanged.
     */
    Boolean incomePaid,

    /**
     * Admin-only preference: whether to notify when the treasury balance falls
     * below the minimum reserve threshold required to cover pending payouts.
     * Ignored for non-admin users.
     * Null to leave current preference unchanged.
     */
    Boolean treasuryShortfall,

    /**
     * Whether to notify the user when an asset they hold is announced for delisting.
     * Users receive this notification ahead of the actual delisting date to allow
     * them to decide whether to sell their position.
     * Null to leave current preference unchanged.
     */
    Boolean delistingAnnounced
) {}
