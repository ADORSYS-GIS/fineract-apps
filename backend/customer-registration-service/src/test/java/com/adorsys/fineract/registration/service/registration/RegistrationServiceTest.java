package com.adorsys.fineract.registration.service.registration;

import com.adorsys.fineract.registration.dto.registration.RegistrationRequest;
import com.adorsys.fineract.registration.dto.registration.RegistrationResponse;
import com.adorsys.fineract.registration.metrics.RegistrationMetrics;
import com.adorsys.fineract.registration.service.FineractService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
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

    @Test
    void register_success() {
        when(fineractService.createClient(request)).thenReturn(1L);
        when(fineractService.createSavingsAccount(1L)).thenReturn(2L);

        RegistrationResponse response = registrationService.register(request);

        assertNotNull(response);
        assertTrue(response.isSuccess());
        assertEquals("success", response.getStatus());
        assertEquals(1L, response.getFineractClientId());
        assertEquals(2L, response.getSavingsAccountId());

        verify(fineractService, times(1)).createClient(request);
        verify(fineractService, times(1)).createSavingsAccount(1L);
        verify(registrationMetrics, times(1)).incrementRegistrationRequests();
        verify(registrationMetrics, times(1)).incrementRegistrationSuccess();
    }

    @Test
    void register_clientCreationFails() {
        when(fineractService.createClient(request)).thenThrow(new RuntimeException("Client creation failed"));

        assertThrows(RuntimeException.class, () -> registrationService.register(request));

        verify(fineractService, times(1)).createClient(request);
        verify(fineractService, never()).createSavingsAccount(anyLong());
        verify(registrationMetrics, times(1)).incrementRegistrationRequests();
        verify(registrationMetrics, never()).incrementRegistrationSuccess();
    }

    @Test
    void register_savingsAccountCreationFails() {
        when(fineractService.createClient(request)).thenReturn(1L);
        when(fineractService.createSavingsAccount(1L)).thenThrow(new RuntimeException("Savings account creation failed"));

        assertThrows(RuntimeException.class, () -> registrationService.register(request));

        verify(fineractService, times(1)).createClient(request);
        verify(fineractService, times(1)).createSavingsAccount(1L);
        verify(registrationMetrics, times(1)).incrementRegistrationRequests();
        verify(registrationMetrics, never()).incrementRegistrationSuccess();
    }
}
