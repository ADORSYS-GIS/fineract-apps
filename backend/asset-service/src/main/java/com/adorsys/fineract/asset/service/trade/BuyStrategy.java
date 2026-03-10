package com.adorsys.fineract.asset.service.trade;

import com.adorsys.fineract.asset.dto.TradeSide;

import java.math.BigDecimal;

/**
 * BUY trade strategy: spread is added to price, cost includes fee, supply increases.
 */
public final class BuyStrategy implements TradeStrategy {

    public static final BuyStrategy INSTANCE = new BuyStrategy();

    private BuyStrategy() {}

    @Override
    public TradeSide side() {
        return TradeSide.BUY;
    }

    @Override
    public BigDecimal applySpread(BigDecimal basePrice, BigDecimal spreadMultiplier) {
        return basePrice.add(basePrice.multiply(spreadMultiplier));
    }

    @Override
    public BigDecimal computeOrderCashAmount(BigDecimal grossAmount, BigDecimal fee) {
        return grossAmount.add(fee);
    }

    @Override
    public BigDecimal supplyAdjustment(BigDecimal units) {
        return units;
    }
}
