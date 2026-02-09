package com.adorsys.fineract.asset.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

/**
 * Full asset detail with OHLC, performance, and supply stats.
 */
public record AssetDetailResponse(
    String id,
    String name,
    String symbol,
    String currencyCode,
    String description,
    String imageUrl,
    AssetCategory category,
    AssetStatus status,
    PriceMode priceMode,
    BigDecimal currentPrice,
    BigDecimal change24hPercent,
    BigDecimal dayOpen,
    BigDecimal dayHigh,
    BigDecimal dayLow,
    BigDecimal dayClose,
    BigDecimal totalSupply,
    BigDecimal circulatingSupply,
    BigDecimal availableSupply,
    BigDecimal tradingFeePercent,
    BigDecimal spreadPercent,
    Integer decimalPlaces,
    LocalDate expectedLaunchDate,
    Long treasuryClientId,
    Long treasuryAssetAccountId,
    Long treasuryCashAccountId,
    Integer fineractProductId,
    Instant createdAt,
    Instant updatedAt
) {}
