package com.adorsys.fineract.asset.dto;

import java.math.BigDecimal;

/**
 * Asset summary for the marketplace listing page.
 */
public record AssetResponse(
    /** Internal asset identifier. */
    String id,
    /** Human-readable asset name. */
    String name,
    /** Ticker symbol, e.g. "BRVM". */
    String symbol,
    /** URL to the asset's logo or image. */
    String imageUrl,
    /** Classification: REAL_ESTATE, COMMODITIES, AGRICULTURE, STOCKS, or CRYPTO. */
    AssetCategory category,
    /** Lifecycle status: PENDING, ACTIVE, HALTED, or DELISTED. */
    AssetStatus status,
    /** Latest price per unit, in XAF. */
    BigDecimal currentPrice,
    /** 24-hour price change as a percentage (e.g. 2.5 = +2.5%). */
    BigDecimal change24hPercent,
    /** Units available for purchase: totalSupply - circulatingSupply. */
    BigDecimal availableSupply,
    /** Maximum total units that can ever exist. */
    BigDecimal totalSupply
) {}
