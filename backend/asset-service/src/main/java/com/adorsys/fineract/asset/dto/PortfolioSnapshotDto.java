package com.adorsys.fineract.asset.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * A single portfolio value snapshot for charting.
 */
public record PortfolioSnapshotDto(
    LocalDate date,
    BigDecimal totalValue,
    BigDecimal totalCostBasis,
    BigDecimal unrealizedPnl,
    int positionCount
) {}
