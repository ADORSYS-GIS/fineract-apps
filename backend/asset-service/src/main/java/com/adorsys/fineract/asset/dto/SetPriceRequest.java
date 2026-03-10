package com.adorsys.fineract.asset.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

/**
 * Admin request to manually set or update an asset's price.
 */
public record SetPriceRequest(
    /** New LP ask price (what buyers pay), in settlement currency. Must be positive. */
    @NotNull @Positive BigDecimal askPrice,
    /** Optional: new LP bid price (what sellers receive). Null to auto-derive from ask price. */
    @Positive BigDecimal bidPrice,
    /** Optional: switch the price mode (AUTO or MANUAL). If null, keeps current mode. */
    PriceMode priceMode
) {}
