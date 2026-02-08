package com.adorsys.fineract.asset.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

/**
 * Request to manually set an asset's price.
 */
public record SetPriceRequest(
    @NotNull @Positive BigDecimal price,
    PriceMode priceMode
) {}
