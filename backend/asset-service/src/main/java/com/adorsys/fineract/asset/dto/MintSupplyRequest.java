package com.adorsys.fineract.asset.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

/**
 * Admin request to mint (create) additional supply for an existing asset.
 * Increases totalSupply by the specified amount.
 */
public record MintSupplyRequest(
    /** Number of additional units to mint. Must be positive. Added to the asset's totalSupply. */
    @NotNull @Positive BigDecimal additionalSupply
) {}
