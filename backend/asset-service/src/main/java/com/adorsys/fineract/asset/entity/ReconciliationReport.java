package com.adorsys.fineract.asset.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

/**
 * Records a discrepancy found during automated reconciliation between
 * the asset service DB and Fineract ledger.
 */
@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "reconciliation_reports")
public class ReconciliationReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "report_date", nullable = false)
    private LocalDate reportDate;

    @Column(name = "report_type", nullable = false, length = 50)
    private String reportType;

    @Column(name = "asset_id", length = 36)
    private String assetId;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "expected_value", precision = 20, scale = 8)
    private BigDecimal expectedValue;

    @Column(name = "actual_value", precision = 20, scale = 8)
    private BigDecimal actualValue;

    @Column(precision = 20, scale = 8)
    private BigDecimal discrepancy;

    @Column(nullable = false, length = 20)
    private String severity;

    @Column(nullable = false, length = 20)
    private String status;

    @Column(length = 1000)
    private String notes;

    @Column(name = "resolved_by", length = 100)
    private String resolvedBy;

    @Column(name = "resolved_at")
    private Instant resolvedAt;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = Instant.now();
        if (status == null) status = "OPEN";
        if (severity == null) severity = "WARNING";
    }
}
