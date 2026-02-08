package com.adorsys.fineract.asset.dto;

import java.math.BigDecimal;

/**
 * Single entry in the order book.
 */
public record OrderBookEntry(
    String id,
    BigDecimal price,
    BigDecimal quantity,
    BigDecimal value,
    TradeSide side
) {}
