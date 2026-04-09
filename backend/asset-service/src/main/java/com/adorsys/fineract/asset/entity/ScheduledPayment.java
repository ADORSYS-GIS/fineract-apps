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
 * A scheduled payment record created by the daily scheduler when a bond coupon
 * date ({@link Asset#nextCouponDate}) or non-bond income distribution date
 * ({@link Asset#nextDistributionDate}) is reached. Represents a pending payment
 * batch that an admin must review and confirm before Fineract transfers are executed.
 * <p>
 * Lifecycle: {@code PENDING} → {@code CONFIRMED} (triggers per-holder transfers
 * recorded as {@link InterestPayment} or {@link IncomeDistribution} rows) or
 * {@code CANCELLED} (no transfers executed).
 * <p>
 * Estimate fields are populated at creation time so admins can preview the
 * expected treasury impact before confirming. Actual amounts may differ if the
 * admin overrides {@code actualAmountPerUnit} at confirmation time.
 */
@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "scheduled_payments")
public class ScheduledPayment {

    /** Auto-generated sequential primary key. */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** ID of the asset this payment is for. References {@link Asset#id}. */
    @Column(name = "asset_id", nullable = false, length = 36)
    private String assetId;

    /**
     * Type of payment batch: {@code COUPON} for bond interest payments
     * (bond assets) or {@code INCOME} for non-bond income distributions
     * (real estate, agriculture, etc.).
     */
    @Column(name = "payment_type", nullable = false, length = 20)
    private String paymentType;

    /**
     * The coupon or distribution date that triggered creation of this record.
     * Matches {@link Asset#nextCouponDate} or {@link Asset#nextDistributionDate}
     * at the time the scheduler ran.
     */
    @Column(name = "schedule_date", nullable = false)
    private LocalDate scheduleDate;

    /**
     * Current workflow state: {@code PENDING} while awaiting admin action,
     * {@code CONFIRMED} after an admin approves and transfers are dispatched,
     * or {@code CANCELLED} if the payment is skipped. Defaults to {@code PENDING}.
     */
    @Column(nullable = false, length = 20)
    @Builder.Default
    private String status = "PENDING";

    // ── Rate-based estimates (set at creation) ──────────────────────────────

    /**
     * The coupon rate ({@link Asset#interestRate}) or income rate
     * ({@link Asset#incomeRate}) at the time this record was created, as a
     * percentage (e.g. 5.80 = 5.80%). Stored for audit purposes. Null for
     * payment types that do not use a rate.
     */
    @Column(name = "estimated_rate", precision = 8, scale = 4)
    private BigDecimal estimatedRate;

    /**
     * Projected XAF amount per unit at creation time, calculated from
     * {@code estimatedRate} and the asset's price. Shown to the admin on the
     * confirmation screen as a preview. May differ from the actual amount if
     * the admin overrides it at confirmation.
     */
    @Column(name = "estimated_amount_per_unit", precision = 20, scale = 4)
    private BigDecimal estimatedAmountPerUnit;

    /**
     * Projected total XAF disbursement across all eligible holders at creation
     * time: {@code estimatedAmountPerUnit * totalEligibleUnits}. Shown on the
     * treasury shortfall check and admin preview. May differ from the actual
     * total paid.
     */
    @Column(name = "estimated_total", precision = 20, scale = 0)
    private BigDecimal estimatedTotal;

    /**
     * Number of holders with non-zero positions at the time this record was
     * created. Used to validate that the scheduler correctly identified all
     * eligible recipients. Starts at 0; set by the scheduler on creation.
     */
    @Column(name = "holder_count", nullable = false)
    @Builder.Default
    private Integer holderCount = 0;

    // ── Confirmation details ────────────────────────────────────────────────

    /**
     * Admin-confirmed XAF amount per unit to pay each holder. May differ from
     * {@code estimatedAmountPerUnit} if the admin adjusts the rate at confirmation
     * time (e.g. to account for partial periods). Null until the payment is confirmed.
     */
    @Column(name = "actual_amount_per_unit", precision = 20, scale = 4)
    private BigDecimal actualAmountPerUnit;

    /** JWT subject of the admin who confirmed this payment. Null until confirmed. */
    @Column(name = "confirmed_by", length = 255)
    private String confirmedBy;

    /** Timestamp when the admin confirmed this payment. Null until confirmed. */
    @Column(name = "confirmed_at")
    private Instant confirmedAt;

    /** JWT subject of the admin who cancelled this payment. Null unless cancelled. */
    @Column(name = "cancelled_by", length = 255)
    private String cancelledBy;

    /** Timestamp when the admin cancelled this payment. Null unless cancelled. */
    @Column(name = "cancelled_at")
    private Instant cancelledAt;

    /** Reason given by the admin when cancelling. Null unless cancelled. */
    @Column(name = "cancel_reason", length = 500)
    private String cancelReason;

    // ── Execution results ───────────────────────────────────────────────────

    /**
     * Number of holders who were successfully paid after confirmation.
     * Null until execution completes. Together with {@code holdersFailed} allows
     * admins to verify partial-success scenarios.
     */
    @Column(name = "holders_paid")
    private Integer holdersPaid;

    /**
     * Number of holders for whom the Fineract transfer failed during execution.
     * Null until execution completes. Individual failures are recorded in
     * {@link InterestPayment} or {@link IncomeDistribution} rows with
     * {@code status = FAILED}.
     */
    @Column(name = "holders_failed")
    private Integer holdersFailed;

    /**
     * Total XAF amount actually disbursed across all holders after execution.
     * Null until execution completes. May be less than {@code estimatedTotal}
     * if some holders had zero units or some transfers failed.
     */
    @Column(name = "total_amount_paid", precision = 20, scale = 0)
    private BigDecimal totalAmountPaid;

    /** Timestamp when the per-holder Fineract transfers were dispatched. Null until execution starts. */
    @Column(name = "executed_at")
    private Instant executedAt;

    /** Timestamp when this record was created by the scheduler. Set once on insert; never updated. */
    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private Instant createdAt = Instant.now();

    // ── Transient: eagerly-loaded asset for responses ────────────────────────

    /** Lazy-loaded reference to the parent Asset. Read-only (not insertable/updatable). */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "asset_id", insertable = false, updatable = false)
    private Asset asset;
}
