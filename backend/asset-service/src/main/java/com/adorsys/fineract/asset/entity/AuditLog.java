package com.adorsys.fineract.asset.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

/**
 * Persistent record of an admin action. Created by AuditLogAspect for every
 * mutation on AdminAssetController, AdminOrderController, and AdminReconciliationController.
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

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Controller method name, e.g. createAsset, activateAsset, resolveOrder. */
    @Column(nullable = false, length = 100)
    private String action;

    /** JWT subject of the admin who performed the action. */
    @Column(nullable = false, length = 255)
    private String adminSubject;

    /** Target asset ID, if applicable. Null for non-asset-specific actions. */
    @Column(length = 36)
    private String targetAssetId;

    /** Denormalized asset symbol for human readability. */
    @Column(length = 10)
    private String targetAssetSymbol;

    /** SUCCESS or FAILURE. */
    @Column(nullable = false, length = 10)
    private String result;

    /** Exception message on failure, truncated to 500 chars. Null on success. */
    @Column(length = 500)
    private String errorMessage;

    /** Execution duration in milliseconds. */
    private long durationMs;

    /** Key request parameters serialized as JSON, e.g. {"price":1500}. */
    @Column(columnDefinition = "TEXT")
    private String requestSummary;

    /** When the action was performed. */
    @Column(nullable = false)
    private Instant performedAt;

    @PrePersist
    protected void onCreate() {
        if (performedAt == null) performedAt = Instant.now();
    }
}
