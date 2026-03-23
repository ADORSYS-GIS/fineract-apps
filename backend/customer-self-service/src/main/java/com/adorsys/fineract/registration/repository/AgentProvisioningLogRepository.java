package com.adorsys.fineract.registration.repository;

import com.adorsys.fineract.registration.entity.AgentProvisioningLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface AgentProvisioningLogRepository extends JpaRepository<AgentProvisioningLog, UUID> {

    List<AgentProvisioningLog> findByServicingOfficeIdAndExecutedAtBetween(
            Integer servicingOfficeId, OffsetDateTime from, OffsetDateTime to);

    List<AgentProvisioningLog> findByHomeBranchOfficeIdAndExecutedAtBetween(
            Integer homeBranchOfficeId, OffsetDateTime from, OffsetDateTime to);

    List<AgentProvisioningLog> findByAgentKeycloakId(String agentKeycloakId);

    @Query("SELECT COUNT(DISTINCT p.agentKeycloakId) FROM AgentProvisioningLog p " +
           "WHERE p.servicingOfficeId = :officeId AND p.executedAt BETWEEN :from AND :to")
    long countDistinctAgentsByServicingOffice(
            @Param("officeId") Integer officeId,
            @Param("from") OffsetDateTime from,
            @Param("to") OffsetDateTime to);

    @Query("SELECT COALESCE(SUM(p.amountXaf), 0) FROM AgentProvisioningLog p " +
           "WHERE p.servicingOfficeId = :officeId AND p.executedAt BETWEEN :from AND :to")
    long sumAmountByServicingOffice(
            @Param("officeId") Integer officeId,
            @Param("from") OffsetDateTime from,
            @Param("to") OffsetDateTime to);

    @Query("SELECT COUNT(p) FROM AgentProvisioningLog p " +
           "WHERE p.servicingOfficeId = :officeId AND p.executedAt BETWEEN :from AND :to")
    long countByServicingOffice(
            @Param("officeId") Integer officeId,
            @Param("from") OffsetDateTime from,
            @Param("to") OffsetDateTime to);

    @Query("SELECT COUNT(p), COUNT(DISTINCT p.agentKeycloakId), COALESCE(SUM(p.amountXaf), 0) " +
           "FROM AgentProvisioningLog p " +
           "WHERE p.servicingOfficeId = :officeId AND p.executedAt BETWEEN :from AND :to")
    Object[] getAggregates(
            @Param("officeId") Integer officeId,
            @Param("from") OffsetDateTime from,
            @Param("to") OffsetDateTime to);
}
