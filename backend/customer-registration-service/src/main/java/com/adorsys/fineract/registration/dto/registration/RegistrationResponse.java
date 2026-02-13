package com.adorsys.fineract.registration.dto.registration;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class RegistrationResponse {
    private boolean success;
    private String status;
    private Long fineractClientId;
}
