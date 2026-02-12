package com.adorsys.fineract.registration.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KycStatusResponse {

    private Integer kycTier;
    private String kycStatus;
    private List<DocumentStatus> documents;
    private List<String> requiredDocuments;
    private List<String> missingDocuments;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DocumentStatus {
        private String documentType;
        private String status;
        private Instant uploadedAt;
        private String rejectionReason;
    }
}
