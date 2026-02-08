package com.adorsys.fineract.asset.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

/**
 * Request to sell an asset.
 */
public record SellRequest(
    @NotBlank String externalId,
    @NotBlank String assetId,
    @NotNull @Positive BigDecimal units,
    String orderBookEntryId,
    @NotNull Long userCashAccountId,
    @NotNull Long userAssetAccountId
) {}
