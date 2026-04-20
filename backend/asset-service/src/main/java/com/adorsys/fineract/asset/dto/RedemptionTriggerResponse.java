package com.adorsys.fineract.asset.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * Response from {@code POST /api/admin/assets/{id}/redeem}.
 *
 * <p>Summarizes the outcome of a batch redemption run triggered manually by an admin
 * when a bond reaches maturity. The system attempts to redeem principal for every holder
 * in a single operation. Both successful and failed per-holder results are included in
 * {@code details}.</p>
 *
 * <p>After a successful run, {@code bondStatus} will typically change to {@code REDEEMED}.</p>
 */
public record RedemptionTriggerResponse(
    /** Internal asset ID of the redeemed bond. */
    String assetId,

    /** Ticker symbol of the redeemed bond (e.g. {@code BTA_6M_2025}). */
    String symbol,

    /** The maturity date on which this redemption was executed. */
    LocalDate redemptionDate,

    /** Total number of distinct holders found for this bond at the time of redemption. */
    int totalHolders,

    /**
     * Number of holders whose principal was successfully credited.
     * {@code holdersRedeemed + holdersFailed == totalHolders}.
     */
    int holdersRedeemed,

    /**
     * Number of holders for whom the redemption failed (e.g. Fineract transfer error).
     * Individual failure reasons are in {@code details}.
     */
    int holdersFailed,

    /**
     * Total XAF principal successfully paid out across all redeemed holders.
     * Sum of {@code cashAmount} for all entries in {@code details} with status {@code SUCCESS}.
     */
    BigDecimal totalPrincipalPaid,

    /**
     * Total XAF principal that could not be transferred due to failures.
     * Sum of {@code cashAmount} for all entries in {@code details} with status {@code FAILED}.
     */
    BigDecimal totalPrincipalFailed,

    /**
     * Asset lifecycle status after the redemption run.
     * Typically {@code REDEEMED} when all holders were processed (even with partial failures),
     * or {@code ACTIVE} if the run was aborted entirely.
     */
    String bondStatus,

    /**
     * Per-holder breakdown of redemption outcomes. Always present, never null.
     * Length equals {@code totalHolders}.
     */
    List<HolderRedemptionDetail> details
) {

    /**
     * Per-holder outcome within a redemption run.
     *
     * <p>Returned as part of the {@code details} list in {@link RedemptionTriggerResponse}.
     * Each entry corresponds to one holder's attempt to receive their principal.</p>
     */
    public record HolderRedemptionDetail(
        /** Fineract client ID of the holder. */
        Long userId,

        /** Units of the bond held by this holder at the time of redemption. */
        BigDecimal units,

        /**
         * XAF cash amount that was (or would have been) credited to this holder.
         * Equals {@code units * faceValue}. Present even on failure for audit purposes.
         */
        BigDecimal cashAmount,

        /**
         * Outcome for this holder.
         * Typical values: {@code SUCCESS}, {@code FAILED}.
         */
        String status,

        /**
         * Reason the redemption failed for this specific holder.
         * Null when {@code status} is {@code SUCCESS}.
         */
        String failureReason
    ) {}
}
