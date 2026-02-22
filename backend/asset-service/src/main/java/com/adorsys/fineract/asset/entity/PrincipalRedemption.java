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
 * Audit record for a bond principal redemption paid to a holder at maturity.
 * <p>
 * Each row represents a pair of Fineract transfers: asset units returned to treasury,
 * and cash (face value) paid to the holder. The cash amount is calculated as:
 * {@code cashAmount = units * faceValue} (no fee or spread).
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
