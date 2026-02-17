package com.adorsys.fineract.asset.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;
import java.time.LocalDate;

@Schema(description = "Bond coupon obligation forecast showing remaining liabilities and treasury coverage.")
public record CouponForecastResponse(
    String assetId,
    String symbol,
    BigDecimal interestRate,
    Integer couponFrequencyMonths,
    LocalDate maturityDate,
    LocalDate nextCouponDate,
    BigDecimal totalUnitsOutstanding,
    BigDecimal faceValuePerUnit,
    BigDecimal couponPerPeriod,
    Integer remainingCouponPeriods,
    BigDecimal totalRemainingCouponObligation,
    BigDecimal principalAtMaturity,
    BigDecimal totalObligation,
    BigDecimal treasuryBalance,
    BigDecimal shortfall,
    Integer couponsCoveredByBalance
) {}
