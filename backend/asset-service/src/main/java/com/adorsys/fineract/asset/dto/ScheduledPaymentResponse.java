package com.adorsys.fineract.asset.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

public record ScheduledPaymentResponse(
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
    BigDecimal lpCashBalance
) {}
