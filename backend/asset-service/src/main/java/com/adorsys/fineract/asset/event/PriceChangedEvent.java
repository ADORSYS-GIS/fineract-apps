package com.adorsys.fineract.asset.event;

import java.math.BigDecimal;

/**
 * Published when an admin manually changes an asset's price via the setPrice API.
 * Creates an admin-visible notification with before/after price details.
 */
public record PriceChangedEvent(
        String assetId,
        String assetSymbol,
        BigDecimal oldAskPrice,
        BigDecimal newAskPrice,
        BigDecimal oldBidPrice,
        BigDecimal newBidPrice,
        BigDecimal changePercent,
        String adminSubject
) implements AssetServiceEvent {
}
