package com.adorsys.fineract.registration.metrics;

import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.concurrent.TimeUnit;

/**
 * Comprehensive business metrics for the customer registration service.
 * Covers registration, KYC, account operations, rate limiting, and external service calls.
 */
@Slf4j
@Component
public class RegistrationMetrics {

    private final Counter registrationRequestsTotal;
    private final Counter registrationSuccessTotal;
    private final Timer registrationDuration;
    private final Timer kycReviewDuration;
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

        this.kycReviewDuration = Timer.builder("kyc_review_duration_seconds")
                .description("Time taken to review KYC submissions")
                .register(meterRegistry);

        log.info("Registration metrics initialized");
    }

    // --- Registration metrics ---

    public void incrementRegistrationRequests() {
        registrationRequestsTotal.increment();
    }

    public void incrementRegistrationSuccess() {
        registrationSuccessTotal.increment();
    }

    public void incrementRegistrationFailure(String reason) {
        Counter.builder("registration_failure_total")
                .tag("reason", reason)
                .description("Total number of failed registrations")
                .register(meterRegistry)
                .increment();
    }

    public void incrementRollbackFailure(String system) {
        Counter.builder("registration_rollback_failure_total")
                .tag("system", system)
                .description("Failed rollback attempts during registration (orphaned resources)")
                .register(meterRegistry)
                .increment();
    }

    // --- KYC Document metrics ---

    public void incrementKycSubmission(String documentType) {
        Counter.builder("kyc_document_uploads_total")
                .tag("document_type", documentType)
                .description("Total number of KYC document uploads")
                .register(meterRegistry)
                .increment();
    }

    public void incrementKycUploadFailure(String reason) {
        Counter.builder("kyc_document_upload_failures_total")
                .tag("reason", reason)
                .description("Failed KYC document uploads")
                .register(meterRegistry)
                .increment();
    }

    // --- KYC Review metrics ---

    public void incrementKycReview(String action) {
        Counter.builder("kyc_reviews_total")
                .tag("action", action)
                .description("Total KYC review actions (approved, rejected, more_info)")
                .register(meterRegistry)
                .increment();
    }

    public void recordKycReviewDuration(long durationMs, String status) {
        Timer.builder("kyc_review_duration_seconds")
                .tag("status", status)
                .description("Time taken to review KYC submissions")
                .register(meterRegistry)
                .record(durationMs, TimeUnit.MILLISECONDS);
    }

    // --- Rate limiting metrics ---

    public void incrementRateLimitHit(String endpoint) {
        Counter.builder("rate_limit_exceeded_total")
                .tag("endpoint", endpoint)
                .description("Rate limit exceeded events")
                .register(meterRegistry)
                .increment();
    }

    // --- Fineract API metrics ---

    public void incrementFineractCall(String operation, String status) {
        Counter.builder("fineract_api_calls_total")
                .tag("operation", operation)
                .tag("status", status)
                .description("Fineract API call counts")
                .register(meterRegistry)
                .increment();
    }

    // --- Keycloak metrics ---

    public void incrementKeycloakCall(String operation, String status) {
        Counter.builder("keycloak_api_calls_total")
                .tag("operation", operation)
                .tag("status", status)
                .description("Keycloak API call counts")
                .register(meterRegistry)
                .increment();
    }

    // --- Account security metrics ---

    public void incrementCacheHit() {
        Counter.builder("account_ownership_cache_total")
                .tag("result", "hit")
                .description("Account ownership cache hits/misses")
                .register(meterRegistry)
                .increment();
    }

    public void incrementCacheMiss() {
        Counter.builder("account_ownership_cache_total")
                .tag("result", "miss")
                .description("Account ownership cache hits/misses")
                .register(meterRegistry)
                .increment();
    }

    // --- Transaction limit metrics ---

    public void incrementLimitViolation(String limitType) {
        Counter.builder("transaction_limit_violations_total")
                .tag("limit_type", limitType)
                .description("Transaction limit violation events")
                .register(meterRegistry)
                .increment();
    }

    // --- Timer utilities ---

    public Timer.Sample startTimer() {
        return Timer.start(meterRegistry);
    }

    public void stopRegistrationTimer(Timer.Sample sample) {
        sample.stop(registrationDuration);
    }

    public void recordRegistrationDuration(long durationMs) {
        registrationDuration.record(durationMs, TimeUnit.MILLISECONDS);
    }
}
