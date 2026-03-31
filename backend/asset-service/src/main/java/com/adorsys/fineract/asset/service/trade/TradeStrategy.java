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

    /** Compute the order's final cash amount. BUY: grossCost + fee + tax + accruedInterest, SELL: grossProceeds - fee + accruedInterest. */
    BigDecimal computeOrderCashAmount(BigDecimal grossAmount, BigDecimal fee, BigDecimal totalTax, BigDecimal accruedInterest);

    /** Overload without accrued interest (defaults to zero). */
    default BigDecimal computeOrderCashAmount(BigDecimal grossAmount, BigDecimal fee, BigDecimal totalTax) {
        return computeOrderCashAmount(grossAmount, fee, totalTax, BigDecimal.ZERO);
    }

    /** @deprecated Use {@link #computeOrderCashAmount(BigDecimal, BigDecimal, BigDecimal, BigDecimal)} */
    default BigDecimal computeOrderCashAmount(BigDecimal grossAmount, BigDecimal fee) {
        return computeOrderCashAmount(grossAmount, fee, BigDecimal.ZERO, BigDecimal.ZERO);
    }

    /** The circulating supply adjustment direction. BUY: +units, SELL: -units. */
    BigDecimal supplyAdjustment(BigDecimal units);
}
