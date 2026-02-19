package com.adorsys.fineract.asset.service.trade;

import com.adorsys.fineract.asset.dto.TradeSide;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

class SellStrategyTest {

    private final SellStrategy strategy = SellStrategy.INSTANCE;

    @Test
    void side_returnsSell() {
        assertEquals(TradeSide.SELL, strategy.side());
    }

    @Test
    void applySpread_subtractsSpreadFromBasePrice() {
        BigDecimal basePrice = new BigDecimal("100");
        BigDecimal spreadPercent = new BigDecimal("0.01");

        BigDecimal result = strategy.applySpread(basePrice, spreadPercent);

        // 100 - 100 * 0.01 = 99
        assertEquals(new BigDecimal("99.00"), result);
    }

    @Test
    void applySpread_zeroSpread_returnsBasePrice() {
        BigDecimal basePrice = new BigDecimal("100");

        BigDecimal result = strategy.applySpread(basePrice, BigDecimal.ZERO);

        assertEquals(0, basePrice.compareTo(result));
    }

    @Test
    void computeOrderCashAmount_subtractsFeeFromGross() {
        BigDecimal grossAmount = new BigDecimal("495");
        BigDecimal fee = new BigDecimal("2");

        BigDecimal result = strategy.computeOrderCashAmount(grossAmount, fee);

        // SELL: net = gross - fee
        assertEquals(new BigDecimal("493"), result);
    }

    @Test
    void supplyAdjustment_returnsNegativeUnits() {
        BigDecimal units = new BigDecimal("10");

        BigDecimal result = strategy.supplyAdjustment(units);

        // SELL decreases circulating supply
        assertEquals(new BigDecimal("-10"), result);
    }
}
