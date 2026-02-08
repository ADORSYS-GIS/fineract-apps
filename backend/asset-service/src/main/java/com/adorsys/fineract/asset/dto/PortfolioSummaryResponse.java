package com.adorsys.fineract.asset.dto;

import java.math.BigDecimal;
import java.util.List;

/**
 * Full portfolio summary with all positions.
 */
public record PortfolioSummaryResponse(
    BigDecimal totalValue,
    BigDecimal totalCostBasis,
    BigDecimal unrealizedPnl,
    BigDecimal unrealizedPnlPercent,
    List<PositionResponse> positions,
    List<HoldingResponse> holdings
) {}
