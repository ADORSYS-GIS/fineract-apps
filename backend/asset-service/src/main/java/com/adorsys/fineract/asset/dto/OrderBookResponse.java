package com.adorsys.fineract.asset.dto;

import java.util.List;

/**
 * Order book for an asset showing buy/sell sides and recent trades.
 */
public record OrderBookResponse(
    List<OrderBookEntry> buyOrders,
    List<OrderBookEntry> sellOrders,
    List<RecentTradeDto> recentTrades
) {}
