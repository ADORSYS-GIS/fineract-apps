package com.adorsys.fineract.asset.dto;

import java.math.BigDecimal;

/**
 * Request to update asset metadata.
 */
public record UpdateAssetRequest(
    String name,
    String description,
    String imageUrl,
    AssetCategory category,
    BigDecimal tradingFeePercent,
    BigDecimal spreadPercent
) {}
