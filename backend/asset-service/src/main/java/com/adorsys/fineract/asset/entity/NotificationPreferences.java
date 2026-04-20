package com.adorsys.fineract.asset.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

/**
 * Per-user notification opt-in preferences. One row per user, created with all
 * channels enabled when the user first logs in. Each boolean flag maps to a
 * domain event category; when {@code false}, the NotificationService skips
 * writing a {@link NotificationLog} row for that user and event type.
 * <p>
 * All flags default to {@code true} so that new users receive all notifications
 * without needing to configure anything.
 */
@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "notification_preferences")
public class NotificationPreferences {

    /** Auto-generated sequential primary key. */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Fineract client ID of the user these preferences belong to. Unique per user. */
    @Column(name = "user_id", nullable = false, unique = true)
    private Long userId;

    /**
     * When {@code true}, the user receives a notification each time one of their
     * BUY or SELL orders is filled or definitively rejected.
     */
    @Column(name = "trade_executed", nullable = false)
    @Builder.Default
    private boolean tradeExecuted = true;

    /**
     * When {@code true}, the user receives a notification each time a bond coupon
     * payment is deposited to their account.
     */
    @Column(name = "coupon_paid", nullable = false)
    @Builder.Default
    private boolean couponPaid = true;

    /**
     * When {@code true}, the user receives a notification when their bond holdings
     * are redeemed at maturity and cash is returned to their account.
     */
    @Column(name = "redemption_completed", nullable = false)
    @Builder.Default
    private boolean redemptionCompleted = true;

    /**
     * When {@code true}, the user receives a notification whenever an asset they
     * hold changes lifecycle status (ACTIVE → HALTED, DELISTED, MATURED, etc.).
     */
    @Column(name = "asset_status_changed", nullable = false)
    @Builder.Default
    private boolean assetStatusChanged = true;

    /**
     * When {@code true}, the user receives an alert if one of their orders has been
     * in EXECUTING state beyond the stuck-order threshold (currently 15 minutes),
     * prompting them to contact support.
     */
    @Column(name = "order_stuck", nullable = false)
    @Builder.Default
    private boolean orderStuck = true;

    /**
     * When {@code true}, the user receives a notification each time a non-bond
     * income distribution (dividend, rent, harvest yield) is credited to their account.
     */
    @Column(name = "income_paid", nullable = false)
    @Builder.Default
    private boolean incomePaid = true;

    /**
     * When {@code true}, the user receives an admin-facing alert when the LP's
     * treasury cash account has insufficient funds to cover an upcoming coupon
     * or income payment. This preference is typically only meaningful for admin
     * users who monitor treasury health.
     */
    @Column(name = "treasury_shortfall", nullable = false)
    @Builder.Default
    private boolean treasuryShortfall = true;

    /**
     * When {@code true}, the user receives an advance notice when an asset they
     * hold is scheduled for delisting and forced buyback, so they can decide
     * whether to sell before the buyback price is applied.
     */
    @Column(name = "delisting_announced", nullable = false)
    @Builder.Default
    private boolean delistingAnnounced = true;

    /** Timestamp of the most recent preference change. Null until first update after creation. */
    @Column(name = "updated_at")
    private Instant updatedAt;

    @PreUpdate
    protected void onUpdate() {
        updatedAt = Instant.now();
    }
}
