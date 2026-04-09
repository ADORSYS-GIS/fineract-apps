package com.adorsys.fineract.asset.dto;

import java.math.BigDecimal;
import java.util.List;

/**
 * Aggregated performance metrics for the Liquidity Provider (LP) operation,
 * compiled from the trade log across all assets and all LP clients.
 *
 * <p>Returned by the admin LP performance endpoint. All monetary amounts are in the
 * settlement currency (XAF). The report covers the full trade history unless the
 * endpoint supports date-range filtering.
 *
 * <p>The top-level fields give an overall view; {@code perAsset} breaks the same numbers
 * down by instrument, and {@code perLP} shows the funding and balance state for each
 * registered LP client account.
 */
public record LPPerformanceResponse(

    /**
     * Total spread revenue earned by the LP across all trades, in XAF.
     * Spread is the difference between ask price (buyer pays) and bid price (seller receives).
     * Formula per trade: {@code spreadAmount = (askPrice - bidPrice) × units}.
     */
    BigDecimal totalSpreadEarned,

    /**
     * Total buyback premium paid by the LP on SELL trades, in XAF.
     * A premium arises when the bid price exceeds the original issue price, meaning the LP
     * pays more to buy back units than it originally received for them.
     */
    BigDecimal totalBuybackPremiumPaid,

    /**
     * Total fee commission collected from users across all trades, in XAF.
     * Includes platform service fees deducted at order execution time.
     */
    BigDecimal totalFeeCommission,

    /**
     * Net LP margin after subtracting buyback premiums from spread earned, in XAF.
     * Formula: {@code netMargin = totalSpreadEarned - totalBuybackPremiumPaid}.
     * Positive means the LP operation is profitable; negative indicates net loss.
     */
    BigDecimal netMargin,

    /**
     * Total number of executed trades (FILLED orders) included in this report.
     * Both BUY and SELL orders count toward this figure.
     */
    long totalTrades,

    /**
     * Per-asset breakdown of LP performance metrics.
     * Each entry in this list corresponds to one asset and contains the same revenue
     * and trade figures as the top-level totals, scoped to that instrument.
     */
    List<AssetPerformance> perAsset,

    /**
     * Balance and exposure summary for each individual LP client.
     * Shows the current GL account balances used to track LP obligations and settlements.
     */
    List<LPSummary> perLP

) {

    /**
     * LP performance metrics scoped to a single asset.
     * Mirrors the structure of the top-level {@link LPPerformanceResponse} for one instrument.
     */
    public record AssetPerformance(

        /** Internal asset identifier. */
        String assetId,

        /** Ticker symbol, e.g. "BRVM-BTA". */
        String symbol,

        /**
         * Total spread revenue earned from trades on this asset, in XAF.
         * See {@link LPPerformanceResponse#totalSpreadEarned()} for the spread formula.
         */
        BigDecimal spreadEarned,

        /**
         * Total buyback premium paid on SELL trades for this asset, in XAF.
         * See {@link LPPerformanceResponse#totalBuybackPremiumPaid()} for details.
         */
        BigDecimal buybackPremiumPaid,

        /**
         * Total fee commission collected on trades for this asset, in XAF.
         */
        BigDecimal feeCommission,

        /**
         * Net LP margin for this asset, in XAF.
         * Formula: {@code spreadEarned - buybackPremiumPaid}.
         */
        BigDecimal netMargin,

        /**
         * Number of FILLED orders (BUY + SELL) for this asset included in this report.
         */
        long tradeCount

    ) {}

    /**
     * Balance summary for a single LP client, showing current GL account values
     * and total unsettled obligations.
     */
    public record LPSummary(

        /** Fineract client ID of the LP account. */
        Long lpClientId,

        /** Display name of the LP client. */
        String lpClientName,

        /**
         * Current balance of the LP savings (LSAV) account, in XAF.
         * This is the LP's primary cash account used to fund BUY payouts.
         */
        BigDecimal lsavBalance,

        /**
         * Current balance of the LP spread income (LSPD) account, in XAF.
         * Spread revenue is posted here when trades are executed.
         */
        BigDecimal lspdBalance,

        /**
         * Current balance of the LP tax holding (LTAX) account, in XAF.
         * Holds tax amounts withheld from LP income pending remittance.
         */
        BigDecimal ltaxBalance,

        /**
         * Total value of outstanding obligations not yet settled, in XAF.
         * Includes payouts owed to sellers and fees owed to the platform that have not
         * yet been transferred out of the LP account.
         */
        BigDecimal unsettledTotal,

        /**
         * Number of distinct assets for which this LP client has active positions or obligations.
         */
        int assetCount

    ) {}
}
