package com.adorsys.fineract.asset.dto;

/**
 * Direction of a trade from the investor's perspective.
 *
 * <p>Used in {@link QuoteRequest} and {@link QuoteResponse} to determine which LP price
 * applies, how taxes are calculated, and whether inventory or cash balance checks are needed.</p>
 */
public enum TradeSide {
    /**
     * The investor is purchasing asset units by paying XAF cash.
     * The execution price is the LP ask price. Inventory availability is checked.
     * Capital gains tax does not apply on BUY.
     */
    BUY,

    /**
     * The investor is selling asset units to receive XAF cash.
     * The execution price is the LP bid price. The holder's available units are checked.
     * Capital gains tax applies when the sale price exceeds the average acquisition cost.
     */
    SELL
}
