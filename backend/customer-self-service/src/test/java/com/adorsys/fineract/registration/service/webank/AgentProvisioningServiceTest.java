package com.adorsys.fineract.registration.service.webank;

import com.adorsys.fineract.registration.dto.webank.*;
import com.adorsys.fineract.registration.entity.AgentHomeBranchHistory;
import com.adorsys.fineract.registration.entity.AgentProvisioningLog;
import com.adorsys.fineract.registration.repository.AgentHomeBranchHistoryRepository;
import com.adorsys.fineract.registration.repository.AgentProvisioningLogRepository;
import com.adorsys.fineract.registration.service.fineract.FineractAccountService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("AgentProvisioningService Tests")
class AgentProvisioningServiceTest {

    @Mock
    private AgentProvisioningLogRepository provisioningLogRepo;

    @Mock
    private AgentHomeBranchHistoryRepository branchHistoryRepo;

    @Mock
    private FineractAccountService accountService;

    @InjectMocks
    private AgentProvisioningService service;

    // -----------------------------------------------------------------------
    // provisionFloat
    // -----------------------------------------------------------------------

    @Nested
    @DisplayName("provisionFloat")
    class ProvisionFloat {

        @Test
        @DisplayName("should deposit to agent float account and create provisioning log")
        void provisionFloat_Success() {
            // Arrange
            ProvisionAgentFloatRequest req = new ProvisionAgentFloatRequest(
                    "agent-kc-1", 500000L, 1, "Douala Branch", "staff-1", "Jean Admin");

            Map<String, Object> depositResult = new HashMap<>();
            depositResult.put("resourceId", 42L);
            when(accountService.makeDeposit(eq(100L), eq(BigDecimal.valueOf(500000L)),
                    eq("Agency Float Credit"), anyString()))
                    .thenReturn(depositResult);

            when(provisioningLogRepo.save(any(AgentProvisioningLog.class)))
                    .thenAnswer(invocation -> {
                        AgentProvisioningLog log = invocation.getArgument(0);
                        log.setId(UUID.randomUUID());
                        log.setExecutedAt(OffsetDateTime.now());
                        return log;
                    });

            // Act
            ProvisionAgentFloatResponse resp = service.provisionFloat(
                    req, "+237600000001", 1, "Douala Branch", 100L);

            // Assert
            assertNotNull(resp);
            assertEquals(500000L, resp.amount());
            assertNotNull(resp.receiptRef());
            assertTrue(resp.receiptRef().startsWith("PROV-"));
            assertNotNull(resp.id());
            assertEquals(42L, resp.fineractTxnId());

            // Verify deposit was called
            verify(accountService).makeDeposit(eq(100L), eq(BigDecimal.valueOf(500000L)),
                    eq("Agency Float Credit"), anyString());

            // Verify log was saved with correct fields
            ArgumentCaptor<AgentProvisioningLog> logCaptor = ArgumentCaptor.forClass(AgentProvisioningLog.class);
            verify(provisioningLogRepo).save(logCaptor.capture());

            AgentProvisioningLog savedLog = logCaptor.getValue();
            assertEquals("agent-kc-1", savedLog.getAgentKeycloakId());
            assertEquals("+237600000001", savedLog.getAgentPhone());
            assertEquals(500000L, savedLog.getAmountXaf());
            assertEquals(1, savedLog.getHomeBranchOfficeId());
            assertEquals("Douala Branch", savedLog.getHomeBranchName());
            assertEquals(1, savedLog.getServicingOfficeId());
            assertEquals("Douala Branch", savedLog.getServicingBranchName());
            assertEquals("staff-1", savedLog.getStaffId());
            assertEquals("Jean Admin", savedLog.getStaffName());
        }

        @Test
        @DisplayName("should handle null deposit result gracefully")
        void provisionFloat_NullDepositResult() {
            ProvisionAgentFloatRequest req = new ProvisionAgentFloatRequest(
                    "agent-kc-2", 100000L, 2, "Yaoundé Branch", "staff-2", null);

            when(accountService.makeDeposit(anyLong(), any(BigDecimal.class),
                    anyString(), anyString())).thenReturn(null);

            when(provisioningLogRepo.save(any(AgentProvisioningLog.class)))
                    .thenAnswer(invocation -> {
                        AgentProvisioningLog log = invocation.getArgument(0);
                        log.setId(UUID.randomUUID());
                        log.setExecutedAt(OffsetDateTime.now());
                        return log;
                    });

            ProvisionAgentFloatResponse resp = service.provisionFloat(
                    req, "+237600000002", 3, "Bafoussam Branch", 200L);

            assertNotNull(resp);
            assertEquals(100000L, resp.amount());
            assertEquals(0L, resp.fineractTxnId());
        }
    }

    // -----------------------------------------------------------------------
    // reassignAgents
    // -----------------------------------------------------------------------

    @Nested
    @DisplayName("reassignAgents")
    class ReassignAgents {

