package com.adorsys.fineract.registration.service.registration;

import com.adorsys.fineract.registration.dto.registration.RegistrationRequest;
import com.adorsys.fineract.registration.dto.registration.RegistrationResponse;
import com.adorsys.fineract.registration.exception.RegistrationException;
import com.adorsys.fineract.registration.metrics.RegistrationMetrics;
import com.adorsys.fineract.registration.service.fineract.FineractBatchService;
import com.adorsys.fineract.registration.service.fineract.FineractClientService;
import com.adorsys.fineract.registration.config.FineractProperties;
import com.adorsys.fineract.registration.dto.batch.BatchResponse;
import java.util.Collections;
import java.util.ArrayList;
import com.adorsys.fineract.registration.service.FineractService;
import java.util.List;
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
    private FineractService fineractService;

    @Mock
    private FineractProperties fineractProperties;
    
    @InjectMocks
    private RegistrationService registrationService;

    private RegistrationRequest request;

    @BeforeEach
    void setUp() {
        request = new RegistrationRequest();
        request.setEmail("test@example.com");
        request.setExternalId("external-id");

        FineractProperties.Defaults defaults = new FineractProperties.Defaults();
        defaults.setSavingsProductId(1L);
        defaults.setLocale("en");
        defaults.setDateFormat("yyyy-MM-dd");
        defaults.setPaymentTypeId(1L);
        when(fineractProperties.getDefaults()).thenReturn(defaults);
        when(fineractService.getClientByExternalId(anyString())).thenReturn(Collections.emptyMap());
    }

    @Nested
    @DisplayName("Success Scenarios")
    class SuccessScenarios {
        @Test
        @DisplayName("Should complete registration successfully when all steps pass")
        void register_success() {
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
            RegistrationResponse response = registrationService.register(request);

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
    }


    @Nested
    @DisplayName("Failure Scenarios")
    class FailureScenarios {
        @Test
        @DisplayName("When client creation fails, it should throw RegistrationException and not create an account")
        void register_whenClientCreationFails_throwsRegistrationException() {
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
            RegistrationException exception = assertThrows(RegistrationException.class, () -> registrationService.register(request));

            assertEquals("Batch request failed", exception.getMessage());

            // Verify interactions
            verify(fineractBatchService, times(1)).sendBatchRequest(anyList());
            verify(registrationMetrics, times(1)).incrementRegistrationRequests();
            verify(registrationMetrics, times(1)).incrementRegistrationFailure("BATCH_REQUEST_FAILED");
            verify(registrationMetrics, never()).incrementRegistrationSuccess();
        }

        @Test
        @DisplayName("When savings account creation fails, it should throw RegistrationException")
        void register_whenSavingsAccountCreationFails_throwsRegistrationException() {
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
            RegistrationException exception = assertThrows(RegistrationException.class, () -> registrationService.register(request));

            assertEquals("Batch request failed", exception.getMessage());

            // Verify interactions
            verify(fineractBatchService, times(1)).sendBatchRequest(anyList());
            verify(registrationMetrics, times(1)).incrementRegistrationRequests();
            verify(registrationMetrics, times(1)).incrementRegistrationFailure("BATCH_REQUEST_FAILED");
            verify(registrationMetrics, never()).incrementRegistrationSuccess();
        }
    }
}
