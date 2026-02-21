package com.adorsys.fineract.asset.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;
import java.time.LocalDate;

@Schema(description = "Income distribution forecast showing per-period obligation and treasury coverage.")
public record IncomeForecastResponse(
    String assetId,
    String symbol,
    String incomeType,
    BigDecimal incomeRate,
    Integer distributionFrequencyMonths,
    LocalDate nextDistributionDate,
    BigDecimal totalUnitsOutstanding,
    BigDecimal currentPrice,
    BigDecimal incomePerPeriod,
    @Schema(description = "Balance of this asset's dedicated treasury cash account")
    BigDecimal treasuryBalance,
    BigDecimal shortfall,
    Integer periodsCoveredByBalance
) {}
