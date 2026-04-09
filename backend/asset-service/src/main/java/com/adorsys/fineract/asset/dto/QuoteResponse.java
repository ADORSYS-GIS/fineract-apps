package com.adorsys.fineract.asset.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

/**
 * Response from {@code POST /api/orders/quote}.
 *
 * <p>Contains a price-locked order in {@code QUOTED} status with a full cost breakdown,
 * feasibility check, and investment projections. The quote is valid until {@code quoteExpiresAt};
 * the user must call {@code POST /api/orders/{orderId}/confirm} before that time to execute
 * the trade at the locked price. After expiry, the order moves to {@code EXPIRED} and cannot
 * be confirmed.</p>
 *
 * <p>All monetary amounts are in XAF unless otherwise noted.</p>
 */
public record QuoteResponse(
    /**
     * Unique identifier of the order created for this quote.
     * Use this to confirm ({@code POST /api/orders/{orderId}/confirm}) or
     * cancel ({@code DELETE /api/orders/{orderId}}) the trade.
     */
    String orderId,

    /**
     * Current lifecycle state of this order.
     * Always {@code QUOTED} for a freshly created quote.
     */
    OrderStatus status,

    /** Internal asset ID of the asset being traded. */
    String assetId,

    /** Ticker symbol of the asset (e.g. {@code "OTA_10Y_2034"}). */
    String assetSymbol,

    /** Trade direction: {@code BUY} or {@code SELL}. */
    TradeSide side,

    /**
     * Number of units to be traded.
     * For amount-based quotes, this is the maximum whole-unit count
     * that fits within the requested XAF budget.
     */
    BigDecimal units,

    /**
     * Price per unit locked for this quote, in XAF.
     * LP ask price for BUY orders; LP bid price for SELL orders.
     * Guaranteed to remain valid until {@code quoteExpiresAt}.
     */
    BigDecimal executionPrice,

    /**
     * LP margin per unit — the absolute difference between {@code executionPrice}
     * and the LP's acquisition cost ({@code issuerPrice}), in XAF.
     * Represents the LP's gross profit per unit on this trade.
     */
    BigDecimal lpMarginPerUnit,

    /**
     * Gross trade value before fees and taxes, in XAF.
     * Equals {@code units * executionPrice}.
     */
    BigDecimal grossAmount,

    /**
     * Platform trading fee for this order, in XAF.
     * Equals {@code grossAmount * feePercent}.
     */
    BigDecimal fee,

    /**
     * Trading fee rate as a decimal (e.g. {@code 0.005} = 0.5%).
     * Matches the asset's configured {@code tradingFeePercent}.
     */
    BigDecimal feePercent,

    /**
     * Ask/bid spread amount included in the execution price, in XAF.
     * Equals half the total spread applied symmetrically around the issuer price.
     * Zero when the spread is not separately itemized.
     */
    BigDecimal spreadAmount,

    /**
     * Accrued interest for COUPON bond (OTA) trades, in XAF.
     * Calculated from the last coupon date to today using the bond's day count convention
     * and annual interest rate. Added to the buyer's cost and the seller's proceeds.
     * Null for DISCOUNT bonds and non-bond assets.
     */
    BigDecimal accruedInterestAmount,

    /**
     * Total amount the user will pay (BUY) or receive (SELL), in XAF.
     * BUY: {@code grossAmount + fee + accruedInterestAmount + taxes}.
     * SELL: {@code grossAmount - fee + accruedInterestAmount - taxes}.
     */
    BigDecimal netAmount,

    /**
     * User's available XAF cash balance at the time the quote was created.
     * Used to determine {@code feasible} for BUY orders.
     * Null if the balance could not be resolved from Fineract.
     */
    BigDecimal availableBalance,

    /**
     * User's available units of this asset at the time the quote was created.
     * Relevant for SELL orders to verify the user can cover the trade. Null for BUY orders.
     */
    BigDecimal availableUnits,

    /**
     * Remaining LP inventory (units available for purchase) at the time the quote was created.
     * Relevant for BUY orders to verify supply. Null for SELL orders.
     */
    BigDecimal availableSupply,

    /**
     * Projected investment outcomes for bond assets.
     * Includes coupon schedule, total projected return, and annualized yield.
     * Null for non-bond assets.
     */
    BondBenefitProjection bondBenefit,

    /**
     * Projected income outcomes for non-bond income-bearing assets (dividend, rent, etc.).
     * Includes estimated periodic and annual income amounts.
     * Null for bond assets and assets with no income configuration.
     */
    IncomeBenefitProjection incomeBenefit,

    /**
     * The original XAF budget supplied in an amount-based quote request.
     * Null when the request used the unit-based mode ({@code units} was specified).
     */
    BigDecimal computedFromAmount,

    /**
     * The XAF amount left over after the maximum whole units are purchased,
     * in an amount-based BUY quote. Equals {@code computedFromAmount - netAmount}.
     * Null for unit-based quotes.
     */
    BigDecimal remainder,

    /**
     * UTC timestamp when this quote was created and the price was locked.
     */
    Instant quotedAt,

    /**
     * UTC timestamp when this quote expires.
     * The user must confirm before this time; after expiry the order cannot be executed.
     * Typically 30 seconds after {@code quotedAt}.
     */
    Instant quoteExpiresAt,

    /**
     * Advisory warning codes about this quote. Empty list when there are no warnings.
     * Example values: {@code "MARKET_CLOSED"} (order will queue until market reopens),
     * {@code "LOW_LIQUIDITY"} (limited inventory available).
     */
    List<String> warnings,

    /**
     * Itemized tax breakdown showing registration duty, capital gains tax, and TVA amounts.
     * Null when no taxes are configured for this asset.
     * The {@code totalTaxAmount} is reflected in {@code netAmount}.
     */
    TaxBreakdown taxBreakdown,

    /**
     * Whether this trade can proceed given the user's current balances.
     * For BUY: {@code availableBalance >= netAmount}.
     * For SELL: always {@code true} as long as {@code availableUnits >= units}.
     * When {@code false}, the order can still be created but will fail at execution
     * if the balance does not change before confirmation.
     */
    boolean feasible,

    /**
     * Human-readable explanation of why {@code feasible} is {@code false}.
     * Format: {@code "INSUFFICIENT_FUNDS: Required X XAF, Available Y XAF (shortfall: Z XAF)"}.
     * Null when {@code feasible} is {@code true}.
     */
    String feasibilityReason
) {}
