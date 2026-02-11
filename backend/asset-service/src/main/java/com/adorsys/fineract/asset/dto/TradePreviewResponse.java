package com.adorsys.fineract.asset.dto;

import java.math.BigDecimal;
import java.util.List;

/**
 * Response from a trade preview. Contains a price quote and feasibility check.
 * If {@code feasible} is false, the {@code blockers} list explains why.
 */
public record TradePreviewResponse(
    /** Whether the trade can be executed right now. */
    boolean feasible,
    /** List of blocker codes if not feasible, e.g. ["MARKET_CLOSED", "INSUFFICIENT_FUNDS"]. */
    List<String> blockers,
    String assetId,
    String assetSymbol,
    TradeSide side,
    BigDecimal units,
    /** Raw price from pricing service before spread. */
    BigDecimal basePrice,
    /** Execution price after spread adjustment. */
    BigDecimal executionPrice,
    BigDecimal spreadPercent,
    /** units x executionPrice */
    BigDecimal grossAmount,
    /** grossAmount x feePercent */
    BigDecimal fee,
    BigDecimal feePercent,
    /** Spread amount in XAF. Zero if spread is disabled. */
    BigDecimal spreadAmount,
    /** BUY: grossAmount + fee (total charged). SELL: grossAmount - fee (net proceeds). */
    BigDecimal netAmount,
    /** User's available XAF balance, null if could not resolve. */
    BigDecimal availableBalance,
    /** User's held units for this asset (SELL only), null for BUY. */
    BigDecimal availableUnits,
    /** Remaining asset inventory (BUY only), null for SELL. */
    BigDecimal availableSupply
) {}
