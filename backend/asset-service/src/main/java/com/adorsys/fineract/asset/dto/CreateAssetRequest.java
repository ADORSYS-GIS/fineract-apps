package com.adorsys.fineract.asset.dto;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Admin request to create a new asset. Triggers Fineract savings product provisioning.
 */
public record CreateAssetRequest(
    /** Human-readable display name for the asset. */
    @NotBlank String name,
    /** Short ticker symbol, e.g. "BRVM". Max 10 characters, must be unique. */
    @NotBlank @Size(max = 10) String symbol,
    /** ISO-style currency code for the Fineract savings product, e.g. "BRV". Max 10 characters, must be unique. */
    @NotBlank @Size(max = 10) String currencyCode,
    /** Optional long-form description. Max 1000 characters. */
    @Size(max = 1000) String description,
    /** Optional URL to the asset's logo or image. Max 500 characters. */
    @Size(max = 500) String imageUrl,
    /** Classification: REAL_ESTATE, COMMODITIES, AGRICULTURE, STOCKS, or CRYPTO. */
    @NotNull AssetCategory category,
    /** Starting price per unit, in XAF. Must be positive. Used as the initial manual price. */
    @NotNull @Positive BigDecimal initialPrice,
    /** Maximum total units that can ever exist. Must be positive. */
    @NotNull @Positive BigDecimal totalSupply,
    /** Number of decimal places for fractional units (0 = whole units only, max 8). */
    @NotNull @Min(0) @Max(8) Integer decimalPlaces,
    /** Optional trading fee as a percentage (e.g. 0.005 = 0.5%). Null means no fee. */
    BigDecimal tradingFeePercent,
    /** Optional bid-ask spread as a percentage (e.g. 0.01 = 1%). Null means no spread. */
    BigDecimal spreadPercent,
    /** Optional planned launch date. If set, asset starts in PENDING status until this date. */
    LocalDate expectedLaunchDate,
    /** Fineract client ID of the treasury that will hold this asset's reserves. */
    @NotNull Long treasuryClientId
) {}
