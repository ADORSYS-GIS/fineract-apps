package com.adorsys.fineract.registration.dto.webank;

import java.util.List;

public record ReassignAgentsResponse(
    int agentsReassigned,
    List<ReassignedAgent> agents
) {
    public record ReassignedAgent(
        String agentKeycloakId,
        String previousOfficeName,
        String newOfficeName
    ) {}
}
