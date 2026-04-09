package com.adorsys.fineract.asset.dto;

/**
 * Aggregate counts of orders in resolution-relevant statuses, used on the admin dashboard.
 *
 * <p>Returned by {@code GET /api/admin/orders/summary}. Provides at-a-glance totals so
 * admins can quickly see how many orders need attention without paginating through the full
 * order list.
 *
 * <p>Orders in FILLED, REJECTED, CANCELLED, QUOTED, PENDING, QUEUED, and EXECUTING states
 * are not counted here — those are either healthy terminal states or normal in-flight states.
 * Only states that represent an abnormal condition or completed manual intervention are surfaced.
 */
public record OrderSummaryResponse(

    /**
     * Number of orders currently in NEEDS_RECONCILIATION status.
     * These orders were stuck in EXECUTING and require an admin to verify the outcome
     * against Fineract and then manually close them. A non-zero count here indicates
     * outstanding work for the operations team.
     */
    long needsReconciliation,

    /**
     * Number of orders that ended in FAILED status.
     * Typically caused by insufficient funds or LP account shortfalls during execution.
     * Useful for monitoring the failure rate over time; does not require admin action
     * unless the user reports an issue or funds appear to have been partially transferred.
     */
    long failed,

    /**
     * Number of orders that have been manually closed by an admin (MANUALLY_CLOSED status).
     * Included here as a historical audit metric. These orders are already resolved and
     * require no further action.
     */
    long manuallyClosed

) {}
