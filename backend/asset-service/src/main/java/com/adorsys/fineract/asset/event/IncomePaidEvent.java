package com.adorsys.fineract.asset.event;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Published after an income distribution (dividend, rent, yield) is paid to a holder.
 */
public record IncomePaidEvent(
        Long userId,
        String assetId,
        String assetSymbol,
        String incomeType,
        BigDecimal cashAmount,
        LocalDate distributionDate
) implements AssetServiceEvent {}
