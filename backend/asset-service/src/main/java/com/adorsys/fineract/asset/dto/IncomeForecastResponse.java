package com.adorsys.fineract.asset.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Income distribution obligation forecast returned by the admin treasury forecast endpoint
 * ({@code GET /admin/assets/{id}/income-forecast}). Shows the LP's upcoming payout
 * liability for a non-bond income asset and whether the current treasury cash balance
 * is sufficient to cover it. Used for liquidity planning before each distribution date.
 *
 * <p>Unlike the bond coupon forecast ({@link CouponForecastResponse}), income
 * distributions for non-bond assets do not have a fixed number of remaining periods —
 * they continue indefinitely until the asset is delisted. The forecast therefore focuses
 * on a single upcoming period rather than the cumulative lifetime obligation. All monetary
 * amounts are in XAF.</p>
 */
@Schema(description = "Income distribution forecast showing per-period obligation and treasury coverage.")
public record IncomeForecastResponse(
    /** Internal identifier of the asset this forecast covers. */
    String assetId,
    /** Ticker symbol of the asset (e.g. "BRVM"). */
    String symbol,
    /**
     * Type of income this asset distributes: DIVIDEND, RENT, HARVEST_YIELD, or PROFIT_SHARE.
     * Determines which regulatory rules and tax treatments apply to the payout.
     */
    String incomeType,
    /**
     * Annual income rate as a percentage (e.g. 8.0 = 8.0% per year). Applied to
     * {@code faceValue} (issuer price) per unit to compute each period's obligation.
     */
    BigDecimal incomeRate,
    /**
     * Distribution payment frequency in months (e.g. 3 = quarterly). Together with
     * {@code incomeRate} and {@code faceValue} determines the per-period cash outflow.
     */
    Integer distributionFrequencyMonths,
    /**
     * The next date on which income must be distributed to holders. If this date
     * is imminent and the treasury balance is insufficient, urgent action is required.
     */
    LocalDate nextDistributionDate,
    /**
     * Total outstanding units currently held by all investors. Used as the multiplier
     * for computing the total per-period payout obligation.
     */
    BigDecimal totalUnitsOutstanding,
    /**
     * The issuer price per unit in XAF used as the base for income calculations.
     * For non-bond income assets, the income rate is applied to this fixed price
     * (not the fluctuating market price) to ensure predictable LP liability.
     */
    @Schema(description = "Face value (issuer price) used for income calculation")
    BigDecimal faceValue,
    /**
     * Total XAF payout obligation for the upcoming distribution period across all holders.
     * Computed as: {@code totalUnitsOutstanding × faceValue × (incomeRate/100) × (distributionFrequencyMonths/12)}.
     * This is the cash the LP must have available by {@code nextDistributionDate}.
     */
    BigDecimal incomePerPeriod,
    /**
     * Current XAF balance in the LP's dedicated treasury cash account for this asset
     * ({@code lpCashAccountId}). Sourced from Fineract at query time.
     */
    @Schema(description = "Balance of this asset's dedicated treasury cash account")
    BigDecimal lpCashBalance,
    /**
     * Funding gap in XAF: {@code incomePerPeriod - lpCashBalance}. A positive value means
     * the treasury does not have enough cash to cover the next distribution and the LP
     * must top up before {@code nextDistributionDate}. Zero or negative means fully funded.
     */
    BigDecimal shortfall,
    /**
     * Number of upcoming distribution periods the current treasury balance can fully fund,
     * computed as: {@code floor(lpCashBalance / incomePerPeriod)}. A value of zero means
     * the LP cannot fund even the next single period from the current balance.
     */
    Integer periodsCoveredByBalance
) {}
