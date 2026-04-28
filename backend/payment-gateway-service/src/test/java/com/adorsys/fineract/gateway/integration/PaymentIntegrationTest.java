package com.adorsys.fineract.gateway.integration;

import com.adorsys.fineract.gateway.client.CinetPayClient;
import com.adorsys.fineract.gateway.client.FineractClient;
import com.adorsys.fineract.gateway.client.MtnMomoClient;
import com.adorsys.fineract.gateway.client.NokashClient;
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
    private NokashClient nokashClient;

    @MockBean
    private PaymentMetrics paymentMetrics;

    @MockBean
    private JwtDecoder jwtDecoder;

    private static final String EXTERNAL_ID = "a1b2c3d4-e5f6-7890-abcd-ef1234567890";
    private static final Long ACCOUNT_ID = 456L;
    private static final String PHONE = "+237612345678";

    // Must match values in application-test.yml
    private static final String MTN_SECRET    = "test-mtn-secret";
    private static final String NOKASH_SECRET = "test-nokash-secret";

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
        when(mtnClient.requestToPay(anyString(), any(BigDecimal.class),
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
                        .with(jwt().jwt(j -> j.subject(EXTERNAL_ID)))
                        .header("X-Idempotency-Key", idempotencyKey)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(depositRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("PENDING"))
                .andExpect(jsonPath("$.transactionId").isNotEmpty())
                .andReturn();

        // Verify PENDING in DB
        Optional<PaymentTransaction> pendingTxn = transactionRepository.findByIdempotencyKey(idempotencyKey);
        assertThat(pendingTxn).isPresent();
        assertThat(pendingTxn.get().getStatus()).isEqualTo(PaymentStatus.PENDING);
        assertThat(pendingTxn.get().getProviderReference()).isEqualTo("mtn-ext-ref-001");

        // Step 2: Simulate MTN callback — use the transactionId from the initiation response
        String transactionId = objectMapper.readTree(depositResult.getResponse().getContentAsString())
                .get("transactionId").asText();

        when(fineractClient.createDeposit(eq(ACCOUNT_ID), any(BigDecimal.class), anyLong(), isNull()))
                .thenReturn(999L);
        when(mtnClient.getCollectionStatus(transactionId)).thenReturn(PaymentStatus.SUCCESSFUL);

        mockMvc.perform(post("/api/callbacks/mtn/collection/" + transactionId)
                        .header("X-Callback-Secret", MTN_SECRET))
                .andExpect(status().isOk());

        // Step 3: Verify SUCCESSFUL in DB
        Optional<PaymentTransaction> completedTxn = transactionRepository.findByIdempotencyKey(idempotencyKey);
        assertThat(completedTxn).isPresent();
        assertThat(completedTxn.get().getStatus()).isEqualTo(PaymentStatus.SUCCESSFUL);
        assertThat(completedTxn.get().getFineractTransactionId()).isEqualTo(999L);
    }

    @Test
    @Order(11)
    @DisplayName("should complete full NOKASH deposit flow: initiate -> callback -> verify")
    void deposit_nokash_fullFlow() throws Exception {
        String idempotencyKey = UUID.randomUUID().toString();

        // Mock external clients
        when(fineractClient.verifyAccountOwnership(EXTERNAL_ID, ACCOUNT_ID)).thenReturn(true);
        when(nokashClient.initiatePayin(anyString(), any(BigDecimal.class), eq(PHONE), anyString())).thenReturn("nokash-ref-001");

        // Step 1: Initiate deposit
        DepositRequest depositRequest = DepositRequest.builder()
                .externalId(EXTERNAL_ID)
                .accountId(ACCOUNT_ID)
                .amount(BigDecimal.valueOf(10000))
                .provider(PaymentProvider.NOKASH)
                .phoneNumber(PHONE)
                .paymentMethod("MTN_MOMO")
                .build();

        MvcResult depositResult = mockMvc.perform(post("/api/payments/deposit")
                        .with(jwt().jwt(j -> j.subject(EXTERNAL_ID)))
                        .header("X-Idempotency-Key", idempotencyKey)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(depositRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("PENDING"))
                .andExpect(jsonPath("$.transactionId").isNotEmpty())
                .andReturn();

        // Verify PENDING in DB
        Optional<PaymentTransaction> pendingTxn = transactionRepository.findByIdempotencyKey(idempotencyKey);
        assertThat(pendingTxn).isPresent();
        assertThat(pendingTxn.get().getStatus()).isEqualTo(PaymentStatus.PENDING);
        assertThat(pendingTxn.get().getProviderReference()).isEqualTo("nokash-ref-001");

        // Step 2: Simulate NOKASH callback
        String transactionId = objectMapper.readTree(depositResult.getResponse().getContentAsString())
                .get("transactionId").asText();

        NokashCallbackRequest callbackRequest = NokashCallbackRequest.builder()
                .orderId(transactionId)
                .status("SUCCESS")
                .amount("10000")
                .reference("nokash-callback-ref")
                .build();

        when(fineractClient.createDeposit(eq(ACCOUNT_ID), any(BigDecimal.class), anyLong(), anyString()))
                .thenReturn(1000L);

        mockMvc.perform(post("/api/callbacks/nokash/" + transactionId)
                        .header("X-Callback-Secret", NOKASH_SECRET)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(callbackRequest)))
                .andExpect(status().isOk());

        // Step 3: Verify SUCCESSFUL in DB
        Optional<PaymentTransaction> completedTxn = transactionRepository.findByIdempotencyKey(idempotencyKey);
        assertThat(completedTxn).isPresent();
        assertThat(completedTxn.get().getStatus()).isEqualTo(PaymentStatus.SUCCESSFUL);
        assertThat(completedTxn.get().getFineractTransactionId()).isEqualTo(1000L);
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
        when(mtnClient.requestToPay(anyString(), any(BigDecimal.class), eq(PHONE), anyString()))
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
                        .with(jwt().jwt(j -> j.subject(EXTERNAL_ID)))
                        .header("X-Idempotency-Key", idempotencyKey)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.transactionId").isNotEmpty());

        // Second call with same key - should return same result without calling provider again
        reset(mtnClient);

        mockMvc.perform(post("/api/payments/deposit")
                        .with(jwt().jwt(j -> j.subject(EXTERNAL_ID)))
                        .header("X-Idempotency-Key", idempotencyKey)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.transactionId").isNotEmpty());

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
                anyLong(), anyString())).thenReturn(789L);
        when(mtnClient.transfer(anyString(), any(BigDecimal.class),
                eq(PHONE), anyString())).thenReturn("mtn-ext-ref-w1");

        WithdrawalRequest request = WithdrawalRequest.builder()
                .externalId(EXTERNAL_ID)
                .accountId(ACCOUNT_ID)
                .amount(BigDecimal.valueOf(5000))
                .provider(PaymentProvider.MTN_MOMO)
                .phoneNumber(PHONE)
                .build();

        mockMvc.perform(post("/api/payments/withdraw")
                        .with(jwt().jwt(j -> j.subject(EXTERNAL_ID)))
                        .header("X-Idempotency-Key", idempotencyKey)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("PROCESSING"));

        // Verify PROCESSING in DB
        Optional<PaymentTransaction> processingTxn = transactionRepository.findByIdempotencyKey(idempotencyKey);
        assertThat(processingTxn).isPresent();
        assertThat(processingTxn.get().getStatus()).isEqualTo(PaymentStatus.PROCESSING);

        // Simulate successful MTN disbursement callback — use transactionId from initiation
        Optional<PaymentTransaction> processingTxnForCallback = transactionRepository.findByIdempotencyKey(idempotencyKey);
        String withdrawalTxnId = processingTxnForCallback.get().getTransactionId();
        when(mtnClient.getDisbursementStatus(withdrawalTxnId)).thenReturn(PaymentStatus.SUCCESSFUL);

        mockMvc.perform(post("/api/callbacks/mtn/disbursement/" + withdrawalTxnId)
                        .header("X-Callback-Secret", MTN_SECRET))
                .andExpect(status().isOk());

        // Verify SUCCESSFUL in DB
        Optional<PaymentTransaction> completedTxn = transactionRepository.findByIdempotencyKey(idempotencyKey);
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
                anyLong(), anyString())).thenReturn(111L);
        when(mtnClient.transfer(anyString(), any(BigDecimal.class),
                eq(PHONE), anyString())).thenReturn("mtn-ext-ref-w2");

        WithdrawalRequest request = WithdrawalRequest.builder()
                .externalId(EXTERNAL_ID)
                .accountId(ACCOUNT_ID)
                .amount(BigDecimal.valueOf(5000))
                .provider(PaymentProvider.MTN_MOMO)
                .phoneNumber(PHONE)
                .build();

        mockMvc.perform(post("/api/payments/withdraw")
                        .with(jwt().jwt(j -> j.subject(EXTERNAL_ID)))
                        .header("X-Idempotency-Key", idempotencyKey)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());

        // Simulate FAILED MTN disbursement callback — use transactionId from initiation
        Optional<PaymentTransaction> processingTxnForCallback = transactionRepository.findByIdempotencyKey(idempotencyKey);
        String withdrawalTxnId = processingTxnForCallback.get().getTransactionId();
        when(mtnClient.getDisbursementStatus(withdrawalTxnId)).thenReturn(PaymentStatus.FAILED);

        mockMvc.perform(post("/api/callbacks/mtn/disbursement/" + withdrawalTxnId)
                        .header("X-Callback-Secret", MTN_SECRET))
                .andExpect(status().isOk());

        // Verify FAILED in DB and reversal was called
        Optional<PaymentTransaction> failedTxn = transactionRepository.findByIdempotencyKey(idempotencyKey);
        assertThat(failedTxn).isPresent();
        assertThat(failedTxn.get().getStatus()).isEqualTo(PaymentStatus.FAILED);

        verify(fineractClient).createDeposit(eq(ACCOUNT_ID), any(BigDecimal.class),
                anyLong(), startsWith("REVERSAL-"));
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
                        .with(jwt().jwt(j -> j.subject(EXTERNAL_ID)))
                        .header("X-Idempotency-Key", UUID.randomUUID().toString())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden());
    }

    @Test
    @Order(7)
    @DisplayName("callback with wrong secret is silently dropped — returns 200, guard relies on scheduler")
    void callback_mtn_wrongSecret_droppedWith200() throws Exception {
        mockMvc.perform(post("/api/callbacks/mtn/collection/ref-no-auth")
                        .header("X-Callback-Secret", "wrong-secret"))
                .andExpect(status().isOk());

        verify(mtnClient, never()).getCollectionStatus(any());
    }

    // =========================================================================
    // Callback Guard Tests
    // =========================================================================

    @Test
    @Order(20)
    @DisplayName("nokash callback with no secret header is silently dropped — no DB change")
    void callback_nokash_noSecret_droppedWithNoDbChange() throws Exception {
        String transactionId = UUID.randomUUID().toString();

        mockMvc.perform(post("/api/callbacks/nokash/" + transactionId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"status\":\"SUCCESS\",\"amount\":\"10000\"}"))
                .andExpect(status().isOk());

        assertThat(transactionRepository.findById(transactionId)).isEmpty();
        verify(fineractClient, never()).createDeposit(any(), any(), any(), any());
    }

    @Test
    @Order(21)
    @DisplayName("nokash callback with correct secret is processed")
    void callback_nokash_correctSecret_processed() throws Exception {
        when(fineractClient.verifyAccountOwnership(EXTERNAL_ID, ACCOUNT_ID)).thenReturn(true);
        when(nokashClient.initiatePayin(anyString(), any(), eq(PHONE), anyString())).thenReturn("nokash-ref-guard");
        String idempotencyKey = UUID.randomUUID().toString();

        MvcResult depositResult = mockMvc.perform(post("/api/payments/deposit")
                        .with(jwt().jwt(j -> j.subject(EXTERNAL_ID)))
                        .header("X-Idempotency-Key", idempotencyKey)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(DepositRequest.builder()
                                .externalId(EXTERNAL_ID).accountId(ACCOUNT_ID)
                                .amount(BigDecimal.valueOf(5000))
                                .provider(PaymentProvider.NOKASH).phoneNumber(PHONE)
                                .paymentMethod("MTN_MOMO").build())))
                .andExpect(status().isOk()).andReturn();

        String transactionId = objectMapper.readTree(depositResult.getResponse().getContentAsString())
                .get("transactionId").asText();
        when(fineractClient.createDeposit(eq(ACCOUNT_ID), any(), anyLong(), anyString())).thenReturn(2000L);

        NokashCallbackRequest cb = NokashCallbackRequest.builder()
                .orderId(transactionId).status("SUCCESS").amount("5000").reference("ref-guard").build();

        mockMvc.perform(post("/api/callbacks/nokash/" + transactionId)
                        .header("X-Callback-Secret", NOKASH_SECRET)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(cb)))
                .andExpect(status().isOk());

        assertThat(transactionRepository.findById(transactionId))
                .isPresent()
                .hasValueSatisfying(t -> assertThat(t.getStatus()).isEqualTo(PaymentStatus.SUCCESSFUL));
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
        when(mtnClient.requestToPay(anyString(), any(BigDecimal.class), eq(PHONE), anyString()))
                .thenReturn("mtn-ext-ref-status");

        // Initiate deposit
        DepositRequest request = DepositRequest.builder()
                .externalId(EXTERNAL_ID)
                .accountId(ACCOUNT_ID)
                .amount(BigDecimal.valueOf(10000))
                .provider(PaymentProvider.MTN_MOMO)
                .phoneNumber(PHONE)
                .build();

        MvcResult result = mockMvc.perform(post("/api/payments/deposit")
                        .with(jwt().jwt(j -> j.subject(EXTERNAL_ID)))
                        .header("X-Idempotency-Key", idempotencyKey)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andReturn();

        // Extract the server-generated transactionId from the response
        String transactionId = objectMapper.readTree(result.getResponse().getContentAsString())
                .get("transactionId").asText();

        // Check status via API using the transactionId (not idempotency key)
        mockMvc.perform(get("/api/payments/status/{transactionId}", transactionId)
                        .with(jwt().jwt(j -> j.subject(EXTERNAL_ID))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.transactionId").value(transactionId))
                .andExpect(jsonPath("$.status").value("PENDING"))
                .andExpect(jsonPath("$.externalId").value(EXTERNAL_ID));
    }

    @Test
    @Order(9)
    @DisplayName("should return 403 when viewing another user's transaction")
    void getStatus_otherUser_returns403() throws Exception {
        String idempotencyKey = UUID.randomUUID().toString();

        when(fineractClient.verifyAccountOwnership(EXTERNAL_ID, ACCOUNT_ID)).thenReturn(true);
        when(mtnClient.requestToPay(anyString(), any(BigDecimal.class), eq(PHONE), anyString()))
                .thenReturn("mtn-ext-ref-other");

        // Create a deposit as user A
        DepositRequest request = DepositRequest.builder()
                .externalId(EXTERNAL_ID)
                .accountId(ACCOUNT_ID)
                .amount(BigDecimal.valueOf(10000))
                .provider(PaymentProvider.MTN_MOMO)
                .phoneNumber(PHONE)
                .build();

        MvcResult result = mockMvc.perform(post("/api/payments/deposit")
                        .with(jwt().jwt(j -> j.subject(EXTERNAL_ID)))
                        .header("X-Idempotency-Key", idempotencyKey)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andReturn();

        String transactionId = objectMapper.readTree(result.getResponse().getContentAsString())
                .get("transactionId").asText();

        // Try to view as user B
        mockMvc.perform(get("/api/payments/status/{transactionId}", transactionId)
                        .with(jwt().jwt(j -> j.subject("b2c3d4e5-f6a7-8901-bcde-f12345678901"))))
                .andExpect(status().isForbidden());
    }

    // =========================================================================
    // Validation
    // =========================================================================

    // =========================================================================
    // Nokash Timeout Scenario Tests
    // =========================================================================

    @Test
    @Order(22)
    @DisplayName("nokash payout timeout leaves withdrawal in PROCESSING — no immediate reversal")
    void nokashWithdrawal_timeout_staysProcessing() throws Exception {
        String idempotencyKey = UUID.randomUUID().toString();

        when(fineractClient.verifyAccountOwnership(EXTERNAL_ID, ACCOUNT_ID)).thenReturn(true);
        when(fineractClient.getSavingsAccount(ACCOUNT_ID)).thenReturn(Map.of("availableBalance", 50000));
        when(fineractClient.createWithdrawal(eq(ACCOUNT_ID), any(), anyLong(), anyString())).thenReturn(777L);
        when(nokashClient.getTemporaryAuthKey()).thenReturn("test-auth-key");
        when(nokashClient.initiatePayout(anyString(), anyString(), any(), anyString(), anyString()))
                .thenThrow(new RuntimeException("timeout", new java.util.concurrent.TimeoutException("simulated Nokash payout timeout")));

        WithdrawalRequest request = WithdrawalRequest.builder()
                .externalId(EXTERNAL_ID).accountId(ACCOUNT_ID)
                .amount(BigDecimal.valueOf(3000))
                .provider(PaymentProvider.NOKASH).phoneNumber(PHONE)
                .paymentMethod("MTN_MOMO").build();

        mockMvc.perform(post("/api/payments/withdraw")
                        .with(jwt().jwt(j -> j.subject(EXTERNAL_ID)))
                        .header("X-Idempotency-Key", idempotencyKey)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)));

        Optional<PaymentTransaction> txn = transactionRepository.findByIdempotencyKey(idempotencyKey);
        assertThat(txn).isPresent();
        assertThat(txn.get().getStatus()).isEqualTo(PaymentStatus.PROCESSING);
        assertThat(txn.get().getFineractTransactionId()).isEqualTo(777L);
        verify(fineractClient, never()).createDeposit(eq(ACCOUNT_ID), any(), anyLong(), startsWith("REVERSAL-"));
    }

    @Test
    @Order(23)
    @DisplayName("stale PROCESSING withdrawal resolved as SUCCESSFUL — no reversal triggered")
    void nokashWithdrawal_processing_reconcilerConfirmsSuccess() throws Exception {
        when(fineractClient.verifyAccountOwnership(EXTERNAL_ID, ACCOUNT_ID)).thenReturn(true);
        when(fineractClient.getSavingsAccount(ACCOUNT_ID)).thenReturn(Map.of("availableBalance", 50000));
        when(fineractClient.createWithdrawal(eq(ACCOUNT_ID), any(), anyLong(), anyString())).thenReturn(888L);
        when(nokashClient.getTemporaryAuthKey()).thenReturn("test-auth-key");
        when(nokashClient.initiatePayout(anyString(), anyString(), any(), anyString(), anyString()))
                .thenThrow(new RuntimeException("timeout", new java.util.concurrent.TimeoutException("simulated timeout")));

        String idempotencyKey = UUID.randomUUID().toString();
        mockMvc.perform(post("/api/payments/withdraw")
                        .with(jwt().jwt(j -> j.subject(EXTERNAL_ID)))
                        .header("X-Idempotency-Key", idempotencyKey)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(WithdrawalRequest.builder()
                                .externalId(EXTERNAL_ID).accountId(ACCOUNT_ID)
                                .amount(BigDecimal.valueOf(3000))
                                .provider(PaymentProvider.NOKASH).phoneNumber(PHONE)
                                .paymentMethod("MTN_MOMO").build())));

        PaymentTransaction txn = transactionRepository.findByIdempotencyKey(idempotencyKey).orElseThrow();
        assertThat(txn.getStatus()).isEqualTo(PaymentStatus.PROCESSING);

        // Stale reconciler polls Nokash → confirms SUCCESS
        when(nokashClient.getTransactionStatus(any())).thenReturn(PaymentStatus.SUCCESSFUL);

        NokashCallbackRequest successCb = NokashCallbackRequest.builder()
                .orderId(txn.getTransactionId()).status("SUCCESS").build();
        mockMvc.perform(post("/api/callbacks/nokash/" + txn.getTransactionId())
                        .header("X-Callback-Secret", NOKASH_SECRET)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(successCb)))
                .andExpect(status().isOk());

        Optional<PaymentTransaction> resolved = transactionRepository.findByIdempotencyKey(idempotencyKey);
        assertThat(resolved.get().getStatus()).isEqualTo(PaymentStatus.SUCCESSFUL);
        verify(fineractClient, never()).createDeposit(eq(ACCOUNT_ID), any(), anyLong(), startsWith("REVERSAL-"));
    }

    @Test
    @Order(24)
    @DisplayName("stale PROCESSING withdrawal confirmed FAILED by provider — Fineract is reversed")
    void nokashWithdrawal_processing_reconcilerConfirmsFailure_reverses() throws Exception {
        when(fineractClient.verifyAccountOwnership(EXTERNAL_ID, ACCOUNT_ID)).thenReturn(true);
        when(fineractClient.getSavingsAccount(ACCOUNT_ID)).thenReturn(Map.of("availableBalance", 50000));
        when(fineractClient.createWithdrawal(eq(ACCOUNT_ID), any(), anyLong(), anyString())).thenReturn(999L);
        when(nokashClient.getTemporaryAuthKey()).thenReturn("test-auth-key");
        when(nokashClient.initiatePayout(anyString(), anyString(), any(), anyString(), anyString()))
                .thenThrow(new RuntimeException("timeout", new java.util.concurrent.TimeoutException("simulated timeout")));

        String idempotencyKey = UUID.randomUUID().toString();
        mockMvc.perform(post("/api/payments/withdraw")
                        .with(jwt().jwt(j -> j.subject(EXTERNAL_ID)))
                        .header("X-Idempotency-Key", idempotencyKey)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(WithdrawalRequest.builder()
                                .externalId(EXTERNAL_ID).accountId(ACCOUNT_ID)
                                .amount(BigDecimal.valueOf(3000))
                                .provider(PaymentProvider.NOKASH).phoneNumber(PHONE)
                                .paymentMethod("MTN_MOMO").build())));

        PaymentTransaction txn = transactionRepository.findByIdempotencyKey(idempotencyKey).orElseThrow();
        assertThat(txn.getStatus()).isEqualTo(PaymentStatus.PROCESSING);

        // Callback arrives confirming FAILED → reversal must be triggered
        NokashCallbackRequest failedCb = NokashCallbackRequest.builder()
                .orderId(txn.getTransactionId()).status("FAILED").build();
        mockMvc.perform(post("/api/callbacks/nokash/" + txn.getTransactionId())
                        .header("X-Callback-Secret", NOKASH_SECRET)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(failedCb)))
                .andExpect(status().isOk());

        Optional<PaymentTransaction> resolved = transactionRepository.findByIdempotencyKey(idempotencyKey);
        assertThat(resolved.get().getStatus()).isEqualTo(PaymentStatus.FAILED);
        verify(fineractClient).createDeposit(eq(ACCOUNT_ID), any(), anyLong(), startsWith("REVERSAL-"));
    }

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
                        .with(jwt().jwt(j -> j.subject(EXTERNAL_ID)))
                        .header("X-Idempotency-Key", UUID.randomUUID().toString())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }
}
