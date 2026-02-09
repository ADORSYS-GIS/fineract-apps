package com.adorsys.fineract.asset.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

/**
 * Request to mint additional supply for an asset.
 */
public record MintSupplyRequest(
    @NotNull @Positive BigDecimal additionalSupply
) {}
