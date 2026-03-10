package com.adorsys.fineract.asset.dto;

import java.math.BigDecimal;

public record ScheduledPaymentSummaryResponse(
    long pendingCount,
    long confirmedThisMonth,
    BigDecimal totalPaidThisMonth
) {}
