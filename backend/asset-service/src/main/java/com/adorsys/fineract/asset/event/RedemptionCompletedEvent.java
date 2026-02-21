package com.adorsys.fineract.asset.event;

import java.math.BigDecimal;

/**
 * Published after a bond principal redemption is completed for a holder.
 */
public record RedemptionCompletedEvent(
        Long userId,
        String assetId,
        String assetSymbol,
        BigDecimal units,
        BigDecimal cashAmount
) implements AssetServiceEvent {}
