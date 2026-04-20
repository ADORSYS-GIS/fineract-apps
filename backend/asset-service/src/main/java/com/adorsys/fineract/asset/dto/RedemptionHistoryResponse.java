package com.adorsys.fineract.asset.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

/**
 * Single row in the principal redemption history for a bond asset, returned by
 * {@code GET /api/admin/assets/{id}/redemption-history}.
 *
 * <p>Each record corresponds to one holder's redemption event when a bond matured.
 * Successful redemptions will have a non-null {@code fineractCashTransferId} and
 * {@code fineractAssetTransferId}; failed ones will have a non-null {@code failureReason}.</p>
 */
public record RedemptionHistoryResponse(
    /** Internal database identifier of this redemption record. */
    Long id,

    /** Fineract client ID of the bondholder who was redeemed. */
    Long userId,

    /** Number of bond units redeemed for this holder. */
    BigDecimal units,

    /**
     * Face/par value per unit at the time of redemption, in XAF.
     * The total principal owed is {@code units * faceValue}.
     */
    BigDecimal faceValue,

    /**
     * Actual XAF cash amount transferred to the holder's account.
     * Equals {@code units * faceValue} for successful redemptions.
     * May differ if a partial settlement occurred.
     */
    BigDecimal cashAmount,

    /**
     * Realized profit or loss for this holder on the redemption, in XAF.
     * Calculated as {@code cashAmount - (units * originalAcquisitionPrice)}.
     * Negative values indicate a loss.
     */
    BigDecimal realizedPnl,

    /**
     * Fineract transaction ID for the cash credit applied to the holder's savings account.
     * Null if the redemption failed before the cash transfer was initiated.
     */
    Long fineractCashTransferId,

    /**
     * Fineract transaction ID for the asset debit (bond units removed from holder's account).
     * Null if the redemption failed before the asset transfer was initiated.
     */
    Long fineractAssetTransferId,

    /**
     * Outcome of this redemption attempt.
     * Typical values: {@code SUCCESS}, {@code FAILED}.
     */
    String status,

    /**
     * Human-readable explanation of why this redemption failed.
     * Null when {@code status} is {@code SUCCESS}.
     */
    String failureReason,

    /**
     * Exact UTC timestamp when the redemption was processed by the system.
     * Null if the redemption has not yet been attempted.
     */
    Instant redeemedAt,

    /**
     * Calendar date of the bond's maturity / scheduled redemption date.
     * Matches the asset's {@code maturityDate}.
     */
    LocalDate redemptionDate
) {}
