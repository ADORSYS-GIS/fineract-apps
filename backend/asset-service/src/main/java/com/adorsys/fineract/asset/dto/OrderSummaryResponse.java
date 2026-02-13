package com.adorsys.fineract.asset.dto;

/**
 * Summary counts of orders by resolution-relevant statuses.
 */
public record OrderSummaryResponse(
    long needsReconciliation,
    long failed,
    long manuallyClosed
) {}
