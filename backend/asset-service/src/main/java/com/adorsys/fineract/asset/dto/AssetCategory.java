package com.adorsys.fineract.asset.dto;

/**
 * Classification category for an asset listed on the platform. The category drives
 * UI grouping, portfolio allocation breakdowns, and income calculation logic
 * (e.g. only BONDS assets use the coupon/discount yield formulas; REAL_ESTATE
 * and AGRICULTURE assets typically use RENT or HARVEST_YIELD income types).
 *
 * <p>Used in {@link AssetResponse}, {@link AssetDetailResponse}, and the asset
 * creation/update request DTOs. Stored as a string column in the asset table.</p>
 */
public enum AssetCategory {
    /** Tokenized real estate properties — typically paired with a RENT income type. */
    REAL_ESTATE,
    /** Physical commodities such as gold or oil. Generally no periodic income. */
    COMMODITIES,
    /** Agricultural products and farmland tokens — typically paired with HARVEST_YIELD income. */
    AGRICULTURE,
    /** Equity shares and stock indices — typically paired with DIVIDEND income. */
    STOCKS,
    /** Cryptocurrency and digital assets. Generally no periodic income. */
    CRYPTO,
    /**
     * Fixed-income government or corporate bonds. Requires bond-specific fields
     * ({@code bondType}, {@code interestRate}, {@code maturityDate}, etc.) to be set.
     * The yield calculation path (COUPON vs DISCOUNT) is further controlled by {@link BondType}.
     */
    BONDS
}
