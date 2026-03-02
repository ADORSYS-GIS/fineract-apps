package com.adorsys.fineract.asset.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

/**
 * Admin request to manually set or update an asset's price.
 */
public record SetPriceRequest(
    /** New reference price per unit, in settlement currency. Must be positive. */
    @NotNull @Positive BigDecimal price,
    /** Optional: new LP bid price (what sellers receive). Null to keep current. */
    @Positive BigDecimal bidPrice,
    /** Optional: new LP ask price (what buyers pay). Null to keep current. */
    @Positive BigDecimal askPrice,
    /** Optional: switch the price mode (AUTO or MANUAL). If null, keeps current mode. */
    PriceMode priceMode
) {}
