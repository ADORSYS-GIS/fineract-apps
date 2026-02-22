package com.adorsys.fineract.asset.dto;

import java.math.BigDecimal;

/**
 * Breakdown of portfolio allocation by asset category.
 */
public record CategoryAllocationResponse(
    String category,
    BigDecimal totalValue,
    BigDecimal percentage
) {}
