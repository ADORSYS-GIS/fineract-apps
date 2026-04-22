package com.adorsys.fineract.registration.metrics;

import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.concurrent.TimeUnit;

/**
 * Custom business metrics for the customer registration service.
 * These metrics provide observability into registration and KYC operations.
 */
@Slf4j
@Component
public class RegistrationMetrics {

    private static final Set<String> KNOWN_FAILURE_REASONS = Set.of(
            "BATCH_REQUEST_FAILED"
    );

    private final Counter registrationRequestsTotal;
    private final Counter registrationSuccessTotal;
    private final Timer registrationDuration;
    private final MeterRegistry meterRegistry;

    public RegistrationMetrics(MeterRegistry meterRegistry) {
        this.meterRegistry = meterRegistry;

        // Registration counters
        this.registrationRequestsTotal = Counter.builder("registration_requests_total")
                .description("Total number of registration requests received")
                .register(meterRegistry);

        this.registrationSuccessTotal = Counter.builder("registration_success_total")
                .description("Total number of successful registrations")
                .register(meterRegistry);

        // Timers
        this.registrationDuration = Timer.builder("registration_duration_seconds")
                .description("Time taken to complete a registration")
                .register(meterRegistry);

        log.info("Registration metrics initialized");
    }

    /**
     * Increment registration request counter.
     */
    public void incrementRegistrationRequests() {
        registrationRequestsTotal.increment();
    }

    /**
     * Increment successful registration counter.
     */
    public void incrementRegistrationSuccess() {
        registrationSuccessTotal.increment();
    }

    /**
     * Increment failed registration counter with reason tag.
     */
    public void incrementRegistrationFailure(String reason) {
        String normalizedReason = KNOWN_FAILURE_REASONS.contains(reason) ? reason : "OTHER";
        Counter.builder("registration_failure_total")
                .tag("reason", normalizedReason)
                .description("Total number of failed registrations")
                .register(meterRegistry)
                .increment();
    }

    /**
     * Record registration duration.
     */
    public void recordRegistrationDuration(long durationMs) {
        registrationDuration.record(durationMs, TimeUnit.MILLISECONDS);
    }

    /**
     * Create a timer sample to measure duration.
     */
    public Timer.Sample startTimer() {
        return Timer.start(meterRegistry);
    }

    /**
     * Stop timer and record to registration duration.
     */
    public void stopRegistrationTimer(Timer.Sample sample) {
        sample.stop(registrationDuration);
    }
}