package com.adorsys.fineract.asset.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

/**
 * Request to buy an asset.
 */
public record BuyRequest(
    @NotBlank String externalId,
    @NotBlank String assetId,
    @NotNull @Positive BigDecimal xafAmount,
    @NotNull Long userCashAccountId,
    Long userAssetAccountId
) {}
