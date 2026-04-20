package com.adorsys.fineract.asset.dto;

/**
 * Lifecycle status of a trade order within the asset-service order state machine.
 *
 * <p>Valid transitions:
 * <pre>
 *   QUOTED ──────────────────────────────────────────────────┐
 *     │ (user confirms)                                       │ (TTL expired / user cancels)
 *     ▼                                                       ▼
 *   PENDING ──► QUEUED (market closed)                   CANCELLED
 *     │ (market opens or immediate)
 *     ▼
 *   EXECUTING ──► FILLED           (all Fineract transfers succeeded)
 *             ──► FAILED           (Fineract transfer rejected, e.g. insufficient funds)
 *             ──► REJECTED         (pre-execution validation failed, e.g. asset halted)
 *             ──► NEEDS_RECONCILIATION  (timeout in EXECUTING; requires admin review)
 *
 *   NEEDS_RECONCILIATION ──► MANUALLY_CLOSED  (admin resolves after investigation)
 * </pre>
 *
 * <p>Terminal states (no further automatic transitions): FILLED, FAILED, REJECTED,
 * MANUALLY_CLOSED, CANCELLED.
 */
public enum OrderStatus {

    /**
     * A price quote has been issued to the user and is awaiting their explicit confirmation.
     * The price is locked for a configurable TTL (typically 30–60 seconds). If the user does
     * not confirm within the TTL, the order moves to CANCELLED automatically.
     */
    QUOTED,

    /**
     * The user has confirmed the quote and the order is queued for execution.
     * The order will move to EXECUTING as soon as the execution worker picks it up.
     * This state is brief under normal conditions.
     */
    PENDING,

    /**
     * The order is currently being processed: Fineract account transfers (cash debit, unit credit,
     * fee deduction, LP disbursement) are in flight. If the service crashes or times out while
     * in this state, the order will be flagged as NEEDS_RECONCILIATION by the reconciliation job.
     */
    EXECUTING,

    /**
     * The order has been fully and successfully executed. All Fineract transfers completed,
     * the user's position has been updated, and the trade is recorded in the trade log.
     * This is the happy-path terminal state.
     */
    FILLED,

    /**
     * The order failed during execution, typically because a Fineract transfer was rejected
     * (e.g. insufficient funds in the user's account, LP account balance shortfall).
     * The {@code failureReason} field on the order record contains the specific cause.
     * No funds or units have been transferred when this status is set.
     */
    FAILED,

    /**
     * The order was rejected before execution began because a pre-execution validation failed.
     * Common reasons: the market was found closed at execution time, the asset was HALTED or
     * DELISTED, or available supply was exhausted between quote and confirmation.
     * No transfers are attempted; the user's funds are not debited.
     */
    REJECTED,

    /**
     * The order was stuck in EXECUTING state beyond the reconciliation timeout threshold.
     * The outcome of the Fineract transfers is unknown and requires manual verification.
     * Admin action is needed: confirm the transfer outcome in Fineract, then either manually
     * close the order (MANUALLY_CLOSED) or reprocess it.
     */
    NEEDS_RECONCILIATION,

    /**
     * The order was manually closed by an admin after investigation.
     * Typically follows NEEDS_RECONCILIATION once an admin has verified the Fineract transfer
     * outcome and recorded the resolution. The {@code resolvedBy} and {@code resolvedAt} fields
     * capture who closed it and when.
     */
    MANUALLY_CLOSED,

    /**
     * The order was placed outside market hours and is waiting for the next market open to execute.
     * Only applicable when the asset or platform is configured to accept off-hours order queuing
     * rather than immediately rejecting the order. Transitions to EXECUTING when the market opens.
     */
    QUEUED,

    /**
     * The order was cancelled by the user before execution began.
     * Can occur during the QUOTED state (before confirmation) or in PENDING/QUEUED states
     * if cancellation is permitted. No transfers are attempted.
     */
    CANCELLED
}
