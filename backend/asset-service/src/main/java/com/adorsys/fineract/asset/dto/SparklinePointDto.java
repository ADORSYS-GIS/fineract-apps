package com.adorsys.fineract.asset.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Single data point on a category sparkline chart.
 */
public record SparklinePointDto(
    LocalDate date,
    BigDecimal value
) {}
