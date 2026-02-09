package com.adorsys.fineract.asset.dto;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * Recent executed trade for the public trade feed (anonymous, no user info).
 */
public record RecentTradeDto(
    /** Execution price per unit, in XAF. */
    BigDecimal price,
    /** Number of asset units traded. */
    BigDecimal quantity,
    /** Direction of the trade: BUY or SELL. */
    TradeSide side,
    /** Timestamp when the trade was executed. */
    Instant executedAt
) {}
