package com.adorsys.fineract.registration.controller.webank;

import com.adorsys.fineract.registration.dto.webank.*;
import com.adorsys.fineract.registration.service.webank.AgentProvisioningService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.Map;

/**
 * Agent provisioning and agency network management endpoints.
 * Called by BFF via X-CS-Api-Key authentication.
 * Tracks which bank branch services each agent float provisioning.
 */
@Slf4j
@RestController
@RequestMapping("/provisioning")
@Tag(name = "Agent Provisioning", description = "Agency network float provisioning and branch management")
public class AgentProvisioningController {

    private final AgentProvisioningService provisioningService;

    public AgentProvisioningController(AgentProvisioningService provisioningService) {
        this.provisioningService = provisioningService;
    }

    @PostMapping("/agent-float")
    @Operation(summary = "Provision agent float with servicing branch tracking")
    public ResponseEntity<ProvisionAgentFloatResponse> provisionFloat(
            @Valid @RequestBody ProvisionAgentFloatRequest req,
            @RequestHeader(value = "X-Agent-Phone", defaultValue = "") String agentPhone,
            @RequestHeader(value = "X-Home-Branch-Office-Id", defaultValue = "0") int homeBranchOfficeId,
            @RequestHeader(value = "X-Home-Branch-Name", defaultValue = "") String homeBranchName,
            @RequestHeader(value = "X-Float-Account-Id", defaultValue = "0") long floatAccountId) {

        log.info("POST /provisioning/agent-float: agent={}, amount={}, servicingOffice={}",
                req.agentKeycloakId(), req.amount(), req.servicingOfficeId());

        ProvisionAgentFloatResponse response = provisioningService.provisionFloat(
                req, agentPhone, homeBranchOfficeId, homeBranchName, floatAccountId);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/admin/agents")
    @Operation(summary = "Create agent with home branch assignment")
    public ResponseEntity<Map<String, Object>> createAgent(@Valid @RequestBody CreateAgentRequest req) {
        log.info("POST /provisioning/admin/agents: keycloakUserId={}, homeBranch={}",
                req.keycloakUserId(), req.homeBranchOfficeId());

        // The BFF handles Keycloak attribute setting (is_agent, home_branch_office_id, fee_tier).
        // CS creates the Fineract float account and records the enrollment.
        // For now, return acknowledgment — BFF orchestrates the full flow.
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "keycloak_user_id", req.keycloakUserId(),
                "home_branch_office_id", req.homeBranchOfficeId(),
                "enrollment_staff_id", req.enrollmentStaffId(),
                "status", "ENROLLED"
        ));
    }

    @PostMapping("/admin/branches/{officeId}/reassign-agents")
    @Operation(summary = "Bulk reassign agents to a new home branch")
    public ResponseEntity<ReassignAgentsResponse> reassignAgents(
            @PathVariable int officeId,
            @Valid @RequestBody ReassignAgentsRequest req,
            @RequestHeader(value = "X-Staff-Id", defaultValue = "") String staffId) {

        log.info("POST /provisioning/admin/branches/{}/reassign-agents: newOffice={}, agents={}",
                officeId, req.newOfficeId(), req.agentKeycloakIds() != null ? req.agentKeycloakIds().size() : 0);

        // The BFF provides agent branch info via headers or the request enrichment.
        // For now, CS delegates to the service with a placeholder agent info map.
        // In production, BFF fetches current branch from Keycloak and passes it.
        ReassignAgentsResponse response = provisioningService.reassignAgents(
                officeId, req, staffId, Map.of());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/admin/branches/{officeId}/report")
    @Operation(summary = "Agency report: operations, agents served, total provisioned")
    public ResponseEntity<AgencyReportResponse> getAgencyReport(
            @PathVariable int officeId,
            @RequestParam(required = false) String from,
            @RequestParam(required = false) String to) {

        log.info("GET /provisioning/admin/branches/{}/report: from={}, to={}", officeId, from, to);

        OffsetDateTime fromDate;
        try {
            fromDate = from != null
                    ? OffsetDateTime.parse(from)
                    : OffsetDateTime.now(ZoneOffset.UTC).minusDays(30);
        } catch (java.time.format.DateTimeParseException e) {
            // Try parsing as LocalDate (no offset)
            fromDate = java.time.LocalDate.parse(from)
                    .atStartOfDay(ZoneOffset.UTC).toOffsetDateTime();
        }
        OffsetDateTime toDate;
        try {
            toDate = to != null
                    ? OffsetDateTime.parse(to)
                    : OffsetDateTime.now(ZoneOffset.UTC);
        } catch (java.time.format.DateTimeParseException e) {
            toDate = java.time.LocalDate.parse(to)
                    .atTime(23, 59, 59).atOffset(ZoneOffset.UTC);
        }

        AgencyReportResponse report = provisioningService.getAgencyReport(officeId, fromDate, toDate);
        return ResponseEntity.ok(report);
    }
}
