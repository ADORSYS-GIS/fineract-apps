package com.adorsys.fineract.asset.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Schema(description = "Projected income calendar across a user's entire portfolio.")
public record IncomeCalendarResponse(
    List<IncomeEvent> events,
    List<MonthlyAggregate> monthlyTotals,
    BigDecimal totalExpectedIncome,
    Map<String, BigDecimal> totalByIncomeType
) {
    public record IncomeEvent(
        String assetId,
        String symbol,
        String assetName,
        /** COUPON, DIVIDEND, RENT, HARVEST_YIELD, PROFIT_SHARE, PRINCIPAL_REDEMPTION */
        String incomeType,
        LocalDate paymentDate,
        BigDecimal expectedAmount,
        BigDecimal units,
        BigDecimal rateApplied
    ) {}

    public record MonthlyAggregate(
        String month,
        BigDecimal totalAmount,
        int eventCount
    ) {}
}
