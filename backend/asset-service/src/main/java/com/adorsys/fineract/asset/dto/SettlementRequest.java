package com.adorsys.fineract.asset.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

/**
 * Request body for creating a manual treasury settlement, sent to
 * {@code POST /api/admin/settlements}.
 *
 * <p>Settlements represent fund movements between trust accounts, LP accounts, tax
 * authorities, and external bank GL accounts. Each settlement type has specific
 * requirements for {@code lpClientId}, {@code sourceGlCode}, and {@code destinationGlCode}:</p>
 * <ul>
 *   <li>{@code LP_PAYOUT} — pays the LP for their inventory position; requires {@code lpClientId}.</li>
 *   <li>{@code TAX_REMITTANCE} — remits collected taxes to a government authority; requires {@code lpClientId}.</li>
 *   <li>{@code TRUST_REBALANCE} — moves funds between trust sub-accounts; no LP required.</li>
 *   <li>{@code FEE_COLLECTION} — transfers platform fees from trust to the operator account; no LP required.</li>
 * </ul>
 *
 * <p>All amounts are in XAF. GL codes must correspond to valid accounts in the Fineract
 * GL chart configured for this deployment.</p>
 */
public record SettlementRequest(
    /**
     * Type of settlement to create.
     * Allowed values: {@code LP_PAYOUT}, {@code TAX_REMITTANCE}, {@code TRUST_REBALANCE}, {@code FEE_COLLECTION}.
     */
    @NotNull @Schema(description = "Settlement type: LP_PAYOUT, TAX_REMITTANCE, TRUST_REBALANCE, FEE_COLLECTION")
    String settlementType,

    /**
     * Amount to transfer, in XAF. Must be positive.
     */
    @NotNull @Positive @Schema(description = "Settlement amount in XAF")
    BigDecimal amount,

    /**
     * Fineract client ID of the liquidity partner involved in this settlement.
     * Required for {@code LP_PAYOUT} and {@code TAX_REMITTANCE}; null for other types.
     */
    @Schema(description = "LP client ID (required for LP_PAYOUT and TAX_REMITTANCE)")
    Long lpClientId,

    /**
     * Optional free-text description stored with the settlement for audit and reporting.
     * Shown in GL transaction notes and the settlement history screen.
     */
    @Schema(description = "Free-text description")
    String description,

    /**
     * GL account code to debit (the funding source for this transfer).
     * Example: {@code "4011"} for the LP Settlement Payable account.
     * Null to use the system-configured default for the given settlement type.
     */
    @Schema(description = "Source GL code (e.g. 4011 for LP Settlement)")
    String sourceGlCode,

    /**
     * GL account code to credit (the destination for this transfer).
     * Example: {@code "5011"} for the UBA Bank trust account.
     * Null to use the system-configured default for the given settlement type.
     */
    @Schema(description = "Destination GL code (e.g. 5011 for UBA Bank)")
    String destinationGlCode
) {}
