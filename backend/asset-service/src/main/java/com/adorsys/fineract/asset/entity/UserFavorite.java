package com.adorsys.fineract.asset.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

/**
 * Tracks which assets a user has marked as favorites (watchlist).
 * One row per (userId, assetId) pair.
 */
@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "user_favorites", uniqueConstraints = {
    @UniqueConstraint(name = "uq_user_favorites", columnNames = {"user_id", "asset_id"})
})
public class UserFavorite {

    /** Auto-generated sequential primary key. */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Fineract user/client ID that favorited this asset. */
    @Column(name = "user_id", nullable = false)
    private Long userId;

    /** ID of the favorited asset. References {@link Asset#id}. */
    @Column(name = "asset_id", nullable = false)
    private String assetId;

    /** Lazy-loaded reference to the Asset entity. Read-only (not insertable/updatable). */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "asset_id", insertable = false, updatable = false)
    private Asset asset;

    /** Timestamp when the user favorited this asset. Set automatically, never updated. */
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = Instant.now();
    }
}
