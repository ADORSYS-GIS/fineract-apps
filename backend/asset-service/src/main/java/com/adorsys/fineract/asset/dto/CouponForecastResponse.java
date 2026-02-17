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
    @Schema(description = "Total balance of the shared treasury cash account (may be shared with sibling bonds)")
    BigDecimal treasuryBalance,
    @Schema(description = "Portion of treasury balance allocated to this bond, proportional to its share of total obligations")
    BigDecimal allocatedTreasuryBalance,
    @Schema(description = "Number of sibling bonds sharing the same treasury cash account")
    Integer siblingBondCount,
    BigDecimal shortfall,
    Integer couponsCoveredByBalance
) {}
