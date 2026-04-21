package com.adorsys.fineract.asset.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

/**
 * Outbox entry that ensures at-least-once DB finalization after a Fineract batch call.
 *
 * <p>Written (PENDING) in a committed REQUIRES_NEW transaction before the Fineract call.
 * After Fineract confirms, transitions to DISPATCHED (also committed immediately).
 * All post-Fineract DB writes (portfolio, trade log, tax) run in the same transaction
 * that marks this entry CONFIRMED. If that transaction rolls back, the entry stays
 * DISPATCHED and the processor retries the finalization.</p>
 *
 * <p>Status lifecycle:
 * <ul>
 *   <li>PENDING — outbox written, Fineract not yet called</li>
 *   <li>DISPATCHED — Fineract batch succeeded, DB finalization pending</li>
 *   <li>CONFIRMED — all DB writes committed</li>
 *   <li>ABORTED — Fineract call itself failed; no retry needed</li>
 *   <li>FAILED — max retries exceeded on DB finalization</li>
 * </ul>
 */
@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "fineract_outbox")
public class FineractOutboxEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    /** Event type: TRADE_BUY, TRADE_SELL, COUPON_PAYMENT, INCOME_DISTRIBUTION, PRINCIPAL_REDEMPTION, FORCED_BUYBACK */
    @Column(name = "event_type", nullable = false, length = 50)
    private String eventType;

    /** Entity type this outbox entry relates to: ORDER, SCHEDULED_PAYMENT, PRINCIPAL_REDEMPTION, ASSET */
    @Column(name = "reference_type", nullable = false, length = 50)
    private String referenceType;

    /** PK of the referenced entity. */
    @Column(name = "reference_id", nullable = false, length = 255)
    private String referenceId;

    /** Unique key to prevent duplicate processing. */
    @Column(name = "idempotency_key", nullable = false, unique = true, length = 255)
    private String idempotencyKey;

    @Column(name = "status", nullable = false, length = 20)
    @Builder.Default
    private String status = "PENDING";

    /** JSON-serialized payload containing all data needed to finalize DB state. */
    @Column(name = "payload", nullable = false, columnDefinition = "TEXT")
    private String payload;

    /** JSON-serialized Fineract batch response (transfer IDs, batch ID). Set after Fineract call. */
    @Column(name = "fineract_response", columnDefinition = "TEXT")
    private String fineractResponse;

    @Column(name = "last_error")
    private String lastError;

    @Column(name = "retry_count", nullable = false)
    @Builder.Default
    private int retryCount = 0;

    @Column(name = "max_retries", nullable = false)
    @Builder.Default
    private int maxRetries = 5;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "dispatched_at")
    private Instant dispatchedAt;

    @Column(name = "confirmed_at")
    private Instant confirmedAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = Instant.now();
    }
}
