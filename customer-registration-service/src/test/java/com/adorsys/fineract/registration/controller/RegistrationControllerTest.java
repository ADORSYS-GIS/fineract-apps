package com.adorsys.fineract.registration.controller;

import com.adorsys.fineract.registration.dto.*;
import com.adorsys.fineract.registration.exception.RegistrationException;
import com.adorsys.fineract.registration.service.RegistrationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(RegistrationController.class)
class RegistrationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private RegistrationService registrationService;

    @Nested
    @DisplayName("POST /api/registration/register")
    class RegisterEndpoint {

        @Test
        @DisplayName("should register new customer successfully")
        @WithMockUser
        void shouldRegisterSuccessfully() throws Exception {
            // Given
            RegistrationRequest request = RegistrationRequest.builder()
                    .firstName("John")
                    .lastName("Doe")
                    .email("john.doe@example.com")
                    .phoneNumber("+237612345678")
                    .dateOfBirth("1990-01-15")
                    .nationality("CM")
                    .build();

            RegistrationResponse response = RegistrationResponse.success("ext-123");

            when(registrationService.register(any(RegistrationRequest.class))).thenReturn(response);

            // When/Then
            mockMvc.perform(post("/api/registration/register")
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath("$.externalId").value("ext-123"))
                    .andExpect(jsonPath("$.success").value(true));
        }

        @Test
        @DisplayName("should return 400 for invalid request")
        @WithMockUser
        void shouldReturn400ForInvalidRequest() throws Exception {
            // Given
            RegistrationRequest request = RegistrationRequest.builder()
                    .firstName("") // invalid - empty
                    .lastName("Doe")
                    .email("invalid-email") // invalid format
                    .build();

            // When/Then
            mockMvc.perform(post("/api/registration/register")
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("should return 400 when registration fails")
        @WithMockUser
        void shouldReturn400WhenRegistrationFails() throws Exception {
            // Given
            RegistrationRequest request = RegistrationRequest.builder()
                    .firstName("John")
                    .lastName("Doe")
                    .email("john.doe@example.com")
                    .phoneNumber("+237612345678")
                    .dateOfBirth("1990-01-15")
                    .nationality("CM")
                    .build();

            when(registrationService.register(any(RegistrationRequest.class)))
                    .thenThrow(new RegistrationException("Email already exists"));

            // When/Then
            mockMvc.perform(post("/api/registration/register")
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.message").value("Email already exists"));
        }

        @Test
        @DisplayName("should reject unauthenticated requests when endpoint is protected")
        void shouldRejectUnauthenticatedRequests() throws Exception {
            // Given
            RegistrationRequest request = RegistrationRequest.builder()
                    .firstName("John")
                    .lastName("Doe")
                    .email("john.doe@example.com")
                    .phoneNumber("+237612345678")
                    .build();

            // When/Then
            mockMvc.perform(post("/api/registration/register")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isForbidden());
        }
    }

    @Nested
    @DisplayName("GET /api/registration/status/{externalId}")
    class StatusEndpoint {

        @Test
        @DisplayName("should return registration status")
        @WithMockUser
        void shouldReturnStatus() throws Exception {
            // Given
            String externalId = "ext-123";
            RegistrationStatusResponse response = RegistrationStatusResponse.builder()
                    .externalId(externalId)
                    .registrationStatus("completed")
                    .emailVerified(true)
                    .webAuthnRegistered(true)
                    .kycTier(2)
                    .kycStatus("approved")
                    .build();

            when(registrationService.getStatus(externalId)).thenReturn(response);

            // When/Then
            mockMvc.perform(get("/api/registration/status/{externalId}", externalId))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.externalId").value(externalId))
                    .andExpect(jsonPath("$.registrationStatus").value("completed"))
                    .andExpect(jsonPath("$.kycTier").value(2));
        }

        @Test
        @DisplayName("should return 404 when not found")
        @WithMockUser
        void shouldReturn404WhenNotFound() throws Exception {
            // Given
            String externalId = "non-existent";
            when(registrationService.getStatus(externalId))
                    .thenThrow(new RegistrationException("NOT_FOUND", "Registration not found", "externalId"));

            // When/Then
            mockMvc.perform(get("/api/registration/status/{externalId}", externalId))
                    .andExpect(status().isBadRequest());
        }
    }

    @Nested
    @DisplayName("GET /api/registration/limits")
    class LimitsEndpoint {

        @Test
        @DisplayName("should return limits for authenticated user")
        @WithMockUser(username = "user", authorities = {"SCOPE_openid"})
        void shouldReturnLimits() throws Exception {
            // Given
            LimitsResponse response = LimitsResponse.builder()
                    .tier(2)
                    .tierName("Standard")
                    .currency("XAF")
                    .limits(LimitsResponse.LimitsDto.builder()
                            .dailyDeposit(BigDecimal.valueOf(500000))
                            .dailyWithdrawal(BigDecimal.valueOf(200000))
                            .monthlyDeposit(BigDecimal.valueOf(5000000))
                            .monthlyWithdrawal(BigDecimal.valueOf(2000000))
                            .build())
                    .build();

            when(registrationService.getLimits(anyString())).thenReturn(response);

            // When/Then
            mockMvc.perform(get("/api/registration/limits")
                            .param("externalId", "ext-123"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.tier").value(2))
                    .andExpect(jsonPath("$.tierName").value("Standard"))
                    .andExpect(jsonPath("$.limits.dailyDeposit").value(500000));
        }
    }

    @Nested
    @DisplayName("GET /api/registration/kyc/status")
    class KycStatusEndpoint {

        @Test
        @DisplayName("should return KYC status")
        @WithMockUser
        void shouldReturnKycStatus() throws Exception {
            // Given
            KycStatusResponse response = KycStatusResponse.builder()
                    .kycTier(1)
                    .kycStatus("pending")
                    .requiredDocuments(java.util.List.of("ID_FRONT", "ID_BACK"))
                    .missingDocuments(java.util.List.of("ID_FRONT", "ID_BACK"))
                    .build();

            when(registrationService.getKycStatus(anyString())).thenReturn(response);

            // When/Then
            mockMvc.perform(get("/api/registration/kyc/status")
                            .param("externalId", "ext-123"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.kycTier").value(1))
                    .andExpect(jsonPath("$.kycStatus").value("pending"));
        }
    }
}
