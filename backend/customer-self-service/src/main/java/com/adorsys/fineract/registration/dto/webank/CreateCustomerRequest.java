package com.adorsys.fineract.registration.dto.webank;

import jakarta.validation.constraints.NotBlank;

public record CreateCustomerRequest(
    @NotBlank String phone,
    @NotBlank String keycloakId
) {}
