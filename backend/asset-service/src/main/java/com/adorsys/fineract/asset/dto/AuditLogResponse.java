package com.adorsys.fineract.asset.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.Instant;

/**
 * Audit log entry returned by the admin audit endpoint ({@code GET /admin/audit-logs}).
 * Each entry records a single admin-initiated action — asset creation, price update,
 * status change, order resolution, etc. — along with the outcome and the duration
 * of the operation. Used for compliance review and incident investigation.
 */
@Schema(description = "Audit log entry for an admin action.")
public record AuditLogResponse(
    /** Auto-generated audit log record ID (sequential). */
    Long id,
    /**
     * Short identifier for the type of action performed (e.g. "CREATE_ASSET", "SET_PRICE",
     * "HALT_TRADING", "RESOLVE_ORDER"). Used for filtering in the admin UI.
     */
    String action,
    /**
     * Keycloak subject (sub claim) of the admin who performed the action. Allows
     * cross-referencing with Keycloak user records to identify the individual.
     */
    String adminSubject,
    /**
     * Internal ID of the asset that was the target of this action.
     * Null for actions that are not asset-specific (e.g. platform-wide operations).
     */
    String targetAssetId,
    /**
     * Ticker symbol of the targeted asset at the time of the action (e.g. "BTA2024").
     * Stored alongside the ID so the log remains readable even if the symbol is later changed.
     * Null for non-asset-specific actions.
     */
    String targetAssetSymbol,
    /**
     * Outcome of the action: "SUCCESS" if it completed without error, "FAILURE" otherwise.
     * When "FAILURE", the {@code errorMessage} field will contain the reason.
     */
    String result,
    /**
     * Error message captured when the action failed. Contains the exception message or
     * business rule violation that caused the failure. Null when {@code result} is "SUCCESS".
     */
    String errorMessage,
    /**
     * Wall-clock duration of the action in milliseconds. Useful for identifying slow
     * operations or Fineract API latency issues.
     */
    long durationMs,
    /**
     * Human-readable summary of the incoming request payload (e.g. a truncated JSON
     * representation of the request body). Stored for audit purposes; sensitive fields
     * should be redacted before persistence.
     */
    String requestSummary,
    /** Timestamp when the action was executed, in UTC. */
    Instant performedAt
) {}
