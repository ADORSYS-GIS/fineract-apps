package com.adorsys.fineract.asset.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

/**
 * Detail view of a single principal-redemption event for the authenticated user,
 * returned by {@code GET /portfolio/redemptions/{redemptionId}}. Used by the mobile
 * "BTA maturity redemption confirmation" screen (mockup 09b) to render the four-line
 * tax breakdown without reconstructing it from the order log + position cost basis.
 *
 * <p>All monetary fields are in XAF. {@code capitalGain} and {@code ircmWithheld}
 * are zero (or null on legacy rows) for OTA bonds and for BTA bonds where the
 * holder bought at or above face value.</p>
 */
@Schema(description = "Single principal-redemption event with tax breakdown.")
public record RedemptionDetailResponse(
    /** Surrogate primary key of the redemption row. Stable identifier for deep-link URLs. */
    Long id,
    /** ID of the redeemed asset (the BTA / OTA bond). */
    String assetId,
    /** Display ticker of the redeemed asset (e.g. "BTA_2Y_2027"). */
    String assetSymbol,
    /** Human-readable asset name. */
    String assetName,
    /**
     * Bond type at redemption. {@code DISCOUNT} (BTA) redemptions can carry IRCM
     * withholding when there is a positive capital gain; {@code COUPON} (OTA)
     * redemptions are at par with no tax.
     */
    BondType bondType,
    /** ISIN code of the bond, when available. */
    String isinCode,
    /** Number of units redeemed. */
    BigDecimal units,
    /** Face value per unit, in XAF. */
    BigDecimal faceValue,
    /**
     * Weighted-average cost basis per unit at redemption time, in XAF. Null on legacy
     * rows persisted before the V3 migration.
     */
    BigDecimal avgPurchasePrice,
    /**
     * Gross redemption proceeds: {@code units × faceValue}, in XAF. Always equal to
     * {@code netProceeds + ircmWithheld}.
     */
    BigDecimal grossProceeds,
    /**
     * Capital gain at redemption: {@code max(units × (faceValue − avgPurchasePrice), 0)}.
     * Zero when the holder bought at or above face value, or for OTA bonds.
     */
    BigDecimal capitalGain,
    /**
     * IRCM withholding paid to the tax authority account in the same atomic batch as
     * the cash transfer. Zero when the asset is IRCM-exempt or there is no capital gain.
     */
    BigDecimal ircmWithheld,
    /**
     * Net cash credited to the holder's settlement account: {@code grossProceeds − ircmWithheld}.
     */
    BigDecimal netProceeds,
    /**
     * Realized P&L recorded on the position at redemption: {@code netProceeds − costBasis}.
     */
    BigDecimal realizedPnl,
    /** Date the admin triggered the redemption batch. */
    LocalDate redemptionDate,
    /** Timestamp at which the row was finalised. */
    Instant redeemedAt,
    /**
     * Outcome of the redemption batch entry. Always {@code SUCCESS} when this endpoint
     * returns a row; failed redemptions are not exposed to end users.
     */
    String status
) {}
