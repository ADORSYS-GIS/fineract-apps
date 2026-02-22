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
 * Records an income distribution payment (dividend, rent, yield) to a single holder.
 */
@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "income_distributions")
public class IncomeDistribution {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "asset_id", nullable = false, length = 36)
    private String assetId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "income_type", nullable = false, length = 30)
    private String incomeType;

    @Column(nullable = false, precision = 20, scale = 8)
    private BigDecimal units;

    @Column(name = "rate_applied", nullable = false, precision = 8, scale = 4)
    private BigDecimal rateApplied;

    @Column(name = "cash_amount", nullable = false, precision = 20, scale = 0)
    private BigDecimal cashAmount;

    @Column(name = "fineract_transfer_id")
    private Long fineractTransferId;

    @Column(nullable = false, length = 20)
    private String status;

    @Column(name = "failure_reason", length = 500)
    private String failureReason;

    @Column(name = "distribution_date", nullable = false)
    private LocalDate distributionDate;

    @Column(name = "paid_at", nullable = false)
    private Instant paidAt;

    @PrePersist
    protected void onCreate() {
        if (paidAt == null) paidAt = Instant.now();
        if (status == null) status = "SUCCESS";
    }
}
