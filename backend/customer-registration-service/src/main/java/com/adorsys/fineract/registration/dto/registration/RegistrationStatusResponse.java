package com.adorsys.fineract.registration.dto.registration;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegistrationStatusResponse {

    private String externalId;
    private String registrationStatus;
    private boolean emailVerified;
    private boolean webAuthnRegistered;
    private Integer kycTier;
    private String kycStatus;
}
