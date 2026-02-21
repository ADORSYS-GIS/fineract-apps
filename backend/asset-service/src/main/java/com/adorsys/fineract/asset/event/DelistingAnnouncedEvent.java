package com.adorsys.fineract.asset.event;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Published when a delisting is initiated for an asset.
 * Notifies each holder that SELL is still allowed but BUY is blocked.
 */
public record DelistingAnnouncedEvent(
        Long userId,
        String assetId,
        String assetSymbol,
        LocalDate delistingDate,
        BigDecimal redemptionPrice
) implements AssetServiceEvent {}
