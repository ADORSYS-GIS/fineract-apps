package com.adorsys.fineract.gateway.controller;

import com.adorsys.fineract.gateway.dto.*;
import com.adorsys.fineract.gateway.exception.PaymentException;
import com.adorsys.fineract.gateway.service.PaymentService;
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
import java.time.Instant;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(PaymentController.class)
class PaymentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private PaymentService paymentService;

    @Nested
    @DisplayName("POST /api/payments/deposit")
    class DepositEndpoint {

        @Test
        @DisplayName("should initiate deposit successfully")
        @WithMockUser
        void shouldInitiateDepositSuccessfully() throws Exception {
            // Given
            DepositRequest request = DepositRequest.builder()
                    .externalId("ext-123")
                    .accountId(456L)
                    .amount(BigDecimal.valueOf(10000))
                    .provider(PaymentProvider.MTN_MOMO)
                    .phoneNumber("+237612345678")
                    .build();

            PaymentResponse response = PaymentResponse.builder()
                    .transactionId("txn-123")
                    .providerReference("mtn-ref-123")
                    .provider(PaymentProvider.MTN_MOMO)
                    .type(PaymentResponse.TransactionType.DEPOSIT)
                    .amount(BigDecimal.valueOf(10000))
                    .currency("XAF")
                    .status(PaymentStatus.PENDING)
                    .message("Please approve the payment on your phone")
                    .createdAt(Instant.now())
                    .build();

            when(paymentService.initiateDeposit(any(DepositRequest.class))).thenReturn(response);

            // When/Then
            mockMvc.perform(post("/api/payments/deposit")
                            .with(csrf())
                            .with(jwt().jwt(jwt -> jwt.claim("fineract_external_id", "ext-123")))
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.transactionId").value("txn-123"))
                    .andExpect(jsonPath("$.status").value("PENDING"))
                    .andExpect(jsonPath("$.provider").value("MTN_MOMO"));
        }

        @Test
        @DisplayName("should return 403 when externalId mismatch")
        @WithMockUser
        void shouldReturn403WhenExternalIdMismatch() throws Exception {
            // Given
            DepositRequest request = DepositRequest.builder()
                    .externalId("other-user-123")
                    .accountId(456L)
                    .amount(BigDecimal.valueOf(10000))
                    .provider(PaymentProvider.MTN_MOMO)
                    .phoneNumber("+237612345678")
                    .build();

            // When/Then
            mockMvc.perform(post("/api/payments/deposit")
                            .with(csrf())
                            .with(jwt().jwt(jwt -> jwt.claim("fineract_external_id", "ext-123")))
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isForbidden());

            verify(paymentService, never()).initiateDeposit(any());
        }

        @Test
        @DisplayName("should return 400 for invalid request")
        @WithMockUser
        void shouldReturn400ForInvalidRequest() throws Exception {
            // Given - missing required fields
            DepositRequest request = DepositRequest.builder()
                    .externalId("ext-123")
                    .amount(BigDecimal.valueOf(-100)) // invalid negative amount
                    .build();

            // When/Then
            mockMvc.perform(post("/api/payments/deposit")
                            .with(csrf())
                            .with(jwt().jwt(jwt -> jwt.claim("fineract_external_id", "ext-123")))
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("should reject unauthenticated requests")
        void shouldRejectUnauthenticatedRequests() throws Exception {
            // Given
            DepositRequest request = DepositRequest.builder()
                    .externalId("ext-123")
                    .accountId(456L)
                    .amount(BigDecimal.valueOf(10000))
                    .provider(PaymentProvider.MTN_MOMO)
                    .phoneNumber("+237612345678")
                    .build();

            // When/Then
            mockMvc.perform(post("/api/payments/deposit")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isUnauthorized());
        }
    }

    @Nested
    @DisplayName("POST /api/payments/withdraw")
    class WithdrawEndpoint {

        @Test
        @DisplayName("should initiate withdrawal successfully")
        @WithMockUser
        void shouldInitiateWithdrawalSuccessfully() throws Exception {
            // Given
            WithdrawalRequest request = WithdrawalRequest.builder()
                    .externalId("ext-123")
                    .accountId(456L)
                    .amount(BigDecimal.valueOf(5000))
                    .provider(PaymentProvider.MTN_MOMO)
                    .phoneNumber("+237612345678")
                    .build();

            PaymentResponse response = PaymentResponse.builder()
                    .transactionId("txn-456")
                    .providerReference("mtn-ref-456")
                    .provider(PaymentProvider.MTN_MOMO)
                    .type(PaymentResponse.TransactionType.WITHDRAWAL)
                    .amount(BigDecimal.valueOf(5000))
                    .currency("XAF")
                    .status(PaymentStatus.PROCESSING)
                    .fineractTransactionId(789L)
                    .createdAt(Instant.now())
                    .build();

            when(paymentService.initiateWithdrawal(any(WithdrawalRequest.class))).thenReturn(response);

            // When/Then
            mockMvc.perform(post("/api/payments/withdraw")
                            .with(csrf())
                            .with(jwt().jwt(jwt -> jwt.claim("fineract_external_id", "ext-123")))
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.transactionId").value("txn-456"))
                    .andExpect(jsonPath("$.status").value("PROCESSING"))
                    .andExpect(jsonPath("$.fineractTransactionId").value(789));
        }

        @Test
        @DisplayName("should return 400 when insufficient funds")
        @WithMockUser
        void shouldReturn400WhenInsufficientFunds() throws Exception {
            // Given
            WithdrawalRequest request = WithdrawalRequest.builder()
                    .externalId("ext-123")
                    .accountId(456L)
                    .amount(BigDecimal.valueOf(1000000))
                    .provider(PaymentProvider.MTN_MOMO)
                    .phoneNumber("+237612345678")
                    .build();

            when(paymentService.initiateWithdrawal(any(WithdrawalRequest.class)))
                    .thenThrow(new PaymentException("Insufficient funds"));

            // When/Then
            mockMvc.perform(post("/api/payments/withdraw")
                            .with(csrf())
                            .with(jwt().jwt(jwt -> jwt.claim("fineract_external_id", "ext-123")))
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.message").value("Insufficient funds"));
        }
    }

    @Nested
    @DisplayName("GET /api/payments/status/{transactionId}")
    class StatusEndpoint {

        @Test
        @DisplayName("should return transaction status")
        @WithMockUser
        void shouldReturnTransactionStatus() throws Exception {
            // Given
            TransactionStatusResponse response = TransactionStatusResponse.builder()
                    .transactionId("txn-123")
                    .providerReference("mtn-ref-123")
                    .provider(PaymentProvider.MTN_MOMO)
                    .type(PaymentResponse.TransactionType.DEPOSIT)
                    .amount(BigDecimal.valueOf(10000))
                    .currency("XAF")
                    .status(PaymentStatus.SUCCESSFUL)
                    .externalId("ext-123")
                    .accountId(456L)
                    .fineractTransactionId(789L)
                    .build();

            when(paymentService.getTransactionStatus("txn-123")).thenReturn(response);

            // When/Then
            mockMvc.perform(get("/api/payments/status/{transactionId}", "txn-123")
                            .with(jwt().jwt(jwt -> jwt.claim("fineract_external_id", "ext-123"))))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.transactionId").value("txn-123"))
                    .andExpect(jsonPath("$.status").value("SUCCESSFUL"));
        }

        @Test
        @DisplayName("should return 403 when viewing other user's transaction")
        @WithMockUser
        void shouldReturn403ForOtherUserTransaction() throws Exception {
            // Given
            TransactionStatusResponse response = TransactionStatusResponse.builder()
                    .transactionId("txn-123")
                    .externalId("other-user-456")
                    .build();

            when(paymentService.getTransactionStatus("txn-123")).thenReturn(response);

            // When/Then
            mockMvc.perform(get("/api/payments/status/{transactionId}", "txn-123")
                            .with(jwt().jwt(jwt -> jwt.claim("fineract_external_id", "ext-123"))))
                    .andExpect(status().isForbidden());
        }

        @Test
        @DisplayName("should return 400 for unknown transaction")
        @WithMockUser
        void shouldReturn400ForUnknownTransaction() throws Exception {
            // Given
            when(paymentService.getTransactionStatus("unknown"))
                    .thenThrow(new PaymentException("Transaction not found"));

            // When/Then
            mockMvc.perform(get("/api/payments/status/{transactionId}", "unknown")
                            .with(jwt().jwt(jwt -> jwt.claim("fineract_external_id", "ext-123"))))
                    .andExpect(status().isBadRequest());
        }
    }
}
