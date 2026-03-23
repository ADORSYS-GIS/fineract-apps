package com.adorsys.fineract.registration.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "agent_home_branch_history")
@Getter
@Setter
@NoArgsConstructor
public class AgentHomeBranchHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "agent_keycloak_id", nullable = false)
    private String agentKeycloakId;

    @Column(name = "previous_office_id", nullable = false)
    private Integer previousOfficeId;

    @Column(name = "previous_office_name", nullable = false, length = 100)
    private String previousOfficeName;

    @Column(name = "new_office_id", nullable = false)
    private Integer newOfficeId;

    @Column(name = "new_office_name", nullable = false, length = 100)
    private String newOfficeName;

    @Column(name = "changed_at", nullable = false)
    private OffsetDateTime changedAt;

    @Column(name = "changed_by", nullable = false)
    private String changedBy;

    @Column(name = "reason", nullable = false, length = 50)
    private String reason;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @PrePersist
    void prePersist() {
        if (changedAt == null) {
            changedAt = OffsetDateTime.now();
        }
    }
}
