package com.adorsys.fineract.asset.service.trade;

import com.adorsys.fineract.asset.dto.TradeSide;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

class BuyStrategyTest {

    private final BuyStrategy strategy = BuyStrategy.INSTANCE;

    @Test
    void side_returnsBuy() {
        assertEquals(TradeSide.BUY, strategy.side());
    }

    @Test
    void applySpread_addsSpreadToBasePrice() {
        BigDecimal basePrice = new BigDecimal("100");
        BigDecimal spreadPercent = new BigDecimal("0.01");

        BigDecimal result = strategy.applySpread(basePrice, spreadPercent);

        // 100 + 100 * 0.01 = 101
        assertEquals(new BigDecimal("101.00"), result);
    }

    @Test
    void applySpread_zeroSpread_returnsBasePrice() {
        BigDecimal basePrice = new BigDecimal("100");

        BigDecimal result = strategy.applySpread(basePrice, BigDecimal.ZERO);

        assertEquals(0, basePrice.compareTo(result));
    }

    @Test
    void computeOrderCashAmount_addsFeeToGross() {
        BigDecimal grossAmount = new BigDecimal("1010");
        BigDecimal fee = new BigDecimal("5");

        BigDecimal result = strategy.computeOrderCashAmount(grossAmount, fee);

        // BUY: charged = cost + fee
        assertEquals(new BigDecimal("1015"), result);
    }

    @Test
    void supplyAdjustment_returnsPositiveUnits() {
        BigDecimal units = new BigDecimal("10");

        BigDecimal result = strategy.supplyAdjustment(units);

        // BUY increases circulating supply
        assertEquals(new BigDecimal("10"), result);
    }
}
