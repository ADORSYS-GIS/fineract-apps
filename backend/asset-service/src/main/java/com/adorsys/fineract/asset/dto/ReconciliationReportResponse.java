package com.adorsys.fineract.asset.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

/**
 * A single discrepancy record from the automated reconciliation process.
 *
 * <p>Returned as a list by {@code GET /api/admin/reconciliation/reports} and individually by
 * {@code GET /api/admin/reconciliation/reports/{id}}. Reconciliation runs compare the
 * asset-service's internal ledger (positions, balances, trade records) against Fineract's
 * account balances and journal entries. Any mismatch above a configured threshold is written
 * as a report record.
 *
 * <p>All monetary amounts are in the settlement currency (XAF). Resolved records are kept
 * permanently for audit purposes and are never deleted.
 */
public record ReconciliationReportResponse(

    /** Database primary key of this reconciliation record. Stable identifier for resolution calls. */
    Long id,

    /**
     * Calendar date the reconciliation run that produced this record was executed, in WAT.
     * Multiple records may share the same {@code reportDate} if the same run detected
     * multiple discrepancies.
     */
    LocalDate reportDate,

    /**
     * Category of reconciliation check that detected the mismatch.
     * Examples: {@code "POSITION_BALANCE"} (asset-service units vs Fineract savings account balance),
     * {@code "TRADE_SETTLEMENT"} (trade log amount vs Fineract journal entry),
     * {@code "LP_OBLIGATION"} (unsettled LP payable vs Fineract GL balance).
     */
    String reportType,

    /**
     * Internal asset identifier associated with this discrepancy.
     * Null for report types that are not asset-specific (e.g. platform-level fee reconciliation).
     */
    String assetId,

    /**
     * Fineract client ID of the user whose account is involved in the discrepancy.
     * Null for report types that are not user-specific (e.g. LP or treasury-level checks).
     */
    Long userId,

    /**
     * The value the asset-service expected to find based on its own records, in XAF (or asset units
     * depending on {@code reportType}). Derived from trade history, position snapshots, or GL ledger.
     */
    BigDecimal expectedValue,

    /**
     * The value actually observed in Fineract at the time the reconciliation ran, in XAF
     * (or asset units depending on {@code reportType}). Sourced directly from Fineract account
     * balance queries or journal entry aggregations.
     */
    BigDecimal actualValue,

    /**
     * The gap between expected and actual: {@code actualValue - expectedValue}, in XAF or asset units.
     * Positive means Fineract holds more than expected (over-funding or double credit).
     * Negative means Fineract holds less than expected (under-funding or missing transfer).
     * The absolute value of {@code discrepancy} is compared against the configured threshold to
     * determine whether a record is created at all.
     */
    BigDecimal discrepancy,

    /**
     * Impact level of this discrepancy, used to prioritise resolution work.
     * Typical values: {@code "LOW"} (within acceptable rounding tolerance),
     * {@code "MEDIUM"} (significant but not immediately critical),
     * {@code "HIGH"} (large amount or affects user-facing balances, requires urgent action).
     */
    String severity,

    /**
     * Current resolution status of this record.
     * Values: {@code "OPEN"} (not yet investigated), {@code "IN_PROGRESS"} (under investigation),
     * {@code "RESOLVED"} (root cause identified and corrective action taken),
     * {@code "DISMISSED"} (determined to be a known/acceptable variance).
     */
    String status,

    /**
     * Free-text admin notes on the investigation or resolution of this discrepancy.
     * Null until an admin adds context via the resolution endpoint. May include references to
     * Fineract journal entry IDs, root cause analysis, or corrective action taken.
     */
    String notes,

    /**
     * Username or identifier of the admin who marked this record as resolved or dismissed.
     * Null while {@code status} is {@code "OPEN"} or {@code "IN_PROGRESS"}.
     */
    String resolvedBy,

    /**
     * UTC timestamp when the resolution status was set to {@code "RESOLVED"} or {@code "DISMISSED"}.
     * Null while the record is still open or in progress.
     */
    Instant resolvedAt,

    /**
     * UTC timestamp when this reconciliation record was first created by the reconciliation job.
     */
    Instant createdAt

) {}
