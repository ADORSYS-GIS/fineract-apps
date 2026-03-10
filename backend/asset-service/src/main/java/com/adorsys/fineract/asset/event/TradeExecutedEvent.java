package com.adorsys.fineract.asset.event;

import com.adorsys.fineract.asset.dto.TradeSide;

import java.math.BigDecimal;

/**
 * Published after a trade (BUY or SELL) is successfully filled.
 */
public record TradeExecutedEvent(
        Long userId,
        String assetId,
        String assetSymbol,
        TradeSide side,
        BigDecimal units,
        BigDecimal executionPrice,
        BigDecimal cashAmount,
        String orderId
) implements AssetServiceEvent {}
