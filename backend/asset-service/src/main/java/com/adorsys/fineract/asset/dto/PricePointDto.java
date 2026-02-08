package com.adorsys.fineract.asset.dto;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * Single point on a price history chart.
 */
public record PricePointDto(
    BigDecimal price,
    Instant timestamp
) {}
