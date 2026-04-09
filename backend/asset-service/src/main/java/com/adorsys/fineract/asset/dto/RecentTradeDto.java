package com.adorsys.fineract.asset.dto;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * A single recent executed trade, used to populate the public trade feed on the asset detail page.
 *
 * <p>Returned as a list by {@code GET /api/assets/{assetId}/recent-trades}. The list contains
 * the most recent FILLED orders for the asset, capped at a configurable maximum (typically 20–50
 * entries), ordered newest first.
 *
 * <p>This DTO is intentionally anonymous — no user identifier or account information is included.
 * It is safe to expose to all authenticated users without leaking other users' identities.
 *
 * <p>All monetary amounts are in the settlement currency (XAF).
 */
public record RecentTradeDto(

    /**
     * Execution price per unit at the time this trade was filled, in XAF.
     * BUY trades execute at the ask price; SELL trades at the bid price.
     * Useful for visualising the price at which the market last transacted.
     */
    BigDecimal price,

    /**
     * Number of asset units exchanged in this trade.
     * Always positive, regardless of direction. Combine with {@code side} to determine
     * whether units entered or left circulation.
     */
    BigDecimal quantity,

    /**
     * Direction of the trade: BUY (units purchased, cash spent) or SELL (units sold, cash received).
     * Displayed as a colour-coded badge in the trade feed (green for BUY, red for SELL).
     */
    TradeSide side,

    /**
     * UTC timestamp when this order's Fineract transfers completed and the trade was recorded.
     * Use for the "time ago" display in the trade feed and for sorting entries chronologically.
     */
    Instant executedAt

) {}
