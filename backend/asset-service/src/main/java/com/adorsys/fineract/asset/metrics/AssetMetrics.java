package com.adorsys.fineract.asset.metrics;

import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import org.springframework.stereotype.Component;

/**
 * Micrometer metrics for asset service operations.
 */
@Component
public class AssetMetrics {

    private final Counter buyCounter;
    private final Counter sellCounter;
    private final Counter tradeFailureCounter;
    private final Counter tradeLockFailureCounter;
    private final Timer buyTimer;
    private final Timer sellTimer;

    public AssetMetrics(MeterRegistry registry) {
        buyCounter = Counter.builder("asset.trades.buy")
                .description("Number of buy trades executed")
                .register(registry);

        sellCounter = Counter.builder("asset.trades.sell")
                .description("Number of sell trades executed")
                .register(registry);

        tradeFailureCounter = Counter.builder("asset.trades.failures")
                .description("Number of failed trades")
                .register(registry);

        tradeLockFailureCounter = Counter.builder("asset.trades.lock_failures")
                .description("Number of trade lock acquisition failures")
                .register(registry);

        buyTimer = Timer.builder("asset.trades.buy.duration")
                .description("Duration of buy trade execution")
                .register(registry);

        sellTimer = Timer.builder("asset.trades.sell.duration")
                .description("Duration of sell trade execution")
                .register(registry);
    }

    public void recordBuy() { buyCounter.increment(); }
    public void recordSell() { sellCounter.increment(); }
    public void recordTradeFailure() { tradeFailureCounter.increment(); }
    public void recordTradeLockFailure() { tradeLockFailureCounter.increment(); }
    public Timer getBuyTimer() { return buyTimer; }
    public Timer getSellTimer() { return sellTimer; }
}
