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
 * Records a discrepancy found during automated reconciliation between the
 * asset service database and the Fineract ledger. Created by the
 * ReconciliationScheduler when it detects that the unit or cash balance
 * recorded in this service does not match what Fineract reports for the
 * same savings account.
 * <p>
 * Discrepancies start in {@code OPEN} status and must be investigated and
 * manually resolved by an admin via the reconciliation admin API.
 */
@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "reconciliation_reports")
public class ReconciliationReport {

    /** Auto-generated sequential primary key. */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Calendar date on which the reconciliation job ran and detected this discrepancy. */
    @Column(name = "report_date", nullable = false)
    private LocalDate reportDate;

    /**
     * Category of the check that failed (e.g. {@code UNIT_BALANCE},
     * {@code CASH_BALANCE}, {@code CIRCULATING_SUPPLY}).
     * Determines which Fineract accounts and local tables are compared.
     */
    @Column(name = "report_type", nullable = false, length = 50)
    private String reportType;

    /**
     * ID of the asset this discrepancy relates to. Null for report types that
     * are not asset-scoped (e.g. a global cash reconciliation).
     */
    @Column(name = "asset_id", length = 36)
    private String assetId;

    /**
     * Fineract client ID of the user involved, when the discrepancy is at the
     * per-user position level. Null for asset-level or global checks.
     */
    @Column(name = "user_id")
    private Long userId;

    /**
     * The value that the asset service expected to find in Fineract, based on
     * its own internal records (e.g. {@link UserPosition#totalUnits}).
     * Units depend on {@code reportType}: asset units or XAF.
     */
    @Column(name = "expected_value", precision = 20, scale = 8)
    private BigDecimal expectedValue;

    /**
     * The value actually observed in Fineract at the time of reconciliation.
     * Compared against {@code expectedValue} to compute {@code discrepancy}.
     */
    @Column(name = "actual_value", precision = 20, scale = 8)
    private BigDecimal actualValue;

    /**
     * The absolute difference between {@code actualValue} and {@code expectedValue}.
     * Positive means Fineract holds more than expected; negative means less.
     */
    @Column(precision = 20, scale = 8)
    private BigDecimal discrepancy;

    /**
     * How critical this discrepancy is: {@code INFO} for tiny rounding differences,
     * {@code WARNING} for small but unexplained gaps, {@code CRITICAL} for large
     * or growing mismatches that require immediate attention.
     * Defaults to {@code WARNING} on insert.
     */
    @Column(nullable = false, length = 20)
    private String severity;

    /**
     * Lifecycle status of this report: {@code OPEN} (unresolved), {@code RESOLVED}
     * (admin confirmed it was corrected), or {@code DISMISSED} (admin confirmed
     * the discrepancy is acceptable, e.g. a known rounding artefact).
     * Defaults to {@code OPEN} on insert.
     */
    @Column(nullable = false, length = 20)
    private String status;

    /**
     * Free-text notes added by the admin during investigation or resolution.
     * Null until an admin comments on the report.
     */
    @Column(length = 1000)
    private String notes;

    /** JWT subject of the admin who resolved or dismissed this report. Null while status is OPEN. */
    @Column(name = "resolved_by", length = 100)
    private String resolvedBy;

    /** Timestamp when the admin marked this report as resolved or dismissed. Null while status is OPEN. */
    @Column(name = "resolved_at")
    private Instant resolvedAt;

    /** Timestamp when this report was created by the reconciliation scheduler. */
    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = Instant.now();
        if (status == null) status = "OPEN";
        if (severity == null) severity = "WARNING";
    }
}
