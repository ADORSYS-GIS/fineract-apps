package com.adorsys.fineract.asset.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

/**
 * Request to preview a trade without executing it.
 */
public record TradePreviewRequest(
    @NotBlank String assetId,
    @NotNull TradeSide side,
    @NotNull @Positive @DecimalMax("10000000") BigDecimal units
) {}
