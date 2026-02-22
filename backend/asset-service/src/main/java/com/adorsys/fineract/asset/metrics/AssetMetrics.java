package com.adorsys.fineract.asset.metrics;

import com.adorsys.fineract.asset.config.AssetServiceConfig;
import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.DistributionSummary;
import io.micrometer.core.instrument.Gauge;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.concurrent.atomic.AtomicLong;

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
    private final DistributionSummary couponCashTotal;
    private final Counter subscriptionExpiredRejectionsCounter;

    // Order resolution metrics
    private final Counter ordersResolvedCounter;

    // Bond redemption metrics
    private final Counter bondRedeemedCounter;
    private final DistributionSummary redemptionCashTotal;

    // Exposure limit metrics
    private final MeterRegistry registry;

    // Reconciliation metrics
    private final Timer reconciliationRunTimer;
    private final AtomicLong reconciliationOpenReports = new AtomicLong(0);

    // Delisting metrics
    private final DistributionSummary delistingBuybackAmount;

    // Archival metrics
    private final Counter tradesArchivedCounter;
    private final Counter ordersArchivedCounter;
    private final Counter archivalFailureCounter;

    public AssetMetrics(MeterRegistry meterRegistry, AssetServiceConfig config) {
        this.registry = meterRegistry;
        MeterRegistry registry = meterRegistry;
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

        couponCashTotal = DistributionSummary.builder("asset.bonds.coupon.cash_total")
                .description("Total " + config.getSettlementCurrency() + " distributed as coupon payments")
                .baseUnit(config.getSettlementCurrency())
                .register(registry);

        subscriptionExpiredRejectionsCounter = Counter.builder("asset.subscription_expired_rejections")
                .description("BUY orders rejected due to subscription period violation")
                .register(registry);

        // Order resolution metrics
        ordersResolvedCounter = Counter.builder("asset.orders.resolved")
                .description("Number of orders manually resolved by admins")
                .register(registry);

        // Bond redemption metrics
        bondRedeemedCounter = Counter.builder("asset.bonds.redeemed")
                .description("Number of successful principal redemption payments")
                .register(registry);

        redemptionCashTotal = DistributionSummary.builder("asset.bonds.redemption.cash_total")
                .description("Total " + config.getSettlementCurrency() + " paid as principal redemption")
                .baseUnit(config.getSettlementCurrency())
                .register(registry);

        // Reconciliation metrics
        reconciliationRunTimer = Timer.builder("asset.reconciliation.run_duration")
                .description("Duration of full reconciliation run")
                .register(registry);

        Gauge.builder("asset.reconciliation.open_reports", reconciliationOpenReports, AtomicLong::doubleValue)
                .description("Current count of unresolved reconciliation discrepancies")
                .register(registry);

        // Delisting metrics
        delistingBuybackAmount = DistributionSummary.builder("asset.delisting.buyback_amount")
                .description("Total " + config.getSettlementCurrency() + " paid in forced delisting buybacks")
                .baseUnit(config.getSettlementCurrency())
                .register(registry);

        // Archival metrics
        tradesArchivedCounter = Counter.builder("asset.archival.trades_archived")
                .description("Total trade_log rows archived")
                .register(registry);

        ordersArchivedCounter = Counter.builder("asset.archival.orders_archived")
                .description("Total orders rows archived")
                .register(registry);

        archivalFailureCounter = Counter.builder("asset.archival.failures")
                .description("Number of archival job failures")
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
    /** Record a successful coupon payment with the cash amount distributed. */
    public void recordCouponPaid(double cashAmount) {
        couponPaidCounter.increment();
        couponCashTotal.record(cashAmount);
    }
    /** Record a failed coupon payment attempt. */
    public void recordCouponFailed() { couponFailedCounter.increment(); }
    /** Record a BUY order rejected because subscription period is violated. */
    public void incrementSubscriptionExpiredRejections() { subscriptionExpiredRejectionsCounter.increment(); }

    /** Record an order manually resolved by an admin. */
    public void recordOrderResolved() { ordersResolvedCounter.increment(); }

    /** Record trade_log rows archived. */
    public void recordTradesArchived(int count) { tradesArchivedCounter.increment(count); }
    /** Record orders rows archived. */
    public void recordOrdersArchived(int count) { ordersArchivedCounter.increment(count); }
    /** Record an archival job failure. */
    public void recordArchivalFailure() { archivalFailureCounter.increment(); }

    /** Record successful principal redemption payments. */
    public void recordBondRedeemed(int holderCount, double cashTotal) {
        bondRedeemedCounter.increment(holderCount);
        redemptionCashTotal.record(cashTotal);
    }

    /** Record a trade rejected due to exposure limit violation. */
    public void recordExposureLimitRejection(String assetId, String limitType) {
        Counter.builder("asset.trades.position_limit_rejected")
                .description("Trades rejected due to exposure limit violation")
                .tag("assetId", assetId)
                .tag("limitType", limitType)
                .register(registry)
                .increment();
    }

    /** Record a SELL trade rejected due to lock-up period. */
    public void recordLockupRejection(String assetId) {
        Counter.builder("asset.trades.lockup_rejected")
                .description("SELL trades rejected due to lock-up period")
                .tag("assetId", assetId)
                .register(registry)
                .increment();
    }

    /** Record a notification sent by event type. */
    public void recordNotificationSent(String eventType) {
        Counter.builder("asset.notifications.sent")
                .description("Number of notifications sent")
                .tag("eventType", eventType)
                .register(registry)
                .increment();
    }

    /** Record notification preferences updated. */
    public void recordNotificationPreferencesUpdated() {
        Counter.builder("asset.notifications.preferences_updated")
                .description("Number of notification preferences updates")
                .register(registry)
                .increment();
    }

    /** Record a successful income distribution. */
    public void recordIncomeDistributed(String assetId, String incomeType, double cashAmount) {
        Counter.builder("asset.income.distributions_paid")
                .description("Number of successful income distributions")
                .tag("assetId", assetId)
                .tag("incomeType", incomeType)
                .register(registry)
                .increment();
        DistributionSummary.builder("asset.income.cash_distributed")
                .description("Total cash distributed as income")
                .tag("incomeType", incomeType)
                .register(registry)
                .record(cashAmount);
    }

    /** Record a failed income distribution. */
    public void recordIncomeDistributionFailed(String assetId, String incomeType) {
        Counter.builder("asset.income.distributions_failed")
                .description("Number of failed income distributions")
                .tag("assetId", assetId)
                .tag("incomeType", incomeType)
                .register(registry)
                .increment();
    }

    /** Record a delisting initiated. */
    public void recordDelistingInitiated() {
        Counter.builder("asset.delisting.initiated")
                .description("Number of delistings initiated")
                .register(registry)
                .increment();
    }

    /** Record a delisting completed (forced buyback done). */
    public void recordDelistingCompleted() {
        Counter.builder("asset.delisting.completed")
                .description("Number of delistings completed")
                .register(registry)
                .increment();
    }

    /** Record a delisting cancelled. */
    public void recordDelistingCancelled() {
        Counter.builder("asset.delisting.cancelled")
                .description("Number of delistings cancelled")
                .register(registry)
                .increment();
    }

    /** Record a treasury shortfall detected for an asset. */
    public void recordTreasuryShortfall(String assetId, double shortfallAmount) {
        Counter.builder("asset.treasury.shortfall_detected")
                .description("Number of treasury shortfalls detected")
                .tag("assetId", assetId)
                .register(registry)
                .increment();
    }

    /** Record a reconciliation discrepancy. */
    public void recordReconciliationDiscrepancy(String severity, String reportType) {
        Counter.builder("asset.reconciliation.discrepancies")
                .description("Number of reconciliation discrepancies found")
                .tag("severity", severity)
                .tag("reportType", reportType)
                .register(registry)
                .increment();
    }

    /** Get the reconciliation run timer for wrapping the full reconciliation run. */
    public Timer getReconciliationRunTimer() { return reconciliationRunTimer; }

    /** Update the gauge tracking open reconciliation reports. */
    public void setReconciliationOpenReports(long count) { reconciliationOpenReports.set(count); }

    /** Record cash paid during forced delisting buyback. */
    public void recordDelistingBuybackAmount(double cashAmount) { delistingBuybackAmount.record(cashAmount); }

    /** Record price spread for an asset (askPrice - bidPrice). */
    public void recordSpread(String assetId, BigDecimal spreadAmount) {
        Gauge.builder("asset.price.spread_amount", spreadAmount, BigDecimal::doubleValue)
                .description("Current bid-ask spread amount")
                .tag("assetId", assetId)
                .register(registry);
    }
}
