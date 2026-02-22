package com.adorsys.fineract.asset.dto;

import java.util.List;

/**
 * Historical price data for building charts. Contains a list of price points over a given period.
 */
public record PriceHistoryResponse(
    /** Internal asset identifier. */
    String assetId,
    /** Time period for the history: "1D", "1W", "1M", "3M", "1Y", or "ALL". */
    String period,
    /** Chronologically ordered list of price snapshots within the period. */
    List<PricePointDto> points
) {}
