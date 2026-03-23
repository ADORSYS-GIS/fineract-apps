package com.adorsys.fineract.registration.dto.webank;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateAgentRequest(
    @NotBlank String keycloakUserId,
    @NotNull Integer homeBranchOfficeId,
    @NotBlank String enrollmentStaffId
) {}
