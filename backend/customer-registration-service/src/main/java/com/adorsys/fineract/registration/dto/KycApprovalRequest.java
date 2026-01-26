package com.adorsys.fineract.registration.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KycApprovalRequest {

    @NotNull(message = "New tier is required")
    @Min(value = 1, message = "Tier must be between 1 and 3")
    @Max(value = 3, message = "Tier must be between 1 and 3")
    private Integer newTier;

    private String notes;
}
