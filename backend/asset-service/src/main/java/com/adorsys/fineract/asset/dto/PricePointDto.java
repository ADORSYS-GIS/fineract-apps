package com.adorsys.fineract.asset.dto;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * Single data point on a price history chart.
 */
public record PricePointDto(
    /** Price of the asset at this point in time, in settlement currency. */
    BigDecimal price,
    /** Timestamp when this price was captured. */
    Instant timestamp
) {}
