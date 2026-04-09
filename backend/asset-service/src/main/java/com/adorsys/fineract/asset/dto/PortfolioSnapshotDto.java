package com.adorsys.fineract.asset.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * A single end-of-day portfolio value snapshot, representing one data point on the
 * portfolio history chart.
 *
 * <p>Used inside {@link PortfolioHistoryResponse}. Historical snapshots are computed
 * using the closing prices on each date; today's snapshot uses live prices. All monetary
 * amounts are in the settlement currency (XAF).
 *
 * <p>The relationship between fields:
 * {@code unrealizedPnl = totalValue - totalCostBasis}.
 */
public record PortfolioSnapshotDto(

    /**
     * Calendar date this snapshot represents, in the market timezone (WAT).
     * For historical dates this is midnight-to-midnight; for today it is the current moment
     * at query time.
     */
    LocalDate date,

    /**
     * Total market value of all positions held at the end of this day, in XAF.
     * Calculated as the sum of {@code (units × closing price)} for each position.
     * This is the primary y-axis value plotted on the portfolio chart.
     */
    BigDecimal totalValue,

    /**
     * Total cost basis of all positions on this date, in XAF.
     * Sum of the weighted average purchase cost for each open position.
     * Plotting this alongside {@code totalValue} gives a break-even reference line.
     */
    BigDecimal totalCostBasis,

    /**
     * Aggregate unrealized profit or loss on this date, in XAF.
     * Formula: {@code totalValue - totalCostBasis}.
     * Positive values indicate the portfolio is above its purchase cost; negative below.
     */
    BigDecimal unrealizedPnl,

    /**
     * Number of distinct asset positions held on this date.
     * Zero means the user had fully liquidated or had not yet made any trades by this date.
     */
    int positionCount

) {}
