package com.adorsys.fineract.registration.service.registration;

import com.adorsys.fineract.registration.dto.deposit.DepositRequest;
import com.adorsys.fineract.registration.dto.deposit.DepositResponse;
import com.adorsys.fineract.registration.dto.registration.CheckPhoneRequest;
import com.adorsys.fineract.registration.dto.registration.ClientAndAccountResponse;
import com.adorsys.fineract.registration.dto.registration.RegistrationRequest;
import com.adorsys.fineract.registration.exception.RegistrationException;
import com.adorsys.fineract.registration.service.FineractService;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.math.BigDecimal;
import java.util.Map;
import java.util.UUID;
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
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
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
    private RegistrationService registrationService;

    @MockBean
    private FineractService fineractService;

    private RegistrationRequest validRequest;

    @BeforeEach
    void setUp() {
        validRequest = new RegistrationRequest();
        validRequest.setEmail("test@example.com");
        validRequest.setExternalId("external-id-123");
        validRequest.setFullName("John Doe");
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
            ClientAndAccountResponse response = new ClientAndAccountResponse();
            response.setSuccess(true);
            response.setStatus("success");
            response.setFineractClientId(1L);
            response.setSavingsAccountId(2L);
            when(registrationService.registerClientAndAccount(any(RegistrationRequest.class))).thenReturn(response);

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
            when(registrationService.registerClientAndAccount(any(RegistrationRequest.class)))
                    .thenThrow(new RegistrationException("Fineract client creation failed"));

            mockMvc.perform(post("/api/registration/register")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(validRequest)))
                    .andExpect(status().isInternalServerError())
                    .andExpect(jsonPath("$.message").value("Fineract client creation failed"));
        }
    }

    @Nested
    @DisplayName("Deposit Tests")
    class DepositTests {
        private DepositRequest depositRequest;

        @BeforeEach
        void setUp() {
            depositRequest = new DepositRequest();
            depositRequest.setSavingsAccountId(1L);
            depositRequest.setDepositAmount(new BigDecimal("100.00"));
            depositRequest.setPaymentType("Money Transfer");
        }

        @Test
        @WithMockUser(authorities = "ROLE_KYC_MANAGER")
        void deposit_success_returns200() throws Exception {
            DepositResponse response = new DepositResponse();
            response.setSuccess(true);
            response.setStatus("success");
            response.setSavingsAccountId(1L);
            response.setTransactionId(123L);
            when(registrationService.fundAccount(any(DepositRequest.class), any())).thenReturn(response);

            mockMvc.perform(post("/api/registration/approve-and-deposit")
                    .header("X-Idempotency-Key", UUID.randomUUID().toString())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(depositRequest)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.savingsAccountId").value(1L))
                    .andExpect(jsonPath("$.transactionId").value(123L));
        }

        @Test
        @WithMockUser(authorities = "ROLE_KYC_MANAGER")
        void deposit_serviceFails_returns500() throws Exception {
            when(registrationService.fundAccount(any(DepositRequest.class), any()))
                    .thenThrow(new RegistrationException("Funding failed"));

            mockMvc.perform(post("/api/registration/approve-and-deposit")
                    .header("X-Idempotency-Key", UUID.randomUUID().toString())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(depositRequest)))
                    .andExpect(status().isInternalServerError())
                    .andExpect(jsonPath("$.message").value("Funding failed"));
        }
    }

    @Nested
    @DisplayName("Check Phone Tests")
    class CheckPhoneTests {

        private String body(String phone) throws Exception {
            return objectMapper.writeValueAsString(new CheckPhoneRequest(phone));
        }

        @Test
        void checkPhone_unauthorized_returns401() throws Exception {
            mockMvc.perform(post("/api/registration/check-phone")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(body("+237699555444")))
                    .andExpect(status().isUnauthorized());
            verify(fineractService, never()).getClientByMobileNo(anyString());
        }

        @Test
        @WithMockUser(authorities = "ROLE_USER")
        void checkPhone_forbidden_returns403() throws Exception {
            mockMvc.perform(post("/api/registration/check-phone")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(body("+237699555444")))
                    .andExpect(status().isForbidden());
            verify(fineractService, never()).getClientByMobileNo(anyString());
        }

        @Test
        @WithMockUser(authorities = "ROLE_KYC_MANAGER")
        void checkPhone_invalidFormat_returns400() throws Exception {
            mockMvc.perform(post("/api/registration/check-phone")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(body("abc")))
                    .andExpect(status().isBadRequest());
            verify(fineractService, never()).getClientByMobileNo(anyString());
        }

        @Test
        @WithMockUser(authorities = "ROLE_KYC_MANAGER")
        void checkPhone_blankPhone_returns400() throws Exception {
            mockMvc.perform(post("/api/registration/check-phone")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(body("")))
                    .andExpect(status().isBadRequest());
            verify(fineractService, never()).getClientByMobileNo(anyString());
        }

        @Test
        @WithMockUser(authorities = "ROLE_KYC_MANAGER")
        void checkPhone_notFound_returns200WithExistsFalse() throws Exception {
            when(fineractService.getClientByMobileNo("+237699555444")).thenReturn(Map.of());

            // @JsonInclude(NON_NULL) on the response DTO drops the externalId field when null,
            // so the JSON body is just {"exists":false}.
            mockMvc.perform(post("/api/registration/check-phone")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(body("+237699555444")))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.exists").value(false))
                    .andExpect(jsonPath("$.externalId").doesNotExist());
        }

        @Test
        @WithMockUser(authorities = "ROLE_KYC_MANAGER")
        void checkPhone_found_returns200WithExternalId() throws Exception {
            when(fineractService.getClientByMobileNo("+237699555444")).thenReturn(
                    Map.of("id", 99L, "externalId", "usr_existing_owner", "mobileNo", "+237699555444"));

            mockMvc.perform(post("/api/registration/check-phone")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(body("+237699555444")))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.exists").value(true))
                    .andExpect(jsonPath("$.externalId").value("usr_existing_owner"));
        }

        @Test
        @WithMockUser(authorities = "ROLE_KYC_MANAGER")
        void checkPhone_plusPrefixSurvivesEndToEnd() throws Exception {
            // The reason this whole endpoint is POST + JSON instead of GET + ?phone=:
            // Spring decodes a literal `+` in a raw GET query string as a space, breaking
            // E.164 lookups. Locking in: the body-bound phone reaches the service intact.
            when(fineractService.getClientByMobileNo("+237699555444")).thenReturn(Map.of());

            mockMvc.perform(post("/api/registration/check-phone")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(body("+237699555444")))
                    .andExpect(status().isOk());

            verify(fineractService).getClientByMobileNo("+237699555444");
        }
    }
}
