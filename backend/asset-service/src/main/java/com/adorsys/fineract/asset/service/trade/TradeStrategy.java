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

    /** Compute the order's final cash amount. BUY: grossCost + fee + tax, SELL: grossProceeds - fee - tax. */
    BigDecimal computeOrderCashAmount(BigDecimal grossAmount, BigDecimal fee, BigDecimal totalTax);

    /** @deprecated Use {@link #computeOrderCashAmount(BigDecimal, BigDecimal, BigDecimal)} */
    default BigDecimal computeOrderCashAmount(BigDecimal grossAmount, BigDecimal fee) {
        return computeOrderCashAmount(grossAmount, fee, BigDecimal.ZERO);
    }

    /** The circulating supply adjustment direction. BUY: +units, SELL: -units. */
    BigDecimal supplyAdjustment(BigDecimal units);
}
