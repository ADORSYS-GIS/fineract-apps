package com.adorsys.fineract.asset.dto;

import java.util.List;

/**
 * Portfolio value history over a requested period.
 */
public record PortfolioHistoryResponse(
    String period,
    List<PortfolioSnapshotDto> snapshots
) {}
