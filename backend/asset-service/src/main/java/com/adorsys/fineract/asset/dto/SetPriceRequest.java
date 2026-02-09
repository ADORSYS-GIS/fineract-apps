package com.adorsys.fineract.asset.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

/**
 * Admin request to manually set or update an asset's price.
 */
public record SetPriceRequest(
    /** New price per unit, in XAF. Must be positive. */
    @NotNull @Positive BigDecimal price,
    /** Optional: switch the price mode (AUTO or MANUAL). If null, keeps current mode. */
    PriceMode priceMode
) {}
