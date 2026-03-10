package com.adorsys.fineract.gateway.integration;

import com.adorsys.fineract.gateway.client.CinetPayClient;
import com.adorsys.fineract.gateway.client.FineractClient;
import com.adorsys.fineract.gateway.client.MtnMomoClient;
import com.adorsys.fineract.gateway.client.OrangeMoneyClient;
import com.adorsys.fineract.gateway.dto.*;
import com.adorsys.fineract.gateway.entity.PaymentTransaction;
import com.adorsys.fineract.gateway.metrics.PaymentMetrics;
import com.adorsys.fineract.gateway.repository.PaymentTransactionRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.math.BigDecimal;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class PaymentIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private PaymentTransactionRepository transactionRepository;

    @MockBean
    private FineractClient fineractClient;

    @MockBean
    private MtnMomoClient mtnClient;

    @MockBean
    private OrangeMoneyClient orangeClient;

    @MockBean
    private CinetPayClient cinetPayClient;

    @MockBean
    private PaymentMetrics paymentMetrics;

    @MockBean
    private JwtDecoder jwtDecoder;

    private static final String EXTERNAL_ID = "a1b2c3d4-e5f6-7890-abcd-ef1234567890";
    private static final Long ACCOUNT_ID = 456L;
    private static final String PHONE = "+237612345678";

    @BeforeEach
    void setUp() {
        lenient().when(paymentMetrics.startTimer())
                .thenReturn(mock(io.micrometer.core.instrument.Timer.Sample.class));
    }

    @AfterEach
    void tearDown() {
        transactionRepository.deleteAll();
    }

    // =========================================================================
    // Full Deposit Flow
    // =========================================================================

    @Test
    @Order(1)
    @DisplayName("should complete full MTN deposit flow: initiate -> callback -> verify")
    void deposit_mtn_fullFlow() throws Exception {
        String idempotencyKey = UUID.randomUUID().toString();

        // Mock external clients
        when(fineractClient.verifyAccountOwnership(EXTERNAL_ID, ACCOUNT_ID)).thenReturn(true);
        when(mtnClient.requestToPay(eq(idempotencyKey), any(BigDecimal.class),
                eq(PHONE), anyString())).thenReturn("mtn-ext-ref-001");

        // Step 1: Initiate deposit
        DepositRequest depositRequest = DepositRequest.builder()
                .externalId(EXTERNAL_ID)
                .accountId(ACCOUNT_ID)
                .amount(BigDecimal.valueOf(10000))
                .provider(PaymentProvider.MTN_MOMO)
                .phoneNumber(PHONE)
                .build();

        MvcResult depositResult = mockMvc.perform(post("/api/payments/deposit")
                        .with(jwt().jwt(j -> j.subject("user-1")
                                .claim("fineract_external_id", EXTERNAL_ID)))
                        .header("X-Idempotency-Key", idempotencyKey)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(depositRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("PENDING"))
                .andExpect(jsonPath("$.transactionId").value(idempotencyKey))
                .andReturn();

        // Verify PENDING in DB
        Optional<PaymentTransaction> pendingTxn = transactionRepository.findById(idempotencyKey);
        assertThat(pendingTxn).isPresent();
        assertThat(pendingTxn.get().getStatus()).isEqualTo(PaymentStatus.PENDING);
        assertThat(pendingTxn.get().getProviderReference()).isEqualTo("mtn-ext-ref-001");

        // Step 2: Simulate MTN callback
        when(fineractClient.createDeposit(eq(ACCOUNT_ID), any(BigDecimal.class),
                anyLong(), eq("fin-txn-abc"))).thenReturn(999L);

        MtnCallbackRequest callback = MtnCallbackRequest.builder()
                .referenceId("mtn-ref-id")
                .externalId("mtn-ext-ref-001")
                .status("SUCCESSFUL")
                .financialTransactionId("fin-txn-abc")
                .build();

        mockMvc.perform(post("/api/callbacks/mtn/collection")
                        .header("Ocp-Apim-Subscription-Key", "test-collection-key")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(callback)))
                .andExpect(status().isOk());

        // Step 3: Verify SUCCESSFUL in DB
        Optional<PaymentTransaction> completedTxn = transactionRepository.findById(idempotencyKey);
        assertThat(completedTxn).isPresent();
        assertThat(completedTxn.get().getStatus()).isEqualTo(PaymentStatus.SUCCESSFUL);
        assertThat(completedTxn.get().getFineractTransactionId()).isEqualTo(999L);
    }

    // =========================================================================
    // Idempotency
    // =========================================================================

    @Test
    @Order(2)
    @DisplayName("should return same transaction for duplicate idempotency key")
    void deposit_idempotency() throws Exception {
        String idempotencyKey = UUID.randomUUID().toString();

        when(fineractClient.verifyAccountOwnership(EXTERNAL_ID, ACCOUNT_ID)).thenReturn(true);
        when(mtnClient.requestToPay(eq(idempotencyKey), any(BigDecimal.class), eq(PHONE), anyString()))
                .thenReturn("mtn-ext-ref-002");

        DepositRequest request = DepositRequest.builder()
                .externalId(EXTERNAL_ID)
                .accountId(ACCOUNT_ID)
                .amount(BigDecimal.valueOf(5000))
                .provider(PaymentProvider.MTN_MOMO)
                .phoneNumber(PHONE)
                .build();

        // First call
        mockMvc.perform(post("/api/payments/deposit")
                        .with(jwt().jwt(j -> j.subject("user-1")
                                .claim("fineract_external_id", EXTERNAL_ID)))
                        .header("X-Idempotency-Key", idempotencyKey)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.transactionId").value(idempotencyKey));

        // Second call with same key - should return same result without calling provider again
        reset(mtnClient);

        mockMvc.perform(post("/api/payments/deposit")
                        .with(jwt().jwt(j -> j.subject("user-1")
                                .claim("fineract_external_id", EXTERNAL_ID)))
                        .header("X-Idempotency-Key", idempotencyKey)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.transactionId").value(idempotencyKey));

        // MTN should NOT have been called again
        verify(mtnClient, never()).requestToPay(any(), any(), any(), any());

        // Only one record in DB
        assertThat(transactionRepository.count()).isEqualTo(1);
    }

    // =========================================================================
    // Full Withdrawal Flow
    // =========================================================================

    @Test
    @Order(3)
    @DisplayName("should complete full MTN withdrawal flow")
    void withdrawal_mtn_fullFlow() throws Exception {
        String idempotencyKey = UUID.randomUUID().toString();

        when(fineractClient.verifyAccountOwnership(EXTERNAL_ID, ACCOUNT_ID)).thenReturn(true);
        when(fineractClient.getSavingsAccount(ACCOUNT_ID))
                .thenReturn(Map.of("availableBalance", 50000));
        when(fineractClient.createWithdrawal(eq(ACCOUNT_ID), any(BigDecimal.class),
                anyLong(), eq(idempotencyKey))).thenReturn(789L);
        when(mtnClient.transfer(eq(idempotencyKey), any(BigDecimal.class),
                eq(PHONE), anyString())).thenReturn("mtn-ext-ref-w1");

        WithdrawalRequest request = WithdrawalRequest.builder()
                .externalId(EXTERNAL_ID)
                .accountId(ACCOUNT_ID)
                .amount(BigDecimal.valueOf(5000))
                .provider(PaymentProvider.MTN_MOMO)
                .phoneNumber(PHONE)
                .build();

        mockMvc.perform(post("/api/payments/withdraw")
                        .with(jwt().jwt(j -> j.subject("user-1")
                                .claim("fineract_external_id", EXTERNAL_ID)))
                        .header("X-Idempotency-Key", idempotencyKey)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("PROCESSING"));

        // Verify PROCESSING in DB
        Optional<PaymentTransaction> processingTxn = transactionRepository.findById(idempotencyKey);
        assertThat(processingTxn).isPresent();
        assertThat(processingTxn.get().getStatus()).isEqualTo(PaymentStatus.PROCESSING);

        // Simulate successful MTN disbursement callback
        MtnCallbackRequest callback = MtnCallbackRequest.builder()
                .externalId("mtn-ext-ref-w1")
                .status("SUCCESSFUL")
                .build();

        mockMvc.perform(post("/api/callbacks/mtn/disbursement")
                        .header("Ocp-Apim-Subscription-Key", "test-disbursement-key")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(callback)))
                .andExpect(status().isOk());

        // Verify SUCCESSFUL in DB
        Optional<PaymentTransaction> completedTxn = transactionRepository.findById(idempotencyKey);
        assertThat(completedTxn).isPresent();
        assertThat(completedTxn.get().getStatus()).isEqualTo(PaymentStatus.SUCCESSFUL);
    }

    // =========================================================================
    // Withdrawal Failure with Reversal
    // =========================================================================

    @Test
    @Order(4)
    @DisplayName("should reverse Fineract withdrawal on failed callback")
    void withdrawal_failedCallback_reversesFineract() throws Exception {
        String idempotencyKey = UUID.randomUUID().toString();

        when(fineractClient.verifyAccountOwnership(EXTERNAL_ID, ACCOUNT_ID)).thenReturn(true);
        when(fineractClient.getSavingsAccount(ACCOUNT_ID))
                .thenReturn(Map.of("availableBalance", 50000));
        when(fineractClient.createWithdrawal(eq(ACCOUNT_ID), any(BigDecimal.class),
                anyLong(), eq(idempotencyKey))).thenReturn(111L);
        when(mtnClient.transfer(eq(idempotencyKey), any(BigDecimal.class),
                eq(PHONE), anyString())).thenReturn("mtn-ext-ref-w2");

        WithdrawalRequest request = WithdrawalRequest.builder()
                .externalId(EXTERNAL_ID)
                .accountId(ACCOUNT_ID)
                .amount(BigDecimal.valueOf(5000))
                .provider(PaymentProvider.MTN_MOMO)
                .phoneNumber(PHONE)
                .build();

        mockMvc.perform(post("/api/payments/withdraw")
                        .with(jwt().jwt(j -> j.subject("user-1")
                                .claim("fineract_external_id", EXTERNAL_ID)))
                        .header("X-Idempotency-Key", idempotencyKey)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());

        // Simulate FAILED MTN disbursement callback
        MtnCallbackRequest callback = MtnCallbackRequest.builder()
                .externalId("mtn-ext-ref-w2")
                .status("FAILED")
                .reason("Provider error")
                .build();

        mockMvc.perform(post("/api/callbacks/mtn/disbursement")
                        .header("Ocp-Apim-Subscription-Key", "test-disbursement-key")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(callback)))
                .andExpect(status().isOk());

        // Verify FAILED in DB and reversal was called
        Optional<PaymentTransaction> failedTxn = transactionRepository.findById(idempotencyKey);
        assertThat(failedTxn).isPresent();
        assertThat(failedTxn.get().getStatus()).isEqualTo(PaymentStatus.FAILED);

        verify(fineractClient).createDeposit(eq(ACCOUNT_ID), any(BigDecimal.class),
                anyLong(), eq("REVERSAL-" + idempotencyKey));
    }

    // =========================================================================
    // Security Tests
    // =========================================================================

    @Test
    @Order(5)
    @DisplayName("should return 401 for unauthenticated deposit request")
    void deposit_noAuth_returns401() throws Exception {
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
                .andExpect(status().isUnauthorized());
    }

    @Test
    @Order(6)
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
    }

    @Test
    @Order(7)
    @DisplayName("should allow callback without authentication")
    void callback_mtn_noAuth_returns200() throws Exception {
        MtnCallbackRequest callback = MtnCallbackRequest.builder()
                .referenceId("ref-no-auth")
                .status("SUCCESSFUL")
                .build();

        mockMvc.perform(post("/api/callbacks/mtn/collection")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(callback)))
                .andExpect(status().isOk());
    }

    // =========================================================================
    // Status Endpoint
    // =========================================================================

    @Test
    @Order(8)
    @DisplayName("should return correct status after deposit and callback")
    void getStatus_returnsCorrectState() throws Exception {
        String idempotencyKey = UUID.randomUUID().toString();

        when(fineractClient.verifyAccountOwnership(EXTERNAL_ID, ACCOUNT_ID)).thenReturn(true);
        when(mtnClient.requestToPay(eq(idempotencyKey), any(BigDecimal.class), eq(PHONE), anyString()))
                .thenReturn("mtn-ext-ref-status");

        // Initiate deposit
        DepositRequest request = DepositRequest.builder()
                .externalId(EXTERNAL_ID)
                .accountId(ACCOUNT_ID)
                .amount(BigDecimal.valueOf(10000))
                .provider(PaymentProvider.MTN_MOMO)
                .phoneNumber(PHONE)
                .build();

        mockMvc.perform(post("/api/payments/deposit")
                        .with(jwt().jwt(j -> j.subject("user-1")
                                .claim("fineract_external_id", EXTERNAL_ID)))
                        .header("X-Idempotency-Key", idempotencyKey)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());

        // Check status via API
        mockMvc.perform(get("/api/payments/status/{transactionId}", idempotencyKey)
                        .with(jwt().jwt(j -> j.subject("user-1")
                                .claim("fineract_external_id", EXTERNAL_ID))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.transactionId").value(idempotencyKey))
                .andExpect(jsonPath("$.status").value("PENDING"))
                .andExpect(jsonPath("$.externalId").value(EXTERNAL_ID));
    }

    @Test
    @Order(9)
    @DisplayName("should return 403 when viewing another user's transaction")
    void getStatus_otherUser_returns403() throws Exception {
        String idempotencyKey = UUID.randomUUID().toString();

        when(fineractClient.verifyAccountOwnership(EXTERNAL_ID, ACCOUNT_ID)).thenReturn(true);
        when(mtnClient.requestToPay(eq(idempotencyKey), any(BigDecimal.class), eq(PHONE), anyString()))
                .thenReturn("mtn-ext-ref-other");

        // Create a deposit as user A
        DepositRequest request = DepositRequest.builder()
                .externalId(EXTERNAL_ID)
                .accountId(ACCOUNT_ID)
                .amount(BigDecimal.valueOf(10000))
                .provider(PaymentProvider.MTN_MOMO)
                .phoneNumber(PHONE)
                .build();

        mockMvc.perform(post("/api/payments/deposit")
                        .with(jwt().jwt(j -> j.subject("user-1")
                                .claim("fineract_external_id", EXTERNAL_ID)))
                        .header("X-Idempotency-Key", idempotencyKey)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());

        // Try to view as user B
        mockMvc.perform(get("/api/payments/status/{transactionId}", idempotencyKey)
                        .with(jwt().jwt(j -> j.subject("user-2")
                                .claim("fineract_external_id", "b2c3d4e5-f6a7-8901-bcde-f12345678901"))))
                .andExpect(status().isForbidden());
    }

    // =========================================================================
    // Validation
    // =========================================================================

    @Test
    @Order(10)
    @DisplayName("should return 400 for invalid deposit request")
    void deposit_invalidRequest_returns400() throws Exception {
        // Missing required fields
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
