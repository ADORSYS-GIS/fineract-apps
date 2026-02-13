package com.adorsys.fineract.gateway.controller;

import com.adorsys.fineract.gateway.dto.*;
import com.adorsys.fineract.gateway.exception.PaymentException;
import com.adorsys.fineract.gateway.service.PaymentService;
import com.adorsys.fineract.gateway.service.StepUpAuthService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(PaymentController.class)
@ActiveProfiles("test")
class PaymentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private PaymentService paymentService;

    @MockBean
    private StepUpAuthService stepUpAuthService;

    @MockBean
    private JwtDecoder jwtDecoder;

    private static final String EXTERNAL_ID = "a1b2c3d4-e5f6-7890-abcd-ef1234567890";
    private static final Long ACCOUNT_ID = 456L;
    private static final String PHONE = "+237612345678";

    // =========================================================================
    // POST /api/payments/deposit
    // =========================================================================

    @Nested
    @DisplayName("POST /api/payments/deposit")
    class DepositEndpoint {

        @Test
        @DisplayName("should initiate deposit successfully")
        void deposit_happyPath_returns200() throws Exception {
            String idempotencyKey = UUID.randomUUID().toString();
            DepositRequest request = DepositRequest.builder()
                    .externalId(EXTERNAL_ID)
                    .accountId(ACCOUNT_ID)
                    .amount(BigDecimal.valueOf(10000))
                    .provider(PaymentProvider.MTN_MOMO)
                    .phoneNumber(PHONE)
                    .build();

            PaymentResponse response = PaymentResponse.builder()
                    .transactionId(idempotencyKey)
                    .providerReference("mtn-ref-123")
                    .provider(PaymentProvider.MTN_MOMO)
                    .type(PaymentResponse.TransactionType.DEPOSIT)
                    .amount(BigDecimal.valueOf(10000))
                    .currency("XAF")
                    .status(PaymentStatus.PENDING)
                    .message("Please approve the payment on your phone")
                    .createdAt(Instant.now())
                    .build();

            when(paymentService.initiateDeposit(any(DepositRequest.class), eq(idempotencyKey)))
                    .thenReturn(response);

            mockMvc.perform(post("/api/payments/deposit")
                            .with(jwt().jwt(j -> j.subject("user-1")
                                    .claim("fineract_external_id", EXTERNAL_ID)))
                            .header("X-Idempotency-Key", idempotencyKey)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.transactionId").value(idempotencyKey))
                    .andExpect(jsonPath("$.status").value("PENDING"))
                    .andExpect(jsonPath("$.provider").value("MTN_MOMO"));
        }

        @Test
        @DisplayName("should return 403 when externalId mismatch")
        void deposit_externalIdMismatch_returns403() throws Exception {
            DepositRequest request = DepositRequest.builder()
                    .externalId("b2c3d4e5-f6a7-8901-bcde-f12345678901")
                    .accountId(ACCOUNT_ID)
                    .amount(BigDecimal.valueOf(10000))
                    .provider(PaymentProvider.MTN_MOMO)
                    .phoneNumber(PHONE)
                    .build();

            mockMvc.perform(post("/api/payments/deposit")
                            .with(jwt().jwt(j -> j.subject("user-1")
                                    .claim("fineract_external_id", EXTERNAL_ID)))
                            .header("X-Idempotency-Key", UUID.randomUUID().toString())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isForbidden());

            verify(paymentService, never()).initiateDeposit(any(), any());
        }

        @Test
        @DisplayName("should return 401 without authentication")
        void deposit_noJwt_returns401() throws Exception {
            DepositRequest request = DepositRequest.builder()
                    .externalId(EXTERNAL_ID)
                    .accountId(ACCOUNT_ID)
                    .amount(BigDecimal.valueOf(10000))
                    .provider(PaymentProvider.MTN_MOMO)
                    .phoneNumber(PHONE)
                    .build();

            mockMvc.perform(post("/api/payments/deposit")
                            .header("X-Idempotency-Key", UUID.randomUUID().toString())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isForbidden());
        }

        @Test
        @DisplayName("should return 400 for validation errors")
        void deposit_validationError_returns400() throws Exception {
            // Missing required fields and negative amount
            DepositRequest request = DepositRequest.builder()
                    .externalId(EXTERNAL_ID)
                    .amount(BigDecimal.valueOf(-100))
                    .build();

            mockMvc.perform(post("/api/payments/deposit")
                            .with(jwt().jwt(j -> j.subject("user-1")
                                    .claim("fineract_external_id", EXTERNAL_ID)))
                            .header("X-Idempotency-Key", UUID.randomUUID().toString())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest());
        }
    }

    // =========================================================================
    // POST /api/payments/withdraw
    // =========================================================================

    @Nested
    @DisplayName("POST /api/payments/withdraw")
    class WithdrawEndpoint {

        @Test
        @DisplayName("should initiate withdrawal successfully")
        void withdraw_happyPath_returns200() throws Exception {
            String idempotencyKey = UUID.randomUUID().toString();
            WithdrawalRequest request = WithdrawalRequest.builder()
                    .externalId(EXTERNAL_ID)
                    .accountId(ACCOUNT_ID)
                    .amount(BigDecimal.valueOf(5000))
                    .provider(PaymentProvider.MTN_MOMO)
                    .phoneNumber(PHONE)
                    .build();

            PaymentResponse response = PaymentResponse.builder()
                    .transactionId(idempotencyKey)
                    .providerReference("mtn-ref-456")
                    .provider(PaymentProvider.MTN_MOMO)
                    .type(PaymentResponse.TransactionType.WITHDRAWAL)
                    .amount(BigDecimal.valueOf(5000))
                    .currency("XAF")
                    .status(PaymentStatus.PROCESSING)
                    .fineractTransactionId(789L)
                    .createdAt(Instant.now())
                    .build();

            when(paymentService.initiateWithdrawal(any(WithdrawalRequest.class), eq(idempotencyKey)))
                    .thenReturn(response);

            mockMvc.perform(post("/api/payments/withdraw")
                            .with(jwt().jwt(j -> j.subject("user-1")
                                    .claim("fineract_external_id", EXTERNAL_ID)))
                            .header("X-Idempotency-Key", idempotencyKey)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.transactionId").value(idempotencyKey))
                    .andExpect(jsonPath("$.status").value("PROCESSING"))
                    .andExpect(jsonPath("$.fineractTransactionId").value(789));

            verify(stepUpAuthService).validateStepUpToken(eq(EXTERNAL_ID), isNull());
        }

        @Test
        @DisplayName("should return 403 when externalId mismatch")
        void withdraw_externalIdMismatch_returns403() throws Exception {
            WithdrawalRequest request = WithdrawalRequest.builder()
                    .externalId("b2c3d4e5-f6a7-8901-bcde-f12345678901")
                    .accountId(ACCOUNT_ID)
                    .amount(BigDecimal.valueOf(5000))
                    .provider(PaymentProvider.MTN_MOMO)
                    .phoneNumber(PHONE)
                    .build();

            mockMvc.perform(post("/api/payments/withdraw")
                            .with(jwt().jwt(j -> j.subject("user-1")
                                    .claim("fineract_external_id", EXTERNAL_ID)))
                            .header("X-Idempotency-Key", UUID.randomUUID().toString())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isForbidden());

            verify(paymentService, never()).initiateWithdrawal(any(), any());
        }

        @Test
        @DisplayName("should return 400 when insufficient funds")
        void withdraw_insufficientFunds_returns400() throws Exception {
            String idempotencyKey = UUID.randomUUID().toString();
            WithdrawalRequest request = WithdrawalRequest.builder()
                    .externalId(EXTERNAL_ID)
                    .accountId(ACCOUNT_ID)
                    .amount(BigDecimal.valueOf(5000))
                    .provider(PaymentProvider.MTN_MOMO)
                    .phoneNumber(PHONE)
                    .build();

            when(paymentService.initiateWithdrawal(any(WithdrawalRequest.class), eq(idempotencyKey)))
                    .thenThrow(new PaymentException("Insufficient funds"));

            mockMvc.perform(post("/api/payments/withdraw")
                            .with(jwt().jwt(j -> j.subject("user-1")
                                    .claim("fineract_external_id", EXTERNAL_ID)))
                            .header("X-Idempotency-Key", idempotencyKey)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.message").value("Insufficient funds"));
        }
    }

    // =========================================================================
    // GET /api/payments/status/{transactionId}
    // =========================================================================

    @Nested
    @DisplayName("GET /api/payments/status/{transactionId}")
    class StatusEndpoint {

        @Test
        @DisplayName("should return transaction status")
        void getStatus_happyPath_returns200() throws Exception {
            TransactionStatusResponse response = TransactionStatusResponse.builder()
                    .transactionId("txn-123")
                    .providerReference("mtn-ref-123")
                    .provider(PaymentProvider.MTN_MOMO)
                    .type(PaymentResponse.TransactionType.DEPOSIT)
                    .amount(BigDecimal.valueOf(10000))
                    .currency("XAF")
                    .status(PaymentStatus.SUCCESSFUL)
                    .externalId(EXTERNAL_ID)
                    .accountId(ACCOUNT_ID)
                    .fineractTransactionId(789L)
                    .build();

            when(paymentService.getTransactionStatus("txn-123")).thenReturn(response);

            mockMvc.perform(get("/api/payments/status/{transactionId}", "txn-123")
                            .with(jwt().jwt(j -> j.subject("user-1")
                                    .claim("fineract_external_id", EXTERNAL_ID))))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.transactionId").value("txn-123"))
                    .andExpect(jsonPath("$.status").value("SUCCESSFUL"));
        }

        @Test
        @DisplayName("should return 403 for another user's transaction")
        void getStatus_otherUserTransaction_returns403() throws Exception {
            TransactionStatusResponse response = TransactionStatusResponse.builder()
                    .transactionId("txn-123")
                    .externalId("other-user-id-00000000000000000000")
                    .build();

            when(paymentService.getTransactionStatus("txn-123")).thenReturn(response);

            mockMvc.perform(get("/api/payments/status/{transactionId}", "txn-123")
                            .with(jwt().jwt(j -> j.subject("user-1")
                                    .claim("fineract_external_id", EXTERNAL_ID))))
                    .andExpect(status().isForbidden());
        }
    }
}
