package com.adorsys.fineract.asset.dto;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * Recent executed trade for the public trade feed.
 */
public record RecentTradeDto(
    BigDecimal price,
    BigDecimal quantity,
    TradeSide side,
    Instant executedAt
) {}
