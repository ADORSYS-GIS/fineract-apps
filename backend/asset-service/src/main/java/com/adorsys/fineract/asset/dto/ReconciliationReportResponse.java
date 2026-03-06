package com.adorsys.fineract.asset.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

public record ReconciliationReportResponse(
        Long id,
        LocalDate reportDate,
        String reportType,
        String assetId,
        Long userId,
        BigDecimal expectedValue,
        BigDecimal actualValue,
        BigDecimal discrepancy,
        String severity,
        String status,
        String notes,
        String resolvedBy,
        Instant resolvedAt,
        Instant createdAt
) {}
