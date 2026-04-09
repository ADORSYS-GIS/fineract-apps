package com.adorsys.fineract.asset.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * Audit record for a single tax amount collected from a user on a trade or income
 * distribution. One row is created per tax type per taxable event — a single order
 * may produce two rows (registration duty + capital gains tax) if both apply.
 * <p>
 * Three tax types are currently in use:
 * <ul>
 *   <li>{@code REGISTRATION_DUTY} — 2% droit d'enregistrement on the trade cash amount.
 *       Linked to an {@link Order} via {@code orderId}.</li>
 *   <li>{@code CAPITAL_GAINS} — 16.5% on the realized gain of a profitable SELL.
 *       Linked to an {@link Order} via {@code orderId}.</li>
 *   <li>{@code IRCM} — Impôt sur le Revenu des Capitaux Mobiliers withheld from coupon
 *       and income payments. Linked to a {@link ScheduledPayment} via {@code scheduledPaymentId}.</li>
 * </ul>
 * <p>
 * Used for DGI (Direction Générale des Impôts) tax reporting exports and for enforcing
 * annual capital gains tax-free allowances at the user level.
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
