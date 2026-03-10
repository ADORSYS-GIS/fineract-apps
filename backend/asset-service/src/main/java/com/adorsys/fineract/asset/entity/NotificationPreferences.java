package com.adorsys.fineract.asset.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

/**
 * Per-user notification preferences. Controls which event types generate notifications.
 */
@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "notification_preferences")
public class NotificationPreferences {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false, unique = true)
    private Long userId;

    @Column(name = "trade_executed", nullable = false)
    @Builder.Default
    private boolean tradeExecuted = true;

    @Column(name = "coupon_paid", nullable = false)
    @Builder.Default
    private boolean couponPaid = true;

    @Column(name = "redemption_completed", nullable = false)
    @Builder.Default
    private boolean redemptionCompleted = true;

    @Column(name = "asset_status_changed", nullable = false)
    @Builder.Default
    private boolean assetStatusChanged = true;

    @Column(name = "order_stuck", nullable = false)
    @Builder.Default
    private boolean orderStuck = true;

    @Column(name = "income_paid", nullable = false)
    @Builder.Default
    private boolean incomePaid = true;

    @Column(name = "treasury_shortfall", nullable = false)
    @Builder.Default
    private boolean treasuryShortfall = true;

    @Column(name = "delisting_announced", nullable = false)
    @Builder.Default
    private boolean delistingAnnounced = true;

    @Column(name = "updated_at")
    private Instant updatedAt;

    @PreUpdate
    protected void onUpdate() {
        updatedAt = Instant.now();
    }
}
