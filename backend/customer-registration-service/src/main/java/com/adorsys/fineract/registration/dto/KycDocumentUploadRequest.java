package com.adorsys.fineract.registration.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KycDocumentUploadRequest {

    /**
     * Type of KYC document being uploaded.
     * Valid values: id_front, id_back, selfie_with_id
     */
    @NotBlank(message = "Document type is required")
    @Pattern(regexp = "id_front|id_back|selfie_with_id", message = "Invalid document type. Must be: id_front, id_back, or selfie_with_id")
    private String documentType;
}
