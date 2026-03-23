package com.adorsys.fineract.registration.dto.webank;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record ProvisionAgentFloatRequest(
    @NotBlank String agentKeycloakId,
    @NotNull @Positive Long amount,
    @NotNull Integer servicingOfficeId,
    @NotBlank String servicingBranchName,
    @NotBlank String staffId,
    String staffName
) {}
