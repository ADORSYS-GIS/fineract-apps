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
public class RegistrationResponse {

    private String externalId;
    private String status;
    private String message;
    private List<String> nextSteps;

    public static RegistrationResponse success(String externalId) {
        return RegistrationResponse.builder()
                .externalId(externalId)
                .status("pending_verification")
                .message("Registration successful. Please check your email to verify your account and set up passwordless authentication.")
                .nextSteps(List.of("VERIFY_EMAIL", "REGISTER_WEBAUTHN"))
                .build();
    }

    public static RegistrationResponse error(String message) {
        return RegistrationResponse.builder()
                .status("error")
                .message(message)
                .build();
    }
}
