package com.adorsys.fineract.asset.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

/**
 * Request to buy an asset. User identity and accounts are resolved from the JWT token.
 */
public record BuyRequest(
    @NotBlank String assetId,
    @NotNull @Positive BigDecimal units
) {}
