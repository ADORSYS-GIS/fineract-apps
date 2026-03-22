package com.adorsys.fineract.registration.dto.webank;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record TransferRequest(
    @NotBlank String fromCustomerId,
    @NotBlank String toCustomerId,
    @NotNull @Positive Long amount,
    Long feeAmount,
    String feeGLAccountId,
    String platformFeeAccountId,
    @NotBlank String idempotencyKey,
    String description
) {}
