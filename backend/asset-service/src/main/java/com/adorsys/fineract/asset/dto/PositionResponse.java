package com.adorsys.fineract.asset.dto;

import java.math.BigDecimal;

/**
 * Detailed position for a single asset.
 */
public record PositionResponse(
    String assetId,
    String symbol,
    String name,
    BigDecimal totalUnits,
    BigDecimal avgPurchasePrice,
    BigDecimal currentPrice,
    BigDecimal marketValue,
    BigDecimal costBasis,
    BigDecimal unrealizedPnl,
    BigDecimal unrealizedPnlPercent,
    BigDecimal realizedPnl
) {}
