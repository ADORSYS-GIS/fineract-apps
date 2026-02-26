package com.adorsys.fineract.registration.service.registration;

import com.adorsys.fineract.registration.dto.registration.RegistrationRequest;
import com.adorsys.fineract.registration.exception.RegistrationException;
import com.adorsys.fineract.registration.service.FineractService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@SuppressWarnings("null")
class RegistrationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private FineractService fineractService;

    private RegistrationRequest validRequest;

    @BeforeEach
    void setUp() {
        validRequest = new RegistrationRequest();
        validRequest.setEmail("test@example.com");
        validRequest.setExternalId("external-id-123");
        validRequest.setFirstName("John");
        validRequest.setLastName("Doe");
        validRequest.setPhone("1234567890");
    }

    @Nested
    @DisplayName("Authorization and Authentication Tests")
    class AuthTests {

        @Test
        void register_unauthorized_returns401() throws Exception {
            mockMvc.perform(post("/api/registration/register")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(validRequest)))
                    .andExpect(status().isUnauthorized());
        }

        @Test
        @WithMockUser(authorities = "ROLE_USER")
        void register_forbidden_returns403() throws Exception {
            mockMvc.perform(post("/api/registration/register")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(validRequest)))
                    .andExpect(status().isForbidden());
        }
    }

    @Nested
    @DisplayName("Validation Tests")
    class ValidationTests {

        @Test
        @WithMockUser(authorities = "ROLE_KYC_MANAGER")
        void register_missingAllFields_returns400() throws Exception {
            mockMvc.perform(post("/api/registration/register")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(new RegistrationRequest())))
                    .andExpect(status().isBadRequest());
        }

        @Test
        @WithMockUser(authorities = "ROLE_KYC_MANAGER")
        void register_invalidEmail_returns400() throws Exception {
            validRequest.setEmail("not-an-email");
            mockMvc.perform(post("/api/registration/register")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(validRequest)))
                    .andExpect(status().isBadRequest());
        }
    }

    @Nested
    @DisplayName("Service Logic and Error Handling Tests")
    class ServiceLogicTests {

        @Test
        @WithMockUser(authorities = "ROLE_KYC_MANAGER")
        void register_success_returns201() throws Exception {
            when(fineractService.createClient(any(RegistrationRequest.class))).thenReturn(1L);
            when(fineractService.createSavingsAccount(anyLong())).thenReturn(2L);

            mockMvc.perform(post("/api/registration/register")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(validRequest)))
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath("$.fineractClientId").value(1L))
                    .andExpect(jsonPath("$.savingsAccountId").value(2L));
        }

        @Test
        @WithMockUser(authorities = "ROLE_KYC_MANAGER")
        void register_clientCreationFails_returns500() throws Exception {
            when(fineractService.createClient(any(RegistrationRequest.class)))
                    .thenThrow(new RegistrationException("Fineract client creation failed"));

            mockMvc.perform(post("/api/registration/register")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(validRequest)))
                    .andExpect(status().isInternalServerError())
                    .andExpect(jsonPath("$.message").value("Fineract client creation failed"));
        }

        @Test
        @WithMockUser(authorities = "ROLE_KYC_MANAGER")
        void register_accountCreationFails_returns500() throws Exception {
            when(fineractService.createClient(any(RegistrationRequest.class))).thenReturn(1L);
            doThrow(new RegistrationException("Fineract account creation failed"))
                    .when(fineractService).createSavingsAccount(anyLong());

            mockMvc.perform(post("/api/registration/register")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(validRequest)))
                    .andExpect(status().isInternalServerError())
                    .andExpect(jsonPath("$.message").value("Fineract account creation failed"));
        }
    }
}
