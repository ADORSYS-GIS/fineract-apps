package com.adorsys.fineract.asset.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Income benefit projections for non-bond assets (DIVIDEND, RENT, HARVEST_YIELD, PROFIT_SHARE).
 * Embedded in trade preview and portfolio responses. Null for bond assets and non-income assets.
 *
 * <p>Unlike bond coupons (which use fixed face value), income distributions are based on
 * current market price, so actual payouts vary over time. All projections here use the
 * current price at preview time.</p>
 */
public record IncomeBenefitProjection(
    /** Income type: DIVIDEND, RENT, HARVEST_YIELD, PROFIT_SHARE. */
    String incomeType,
    /** Annual income rate as a percentage (e.g. 5.0). */
    BigDecimal incomeRate,
    /** Distribution frequency in months (1, 3, 6, or 12). */
    Integer distributionFrequencyMonths,
    /** Next scheduled distribution date. */
    LocalDate nextDistributionDate,
    /** Projected income per period: units * price * (rate/100) * (months/12). */
    BigDecimal incomePerPeriod,
    /** Estimated annual income: incomePerPeriod * (12/months). */
    BigDecimal estimatedAnnualIncome,
    /** Estimated yield: (annualIncome / investmentCost) * 100. Null in portfolio context. */
    BigDecimal estimatedYieldPercent,
    /** Always true for non-bond income — payouts vary with market price. */
    boolean variableIncome
) {}
