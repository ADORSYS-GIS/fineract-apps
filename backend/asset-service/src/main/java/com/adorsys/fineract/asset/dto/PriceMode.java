package com.adorsys.fineract.asset.dto;

/**
 * Determines how an asset's ask and bid prices are calculated or sourced.
 *
 * <p>Stored on the asset record and checked by the price service when producing
 * a {@link PriceResponse}. The mode controls which pricing path is taken at trade time.
 *
 * <p>Currently only one mode is supported. Additional modes (e.g. market-feed-driven
 * or formula-based pricing) may be added in future releases without breaking existing assets
 * that already use {@code MANUAL}.
 */
public enum PriceMode {

    /**
     * The asset's ask and bid prices are set explicitly by an admin via the
     * {@code POST /api/admin/assets/{assetId}/price} endpoint. No automated market-feed
     * or formula is used. Prices remain fixed until an admin updates them.
     *
     * <p>This is the only supported mode for the current MANUAL price-setting model used
     * by all assets on the platform (BTA bonds, equities, real-estate funds, etc.).
     * The last admin-set price is cached in Redis with a 1-minute TTL and falls back to
     * the database on cache miss.
     */
    MANUAL
}
