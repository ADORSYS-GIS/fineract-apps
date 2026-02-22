package com.adorsys.fineract.asset.event;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Published when a treasury shortfall is detected — the treasury balance
 * cannot cover an upcoming coupon or income payment.
 * Targeted at admin users (userId = null for broadcast to admins).
 */
public record TreasuryShortfallEvent(
        Long userId,
        String assetId,
        String assetSymbol,
        BigDecimal treasuryBalance,
        BigDecimal obligationAmount,
        BigDecimal shortfall,
        LocalDate paymentDueDate
) implements AssetServiceEvent {}
