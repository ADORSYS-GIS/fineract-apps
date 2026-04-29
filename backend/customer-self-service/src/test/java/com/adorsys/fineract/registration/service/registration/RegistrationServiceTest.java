package com.adorsys.fineract.registration.service.registration;

import com.adorsys.fineract.registration.config.FineractProperties;
import com.adorsys.fineract.registration.dto.batch.BatchResponse;
import com.adorsys.fineract.registration.dto.deposit.DepositRequest;
import com.adorsys.fineract.registration.dto.deposit.DepositResponse;
import com.adorsys.fineract.registration.dto.registration.ClientAndAccountResponse;
import com.adorsys.fineract.registration.dto.registration.RegistrationRequest;
import com.adorsys.fineract.registration.exception.RegistrationException;
import com.adorsys.fineract.registration.metrics.RegistrationMetrics;
import com.adorsys.fineract.registration.service.FineractService;
import com.adorsys.fineract.registration.service.fineract.FineractAccountService;
import com.adorsys.fineract.registration.service.fineract.FineractBatchService;
import com.adorsys.fineract.registration.service.fineract.FineractClientService;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("RegistrationService Tests")
class RegistrationServiceTest {

    @Mock
    private RegistrationMetrics registrationMetrics;

    @Mock
    private FineractBatchService fineractBatchService;

    @Mock
    private FineractClientService fineractClientService;

    @Mock
    private FineractAccountService fineractAccountService;

    @Mock
    private FineractService fineractService;

    @Mock
    private FineractProperties fineractProperties;

    @InjectMocks
    private RegistrationService registrationService;

    private RegistrationRequest registrationRequest;

    @BeforeEach
    void setUp() {
        registrationRequest = new RegistrationRequest();
        registrationRequest.setEmail("test@example.com");
        registrationRequest.setExternalId("external-id");
    }

    @Nested
    @DisplayName("registerClientAndAccount Scenarios")
    class RegisterClientAndAccountScenarios {
        @BeforeEach
        void setUp() {
            FineractProperties.Defaults defaults = new FineractProperties.Defaults();
            defaults.setSavingsProductId(1L);
            defaults.setLocale("en");
            defaults.setDateFormat("yyyy-MM-dd");
            defaults.setPaymentTypeId(1L);
            // Lenient because the duplicate-phone short-circuit test bails out
            // before fineractProperties.getDefaults() is read.
            lenient().when(fineractProperties.getDefaults()).thenReturn(defaults);
            when(fineractService.getClientByExternalId(anyString())).thenReturn(Collections.emptyMap());
        }

        @Test
        @DisplayName("Should complete successfully when all steps pass")
        void registerClientAndAccount_success() {
            // Arrange
            when(fineractBatchService.sendBatchRequest(anyList())).thenAnswer(invocation -> {
                List<BatchResponse> responses = new ArrayList<>();

                BatchResponse clientResponse = new BatchResponse();
                clientResponse.setRequestId(1L);
                clientResponse.setStatusCode(200);
                clientResponse.setBody("{\"clientId\": 1}");
                responses.add(clientResponse);

                BatchResponse savingsResponse = new BatchResponse();
                savingsResponse.setRequestId(2L);
                savingsResponse.setStatusCode(200);
                savingsResponse.setBody("{\"savingsId\": 2}");
                responses.add(savingsResponse);

                return responses;
            });

            // Act
            ClientAndAccountResponse response = registrationService.registerClientAndAccount(registrationRequest);

            // Assert
            assertNotNull(response);
            assertTrue(response.isSuccess());
            assertEquals("success", response.getStatus());
            assertEquals(1L, response.getFineractClientId());
            assertEquals(2L, response.getSavingsAccountId());

            // Verify interactions
            verify(fineractBatchService, times(1)).sendBatchRequest(anyList());
            verify(registrationMetrics, times(1)).incrementRegistrationRequests();
            verify(registrationMetrics, times(1)).incrementRegistrationSuccess();
            verify(registrationMetrics, never()).incrementRegistrationFailure(anyString());
        }

        @Test
        @DisplayName("When phone is already linked to another externalId, throws DUPLICATE_PHONE before sending batch")
        void registerClientAndAccount_whenPhoneAlreadyLinked_throwsDuplicatePhone() {
            // Arrange
            registrationRequest.setPhone("+237699555444");
            when(fineractService.getClientByMobileNo("+237699555444")).thenReturn(
                    Map.of("id", 99L, "externalId", "other-external-id", "mobileNo", "+237699555444"));

            // Act & Assert
            RegistrationException exception = assertThrows(
                    RegistrationException.class,
                    () -> registrationService.registerClientAndAccount(registrationRequest));

            assertEquals("DUPLICATE_PHONE", exception.getErrorCode());
            assertEquals("phone", exception.getField());
            assertEquals("Phone number is already linked to another account.", exception.getMessage());

            // Crucially: we should NOT have sent the batch request at all.
            verify(fineractBatchService, never()).sendBatchRequest(anyList());
            verify(registrationMetrics, times(1)).incrementRegistrationRequests();
            verify(registrationMetrics, times(1)).incrementRegistrationFailure("DUPLICATE_PHONE");
            verify(registrationMetrics, never()).incrementRegistrationSuccess();
        }

