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
 * One row is created per user per asset by the MaturityRedemptionService when an admin
 * triggers the maturity redemption batch for a bond whose {@link Asset#maturityDate}
 * has been reached.
 * <p>
 * Each row represents a pair of atomic Fineract transfers:
 * <ol>
 *   <li>Asset unit transfer — the holder's bond units are returned to the LP's asset account
 *       ({@link Asset#lpAssetAccountId}), reducing their {@link UserPosition}.</li>
 *   <li>Cash transfer — {@code units * faceValue} XAF is debited from the LP's cash account
 *       (see {@link LiquidityProvider#getCashAccountId()}) and credited to the holder's settlement account.</li>
 * </ol>
 * No fee, spread, or tax is deducted from a principal redemption.
 * Cash amount formula: {@code cashAmount = units * faceValue}
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

    /** Cash returned to holder: units * faceValue. */
    @Column(name = "cash_amount", nullable = false, precision = 20, scale = 0)
    private BigDecimal cashAmount;

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
