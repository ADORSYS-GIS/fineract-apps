package com.adorsys.fineract.asset.service.trade;

import com.adorsys.fineract.asset.dto.TradeSide;

import java.math.BigDecimal;

/**
 * SELL trade strategy: spread is subtracted from price, fee is deducted from proceeds, supply decreases.
 */
public final class SellStrategy implements TradeStrategy {

    public static final SellStrategy INSTANCE = new SellStrategy();

    private SellStrategy() {}

    @Override
    public TradeSide side() {
        return TradeSide.SELL;
    }

    @Override
    public BigDecimal applySpread(BigDecimal basePrice, BigDecimal spreadMultiplier) {
        return basePrice.subtract(basePrice.multiply(spreadMultiplier));
    }

    @Override
    public BigDecimal computeOrderCashAmount(BigDecimal grossAmount, BigDecimal fee, BigDecimal totalTax, BigDecimal accruedInterest) {
        // LP bears tax on SELL — client receives grossAmount - fee + accruedInterest (seller gets compensated for accrued)
        return grossAmount.subtract(fee).add(accruedInterest);
    }

    @Override
    public BigDecimal supplyAdjustment(BigDecimal units) {
        return units.negate();
    }
}