        @Test
        @DisplayName("When client creation fails, it should throw RegistrationException")
        void registerClientAndAccount_whenClientCreationFails_throwsRegistrationException() {
            // Arrange
            when(fineractBatchService.sendBatchRequest(anyList())).thenAnswer(invocation -> {
                List<BatchResponse> responses = new ArrayList<>();

                BatchResponse clientResponse = new BatchResponse();
                clientResponse.setRequestId(1L);
                clientResponse.setStatusCode(400);
                clientResponse.setBody("{\"error\": \"Client creation failed\"}");
                responses.add(clientResponse);

                return responses;
            });

            // Act & Assert
            RegistrationException exception = assertThrows(RegistrationException.class, () -> registrationService.registerClientAndAccount(registrationRequest));

            assertEquals("Batch request failed", exception.getMessage());

            // Verify interactions
            verify(fineractBatchService, times(1)).sendBatchRequest(anyList());
            verify(registrationMetrics, times(1)).incrementRegistrationRequests();
            verify(registrationMetrics, times(1)).incrementRegistrationFailure("BATCH_REQUEST_FAILED");
            verify(registrationMetrics, never()).incrementRegistrationSuccess();
        }

        @Test
        @DisplayName("When savings account creation fails, it should throw RegistrationException")
        void registerClientAndAccount_whenSavingsAccountCreationFails_throwsRegistrationException() {
            // Arrange
            when(fineractBatchService.sendBatchRequest(anyList())).thenAnswer(invocation -> {
                List<BatchResponse> responses = new ArrayList<>();

                BatchResponse clientResponse = new BatchResponse();
                clientResponse.setRequestId(1L);
                clientResponse.setStatusCode(200);
                clientResponse.setBody("{\"clientId\": 1}");
                responses.add(clientResponse);

                BatchResponse savingsResponse = new BatchResponse();
                savingsResponse.setRequestId(2L);
                savingsResponse.setStatusCode(400);
                savingsResponse.setBody("{\"error\": \"Savings account creation failed\"}");
                responses.add(savingsResponse);

                return responses;
            });

            // Act & Assert
            RegistrationException exception = assertThrows(RegistrationException.class, () -> registrationService.registerClientAndAccount(registrationRequest));

            assertEquals("Batch request failed", exception.getMessage());
        }
    }

    @Nested
    @DisplayName("fundAccount Scenarios")
    class FundAccountScenarios {
        private DepositRequest depositRequest;

        @BeforeEach
        void setUp() {
            depositRequest = new DepositRequest();
            depositRequest.setSavingsAccountId(2L);
            depositRequest.setDepositAmount(new BigDecimal("1000"));
            depositRequest.setPaymentType("Money Transfer");
        }

        @Test
        @DisplayName("Should fund account successfully")
        void fundAccount_success() {
            // Arrange
            when(fineractAccountService.getSavingsAccount(anyLong())).thenReturn(Map.of("status", Map.of("code", "savingsAccountStatusType.submitted.and.pending.approval")));
            when(fineractAccountService.makeDeposit(anyLong(), any(BigDecimal.class), anyString(), anyString())).thenReturn(Map.of("resourceId", 123L));

            // Act
            DepositResponse response = registrationService.fundAccount(depositRequest, "idempotency-key");

            // Assert
            assertNotNull(response);
            assertTrue(response.isSuccess());
            assertEquals("success", response.getStatus());
            assertEquals(2L, response.getSavingsAccountId());
            assertEquals(123L, response.getTransactionId());
        }

        @Test
        @DisplayName("When deposit fails, it should throw RegistrationException")
        void fundAccount_whenDepositFails_throwsRegistrationException() {
            // Arrange
            when(fineractAccountService.getSavingsAccount(anyLong())).thenReturn(Map.of("status", Map.of("code", "savingsAccountStatusType.submitted.and.pending.approval")));
            when(fineractAccountService.makeDeposit(anyLong(), any(BigDecimal.class), anyString(), anyString())).thenThrow(new RegistrationException("Deposit failed"));

            // Act & Assert
            RegistrationException exception = assertThrows(RegistrationException.class, () -> registrationService.fundAccount(depositRequest, "idempotency-key"));
            assertEquals("Deposit failed", exception.getMessage());
        }
    }
}
