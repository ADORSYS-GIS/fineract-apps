package com.adorsys.fineract.asset.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.Instant;

@Schema(description = "Audit log entry for an admin action.")
public record AuditLogResponse(
    Long id,
    String action,
    String adminSubject,
    String targetAssetId,
    String targetAssetSymbol,
    String result,
    String errorMessage,
    long durationMs,
    String requestSummary,
    Instant performedAt
) {}
