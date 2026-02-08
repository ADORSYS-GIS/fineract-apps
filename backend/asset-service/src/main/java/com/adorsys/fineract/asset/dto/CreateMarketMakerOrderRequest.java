package com.adorsys.fineract.asset.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

/**
 * Request to place a market maker order on the order book.
 */
public record CreateMarketMakerOrderRequest(
    @NotNull @Positive BigDecimal price,
    @NotNull @Positive BigDecimal quantity,
    @NotNull TradeSide side
) {}
