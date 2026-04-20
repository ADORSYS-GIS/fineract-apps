package com.adorsys.fineract.asset.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Projected financial benefit of holding a non-bond income-generating asset
 * (DIVIDEND, RENT, HARVEST_YIELD, PROFIT_SHARE), embedded in trade preview responses
 * ({@code POST /orders/preview}) and portfolio position responses. Complements
 * {@link BondBenefitProjection}, which covers fixed-income bonds.
 *
 * <p>Unlike bond coupons — which are calculated on a fixed {@code faceValue} and
 * thus predictable — non-bond income distributions are based on the current market
 * price per unit at the time of each distribution. This means actual payouts will
 * vary as the asset price changes, so all projections here should be treated as
 * estimates based on the price at the time the preview or portfolio snapshot was
 * generated. The {@code variableIncome} flag is always {@code true} to signal this
 * to the frontend. All monetary amounts are in XAF.</p>
 *
 * <p>Fields marked "Null in portfolio context" are only populated during a trade
 * preview (where there is a new investment cost to compare against). In portfolio
 * responses the cost basis is from historical purchases, which is not modelled here.</p>
 */
public record IncomeBenefitProjection(
    /**
     * Category of income this asset distributes: DIVIDEND (equities), RENT (real estate),
     * HARVEST_YIELD (agriculture), or PROFIT_SHARE (funds).
     */
    String incomeType,
    /**
     * Annual income rate as a percentage of the market price per unit
     * (e.g. 8.0 = 8.0% per year). Applied to the current ask price, not a fixed face value,
     * so the absolute amount per unit changes as the price moves.
     */
    BigDecimal incomeRate,
    /**
     * How often income is distributed, in months. Common values: 1 (monthly),
     * 3 (quarterly), 6 (semi-annual), 12 (annual).
     */
    Integer distributionFrequencyMonths,
    /**
     * The next scheduled date on which income will be distributed to unit holders.
     * Advances by {@code distributionFrequencyMonths} after each successful run.
     */
    LocalDate nextDistributionDate,
    /**
     * Estimated income per distribution period for the given unit quantity, in XAF.
     * Computed as: {@code units × currentPrice × (incomeRate/100) × (distributionFrequencyMonths/12)}.
     * This is the primary figure shown to investors on the trade preview screen.
     */
    BigDecimal incomePerPeriod,
    /**
     * Estimated total income over a full year, in XAF:
     * {@code incomePerPeriod × (12 / distributionFrequencyMonths)}.
     * Normalised to annual so investors can compare assets with different frequencies.
     */
    BigDecimal estimatedAnnualIncome,
    /**
     * Estimated yield as a percentage: {@code (estimatedAnnualIncome / investmentCost) × 100}.
     * Null in portfolio context, where there is no new investment cost being modelled.
     */
    BigDecimal estimatedYieldPercent,
    /**
     * Always {@code true} for non-bond income assets, indicating that the per-period payout
     * is not fixed and will change as the asset price fluctuates. Rendered in the UI
     * as a disclaimer (e.g. "Income projections are estimates and may vary").
     */
    boolean variableIncome
) {}
