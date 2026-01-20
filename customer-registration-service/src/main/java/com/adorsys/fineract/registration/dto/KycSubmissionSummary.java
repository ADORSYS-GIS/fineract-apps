package com.adorsys.fineract.registration.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KycSubmissionSummary {
    private String externalId;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private int kycTier;
    private String kycStatus;
    private String submittedAt;
}
