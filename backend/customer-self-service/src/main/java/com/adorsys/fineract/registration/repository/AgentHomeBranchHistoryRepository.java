package com.adorsys.fineract.registration.repository;

import com.adorsys.fineract.registration.entity.AgentHomeBranchHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AgentHomeBranchHistoryRepository extends JpaRepository<AgentHomeBranchHistory, UUID> {

    List<AgentHomeBranchHistory> findByAgentKeycloakId(String agentKeycloakId);
}
