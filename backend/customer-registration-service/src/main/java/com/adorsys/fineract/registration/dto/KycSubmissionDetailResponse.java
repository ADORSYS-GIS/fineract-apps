package com.adorsys.fineract.registration.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KycSubmissionDetailResponse {
    private String externalId;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private String dateOfBirth;
    private String nationality;
    private int kycTier;
    private String kycStatus;
    private List<KycDocumentDto> documents;
    private String submittedAt;
    private String reviewedAt;
    private String reviewedBy;
    private String rejectionReason;
    private String reviewNotes;
}
