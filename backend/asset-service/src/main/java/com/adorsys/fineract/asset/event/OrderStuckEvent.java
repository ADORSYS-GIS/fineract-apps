package com.adorsys.fineract.asset.event;

/**
 * Published when a stale order is detected (stuck in PENDING/EXECUTING for too long).
 */
public record OrderStuckEvent(
        Long userId,
        String assetId,
        String assetSymbol,
        String orderId,
        String orderStatus
) implements AssetServiceEvent {}
