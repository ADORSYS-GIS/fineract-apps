package com.adorsys.fineract.registration.service.webank;

import com.adorsys.fineract.registration.dto.webank.*;
import com.adorsys.fineract.registration.entity.AgentHomeBranchHistory;
import com.adorsys.fineract.registration.entity.AgentProvisioningLog;
import com.adorsys.fineract.registration.repository.AgentHomeBranchHistoryRepository;
import com.adorsys.fineract.registration.repository.AgentProvisioningLogRepository;
import com.adorsys.fineract.registration.service.fineract.FineractAccountService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;


/**
 * Manages agent float provisioning with branch-level tracking.
 * Records which servicing branch performed each operation for agency network reporting.
 */
@Slf4j
@Service
public class AgentProvisioningService {

    private final AgentProvisioningLogRepository provisioningLogRepo;
    private final AgentHomeBranchHistoryRepository branchHistoryRepo;
    private final FineractAccountService accountService;
    private final KeycloakAdminService keycloakAdminService;

    public AgentProvisioningService(
            AgentProvisioningLogRepository provisioningLogRepo,
            AgentHomeBranchHistoryRepository branchHistoryRepo,
            FineractAccountService accountService,
            KeycloakAdminService keycloakAdminService) {
        this.provisioningLogRepo = provisioningLogRepo;
        this.branchHistoryRepo = branchHistoryRepo;
        this.accountService = accountService;
        this.keycloakAdminService = keycloakAdminService;
    }

    /**
     * Provisions float for an agent, recording the servicing branch for audit.
     * Steps:
     *   1. Deposit to the agent's float account in Fineract
     *   2. Log the provisioning with home_branch and servicing_office
     *   3. Return receipt
     */
    public ProvisionAgentFloatResponse provisionFloat(
            ProvisionAgentFloatRequest req,
            String agentPhone,
            int homeBranchOfficeId,
            String homeBranchName,
            long floatAccountId) {

        log.info("Provisioning float: agent={}, amount={}, servicingOffice={}, homeBranch={}",
                req.agentKeycloakId(), req.amount(), req.servicingOfficeId(), homeBranchOfficeId);

        // 1. Deposit to agent's float account in Fineract
        String idempotencyKey = "prov-" + req.agentKeycloakId() + "-" + System.currentTimeMillis();
        Map<String, Object> depositResult = accountService.makeDeposit(
                floatAccountId, BigDecimal.valueOf(req.amount()), "Agency Float Credit", idempotencyKey);

        long fineractTxnId = depositResult != null
                ? ((Number) depositResult.getOrDefault("resourceId", 0L)).longValue()
                : 0L;

        // 2. Log the provisioning
        String receiptRef = "PROV-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        AgentProvisioningLog logEntry = new AgentProvisioningLog();
        logEntry.setFineractTxnId(fineractTxnId);
        logEntry.setAgentKeycloakId(req.agentKeycloakId());
        logEntry.setAgentPhone(agentPhone);
        logEntry.setAmountXaf(req.amount());
        logEntry.setHomeBranchOfficeId(homeBranchOfficeId);
        logEntry.setHomeBranchName(homeBranchName);
        logEntry.setServicingOfficeId(req.servicingOfficeId());
        logEntry.setServicingBranchName(req.servicingBranchName());
        logEntry.setStaffId(req.staffId());
        logEntry.setStaffName(req.staffName());
        logEntry.setReceiptRef(receiptRef);

        logEntry = provisioningLogRepo.save(logEntry);

        log.info("Float provisioned: receiptRef={}, txnId={}", receiptRef, fineractTxnId);

        return new ProvisionAgentFloatResponse(
                logEntry.getId(),
                fineractTxnId,
                req.amount(),
                receiptRef,
                logEntry.getExecutedAt()
        );
    }

    /**
     * Bulk-reassigns agents to a new home branch.
     * Records each change in agent_home_branch_history.
     */
    public ReassignAgentsResponse reassignAgents(
            int currentOfficeId,
            ReassignAgentsRequest req,
            String changedBy,
            Map<String, String[]> agentBranchInfo) {

        log.info("Reassigning agents from office {} to {}: count={}",
                currentOfficeId, req.newOfficeId(), req.agentKeycloakIds().size());

        List<ReassignAgentsResponse.ReassignedAgent> reassigned = new ArrayList<>();
        List<AgentHomeBranchHistory> historyEntries = new ArrayList<>();

        for (String agentId : req.agentKeycloakIds()) {
            // Use the current office as the previous office for all agents in this batch.
            // The caller provides the currentOfficeId from the URL path.
            int previousOfficeId = currentOfficeId;
            String previousOfficeName = agentBranchInfo.containsKey(agentId)
                    ? agentBranchInfo.get(agentId)[0]
                    : "Office " + currentOfficeId;

            AgentHomeBranchHistory history = new AgentHomeBranchHistory();
            history.setAgentKeycloakId(agentId);
            history.setPreviousOfficeId(previousOfficeId);
            history.setPreviousOfficeName(previousOfficeName);
            history.setNewOfficeId(req.newOfficeId());
            history.setNewOfficeName(req.newOfficeName());
            history.setChangedBy(changedBy);
            history.setReason(req.reason());

            historyEntries.add(history);

            reassigned.add(new ReassignAgentsResponse.ReassignedAgent(
                    agentId, previousOfficeName, req.newOfficeName()));
        }

        branchHistoryRepo.saveAll(historyEntries);

        // Update Keycloak user attributes for each reassigned agent (synchronous to avoid split-brain).
        for (String agentId : req.agentKeycloakIds()) {
            try {
                keycloakAdminService.updateUserAttributes(agentId, Map.of(
                        "home_branch_office_id", List.of(String.valueOf(req.newOfficeId())),
                        "home_branch_name", List.of(req.newOfficeName())
                ));
                log.info("Keycloak attributes updated for agent {}: officeId={}, officeName={}",
                        agentId, req.newOfficeId(), req.newOfficeName());
            } catch (Exception e) {
                log.error("Failed to update Keycloak attributes for agent {}: {}",
                        agentId, e.getMessage(), e);
            }
        }

        log.info("Agents reassigned: {}", reassigned.size());
        return new ReassignAgentsResponse(reassigned.size(), reassigned);
    }

    /**
     * Generates an agency report for a specific branch over a date range.
     */
    public AgencyReportResponse getAgencyReport(int officeId, OffsetDateTime from, OffsetDateTime to) {
        Object[] agg = provisioningLogRepo.getAggregates(officeId, from, to);
        long opsCount = ((Number) agg[0]).longValue();
        long agentsServed = ((Number) agg[1]).longValue();
        long totalProvisioned = ((Number) agg[2]).longValue();

        // For single-branch report, return a list with one entry
        List<AgencyReportResponse.AgencyStats> stats = List.of(
                new AgencyReportResponse.AgencyStats(
                        "Branch " + officeId,
                        officeId,
                        opsCount,
                        agentsServed,
                        totalProvisioned
                )
        );

        return new AgencyReportResponse(stats);
    }
}