        @Test
        @DisplayName("should reassign known agents and record history")
        void reassignAgents_Success() {
            ReassignAgentsRequest req = new ReassignAgentsRequest(
                    2, "Yaoundé Central", "Office restructure",
                    List.of("agent-1", "agent-2"));

            Map<String, String[]> agentBranchInfo = new HashMap<>();
            agentBranchInfo.put("agent-1", new String[]{"Douala Branch", "1"});
            agentBranchInfo.put("agent-2", new String[]{"Douala Branch", "1"});

            when(branchHistoryRepo.save(any(AgentHomeBranchHistory.class)))
                    .thenAnswer(invocation -> invocation.getArgument(0));

            ReassignAgentsResponse resp = service.reassignAgents(
                    1, req, "admin-user", agentBranchInfo);

            assertEquals(2, resp.agentsReassigned());
            assertEquals(2, resp.agents().size());

            // Verify each agent's history was recorded
            verify(branchHistoryRepo, times(2)).save(any(AgentHomeBranchHistory.class));

            // Verify agent details
            ReassignAgentsResponse.ReassignedAgent first = resp.agents().get(0);
            assertEquals("agent-1", first.agentKeycloakId());
            assertEquals("Douala Branch", first.previousOfficeName());
            assertEquals("Yaoundé Central", first.newOfficeName());
        }

        @Test
        @DisplayName("should skip unknown agents")
        void reassignAgents_SkipsUnknownAgents() {
            ReassignAgentsRequest req = new ReassignAgentsRequest(
                    2, "Yaoundé Central", "restructure",
                    List.of("agent-1", "unknown-agent"));

            Map<String, String[]> agentBranchInfo = new HashMap<>();
            agentBranchInfo.put("agent-1", new String[]{"Douala Branch", "1"});
            // "unknown-agent" is not in the map

            when(branchHistoryRepo.save(any(AgentHomeBranchHistory.class)))
                    .thenAnswer(invocation -> invocation.getArgument(0));

            ReassignAgentsResponse resp = service.reassignAgents(
                    1, req, "admin-user", agentBranchInfo);

            assertEquals(1, resp.agentsReassigned());
            assertEquals(1, resp.agents().size());
            verify(branchHistoryRepo, times(1)).save(any(AgentHomeBranchHistory.class));
        }

        @Test
        @DisplayName("should handle empty agent list")
        void reassignAgents_EmptyList() {
            ReassignAgentsRequest req = new ReassignAgentsRequest(
                    2, "Yaoundé Central", "restructure", List.of());

            ReassignAgentsResponse resp = service.reassignAgents(
                    1, req, "admin-user", new HashMap<>());

            assertEquals(0, resp.agentsReassigned());
            assertEquals(0, resp.agents().size());
            verify(branchHistoryRepo, never()).save(any());
        }
    }

    // -----------------------------------------------------------------------
    // getAgencyReport
    // -----------------------------------------------------------------------

    @Nested
    @DisplayName("getAgencyReport")
    class GetAgencyReport {

        @Test
        @DisplayName("should return report with provisioning statistics")
        void getAgencyReport_Success() {
            OffsetDateTime from = OffsetDateTime.now().minusDays(30);
            OffsetDateTime to = OffsetDateTime.now();

            when(provisioningLogRepo.countByServicingOffice(1, from, to)).thenReturn(15L);
            when(provisioningLogRepo.countDistinctAgentsByServicingOffice(1, from, to)).thenReturn(5L);
            when(provisioningLogRepo.sumAmountByServicingOffice(1, from, to)).thenReturn(7500000L);

            AgencyReportResponse resp = service.getAgencyReport(1, from, to);

            assertNotNull(resp);
            assertEquals(1, resp.branches().size());

            AgencyReportResponse.AgencyStats stats = resp.branches().get(0);
            assertEquals(1, stats.officeId());
            assertEquals(15L, stats.opsCount());
            assertEquals(5L, stats.agentsServed());
            assertEquals(7500000L, stats.totalProvisioned());
        }

        @Test
        @DisplayName("should return zero stats when no activity")
        void getAgencyReport_NoActivity() {
            OffsetDateTime from = OffsetDateTime.now().minusDays(7);
            OffsetDateTime to = OffsetDateTime.now();

            when(provisioningLogRepo.countByServicingOffice(99, from, to)).thenReturn(0L);
            when(provisioningLogRepo.countDistinctAgentsByServicingOffice(99, from, to)).thenReturn(0L);
            when(provisioningLogRepo.sumAmountByServicingOffice(99, from, to)).thenReturn(0L);

            AgencyReportResponse resp = service.getAgencyReport(99, from, to);

            AgencyReportResponse.AgencyStats stats = resp.branches().get(0);
            assertEquals(0L, stats.opsCount());
            assertEquals(0L, stats.agentsServed());
            assertEquals(0L, stats.totalProvisioned());
        }
    }
}
