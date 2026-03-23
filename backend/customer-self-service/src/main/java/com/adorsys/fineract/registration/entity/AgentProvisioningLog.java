package com.adorsys.fineract.registration.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "agent_provisioning_log", indexes = {
    @Index(name = "idx_prov_log_office_executed", columnList = "servicing_office_id, executed_at")
})
@Getter
@Setter
@NoArgsConstructor
public class AgentProvisioningLog {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "fineract_txn_id", nullable = false)
    private Long fineractTxnId;

    @Column(name = "agent_keycloak_id", nullable = false)
    private String agentKeycloakId;

    @Column(name = "agent_phone", nullable = false, length = 20)
    private String agentPhone;

    @Column(name = "amount_xaf", nullable = false)
    private Long amountXaf;

    @Column(name = "home_branch_office_id", nullable = false)
    private Integer homeBranchOfficeId;

    @Column(name = "home_branch_name", nullable = false, length = 100)
    private String homeBranchName;

    @Column(name = "servicing_office_id", nullable = false)
    private Integer servicingOfficeId;

    @Column(name = "servicing_branch_name", nullable = false, length = 100)
    private String servicingBranchName;

    @Column(name = "is_home_branch", insertable = false, updatable = false)
    private Boolean isHomeBranch;

    @Column(name = "staff_id", nullable = false)
    private String staffId;

    @Column(name = "staff_name")
    private String staffName;

    @Column(name = "receipt_ref", length = 100)
    private String receiptRef;

    @Column(name = "executed_at", nullable = false)
    private OffsetDateTime executedAt;

    @PrePersist
    void prePersist() {
        if (executedAt == null) {
            executedAt = OffsetDateTime.now();
        }
    }
}
