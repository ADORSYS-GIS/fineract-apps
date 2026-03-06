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
 * Audit record for a coupon (interest) payment made to a bond holder.
 * <p>
 * Each row represents one cash transfer from the treasury cash account to a user's settlement currency account.
 * The payment amount is calculated as:
 * {@code cashAmount = units * faceValue * (annualRate / 100) * (periodMonths / 12)}
 */
@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "interest_payments")
public class InterestPayment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Asset ID of the bond this payment relates to. */
    @Column(name = "asset_id", nullable = false, length = 36)
    private String assetId;

    /** Fineract client ID of the user who received the payment. */
    @Column(name = "user_id", nullable = false)
    private Long userId;

    /** Number of bond units held by the user at payment time. */
    @Column(nullable = false, precision = 20, scale = 8)
    private BigDecimal units;

    /** Face value per unit (asset's manual price at payment time), in settlement currency. */
    @Column(name = "face_value", nullable = false, precision = 20, scale = 0)
    private BigDecimal faceValue;

    /** Annual coupon rate as a percentage (e.g. 5.80). */
    @Column(name = "annual_rate", nullable = false, precision = 8, scale = 4)
    private BigDecimal annualRate;

    /** Coupon frequency in months used for this payment calculation. */
    @Column(name = "period_months", nullable = false)
    private Integer periodMonths;

    /** Computed settlement currency amount transferred to the user. */
    @Column(name = "cash_amount", nullable = false, precision = 20, scale = 0)
    private BigDecimal cashAmount;

    /** Fineract account transfer ID, if the transfer succeeded. Null on failure. */
    @Column(name = "fineract_transfer_id")
    private Long fineractTransferId;

    /** Payment status: SUCCESS or FAILED. */
    @Column(nullable = false, length = 20)
    @Builder.Default
    private String status = "SUCCESS";

    /** Reason for failure, if status is FAILED. */
    @Column(name = "failure_reason", length = 500)
    private String failureReason;

    /** Timestamp when the payment was processed. */
    @Column(name = "paid_at", nullable = false)
    @Builder.Default
    private Instant paidAt = Instant.now();

    /** Coupon date that triggered this payment. */
    @Column(name = "coupon_date", nullable = false)
    private LocalDate couponDate;
}
