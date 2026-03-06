package com.adorsys.fineract.asset.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

public record ScheduledPaymentDetailResponse(
    Long id,
    String assetId,
    String symbol,
    String assetName,
    String paymentType,
    LocalDate scheduleDate,
    String status,
    BigDecimal estimatedRate,
    BigDecimal estimatedAmountPerUnit,
    BigDecimal estimatedTotal,
    int holderCount,
    BigDecimal actualAmountPerUnit,
    String confirmedBy,
    Instant confirmedAt,
    String cancelledBy,
    Instant cancelledAt,
    String cancelReason,
    Integer holdersPaid,
    Integer holdersFailed,
    BigDecimal totalAmountPaid,
    Instant executedAt,
    Instant createdAt,
    BigDecimal lpCashBalance,
    List<HolderBreakdown> holders
) {
    public record HolderBreakdown(
        Long userId,
        BigDecimal units,
        BigDecimal estimatedPayment
    ) {}
}
