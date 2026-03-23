package com.adorsys.fineract.registration.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "user_preferences", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "pref_key"})
})
@Getter
@Setter
@NoArgsConstructor
public class UserPreference {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(name = "pref_key", nullable = false, length = 100)
    private String prefKey;

    @Column(name = "pref_value", nullable = false, length = 500)
    private String prefValue;

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    @PrePersist
    void prePersist() {
        if (updatedAt == null) {
            updatedAt = OffsetDateTime.now();
        }
    }

    @PreUpdate
    void preUpdate() {
        updatedAt = OffsetDateTime.now();
    }
}
