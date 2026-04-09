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
 * Records an income distribution payment (dividend, rent, harvest yield) paid
 * to a single asset holder. One row is created per user per distribution event
 * when the IncomeDistributionScheduler confirms a {@link ScheduledPayment}.
 * <p>
 * The cash amount is calculated as:
 * {@code cashAmount = units * assetPrice * (rateApplied / 100)}
 * where {@code assetPrice} is the asset's manual price at distribution time.
 */
@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "income_distributions")
public class IncomeDistribution {

    /** Auto-generated sequential primary key. */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** ID of the asset that generated this income. References {@link Asset#id}. */
    @Column(name = "asset_id", nullable = false, length = 36)
    private String assetId;

    /** Fineract client ID of the holder who received the payment. */
    @Column(name = "user_id", nullable = false)
    private Long userId;

    /**
     * Type of income paid, matching {@link Asset#incomeType} at distribution time
     * (e.g. DIVIDEND, RENT, HARVEST_YIELD). Stored here for historical accuracy
     * in case the asset's income type changes after distribution.
     */
    @Column(name = "income_type", nullable = false, length = 30)
    private String incomeType;

    /** Number of units held by the user at the distribution snapshot date. */
    @Column(nullable = false, precision = 20, scale = 8)
    private BigDecimal units;

    /**
     * Income rate used for this payment as a percentage (e.g. 3.50 = 3.50%).
     * Copied from {@link Asset#incomeRate} at the time of distribution to preserve
     * the historical rate even if the rate is later changed.
     */
    @Column(name = "rate_applied", nullable = false, precision = 8, scale = 4)
    private BigDecimal rateApplied;

    /**
     * Settlement currency amount (XAF) transferred to the user's account.
     * Equals {@code units * assetPrice * (rateApplied / 100)}, rounded to
     * whole XAF francs.
     */
    @Column(name = "cash_amount", nullable = false, precision = 20, scale = 0)
    private BigDecimal cashAmount;

    /**
     * Fineract account transfer ID confirming the cash deposit to the user.
     * Null when the transfer failed or has not yet been attempted.
     */
    @Column(name = "fineract_transfer_id")
    private Long fineractTransferId;

    /**
     * Outcome of the distribution attempt: {@code SUCCESS} or {@code FAILED}.
     * Defaults to {@code SUCCESS} on insert; updated to {@code FAILED} if the
     * Fineract transfer throws an exception.
     */
    @Column(nullable = false, length = 20)
    private String status;

    /** Human-readable reason for failure when {@code status} is {@code FAILED}. Null on success. */
    @Column(name = "failure_reason", length = 500)
    private String failureReason;

    /**
     * The scheduled distribution date that triggered this payment. Matches
     * {@link Asset#nextDistributionDate} at the time the scheduler ran.
     */
    @Column(name = "distribution_date", nullable = false)
    private LocalDate distributionDate;

    /** Timestamp when the Fineract transfer was executed (or attempted). Defaults to insertion time. */
    @Column(name = "paid_at", nullable = false)
    private Instant paidAt;

    @PrePersist
    protected void onCreate() {
        if (paidAt == null) paidAt = Instant.now();
        if (status == null) status = "SUCCESS";
    }
}
