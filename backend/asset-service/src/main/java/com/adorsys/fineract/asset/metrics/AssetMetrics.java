package com.adorsys.fineract.asset.metrics;

import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.DistributionSummary;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import org.springframework.stereotype.Component;

/**
 * Micrometer metrics for asset service operations including bond-specific counters.
 */
@Component
public class AssetMetrics {

    private final Counter buyCounter;
    private final Counter sellCounter;
    private final Counter tradeFailureCounter;
    private final Counter tradeLockFailureCounter;
    private final Counter reconciliationCounter;
    private final Timer buyTimer;
    private final Timer sellTimer;

    // Bond metrics
    private final Counter bondMaturedCounter;
    private final Counter couponPaidCounter;
    private final Counter couponFailedCounter;
    private final DistributionSummary couponXafTotal;
    private final Counter validityExpiredRejectionsCounter;

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

        reconciliationCounter = Counter.builder("asset.orders.reconciliation_needed")
                .description("Orders requiring manual reconciliation")
                .register(registry);

        buyTimer = Timer.builder("asset.trades.buy.duration")
                .description("Duration of buy trade execution")
                .register(registry);

        sellTimer = Timer.builder("asset.trades.sell.duration")
                .description("Duration of sell trade execution")
                .register(registry);

        // Bond-specific metrics
        bondMaturedCounter = Counter.builder("asset.bonds.matured")
                .description("Number of bonds transitioned to MATURED status")
                .register(registry);

        couponPaidCounter = Counter.builder("asset.bonds.coupon.paid")
                .description("Number of successful coupon payments")
                .register(registry);

        couponFailedCounter = Counter.builder("asset.bonds.coupon.failed")
                .description("Number of failed coupon payments")
                .register(registry);

        couponXafTotal = DistributionSummary.builder("asset.bonds.coupon.xaf_total")
                .description("Total XAF distributed as coupon payments")
                .baseUnit("XAF")
                .register(registry);

        validityExpiredRejectionsCounter = Counter.builder("asset.bonds.validity_expired_rejections")
                .description("BUY orders rejected due to expired offer validity")
                .register(registry);
    }

    public void recordBuy() { buyCounter.increment(); }
    public void recordSell() { sellCounter.increment(); }
    public void recordTradeFailure() { tradeFailureCounter.increment(); }
    public void recordTradeLockFailure() { tradeLockFailureCounter.increment(); }
    public void recordReconciliationNeeded() { reconciliationCounter.increment(); }
    public Timer getBuyTimer() { return buyTimer; }
    public Timer getSellTimer() { return sellTimer; }

    /** Record a bond maturing (status -> MATURED). */
    public void incrementBondMatured() { bondMaturedCounter.increment(); }
    /** Record a successful coupon payment with the XAF amount distributed. */
    public void recordCouponPaid(double xafAmount) {
        couponPaidCounter.increment();
        couponXafTotal.record(xafAmount);
    }
    /** Record a failed coupon payment attempt. */
    public void recordCouponFailed() { couponFailedCounter.increment(); }
    /** Record a BUY order rejected because offer validity has expired. */
    public void incrementBondValidityExpiredRejections() { validityExpiredRejectionsCounter.increment(); }
}
