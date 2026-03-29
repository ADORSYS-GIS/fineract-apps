package com.adorsys.fineract.asset.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

/**
 * Request DTO for creating a settlement.
 */
public record SettlementRequest(
    @NotNull @Schema(description = "Settlement type: LP_PAYOUT, TAX_REMITTANCE, TRUST_REBALANCE, FEE_COLLECTION")
    String settlementType,

    @NotNull @Positive @Schema(description = "Settlement amount in XAF")
    BigDecimal amount,

    @Schema(description = "LP client ID (required for LP_PAYOUT and TAX_REMITTANCE)")
    Long lpClientId,

    @Schema(description = "Free-text description")
    String description,

    @Schema(description = "Source GL code (e.g. 4011 for LP Settlement)")
    String sourceGlCode,

    @Schema(description = "Destination GL code (e.g. 5011 for UBA Bank)")
    String destinationGlCode
) {}
