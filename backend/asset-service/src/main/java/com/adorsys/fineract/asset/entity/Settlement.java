package com.adorsys.fineract.asset.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * Tracks a pending or completed settlement operation between treasury accounts.
 * Settlements represent large, deliberate fund movements that require a two-step
 * admin workflow (create → approve → execute) to prevent unilateral transfers.
 * <p>
 * The four settlement types are:
 * <ul>
 *   <li>{@code LP_PAYOUT} — accumulated spread and fees remitted to the liquidity partner.</li>
 *   <li>{@code TAX_REMITTANCE} — collected taxes (IRCM, registration duty, capital gains)
 *       transferred to the DGI tax authority account.</li>
 *   <li>{@code TRUST_REBALANCE} — internal rebalancing between trust sub-accounts.</li>
 *   <li>{@code FEE_COLLECTION} — platform fees moved from operating accounts to revenue GL.</li>
 * </ul>
 * <p>
 * On execution, a Fineract journal entry is posted; its ID is stored in
 * {@code fineractJournalEntryId} for reconciliation.
 */
@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "settlements")
public class Settlement {

    /** UUID primary key, assigned at creation time. */
    @Id
    private String id;

    /**
     * Fineract client ID of the liquidity partner this settlement involves.
     * Null for settlement types that do not involve the LP directly
     * (e.g. TAX_REMITTANCE, TRUST_REBALANCE).
     */
    @Column(name = "lp_client_id")
    private Long lpClientId;

    /**
     * Category of this settlement: {@code LP_PAYOUT}, {@code TAX_REMITTANCE},
     * {@code TRUST_REBALANCE}, or {@code FEE_COLLECTION}. Determines which
     * accounts are involved and which GL codes apply.
     */
    @Column(name = "settlement_type", nullable = false)
    private String settlementType;

    /** Settlement currency amount to be transferred, in XAF. Must be positive. */
    @Column(nullable = false)
    private BigDecimal amount;

    /**
     * Workflow state: {@code PENDING} (created, awaiting approval), {@code APPROVED}
     * (approved but not yet executed), {@code EXECUTED} (Fineract journal entry posted),
     * or {@code REJECTED} (declined by approver). Defaults to {@code PENDING}.
     */
    @Column(nullable = false)
    @Builder.Default
    private String status = "PENDING";

    /**
     * Human-readable narrative describing the purpose of this settlement.
     * Included in the Fineract journal entry memo when the settlement executes.
     */
    private String description;

    /**
     * Fineract savings account ID to debit. The source of the funds.
     * Null for GL-to-GL settlements that use {@code sourceGlCode} instead.
     */
    @Column(name = "source_account_id")
    private Long sourceAccountId;

    /**
     * Fineract savings account ID to credit. The destination of the funds.
     * Null for GL-to-GL settlements that use {@code destinationGlCode} instead.
     */
    @Column(name = "destination_account_id")
    private Long destinationAccountId;

    /**
     * SYSCOHADA GL account code to debit (e.g. {@code "7011"} for income).
     * Used in place of {@code sourceAccountId} for pure GL journal entries.
     * Null for savings-account-based transfers.
     */
    @Column(name = "source_gl_code")
    private String sourceGlCode;

    /**
     * SYSCOHADA GL account code to credit (e.g. {@code "4411"} for tax payable).
     * Used in place of {@code destinationAccountId} for pure GL journal entries.
     * Null for savings-account-based transfers.
     */
    @Column(name = "destination_gl_code")
    private String destinationGlCode;

    /** JWT subject of the admin who created this settlement request. */
    @Column(name = "created_by")
    private String createdBy;

    /** JWT subject of the admin who approved or rejected this settlement. Null until approved or rejected. */
    @Column(name = "approved_by")
    private String approvedBy;

    /** Timestamp when this settlement record was created. Set automatically on insert. */
    @Column(name = "created_at", nullable = false)
    @Builder.Default
    private Instant createdAt = Instant.now();

    /** Timestamp when an admin approved this settlement for execution. Null until approved. */
    @Column(name = "approved_at")
    private Instant approvedAt;

    /** Timestamp when the Fineract journal entry was posted. Null until executed. */
    @Column(name = "executed_at")
    private Instant executedAt;

    /** Timestamp when this settlement was rejected. Null unless rejected. */
    @Column(name = "rejected_at")
    private Instant rejectedAt;

    /** Reason given by the admin for rejecting this settlement. Null unless rejected. */
    @Column(name = "rejection_reason")
    private String rejectionReason;

    /**
     * Fineract journal entry ID posted on execution. Used to cross-reference
     * the asset service settlement record with the Fineract ledger during reconciliation.
     * Null until execution succeeds.
     */
    @Column(name = "fineract_journal_entry_id")
    private String fineractJournalEntryId;

    /** Optimistic locking version. Prevents concurrent approval and execution conflicts. */
    @Version
    private Long version;
}
