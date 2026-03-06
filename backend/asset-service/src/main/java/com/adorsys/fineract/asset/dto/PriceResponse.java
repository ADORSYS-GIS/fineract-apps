package com.adorsys.fineract.asset.dto;

import java.math.BigDecimal;

/**
 * Lightweight, Redis-cached price snapshot for a single asset.
 * Returns askPrice (what buyer pays) and bidPrice (what seller receives)
 * via a fast path (Redis cache with 1-minute TTL → database fallback).
 * Used internally by the trading engine for BUY/SELL execution price lookups,
 * and exposed at GET /api/prices/{assetId}.
 */
public record PriceResponse(
    /** Internal asset identifier. */
    String assetId,
    /** LP ask price: what buyers pay. */
    BigDecimal askPrice,
    /** LP bid price: what sellers receive. */
    BigDecimal bidPrice,
    /** 24-hour price change as a percentage (e.g. 2.5 = +2.5%). */
    BigDecimal change24hPercent
) {}
