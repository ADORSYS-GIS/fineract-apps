package com.adorsys.fineract.asset.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

/**
 * Request to buy an asset. User identity and accounts are resolved from the JWT token.
 */
public record BuyRequest(
    /** ID of the asset to buy. */
    @NotBlank String assetId,
    /** Number of asset units to purchase. Must be positive, max 10M per trade. */
    @NotNull @Positive @DecimalMax("10000000") BigDecimal units
) {}
