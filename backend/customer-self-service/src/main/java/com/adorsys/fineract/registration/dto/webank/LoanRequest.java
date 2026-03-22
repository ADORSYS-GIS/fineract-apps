package com.adorsys.fineract.registration.dto.webank;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record LoanRequest(
    @NotBlank String productId,
    @NotNull @Positive Long amount,
    @NotNull Integer durationValue,
    @NotBlank String durationUnit,
    @NotBlank String idempotencyKey
) {}
