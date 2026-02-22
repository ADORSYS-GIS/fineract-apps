package com.adorsys.fineract.asset.dto;

import java.math.BigDecimal;

/**
 * Detailed position for a single asset in a user's portfolio.
 */
public record PositionResponse(
    /** Internal asset identifier. */
    String assetId,
    /** Ticker symbol, e.g. "BRVM". */
    String symbol,
    /** Human-readable asset name. */
    String name,
    /** Number of units the user currently holds. */
    BigDecimal totalUnits,
    /** Weighted average purchase price per unit, in settlement currency. */
    BigDecimal avgPurchasePrice,
    /** Latest market price per unit, in settlement currency. */
    BigDecimal currentPrice,
    /** Current market value of the position: currentPrice × totalUnits, in settlement currency. */
    BigDecimal marketValue,
    /** Total amount spent to acquire this position: avgPurchasePrice × totalUnits, in settlement currency. */
    BigDecimal costBasis,
    /** Unrealized P&L: marketValue - costBasis, in settlement currency. Calculated at read time, not persisted. Positive = paper profit, negative = paper loss. */
    BigDecimal unrealizedPnl,
    /** Unrealized P&L as a percentage of costBasis (e.g. 10.0 = +10%). Zero if costBasis is zero. */
    BigDecimal unrealizedPnlPercent,
    /** Cumulative realized P&L from all completed SELL trades for this position, in settlement currency. Persisted in UserPosition. */
    BigDecimal realizedPnl,
    /** Bond benefit projections (coupon income, principal return). Null for non-bond assets. */
    BondBenefitProjection bondBenefit,
    /** Income benefit projections (dividend/rent/yield). Null for bonds and non-income assets. */
    IncomeBenefitProjection incomeBenefit
) {}
