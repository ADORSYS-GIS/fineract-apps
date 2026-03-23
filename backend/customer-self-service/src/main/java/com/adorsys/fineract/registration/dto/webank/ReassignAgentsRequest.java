package com.adorsys.fineract.registration.dto.webank;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record ReassignAgentsRequest(
    @NotNull Integer newOfficeId,
    @NotBlank String newOfficeName,
    @NotBlank String reason,
    List<String> agentKeycloakIds
) {}
