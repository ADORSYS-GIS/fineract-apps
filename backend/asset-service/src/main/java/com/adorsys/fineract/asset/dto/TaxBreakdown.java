package com.adorsys.fineract.asset.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;

/**
 * Tax breakdown for a trade quote, showing each tax type's rate and amount.
 */
public record TaxBreakdown(
    @Schema(description = "Registration duty rate (e.g. 0.02 = 2%).")
    BigDecimal registrationDutyRate,
    @Schema(description = "Registration duty amount in XAF.")
    BigDecimal registrationDutyAmount,
    @Schema(description = "Capital gains tax rate (e.g. 0.165 = 16.5%). Zero for BUY.", nullable = true)
    BigDecimal capitalGainsRate,
    @Schema(description = "Capital gains tax amount in XAF. Zero for BUY.", nullable = true)
    BigDecimal capitalGainsTaxAmount,
    @Schema(description = "Total tax amount (registration duty + capital gains).")
    BigDecimal totalTaxAmount,
    @Schema(description = "True if capital gains exemption was applied (annual gains < 500,000 XAF).")
    boolean capitalGainsExemptionApplied
) {}
