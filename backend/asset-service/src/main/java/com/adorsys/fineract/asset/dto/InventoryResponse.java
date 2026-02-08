package com.adorsys.fineract.asset.dto;

import java.math.BigDecimal;

/**
 * Supply/inventory stats for an asset.
 */
public record InventoryResponse(
    String assetId,
    String name,
    String symbol,
    AssetStatus status,
    BigDecimal totalSupply,
    BigDecimal circulatingSupply,
    BigDecimal availableSupply,
    BigDecimal currentPrice,
    BigDecimal totalValueLocked
) {}
