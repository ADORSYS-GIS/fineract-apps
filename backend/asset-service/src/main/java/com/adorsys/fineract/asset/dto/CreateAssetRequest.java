package com.adorsys.fineract.asset.dto;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Request to create a new asset. Triggers Fineract provisioning.
 */
public record CreateAssetRequest(
    @NotBlank String name,
    @NotBlank @Size(max = 10) String symbol,
    @NotBlank @Size(max = 10) String currencyCode,
    @Size(max = 1000) String description,
    @Size(max = 500) String imageUrl,
    @NotNull AssetCategory category,
    @NotNull @Positive BigDecimal initialPrice,
    @NotNull @Positive BigDecimal totalSupply,
    @NotNull @Min(0) @Max(8) Integer decimalPlaces,
    BigDecimal tradingFeePercent,
    BigDecimal spreadPercent,
    LocalDate expectedLaunchDate,
    @NotNull Long treasuryClientId
) {}
