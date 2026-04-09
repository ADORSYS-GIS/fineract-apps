package com.adorsys.fineract.asset.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

/**
 * Persistent in-app notification record. One row per notification per user.
 * Written by the NotificationService whenever a domain event occurs that the
 * user has opted into via {@link NotificationPreferences}. Notifications are
 * surfaced in the mobile app's notification centre and marked read when the
 * user opens them.
 * <p>
 * Broadcast (userId-null) notifications may be created for system-wide
 * announcements and are visible to all users.
 */
@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "notification_log")
public class NotificationLog {

    /** Auto-generated sequential primary key. */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Fineract client ID of the intended recipient. Null for broadcast
     * notifications that are sent to all users.
     */
    @Column(name = "user_id")
    private Long userId;

    /**
     * Domain event category that triggered this notification, matched against
     * {@link NotificationPreferences} flags (e.g. {@code TRADE_EXECUTED},
     * {@code COUPON_PAID}, {@code ASSET_STATUS_CHANGED}).
     */
    @Column(name = "event_type", nullable = false, length = 50)
    private String eventType;

    /** Short notification headline shown in the notification list. Max 200 characters. */
    @Column(nullable = false, length = 200)
    private String title;

    /** Full notification body with contextual details (amounts, asset names, dates). Max 2000 characters. */
    @Column(nullable = false, length = 2000)
    private String body;

    /**
     * ID of the domain object this notification relates to, used for deep-linking
     * in the app (e.g. an order ID, asset ID, or settlement ID). Null for
     * system-wide notifications without a specific entity.
     */
    @Column(name = "reference_id", length = 36)
    private String referenceId;

    /**
     * Type name of the entity identified by {@code referenceId}, used to route
     * deep-links (e.g. {@code ORDER}, {@code ASSET}, {@code SETTLEMENT}).
     * Null when {@code referenceId} is null.
     */
    @Column(name = "reference_type", length = 30)
    private String referenceType;

    /**
     * Whether the user has opened/acknowledged this notification.
     * {@code false} on creation; set to {@code true} by the read endpoint.
     * Used to drive the unread badge count in the mobile app.
     */
    @Column(name = "is_read", nullable = false)
    private boolean read;

    /**
     * Timestamp when the user marked this notification as read.
     * Null until the read action is performed.
     */
    @Column(name = "read_at")
    private Instant readAt;

    /** Timestamp when this notification was created. Set automatically on insert; never updated. */
    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = Instant.now();
    }
}
