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
 * A scheduled payment record created by the daily scheduler when a coupon or
 * income distribution date is due. Admins must confirm (triggering Fineract
 * transfers) or cancel.
 */
@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "scheduled_payments")
public class ScheduledPayment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "asset_id", nullable = false, length = 36)
    private String assetId;

    /** COUPON or INCOME */
    @Column(name = "payment_type", nullable = false, length = 20)
    private String paymentType;

    @Column(name = "schedule_date", nullable = false)
    private LocalDate scheduleDate;

    /** PENDING, CONFIRMED, or CANCELLED */
    @Column(nullable = false, length = 20)
    @Builder.Default
    private String status = "PENDING";

    // ── Rate-based estimates (set at creation) ──────────────────────────────

    @Column(name = "estimated_rate", precision = 8, scale = 4)
    private BigDecimal estimatedRate;

    @Column(name = "estimated_amount_per_unit", precision = 20, scale = 4)
    private BigDecimal estimatedAmountPerUnit;

    @Column(name = "estimated_total", precision = 20, scale = 0)
    private BigDecimal estimatedTotal;

    @Column(name = "holder_count", nullable = false)
    @Builder.Default
    private Integer holderCount = 0;

    // ── Confirmation details ────────────────────────────────────────────────

    @Column(name = "actual_amount_per_unit", precision = 20, scale = 4)
    private BigDecimal actualAmountPerUnit;

    @Column(name = "confirmed_by", length = 255)
    private String confirmedBy;

    @Column(name = "confirmed_at")
    private Instant confirmedAt;

    @Column(name = "cancelled_by", length = 255)
    private String cancelledBy;

    @Column(name = "cancelled_at")
    private Instant cancelledAt;

    @Column(name = "cancel_reason", length = 500)
    private String cancelReason;

    // ── Execution results ───────────────────────────────────────────────────

    @Column(name = "holders_paid")
    private Integer holdersPaid;

    @Column(name = "holders_failed")
    private Integer holdersFailed;

    @Column(name = "total_amount_paid", precision = 20, scale = 0)
    private BigDecimal totalAmountPaid;

    @Column(name = "executed_at")
    private Instant executedAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private Instant createdAt = Instant.now();

    // ── Transient: eagerly-loaded asset for responses ────────────────────────

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "asset_id", insertable = false, updatable = false)
    private Asset asset;
}
