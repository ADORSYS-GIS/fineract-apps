package com.adorsys.fineract.asset.dto;

import java.math.BigDecimal;

/**
 * Admin request to update an asset's metadata. Only non-null fields are applied (partial update).
 */
public record UpdateAssetRequest(
    /** New display name. Null to keep current. */
    String name,
    /** New description. Null to keep current. */
    String description,
    /** New image URL. Null to keep current. */
    String imageUrl,
    /** New category. Null to keep current. */
    AssetCategory category,
    /** New trading fee percentage (e.g. 0.005 = 0.5%). Null to keep current. */
    BigDecimal tradingFeePercent,
    /** New spread percentage (e.g. 0.01 = 1%). Null to keep current. */
    BigDecimal spreadPercent
) {}
