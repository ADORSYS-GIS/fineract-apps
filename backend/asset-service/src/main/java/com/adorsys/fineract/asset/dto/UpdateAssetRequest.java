package com.adorsys.fineract.asset.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Admin request to update an asset's metadata. Only non-null fields are applied (partial update).
 */
public record UpdateAssetRequest(
    /** New display name. Null to keep current. */
    @Size(max = 200) String name,
    /** New description. Null to keep current. */
    @Size(max = 1000) String description,
    /** New image URL. Null to keep current. */
    @Size(max = 500) String imageUrl,
    /** New category. Null to keep current. */
    AssetCategory category,
    /** New trading fee percentage (e.g. 0.005 = 0.5%). Null to keep current. */
    @PositiveOrZero BigDecimal tradingFeePercent,
    /** New spread percentage (e.g. 0.01 = 1%). Null to keep current. */
    @PositiveOrZero BigDecimal spreadPercent,

    /** New subscription start date. Null to keep current. */
    @Schema(description = "New subscription start date.")
    LocalDate subscriptionStartDate,
    /** New subscription end date. Null to keep current. */
    @Schema(description = "New subscription end date.")
    LocalDate subscriptionEndDate,
    /** New capital opened percentage. Null to keep current. */
    @Schema(description = "New capital opened percentage.")
    @PositiveOrZero BigDecimal capitalOpenedPercent,

    // ── Bond-specific updatable fields ──

    /** New annual coupon rate as percentage. Null to keep current. */
    @Schema(description = "New annual coupon interest rate as percentage.")
    @PositiveOrZero BigDecimal interestRate,
    /** New maturity date. Null to keep current. */
    @Schema(description = "New bond maturity date.")
    LocalDate maturityDate
) {}
