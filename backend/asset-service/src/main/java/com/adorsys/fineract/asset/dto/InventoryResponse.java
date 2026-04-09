package com.adorsys.fineract.asset.dto;

import java.math.BigDecimal;

/**
 * Supply and inventory statistics for a single asset, used on the admin inventory dashboard.
 *
 * <p>Returned by {@code GET /api/admin/inventory} (as a list) and
 * {@code GET /api/admin/inventory/{assetId}} (single asset). All monetary amounts are in
 * the settlement currency (XAF).
 *
 * <p>The three supply fields always satisfy:
 * {@code availableSupply = totalSupply - circulatingSupply}. When an order is filled on a
 * BUY, {@code circulatingSupply} increases and {@code availableSupply} decreases by the
 * traded unit count. The reverse applies on a SELL.
 */
public record InventoryResponse(

    /** Internal asset identifier (UUID string). Matches the {@code id} stored in the asset table. */
    String assetId,

    /** Human-readable asset name, e.g. "BRVM Treasury Bond 2026". */
    String name,

    /** Ticker symbol used on the trading platform, e.g. "BRVM-BTA". */
    String symbol,

    /**
     * Current lifecycle status of the asset.
     * Only ACTIVE assets can be traded. HALTED assets are visible but orders are rejected.
     * DELISTED assets are hidden from the public catalogue.
     */
    AssetStatus status,

    /**
     * Maximum total units that can ever exist for this asset, in asset units.
     * Set at creation time and can be increased by an admin mint operation
     * ({@code POST /api/admin/assets/{assetId}/mint}).
     * Never decreases.
     */
    BigDecimal totalSupply,

    /**
     * Units currently held by all users combined, in asset units.
     * Increases when a BUY order is filled; decreases when a SELL order is filled.
     * Always {@code <= totalSupply}.
     */
    BigDecimal circulatingSupply,

    /**
     * Units still available for purchase by new buyers, in asset units.
     * Always {@code = totalSupply - circulatingSupply}.
     * When this reaches zero, all BUY orders will be rejected until supply is minted.
     */
    BigDecimal availableSupply,

    /**
     * Current LP ask price — what a buyer pays per unit, in XAF.
     * Sourced from the latest price entry in the database (MANUAL price mode).
     */
    BigDecimal askPrice,

    /**
     * Total value locked in user hands: {@code circulatingSupply × askPrice}, in XAF.
     * Represents the aggregate market capitalisation held by platform users at the current price.
     * Recalculated at query time, not persisted.
     */
    BigDecimal totalValueLocked

) {}
