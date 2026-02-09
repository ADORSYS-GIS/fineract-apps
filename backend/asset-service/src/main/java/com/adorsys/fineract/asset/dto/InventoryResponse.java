package com.adorsys.fineract.asset.dto;

import java.math.BigDecimal;

/**
 * Supply and inventory statistics for an asset. Used by the admin inventory dashboard.
 */
public record InventoryResponse(
    /** Internal asset identifier. */
    String assetId,
    /** Human-readable asset name. */
    String name,
    /** Ticker symbol, e.g. "BRVM". */
    String symbol,
    /** Lifecycle status: PENDING, ACTIVE, HALTED, or DELISTED. */
    AssetStatus status,
    /** Maximum total units that can ever exist. */
    BigDecimal totalSupply,
    /** Units currently in circulation (held by users). */
    BigDecimal circulatingSupply,
    /** Units available for purchase: totalSupply - circulatingSupply. */
    BigDecimal availableSupply,
    /** Latest price per unit, in XAF. */
    BigDecimal currentPrice,
    /** Total value locked: circulatingSupply × currentPrice, in XAF. Represents the total market cap held by users. */
    BigDecimal totalValueLocked
) {}
