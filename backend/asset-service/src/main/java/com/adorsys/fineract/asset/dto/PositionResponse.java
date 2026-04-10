package com.adorsys.fineract.asset.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;
import java.util.List;

/**
 * Detailed position for a single asset in a user's portfolio.
 *
 * <p><b>Price vs. value distinction:</b>
 * <ul>
 *   <li>{@code avgPurchasePrice} and {@code marketPrice} are <em>per-unit</em> prices.</li>
 *   <li>{@code costBasis} and {@code marketValue} are <em>total position</em> amounts
 *       derived by multiplying the per-unit price by {@code totalUnits}.</li>
 * </ul>
 *
 * <p><b>Example:</b> user bought 10 units at 1 000 XAF, then 10 more at 1 200 XAF:
 * <pre>
 *   avgPurchasePrice = 1 100  (weighted average)
 *   costBasis        = 1 100 × 20 = 22 000 XAF  (total spent)
 *   marketPrice      = 1 300  (current ask price)
 *   marketValue      = 1 300 × 20 = 26 000 XAF  (current worth)
 *   unrealizedPnl    = 26 000 - 22 000 = +4 000 XAF (paper profit)
 * </pre>
 */
public record PositionResponse(
    /** Internal asset identifier. */
    String assetId,

    /** Ticker symbol, e.g. "BRVM-TST". */
    String symbol,

    /** Human-readable asset name. */
    String name,

    /** Number of units the user currently holds. Decreases on SELL, increases on BUY. */
    BigDecimal totalUnits,

    /**
     * Weighted average purchase price per unit, in settlement currency (XAF).
     * Recalculated after every BUY using the formula:
     * {@code newAvg = (oldAvg × oldUnits + executionPrice × newUnits) / (oldUnits + newUnits)}.
     * Does NOT change on SELL — only the unit count decreases.
     * Multiply by {@code totalUnits} to get {@code costBasis}.
     */
    BigDecimal avgPurchasePrice,

    /**
     * Current market price per unit (ask price), in settlement currency (XAF).
     * Sourced from the latest LP price feed. This is what a new buyer would pay today.
     * Multiply by {@code totalUnits} to get {@code marketValue}.
     */
    BigDecimal marketPrice,

    /**
     * Current market value of the entire position, in settlement currency (XAF).
     * Formula: {@code marketPrice × totalUnits}.
     * Recalculated at read time — not persisted. Changes whenever the market price moves.
     */
    BigDecimal marketValue,

    /**
     * Total amount spent to acquire the current holdings, in settlement currency (XAF).
     * Formula: {@code avgPurchasePrice × totalUnits}.
     * This is the break-even value: if {@code marketValue > costBasis} the position is in profit.
     * Decreases proportionally when units are sold (FIFO lot consumption).
     */
    BigDecimal costBasis,

    /**
     * Unrealized (paper) profit or loss, in settlement currency (XAF).
     * Formula: {@code marketValue - costBasis}.
     * Positive = paper profit (market is above average purchase price).
     * Negative = paper loss (market is below average purchase price).
     * Calculated at read time — not persisted.
     */
    BigDecimal unrealizedPnl,

    /**
     * Unrealized P&amp;L expressed as a percentage of {@code costBasis}.
     * Formula: {@code (unrealizedPnl / costBasis) × 100}, e.g. {@code 18.18} means +18.18%.
     * Zero when {@code costBasis} is zero (no holdings yet).
     */
    BigDecimal unrealizedPnlPercent,

    /**
     * Cumulative realized profit or loss from all completed SELL trades for this position,
     * in settlement currency (XAF).
     * Calculated at execution time using FIFO lot matching and persisted in {@code UserPosition}.
     * Positive = net gain across all past sells; negative = net loss.
     */
    BigDecimal realizedPnl,

    /**
     * Accrued coupon interest per unit since last coupon date (XAF).
     * Zero for BTA/DISCOUNT bonds (no periodic coupons). Null for non-bond assets.
     */
    @Schema(description = "Accrued coupon interest per unit since last coupon date (XAF). Zero for BTA/DISCOUNT.", nullable = true)
    BigDecimal accruedInterestPerUnit,

    /**
     * Clean price per unit (bid price, excluding accrued coupon interest), in XAF.
     * This is the LP's buy-back price used for position valuation. Null for non-bond assets.
     */
    @Schema(description = "Clean price per unit (bid price, excluding accrued coupon).", nullable = true)
    BigDecimal cleanPrice,

    /**
     * Dirty price per unit = cleanPrice + accruedInterestPerUnit, in XAF.
     * Equals cleanPrice for DISCOUNT (BTA) bonds where accrued interest is zero.
     * Null for non-bond assets.
     */
    @Schema(description = "Dirty price = cleanPrice + accruedInterestPerUnit. Equals cleanPrice for BTA.", nullable = true)
    BigDecimal dirtyPrice,

    /**
     * Total accrued interest across all held units: accruedInterestPerUnit × totalUnits, in XAF.
     * Null for non-bond assets.
     */
    @Schema(description = "Total accrued interest across all held units.", nullable = true)
    BigDecimal totalAccruedInterest,

    /**
     * Current market value using the dirty price: dirtyPrice × totalUnits, in XAF.
     * Reflects the full settlement cost of the position including accrued interest.
     * Null for non-bond assets.
     */
    @Schema(description = "Current market value using dirty price: dirtyPrice × totalUnits.", nullable = true)
    BigDecimal dirtyMarketValue,

    /**
     * Bond-specific benefit projections (coupon income schedule, principal redemption at maturity).
     * Null for non-bond assets (equities, real-estate funds, etc.).
     */
    BondBenefitProjection bondBenefit,

    /**
     * Income-bearing asset projections (dividend, rent, harvest yield, profit-share).
     * Null for pure bond assets and non-income assets.
     */
    IncomeBenefitProjection incomeBenefit,

    /**
     * Full trade history for this position, sorted newest first (up to 200 entries).
     * Each entry is an {@link OrderResponse} and includes the complete amount breakdown:
     * {@code totalAmount} (net disbursed/received), {@code fee}, {@code registrationDutyAmount},
     * {@code capitalGainsTaxAmount}, {@code tvaAmount}, and {@code accruedInterestAmount}.
     * Empty list if the user has no orders for this asset.
     */
    List<OrderResponse> orders
) {}
