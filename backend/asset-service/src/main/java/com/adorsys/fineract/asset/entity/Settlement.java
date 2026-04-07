package com.adorsys.fineract.asset.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * Tracks settlement operations: LP payouts, tax remittances,
 * trust account rebalancing, and fee collection.
 */
@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "settlements")
public class Settlement {

    @Id
    private String id;

    /** Fineract client ID of the LP (null for non-LP settlements). */
    @Column(name = "lp_client_id")
    private Long lpClientId;

    /** LP_PAYOUT, TAX_REMITTANCE, TRUST_REBALANCE, FEE_COLLECTION */
    @Column(name = "settlement_type", nullable = false)
    private String settlementType;

    @Column(nullable = false)
    private BigDecimal amount;

    /** PENDING, APPROVED, EXECUTED, REJECTED */
    @Column(nullable = false)
    @Builder.Default
    private String status = "PENDING";

    private String description;

    @Column(name = "source_account_id")
    private Long sourceAccountId;

    @Column(name = "destination_account_id")
    private Long destinationAccountId;

    @Column(name = "source_gl_code")
    private String sourceGlCode;

    @Column(name = "destination_gl_code")
    private String destinationGlCode;

    @Column(name = "created_by")
    private String createdBy;

    @Column(name = "approved_by")
    private String approvedBy;

    @Column(name = "created_at", nullable = false)
    @Builder.Default
    private Instant createdAt = Instant.now();

    @Column(name = "approved_at")
    private Instant approvedAt;

    @Column(name = "executed_at")
    private Instant executedAt;

    @Column(name = "rejected_at")
    private Instant rejectedAt;

    @Column(name = "rejection_reason")
    private String rejectionReason;

    @Column(name = "fineract_journal_entry_id")
    private String fineractJournalEntryId;

    @Version
    private Long version;
}
