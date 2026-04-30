package com.adorsys.fineract.asset.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateLpRequest(
        @NotNull Long lpClientId,
        @NotNull @Size(max = 200) String lpClientName
) {}
