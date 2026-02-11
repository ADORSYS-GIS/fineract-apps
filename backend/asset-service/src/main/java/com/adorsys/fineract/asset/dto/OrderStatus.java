package com.adorsys.fineract.asset.dto;

/** Lifecycle status of a trade order. */
public enum OrderStatus {
    /** Order received, awaiting execution. */
    PENDING,
    /** Order is currently being processed (Fineract transfers in progress). */
    EXECUTING,
    /** Order successfully executed. All transfers completed. */
    FILLED,
    /** Order failed during execution (e.g. insufficient funds). */
    FAILED,
    /** Order rejected before execution (e.g. market closed, asset halted). */
    REJECTED,
    /** Order stuck in EXECUTING; may need manual verification against Fineract. */
    NEEDS_RECONCILIATION
}
