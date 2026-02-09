package com.adorsys.fineract.asset.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

/**
 * Public asset detail response — same as AssetDetailResponse but omits internal
 * Fineract infrastructure IDs (treasury accounts, product ID) that should not
 * be exposed to end users.
 */
public record AssetPublicDetailResponse(
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
    Instant createdAt,
    Instant updatedAt
) {}
