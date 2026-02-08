package com.adorsys.fineract.asset.dto;

import java.util.List;

/**
 * Price history for charts.
 */
public record PriceHistoryResponse(
    String assetId,
    String period,
    List<PricePointDto> points
) {}
