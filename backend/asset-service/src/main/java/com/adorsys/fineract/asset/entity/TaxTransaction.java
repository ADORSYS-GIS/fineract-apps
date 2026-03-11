package com.adorsys.fineract.asset.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * Audit record for a tax collected on a trade or income distribution.
 * Used for capital gains exemption tracking and DGI reporting.
 */
@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "tax_transactions")
public class TaxTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Order ID for trade-related taxes (registration duty, capital gains). */
    @Column(name = "order_id", length = 36)
    private String orderId;

    /** Scheduled payment ID for income-related taxes (IRCM). */
    @Column(name = "scheduled_payment_id")
    private Long scheduledPaymentId;

    /** Fineract client ID of the taxed user. */
    @Column(name = "user_id", nullable = false)
    private Long userId;

    /** Asset ID the tax relates to. */
    @Column(name = "asset_id", nullable = false, length = 36)
    private String assetId;

    /** Tax type: REGISTRATION_DUTY, IRCM, or CAPITAL_GAINS. */
    @Column(name = "tax_type", nullable = false, length = 30)
    private String taxType;

    /** The base amount the tax was calculated on. */
    @Column(name = "taxable_amount", nullable = false, precision = 20, scale = 0)
    private BigDecimal taxableAmount;

    /** The tax rate applied (e.g. 0.02 for 2%). */
    @Column(name = "tax_rate", nullable = false, precision = 5, scale = 4)
    private BigDecimal taxRate;

    /** The tax amount collected. */
    @Column(name = "tax_amount", nullable = false, precision = 20, scale = 0)
    private BigDecimal taxAmount;

    /** Fineract transfer ID for the tax deposit. Null on failure. */
    @Column(name = "fineract_transfer_id")
    private Long fineractTransferId;

    /** Fiscal year for annual aggregation (e.g. 2026). */
    @Column(name = "fiscal_year", nullable = false)
    private int fiscalYear;

    /** Fiscal month for monthly IRCM declaration (1-12). */
    @Column(name = "fiscal_month", nullable = false)
    private int fiscalMonth;

    /** Status: SUCCESS or FAILED. */
    @Column(nullable = false, length = 20)
    @Builder.Default
    private String status = "SUCCESS";

    /** Reason for failure, if status is FAILED. */
    @Column(name = "failure_reason", length = 500)
    private String failureReason;

    /** Timestamp when the tax was collected. */
    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private Instant createdAt = Instant.now();
}
