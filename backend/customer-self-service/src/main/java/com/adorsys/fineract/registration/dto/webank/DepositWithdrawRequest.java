package com.adorsys.fineract.registration.dto.webank;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record DepositWithdrawRequest(
    @NotNull @Positive Long amount,
    @NotBlank String description,
    @NotBlank String idempotencyKey
) {}
