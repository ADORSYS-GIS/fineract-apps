package com.adorsys.fineract.asset.dto;

import java.math.BigDecimal;

/**
 * Single holding entry matching the customer "Holdings" view.
 * Shows: Name, Supply (units), Total Value (XAF), Status (% change).
 */
public record HoldingResponse(
    /** Internal asset identifier. */
    String assetId,
    /** Human-readable asset name. */
    String name,
    /** Ticker symbol, e.g. "BRVM". */
    String symbol,
    /** Number of units the user holds of this asset. */
    BigDecimal supply,
    /** Current market value of the holding: supply × currentPrice, in XAF. */
    BigDecimal totalValue,
    /** 24-hour price change percentage (e.g. 2.5 = +2.5%). */
    BigDecimal changePercent
) {}
