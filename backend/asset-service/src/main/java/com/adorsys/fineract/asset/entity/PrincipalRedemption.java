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
 * Audit record for the principal redemption paid to a single bond holder at maturity.
 * One row is created per user per asset by PrincipalRedemptionService when an admin
 * triggers the maturity redemption batch for a bond whose {@link Asset#maturityDate}
 * has been reached.
 * <p>
 * Each row represents up to three atomic Fineract transfers in a single batch:
 * <ol>
 *   <li>Asset unit transfer — the holder's bond units are returned to the LP's asset account
 *       ({@link Asset#lpAssetAccountId}), reducing their {@link UserPosition}.</li>
 *   <li>Cash transfer (net) — {@code (gross − ircmWithheld)} XAF is debited from the LP's
 *       cash account ({@link Asset#lpCashAccountId}) and credited to the holder's
 *       settlement account.</li>
 *   <li>IRCM transfer (BTA only) — when the bond has a positive capital gain at maturity
 *       and IRCM is enabled for the asset, {@code ircmWithheld} XAF is debited from the
 *       LP's cash account and credited to the IRCM tax authority account
 *       ({@code TaxService.getIrcmAccountId()}).</li>
 * </ol>
 * Tax breakdown (BTA only — OTA principal payback is at par with no tax):
 * <ul>
 *   <li>{@code grossCashAmount = units × faceValue}</li>
 *   <li>{@code capitalGain = max(units × (faceValue − avgPurchasePrice), 0)}</li>
 *   <li>{@code ircmWithheld = capitalGain × TaxService.getEffectiveIrcmRate(asset)}</li>
 *   <li>{@code cashAmount = grossCashAmount − ircmWithheld}</li>
 * </ul>
 * Capital losses (purchase price above face value) are not refunded — IRCM is clamped at zero.
 */
@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "principal_redemptions",
       indexes = {
           @Index(name = "idx_pr_asset_id", columnList = "asset_id"),
           @Index(name = "idx_pr_user_id", columnList = "user_id")
       })
public class PrincipalRedemption {

    /** Auto-generated sequential primary key. */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Asset ID of the matured bond. */
    @Column(name = "asset_id", nullable = false, length = 36)
    private String assetId;

    /** Fineract client ID of the holder. */
    @Column(name = "user_id", nullable = false)
    private Long userId;

    /** Number of units redeemed. */
    @Column(nullable = false, precision = 20, scale = 8)
    private BigDecimal units;

    /** Face value per unit (bond's manualPrice at redemption time). */
    @Column(name = "face_value", nullable = false, precision = 20, scale = 0)
    private BigDecimal faceValue;

    /** Net cash returned to holder: grossCashAmount − ircmWithheld. */
    @Column(name = "cash_amount", nullable = false, precision = 20, scale = 0)
    private BigDecimal cashAmount;

    /**
     * Gross cash amount before IRCM withholding: {@code units × faceValue}. Equal to
     * {@link #cashAmount} for OTA bonds and BTA bonds without taxable capital gain.
     * Nullable for historical rows written before the V3 migration.
     */
    @Column(name = "gross_cash_amount", precision = 20, scale = 0)
    private BigDecimal grossCashAmount;

    /**
     * Weighted-average cost basis per unit at redemption time, copied from
     * {@code UserPosition.avgPurchasePrice}. Null for historical rows written before
     * the V3 migration and for OTA bonds where IRCM does not apply at maturity.
     */
    @Column(name = "avg_purchase_price", precision = 20, scale = 8)
    private BigDecimal avgPurchasePrice;

    /**
     * Capital gain on this BTA redemption: {@code max(units × (faceValue − avgPurchasePrice), 0)}.
     * Zero when there is no gain (or for OTA bonds). Used as the IRCM tax base.
     */
    @Column(name = "capital_gain", precision = 20, scale = 0)
    private BigDecimal capitalGain;

    /**
     * IRCM withholding amount transferred to the tax authority account in the same
     * atomic batch as the user cash transfer: {@code capitalGain × TaxService.getEffectiveIrcmRate}.
     * Zero when IRCM is exempt or there is no capital gain. Audited separately in
     * {@code tax_transactions} via {@link com.adorsys.fineract.asset.service.TaxService#recordTaxTransaction}.
     */
    @Column(name = "ircm_withheld", precision = 20, scale = 0)
    private BigDecimal ircmWithheld;

    /**
     * Effective IRCM rate applied at redemption time as a decimal (e.g.
     * {@code 0.165} = 16.5%). Captured from
     * {@link com.adorsys.fineract.asset.service.TaxService#getEffectiveIrcmRate}
     * once per redemption so historical rows stay accurate even if the asset's
     * IRCM config is later reconfigured. Null on legacy rows persisted before
     * the V4 migration.
     */
    @Column(name = "ircm_rate_applied", precision = 10, scale = 8)
    private BigDecimal ircmRateApplied;

    /** Realized P&L recorded on the position: cashAmount - costBasis. */
    @Column(name = "realized_pnl", precision = 20, scale = 0)
    private BigDecimal realizedPnl;

    /** Fineract account transfer ID for the cash leg. Null on failure. */
    @Column(name = "fineract_cash_transfer_id")
    private Long fineractCashTransferId;

    /** Fineract account transfer ID for the asset unit return leg. Null on failure. */
    @Column(name = "fineract_asset_transfer_id")
    private Long fineractAssetTransferId;

    /** Payment status: SUCCESS or FAILED. */
    @Column(nullable = false, length = 20)
    @Builder.Default
    private String status = "SUCCESS";

    /** Reason for failure, if status is FAILED. */
    @Column(name = "failure_reason", length = 500)
    private String failureReason;

    /** Timestamp when this redemption was processed. */
    @Column(name = "redeemed_at", nullable = false)
    @Builder.Default
    private Instant redeemedAt = Instant.now();

    /** Date the admin triggered the redemption. */
    @Column(name = "redemption_date", nullable = false)
    private LocalDate redemptionDate;
}
