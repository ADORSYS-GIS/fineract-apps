package com.adorsys.fineract.asset.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

/**
 * Full asset detail including OHLC data, supply stats, fee configuration, and Fineract links.
 * Returned by the admin and customer asset detail endpoints.
 */
public record AssetDetailResponse(
    /** Internal asset identifier. */
    String id,
    /** Human-readable asset name. */
    String name,
    /** Ticker symbol, e.g. "BRVM". */
    String symbol,
    /** ISO-style currency code for this asset in Fineract, e.g. "BRV". */
    String currencyCode,
    /** Long-form description of the asset. */
    String description,
    /** URL to the asset's logo or image. */
    String imageUrl,
    /** Classification: REAL_ESTATE, COMMODITIES, AGRICULTURE, STOCKS, or CRYPTO. */
    AssetCategory category,
    /** Lifecycle status: PENDING, ACTIVE, HALTED, or DELISTED. */
    AssetStatus status,
    /** How the price is determined: AUTO or MANUAL. */
    PriceMode priceMode,
    /** Latest price per unit, in XAF. */
    BigDecimal currentPrice,
    /** 24-hour price change as a percentage (e.g. 2.5 = +2.5%). */
    BigDecimal change24hPercent,
    /** Opening price for the current trading day, in XAF. */
    BigDecimal dayOpen,
    /** Highest price reached during the current trading day, in XAF. */
    BigDecimal dayHigh,
    /** Lowest price reached during the current trading day, in XAF. */
    BigDecimal dayLow,
    /** Closing price for the current trading day, in XAF. */
    BigDecimal dayClose,
    /** Maximum total units that can ever exist. */
    BigDecimal totalSupply,
    /** Units currently in circulation (held by users). */
    BigDecimal circulatingSupply,
    /** Units available for purchase: totalSupply - circulatingSupply. */
    BigDecimal availableSupply,
    /** Trading fee as a percentage (e.g. 0.005 = 0.5%). */
    BigDecimal tradingFeePercent,
    /** Bid-ask spread as a percentage (e.g. 0.01 = 1%). */
    BigDecimal spreadPercent,
    /** Number of decimal places for fractional units (0-8). */
    Integer decimalPlaces,
    /** Planned launch date for PENDING assets. Null for active assets. */
    LocalDate expectedLaunchDate,
    /** Fineract client ID of the treasury holding this asset's reserves. */
    Long treasuryClientId,
    /** Fineract savings account ID for the treasury's asset units. */
    Long treasuryAssetAccountId,
    /** Fineract savings account ID for the treasury's XAF cash. */
    Long treasuryCashAccountId,
    /** Corresponding Fineract savings product ID. */
    Integer fineractProductId,
    /** Timestamp when the asset was created. */
    Instant createdAt,
    /** Timestamp of the last update. Null if never updated. */
    Instant updatedAt
) {}
