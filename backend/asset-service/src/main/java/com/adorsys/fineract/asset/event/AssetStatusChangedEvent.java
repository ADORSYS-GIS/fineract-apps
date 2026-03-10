package com.adorsys.fineract.asset.event;

import com.adorsys.fineract.asset.dto.AssetStatus;

/**
 * Published when an asset's status changes (PENDING→ACTIVE, ACTIVE→HALTED, etc.).
 * userId is null for broadcast events (all holders are notified).
 */
public record AssetStatusChangedEvent(
        Long userId,
        String assetId,
        String assetSymbol,
        AssetStatus oldStatus,
        AssetStatus newStatus
) implements AssetServiceEvent {}
