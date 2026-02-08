package com.adorsys.fineract.asset.dto;

import java.math.BigDecimal;

/**
 * Single holding entry matching the customer "Holdings" view.
 * Shows: Name, Supply (units), Total Value (XAF), Status (% change).
 */
public record HoldingResponse(
    String assetId,
    String name,
    String symbol,
    BigDecimal supply,
    BigDecimal totalValue,
    BigDecimal changePercent
) {}
