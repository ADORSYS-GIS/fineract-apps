package com.adorsys.fineract.asset.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

/**
 * Request to sell an asset. User identity and accounts are resolved from the JWT token.
 */
public record SellRequest(
    /** ID of the asset to sell. */
    @NotBlank String assetId,
    /** Number of asset units to sell. Must be positive, max 10M per trade. */
    @NotNull @Positive @DecimalMax("10000000") BigDecimal units
) {}
