package com.adorsys.fineract.asset.service.trade;

import com.adorsys.fineract.asset.dto.TradeSide;

import java.math.BigDecimal;

/**
 * Sealed interface capturing the computational differences between BUY and SELL trades.
 * Used by {@link com.adorsys.fineract.asset.service.TradingService#executeTrade} to
 * eliminate duplication between executeBuy and executeSell.
 */
public sealed interface TradeStrategy permits BuyStrategy, SellStrategy {

    /** The trade direction. */
    TradeSide side();

    /** Apply spread to base price. BUY adds spread, SELL subtracts. */
    BigDecimal applySpread(BigDecimal basePrice, BigDecimal spreadMultiplier);

    /** Compute the order's final cash amount. BUY: grossCost + fee, SELL: grossProceeds - fee. */
    BigDecimal computeOrderCashAmount(BigDecimal grossAmount, BigDecimal fee);

    /** The circulating supply adjustment direction. BUY: +units, SELL: -units. */
    BigDecimal supplyAdjustment(BigDecimal units);
}
