package com.adorsys.fineract.registration.service.registration;

import com.adorsys.fineract.registration.dto.registration.RegistrationRequest;
import com.adorsys.fineract.registration.dto.registration.RegistrationResponse;
import com.adorsys.fineract.registration.exception.RegistrationException;
import com.adorsys.fineract.registration.metrics.RegistrationMetrics;
import com.adorsys.fineract.registration.service.FineractService;
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
    private FineractService fineractService;

    @Mock
    private RegistrationMetrics registrationMetrics;

    @InjectMocks
    private RegistrationService registrationService;

    private RegistrationRequest request;

    @BeforeEach
    void setUp() {
        request = new RegistrationRequest();
        request.setEmail("test@example.com");
        request.setExternalId("external-id");
    }

    @Nested
    @DisplayName("Success Scenarios")
    class SuccessScenarios {
        @Test
        @DisplayName("Should complete registration successfully when all steps pass")
        void register_success() {
            // Arrange
            when(fineractService.createClient(request)).thenReturn(1L);
            when(fineractService.createSavingsAccount(1L)).thenReturn(2L);

            // Act
            RegistrationResponse response = registrationService.register(request);

            // Assert
            assertNotNull(response);
            assertTrue(response.isSuccess());
            assertEquals("success", response.getStatus());
            assertEquals(1L, response.getFineractClientId());
            assertEquals(2L, response.getSavingsAccountId());

            // Verify interactions
            verify(fineractService, times(1)).createClient(request);
            verify(fineractService, times(1)).createSavingsAccount(1L);
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
            String errorMessage = "Client creation failed";
            when(fineractService.createClient(request)).thenThrow(new RegistrationException(errorMessage));

            // Act & Assert
            RegistrationException exception = assertThrows(RegistrationException.class, () -> registrationService.register(request));

            assertEquals(errorMessage, exception.getMessage());

            // Verify interactions
            verify(fineractService, times(1)).createClient(request);
            verify(fineractService, never()).createSavingsAccount(anyLong());
            verify(registrationMetrics, times(1)).incrementRegistrationRequests();
            verify(registrationMetrics, times(1)).incrementRegistrationFailure("CLIENT_CREATION_FAILED");
            verify(registrationMetrics, never()).incrementRegistrationSuccess();
        }

        @Test
        @DisplayName("When savings account creation fails, it should throw RegistrationException")
        void register_whenSavingsAccountCreationFails_throwsRegistrationException() {
            // Arrange
            String errorMessage = "Savings account creation failed";
            when(fineractService.createClient(request)).thenReturn(1L);
            when(fineractService.createSavingsAccount(1L)).thenThrow(new RegistrationException(errorMessage));

            // Act & Assert
            RegistrationException exception = assertThrows(RegistrationException.class, () -> registrationService.register(request));

            assertEquals(errorMessage, exception.getMessage());

            // Verify interactions
            verify(fineractService, times(1)).createClient(request);
            verify(fineractService, times(1)).createSavingsAccount(1L);
            verify(registrationMetrics, times(1)).incrementRegistrationRequests();
            verify(registrationMetrics, times(1)).incrementRegistrationFailure("SAVINGS_ACCOUNT_CREATION_FAILED");
            verify(registrationMetrics, never()).incrementRegistrationSuccess();
        }
    }
}
