package com.adorsys.fineract.asset.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

/**
 * Immutable audit trail record for every admin-initiated mutation. Created by
 * {@code AuditLogAspect} via an around-advice on all write endpoints in
 * {@code AdminAssetController}, {@code AdminOrderController}, and
 * {@code AdminReconciliationController}. Rows are append-only and must never
 * be updated or deleted after creation.
 * <p>
 * The three indexes support the most common audit query patterns: filtering
 * by admin identity, by target asset, and by time range.
 */
@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "audit_log", indexes = {
    @Index(name = "idx_audit_log_admin", columnList = "adminSubject"),
    @Index(name = "idx_audit_log_asset", columnList = "targetAssetId"),
    @Index(name = "idx_audit_log_performed", columnList = "performedAt")
})
public class AuditLog {

    /** Auto-generated sequential primary key. */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Controller method name that was invoked (e.g. {@code createAsset}, {@code activateAsset}, {@code resolveOrder}). */
    @Column(nullable = false, length = 100)
    private String action;

    /** JWT {@code sub} claim of the admin who performed the action. Used to trace actions back to a specific admin account. */
    @Column(nullable = false, length = 255)
    private String adminSubject;

    /** Asset ID the action targeted, if applicable. Null for actions that are not scoped to a single asset. */
    @Column(length = 36)
    private String targetAssetId;

    /**
     * Denormalized asset symbol (e.g. {@code BRVM}) copied at write time for human-readable
     * log displays without requiring a join. May become stale if the asset's symbol changes,
     * but the {@code targetAssetId} remains authoritative.
     */
    @Column(length = 10)
    private String targetAssetSymbol;

    /** Outcome of the action: {@code SUCCESS} if the controller method returned normally, {@code FAILURE} if it threw. */
    @Column(nullable = false, length = 10)
    private String result;

    /** Exception message captured on failure, truncated to 500 characters. Null when {@code result} is SUCCESS. */
    @Column(length = 500)
    private String errorMessage;

    /** Wall-clock duration of the admin request in milliseconds, measured by the audit aspect. */
    private long durationMs;

    /**
     * Key request parameters serialized as a compact JSON string by the audit aspect,
     * e.g. {@code {"price":1500,"symbol":"GOLD"}}. Sensitive fields (passwords, tokens)
     * are redacted before serialization. Stored as TEXT to accommodate large request bodies.
     */
    @Column(columnDefinition = "TEXT")
    private String requestSummary;

    /**
     * Originating IP address of the HTTP request, resolved from the
     * {@code X-Forwarded-For} header (first hop) or {@code RemoteAddr} as fallback.
     * IPv6 addresses may be up to 45 characters.
     */
    @Column(name = "client_ip", length = 45)
    private String clientIp;

    /** {@code User-Agent} HTTP header from the admin's request, for device/browser forensics. */
    @Column(name = "user_agent", length = 500)
    private String userAgent;

    /** Timestamp when the admin action was performed. Set automatically on insert if not provided. */
    @Column(nullable = false)
    private Instant performedAt;

    @PrePersist
    protected void onCreate() {
        if (performedAt == null) performedAt = Instant.now();
    }
}
