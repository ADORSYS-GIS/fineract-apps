package com.adorsys.fineract.asset.dto;

/**
 * Lightweight asset summary for filter dropdowns.
 */
public record AssetOptionResponse(String assetId, String symbol, String name) {
}
