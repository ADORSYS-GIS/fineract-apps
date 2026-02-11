package com.adorsys.fineract.gateway.metrics;

import com.adorsys.fineract.gateway.dto.PaymentProvider;
import com.adorsys.fineract.gateway.dto.PaymentResponse;
import com.adorsys.fineract.gateway.dto.PaymentStatus;
import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.DistributionSummary;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.concurrent.TimeUnit;

/**
 * Custom business metrics for the payment gateway service.
 * These metrics provide observability into payment operations.
 */
@Slf4j
@Component
public class PaymentMetrics {

    private final MeterRegistry meterRegistry;

    public PaymentMetrics(MeterRegistry meterRegistry) {
        this.meterRegistry = meterRegistry;
        log.info("Payment metrics initialized");
    }

    /**
     * Increment payment transaction counter with provider, type, and status tags.
     */
    public void incrementTransaction(PaymentProvider provider, PaymentResponse.TransactionType type, PaymentStatus status) {
        Counter.builder("payment_transactions_total")
                .description("Total number of payment transactions")
                .tag("provider", provider.name().toLowerCase())
                .tag("type", type.name().toLowerCase())
                .tag("status", status.name().toLowerCase())
                .register(meterRegistry)
                .increment();
    }

    /**
     * Record payment amount with provider and type tags.
     */
    public void recordPaymentAmount(PaymentProvider provider, PaymentResponse.TransactionType type, BigDecimal amount) {
        DistributionSummary.builder("payment_amount_xaf")
                .description("Payment amounts in XAF")
                .tag("provider", provider.name().toLowerCase())
                .tag("type", type.name().toLowerCase())
                .baseUnit("XAF")
                .register(meterRegistry)
                .record(amount.doubleValue());
    }

    /**
     * Record total payment amount (for sum aggregation).
     */
    public void recordPaymentAmountTotal(PaymentProvider provider, PaymentResponse.TransactionType type, BigDecimal amount) {
        Counter.builder("payment_amount_total_xaf")
                .description("Total sum of payment amounts in XAF")
                .tag("provider", provider.name().toLowerCase())
                .tag("type", type.name().toLowerCase())
                .register(meterRegistry)
                .increment(amount.doubleValue());
    }

    /**
     * Record payment processing duration.
     */
    public void recordProcessingDuration(PaymentProvider provider, PaymentResponse.TransactionType type,
                                         PaymentStatus status, long durationMs) {
        Timer.builder("payment_processing_duration_seconds")
                .description("Time taken to process a payment")
                .tag("provider", provider.name().toLowerCase())
                .tag("type", type.name().toLowerCase())
                .tag("status", status.name().toLowerCase())
                .register(meterRegistry)
                .record(durationMs, TimeUnit.MILLISECONDS);
    }

    /**
     * Increment provider API call counter.
     */
    public void incrementProviderApiCall(PaymentProvider provider, String operation, boolean success) {
        Counter.builder("payment_provider_api_calls_total")
                .description("Total number of API calls to payment providers")
                .tag("provider", provider.name().toLowerCase())
                .tag("operation", operation)
                .tag("success", String.valueOf(success))
                .register(meterRegistry)
                .increment();
    }

    /**
     * Increment callback received counter.
     */
    public void incrementCallbackReceived(PaymentProvider provider, PaymentStatus status) {
        Counter.builder("payment_callbacks_total")
                .description("Total number of payment callbacks received")
                .tag("provider", provider.name().toLowerCase())
                .tag("status", status.name().toLowerCase())
                .register(meterRegistry)
                .increment();
    }

    /**
     * Increment insufficient funds counter.
     */
    public void incrementInsufficientFunds() {
        Counter.builder("payment_insufficient_funds_total")
                .description("Total number of payments rejected due to insufficient funds")
                .register(meterRegistry)
                .increment();
    }

    /**
     * Increment callback rejected counter (missing fields, invalid signature, etc.).
     */
    public void incrementCallbackRejected(PaymentProvider provider, String reason) {
        Counter.builder("payment_callbacks_rejected_total")
                .description("Total number of payment callbacks rejected")
                .tag("provider", provider.name().toLowerCase())
                .tag("reason", reason)
                .register(meterRegistry)
                .increment();
    }

    /**
     * Increment successful reversal counter.
     */
    public void incrementReversalSuccess() {
        Counter.builder("payment_reversals_total")
                .description("Total number of withdrawal reversals")
                .tag("outcome", "success")
                .register(meterRegistry)
                .increment();
    }

    /**
     * Increment failed reversal counter.
     */
    public void incrementReversalFailure() {
        Counter.builder("payment_reversals_total")
                .description("Total number of withdrawal reversals")
                .tag("outcome", "failure")
                .register(meterRegistry)
                .increment();
    }

    /**
     * Increment expired transaction counter.
     */
    public void incrementTransactionExpired(PaymentProvider provider) {
        Counter.builder("payment_transactions_expired_total")
                .description("Total number of transactions expired by cleanup scheduler")
                .tag("provider", provider.name().toLowerCase())
                .register(meterRegistry)
                .increment();
    }

    /**
     * Create a timer sample to measure duration.
     */
    public Timer.Sample startTimer() {
        return Timer.start(meterRegistry);
    }

    /**
     * Stop timer and record payment processing duration.
     */
    public void stopProcessingTimer(Timer.Sample sample, PaymentProvider provider,
                                     PaymentResponse.TransactionType type, PaymentStatus status) {
        Timer timer = Timer.builder("payment_processing_duration_seconds")
                .description("Time taken to process a payment")
                .tag("provider", provider.name().toLowerCase())
                .tag("type", type.name().toLowerCase())
                .tag("status", status.name().toLowerCase())
                .register(meterRegistry);
        sample.stop(timer);
    }
}
