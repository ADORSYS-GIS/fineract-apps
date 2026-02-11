package com.adorsys.fineract.gateway.service;

import com.adorsys.fineract.gateway.client.CinetPayClient;
import com.adorsys.fineract.gateway.client.FineractClient;
import com.adorsys.fineract.gateway.client.MtnMomoClient;
import com.adorsys.fineract.gateway.client.OrangeMoneyClient;
import com.adorsys.fineract.gateway.config.CinetPayConfig;
import com.adorsys.fineract.gateway.config.MtnMomoConfig;
import com.adorsys.fineract.gateway.config.OrangeMoneyConfig;
import com.adorsys.fineract.gateway.dto.*;
import com.adorsys.fineract.gateway.entity.PaymentTransaction;
import com.adorsys.fineract.gateway.exception.PaymentException;
import com.adorsys.fineract.gateway.metrics.PaymentMetrics;
import com.adorsys.fineract.gateway.repository.PaymentTransactionRepository;
import io.micrometer.core.instrument.Timer;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PaymentServiceTest {

    @Mock private MtnMomoClient mtnClient;
    @Mock private OrangeMoneyClient orangeClient;
    @Mock private CinetPayClient cinetPayClient;
    @Mock private FineractClient fineractClient;
    @Mock private MtnMomoConfig mtnConfig;
    @Mock private OrangeMoneyConfig orangeConfig;
    @Mock private CinetPayConfig cinetPayConfig;
    @Mock private PaymentMetrics paymentMetrics;
    @Mock private PaymentTransactionRepository transactionRepository;
    @Mock private ReversalService reversalService;

    @InjectMocks
    private PaymentService paymentService;

    private static final String EXTERNAL_ID = "a1b2c3d4-e5f6-7890-abcd-ef1234567890";
    private static final Long ACCOUNT_ID = 456L;
    private static final String PHONE = "+237612345678";
    private static final String IDEMPOTENCY_KEY = UUID.randomUUID().toString();

    private DepositRequest depositRequest;
    private WithdrawalRequest withdrawalRequest;

    @BeforeEach
    void setUp() {
        depositRequest = DepositRequest.builder()
                .externalId(EXTERNAL_ID)
                .accountId(ACCOUNT_ID)
                .amount(BigDecimal.valueOf(10000))
                .provider(PaymentProvider.MTN_MOMO)
                .phoneNumber(PHONE)
                .build();

        withdrawalRequest = WithdrawalRequest.builder()
                .externalId(EXTERNAL_ID)
                .accountId(ACCOUNT_ID)
                .amount(BigDecimal.valueOf(5000))
                .provider(PaymentProvider.MTN_MOMO)
                .phoneNumber(PHONE)
                .build();

        lenient().when(paymentMetrics.startTimer()).thenReturn(mock(Timer.Sample.class));
        lenient().when(mtnConfig.getCurrency()).thenReturn("XAF");
        lenient().when(orangeConfig.getCurrency()).thenReturn("XAF");
        lenient().when(cinetPayConfig.getCurrency()).thenReturn("XAF");
    }

    // =========================================================================
    // initiateDeposit tests
    // =========================================================================

    @Nested
    @DisplayName("initiateDeposit()")
    class InitiateDepositTests {

        @Test
        @DisplayName("should initiate MTN deposit successfully")
        void initiateDeposit_mtn_happyPath() {
            when(transactionRepository.findById(IDEMPOTENCY_KEY)).thenReturn(Optional.empty());
            when(fineractClient.verifyAccountOwnership(EXTERNAL_ID, ACCOUNT_ID)).thenReturn(true);
            when(mtnClient.requestToPay(eq(IDEMPOTENCY_KEY), eq(BigDecimal.valueOf(10000)),
                    eq(PHONE), anyString())).thenReturn("mtn-ref-123");

            PaymentResponse response = paymentService.initiateDeposit(depositRequest, IDEMPOTENCY_KEY);

            assertThat(response).isNotNull();
            assertThat(response.getTransactionId()).isEqualTo(IDEMPOTENCY_KEY);
            assertThat(response.getProviderReference()).isEqualTo("mtn-ref-123");
            assertThat(response.getProvider()).isEqualTo(PaymentProvider.MTN_MOMO);
            assertThat(response.getType()).isEqualTo(PaymentResponse.TransactionType.DEPOSIT);
            assertThat(response.getStatus()).isEqualTo(PaymentStatus.PENDING);
            assertThat(response.getAmount()).isEqualByComparingTo(BigDecimal.valueOf(10000));
            assertThat(response.getCurrency()).isEqualTo("XAF");

            verify(transactionRepository).save(any(PaymentTransaction.class));
            verify(paymentMetrics).incrementTransaction(PaymentProvider.MTN_MOMO,
                    PaymentResponse.TransactionType.DEPOSIT, PaymentStatus.PENDING);
        }

        @Test
        @DisplayName("should initiate Orange deposit with payment URL")
        void initiateDeposit_orange_happyPath() {
            depositRequest = depositRequest.toBuilder().provider(PaymentProvider.ORANGE_MONEY).build();
            String key = UUID.randomUUID().toString();

            when(transactionRepository.findById(key)).thenReturn(Optional.empty());
            when(fineractClient.verifyAccountOwnership(EXTERNAL_ID, ACCOUNT_ID)).thenReturn(true);
            when(orangeClient.initializePayment(eq(key), eq(BigDecimal.valueOf(10000)), anyString()))
                    .thenReturn(new OrangeMoneyClient.PaymentInitResponse(
                            "https://pay.orange.com/checkout", "pay-token-123", "notif-token"));

            PaymentResponse response = paymentService.initiateDeposit(depositRequest, key);

            assertThat(response.getProvider()).isEqualTo(PaymentProvider.ORANGE_MONEY);
            assertThat(response.getPaymentUrl()).isEqualTo("https://pay.orange.com/checkout");
            assertThat(response.getProviderReference()).isEqualTo("pay-token-123");
            assertThat(response.getStatus()).isEqualTo(PaymentStatus.PENDING);
        }

        @Test
        @DisplayName("should initiate CinetPay deposit with payment URL")
        void initiateDeposit_cinetpay_happyPath() {
            depositRequest = depositRequest.toBuilder().provider(PaymentProvider.CINETPAY).build();
            String key = UUID.randomUUID().toString();

            when(transactionRepository.findById(key)).thenReturn(Optional.empty());
            when(fineractClient.verifyAccountOwnership(EXTERNAL_ID, ACCOUNT_ID)).thenReturn(true);
            when(cinetPayClient.initializePayment(eq(key), eq(BigDecimal.valueOf(10000)),
                    anyString(), eq(PHONE)))
                    .thenReturn(new CinetPayClient.PaymentInitResponse(
                            "https://checkout.cinetpay.com/pay", "cp-token-123"));

            PaymentResponse response = paymentService.initiateDeposit(depositRequest, key);

            assertThat(response.getProvider()).isEqualTo(PaymentProvider.CINETPAY);
            assertThat(response.getPaymentUrl()).isEqualTo("https://checkout.cinetpay.com/pay");
            assertThat(response.getProviderReference()).isEqualTo("cp-token-123");
        }

        @Test
        @DisplayName("should return existing transaction for idempotent request")
        void initiateDeposit_idempotent_returnsExisting() {
            PaymentTransaction existing = new PaymentTransaction(
                    IDEMPOTENCY_KEY, "mtn-ref-existing", EXTERNAL_ID, ACCOUNT_ID,
                    PaymentProvider.MTN_MOMO, PaymentResponse.TransactionType.DEPOSIT,
                    BigDecimal.valueOf(10000), "XAF", PaymentStatus.PENDING);

            when(transactionRepository.findById(IDEMPOTENCY_KEY)).thenReturn(Optional.of(existing));

            PaymentResponse response = paymentService.initiateDeposit(depositRequest, IDEMPOTENCY_KEY);

            assertThat(response.getTransactionId()).isEqualTo(IDEMPOTENCY_KEY);
            assertThat(response.getProviderReference()).isEqualTo("mtn-ref-existing");

            verify(fineractClient, never()).verifyAccountOwnership(any(), any());
            verify(mtnClient, never()).requestToPay(any(), any(), any(), any());
            verify(transactionRepository, never()).save(any());
        }

        @Test
        @DisplayName("should throw when account ownership verification fails")
        void initiateDeposit_accountOwnershipFails_throws() {
            when(transactionRepository.findById(IDEMPOTENCY_KEY)).thenReturn(Optional.empty());
            when(fineractClient.verifyAccountOwnership(EXTERNAL_ID, ACCOUNT_ID)).thenReturn(false);

            assertThatThrownBy(() -> paymentService.initiateDeposit(depositRequest, IDEMPOTENCY_KEY))
                    .isInstanceOf(PaymentException.class)
                    .hasMessageContaining("Account does not belong to the customer");

            verify(mtnClient, never()).requestToPay(any(), any(), any(), any());
        }

        @Test
        @DisplayName("should throw for invalid idempotency key")
        void initiateDeposit_invalidIdempotencyKey_throws() {
            assertThatThrownBy(() -> paymentService.initiateDeposit(depositRequest, "not-a-uuid"))
                    .isInstanceOf(PaymentException.class)
                    .hasMessageContaining("X-Idempotency-Key must be a valid UUID");
        }
    }

    // =========================================================================
    // initiateWithdrawal tests
    // =========================================================================

    @Nested
    @DisplayName("initiateWithdrawal()")
    class InitiateWithdrawalTests {

        @Test
        @DisplayName("should initiate MTN withdrawal successfully")
        void initiateWithdrawal_mtn_happyPath() {
            String key = UUID.randomUUID().toString();

            when(transactionRepository.findById(key)).thenReturn(Optional.empty());
            when(fineractClient.verifyAccountOwnership(EXTERNAL_ID, ACCOUNT_ID)).thenReturn(true);
            when(fineractClient.getSavingsAccount(ACCOUNT_ID))
                    .thenReturn(Map.of("availableBalance", 50000));
            when(mtnConfig.getFineractPaymentTypeId()).thenReturn(1L);
            when(fineractClient.createWithdrawal(eq(ACCOUNT_ID), eq(BigDecimal.valueOf(5000)),
                    eq(1L), eq(key))).thenReturn(789L);
            when(mtnClient.transfer(eq(key), eq(BigDecimal.valueOf(5000)),
                    eq(PHONE), anyString())).thenReturn("mtn-transfer-ref");

            PaymentResponse response = paymentService.initiateWithdrawal(withdrawalRequest, key);

            assertThat(response).isNotNull();
            assertThat(response.getType()).isEqualTo(PaymentResponse.TransactionType.WITHDRAWAL);
            assertThat(response.getStatus()).isEqualTo(PaymentStatus.PROCESSING);
            assertThat(response.getFineractTransactionId()).isEqualTo(789L);
            assertThat(response.getProviderReference()).isEqualTo("mtn-transfer-ref");

            verify(transactionRepository).save(any(PaymentTransaction.class));
        }

        @Test
        @DisplayName("should throw when insufficient funds")
        void initiateWithdrawal_insufficientFunds_throws() {
            String key = UUID.randomUUID().toString();

            when(transactionRepository.findById(key)).thenReturn(Optional.empty());
            when(fineractClient.verifyAccountOwnership(EXTERNAL_ID, ACCOUNT_ID)).thenReturn(true);
            when(fineractClient.getSavingsAccount(ACCOUNT_ID))
                    .thenReturn(Map.of("availableBalance", 1000));

            assertThatThrownBy(() -> paymentService.initiateWithdrawal(withdrawalRequest, key))
                    .isInstanceOf(PaymentException.class)
                    .hasMessageContaining("Insufficient funds");

            verify(fineractClient, never()).createWithdrawal(any(), any(), any(), any());
        }

        @Test
        @DisplayName("should reverse Fineract withdrawal when provider fails")
        void initiateWithdrawal_providerFails_reversesWithdrawal() {
            String key = UUID.randomUUID().toString();

            when(transactionRepository.findById(key)).thenReturn(Optional.empty());
            when(fineractClient.verifyAccountOwnership(EXTERNAL_ID, ACCOUNT_ID)).thenReturn(true);
            when(fineractClient.getSavingsAccount(ACCOUNT_ID))
                    .thenReturn(Map.of("availableBalance", 50000));
            when(mtnConfig.getFineractPaymentTypeId()).thenReturn(1L);
            when(fineractClient.createWithdrawal(eq(ACCOUNT_ID), eq(BigDecimal.valueOf(5000)),
                    eq(1L), eq(key))).thenReturn(789L);
            when(mtnClient.transfer(eq(key), eq(BigDecimal.valueOf(5000)),
                    eq(PHONE), anyString())).thenThrow(new RuntimeException("MTN API error"));

            assertThatThrownBy(() -> paymentService.initiateWithdrawal(withdrawalRequest, key))
                    .isInstanceOf(RuntimeException.class);

            // Verify compensating deposit was called
            verify(fineractClient).createDeposit(eq(ACCOUNT_ID), eq(BigDecimal.valueOf(5000)),
                    eq(1L), eq("REVERSAL-" + key));
        }

        @Test
        @DisplayName("should return existing transaction for idempotent withdrawal")
        void initiateWithdrawal_idempotent_returnsExisting() {
            PaymentTransaction existing = new PaymentTransaction(
                    IDEMPOTENCY_KEY, "mtn-ref-existing", EXTERNAL_ID, ACCOUNT_ID,
                    PaymentProvider.MTN_MOMO, PaymentResponse.TransactionType.WITHDRAWAL,
                    BigDecimal.valueOf(5000), "XAF", PaymentStatus.PROCESSING);

            when(transactionRepository.findById(IDEMPOTENCY_KEY)).thenReturn(Optional.of(existing));

            PaymentResponse response = paymentService.initiateWithdrawal(withdrawalRequest, IDEMPOTENCY_KEY);

            assertThat(response.getTransactionId()).isEqualTo(IDEMPOTENCY_KEY);
            verify(fineractClient, never()).verifyAccountOwnership(any(), any());
        }
    }

    // =========================================================================
    // handleMtnCollectionCallback tests
    // =========================================================================

    @Nested
    @DisplayName("handleMtnCollectionCallback()")
    class MtnCollectionCallbackTests {

        @Test
        @DisplayName("should create Fineract deposit on successful callback")
        void handleMtnCollectionCallback_success_createsFineractDeposit() {
            PaymentTransaction txn = new PaymentTransaction(
                    "txn-1", "mtn-ref-1", EXTERNAL_ID, ACCOUNT_ID,
                    PaymentProvider.MTN_MOMO, PaymentResponse.TransactionType.DEPOSIT,
                    BigDecimal.valueOf(10000), "XAF", PaymentStatus.PENDING);

            MtnCallbackRequest callback = MtnCallbackRequest.builder()
                    .referenceId("ref-id")
                    .externalId("mtn-ref-1")
                    .status("SUCCESSFUL")
                    .financialTransactionId("fin-txn-123")
                    .build();

            when(transactionRepository.findByProviderReferenceForUpdate("mtn-ref-1"))
                    .thenReturn(Optional.of(txn));
            when(mtnConfig.getFineractPaymentTypeId()).thenReturn(1L);
            when(fineractClient.createDeposit(eq(ACCOUNT_ID), eq(BigDecimal.valueOf(10000)),
                    eq(1L), eq("fin-txn-123"))).thenReturn(999L);

            paymentService.handleMtnCollectionCallback(callback);

            assertThat(txn.getStatus()).isEqualTo(PaymentStatus.SUCCESSFUL);
            assertThat(txn.getFineractTransactionId()).isEqualTo(999L);
            verify(transactionRepository).save(txn);
            verify(paymentMetrics).incrementCallbackReceived(PaymentProvider.MTN_MOMO, PaymentStatus.SUCCESSFUL);
        }

        @Test
        @DisplayName("should mark transaction failed on failed callback")
        void handleMtnCollectionCallback_failed_marksFailed() {
            PaymentTransaction txn = new PaymentTransaction(
                    "txn-2", "mtn-ref-2", EXTERNAL_ID, ACCOUNT_ID,
                    PaymentProvider.MTN_MOMO, PaymentResponse.TransactionType.DEPOSIT,
                    BigDecimal.valueOf(10000), "XAF", PaymentStatus.PENDING);

            MtnCallbackRequest callback = MtnCallbackRequest.builder()
                    .externalId("mtn-ref-2")
                    .status("FAILED")
                    .reason("User cancelled")
                    .build();

            when(transactionRepository.findByProviderReferenceForUpdate("mtn-ref-2"))
                    .thenReturn(Optional.of(txn));

            paymentService.handleMtnCollectionCallback(callback);

            assertThat(txn.getStatus()).isEqualTo(PaymentStatus.FAILED);
            verify(transactionRepository).save(txn);
            verify(fineractClient, never()).createDeposit(any(), any(), any(), any());
        }

        @Test
        @DisplayName("should ignore callback for unknown transaction")
        void handleMtnCollectionCallback_unknownTxn_ignored() {
            MtnCallbackRequest callback = MtnCallbackRequest.builder()
                    .externalId("unknown-ref")
                    .status("SUCCESSFUL")
                    .build();

            when(transactionRepository.findByProviderReferenceForUpdate("unknown-ref"))
                    .thenReturn(Optional.empty());

            paymentService.handleMtnCollectionCallback(callback);

            verify(transactionRepository, never()).save(any());
            verify(fineractClient, never()).createDeposit(any(), any(), any(), any());
        }

        @Test
        @DisplayName("should skip already-terminal transaction")
        void handleMtnCollectionCallback_alreadyTerminal_skipped() {
            PaymentTransaction txn = new PaymentTransaction(
                    "txn-3", "mtn-ref-3", EXTERNAL_ID, ACCOUNT_ID,
                    PaymentProvider.MTN_MOMO, PaymentResponse.TransactionType.DEPOSIT,
                    BigDecimal.valueOf(10000), "XAF", PaymentStatus.SUCCESSFUL);

            MtnCallbackRequest callback = MtnCallbackRequest.builder()
                    .externalId("mtn-ref-3")
                    .status("SUCCESSFUL")
                    .build();

            when(transactionRepository.findByProviderReferenceForUpdate("mtn-ref-3"))
                    .thenReturn(Optional.of(txn));

            paymentService.handleMtnCollectionCallback(callback);

            verify(transactionRepository, never()).save(any());
            verify(fineractClient, never()).createDeposit(any(), any(), any(), any());
        }
    }

    // =========================================================================
    // handleMtnDisbursementCallback tests
    // =========================================================================

    @Nested
    @DisplayName("handleMtnDisbursementCallback()")
    class MtnDisbursementCallbackTests {

        @Test
        @DisplayName("should mark withdrawal successful on successful callback")
        void handleMtnDisbursementCallback_success_marksSuccessful() {
            PaymentTransaction txn = new PaymentTransaction(
                    "txn-w1", "mtn-ref-w1", EXTERNAL_ID, ACCOUNT_ID,
                    PaymentProvider.MTN_MOMO, PaymentResponse.TransactionType.WITHDRAWAL,
                    BigDecimal.valueOf(5000), "XAF", PaymentStatus.PROCESSING);

            MtnCallbackRequest callback = MtnCallbackRequest.builder()
                    .externalId("mtn-ref-w1")
                    .status("SUCCESSFUL")
                    .build();

            when(transactionRepository.findByProviderReferenceForUpdate("mtn-ref-w1"))
                    .thenReturn(Optional.of(txn));

            paymentService.handleMtnDisbursementCallback(callback);

            assertThat(txn.getStatus()).isEqualTo(PaymentStatus.SUCCESSFUL);
            verify(transactionRepository).save(txn);
        }

        @Test
        @DisplayName("should reverse Fineract withdrawal on failed callback")
        void handleMtnDisbursementCallback_failed_reversesWithdrawal() {
            PaymentTransaction txn = new PaymentTransaction(
                    "txn-w2", "mtn-ref-w2", EXTERNAL_ID, ACCOUNT_ID,
                    PaymentProvider.MTN_MOMO, PaymentResponse.TransactionType.WITHDRAWAL,
                    BigDecimal.valueOf(5000), "XAF", PaymentStatus.PROCESSING);
            txn.setFineractTransactionId(789L);

            MtnCallbackRequest callback = MtnCallbackRequest.builder()
                    .externalId("mtn-ref-w2")
                    .status("FAILED")
                    .reason("Provider error")
                    .build();

            when(transactionRepository.findByProviderReferenceForUpdate("mtn-ref-w2"))
                    .thenReturn(Optional.of(txn));

            paymentService.handleMtnDisbursementCallback(callback);

            assertThat(txn.getStatus()).isEqualTo(PaymentStatus.FAILED);
            verify(reversalService).reverseWithdrawal(txn);
            verify(transactionRepository).save(txn);
        }
    }

    // =========================================================================
    // handleOrangeCallback tests
    // =========================================================================

    @Nested
    @DisplayName("handleOrangeCallback()")
    class OrangeCallbackTests {

        @Test
        @DisplayName("should create Fineract deposit on successful Orange deposit callback")
        void handleOrangeCallback_depositSuccess_createsFineractDeposit() {
            PaymentTransaction txn = new PaymentTransaction(
                    "txn-o1", "orange-ref-1", EXTERNAL_ID, ACCOUNT_ID,
                    PaymentProvider.ORANGE_MONEY, PaymentResponse.TransactionType.DEPOSIT,
                    BigDecimal.valueOf(10000), "XAF", PaymentStatus.PENDING);

            OrangeCallbackRequest callback = OrangeCallbackRequest.builder()
                    .orderId("txn-o1")
                    .status("SUCCESS")
                    .transactionId("orange-txn-123")
                    .build();

            when(transactionRepository.findByIdForUpdate("txn-o1")).thenReturn(Optional.of(txn));
            when(orangeConfig.getFineractPaymentTypeId()).thenReturn(2L);
            when(fineractClient.createDeposit(eq(ACCOUNT_ID), eq(BigDecimal.valueOf(10000)),
                    eq(2L), eq("orange-txn-123"))).thenReturn(888L);

            paymentService.handleOrangeCallback(callback);

            assertThat(txn.getStatus()).isEqualTo(PaymentStatus.SUCCESSFUL);
            assertThat(txn.getFineractTransactionId()).isEqualTo(888L);
            verify(transactionRepository).save(txn);
        }

        @Test
        @DisplayName("should reverse Fineract withdrawal on failed Orange withdrawal callback")
        void handleOrangeCallback_withdrawalFailed_reversesWithdrawal() {
            PaymentTransaction txn = new PaymentTransaction(
                    "txn-o2", "orange-ref-2", EXTERNAL_ID, ACCOUNT_ID,
                    PaymentProvider.ORANGE_MONEY, PaymentResponse.TransactionType.WITHDRAWAL,
                    BigDecimal.valueOf(5000), "XAF", PaymentStatus.PROCESSING);
            txn.setFineractTransactionId(777L);

            OrangeCallbackRequest callback = OrangeCallbackRequest.builder()
                    .orderId("txn-o2")
                    .status("FAILED")
                    .build();

            when(transactionRepository.findByIdForUpdate("txn-o2")).thenReturn(Optional.of(txn));

            paymentService.handleOrangeCallback(callback);

            assertThat(txn.getStatus()).isEqualTo(PaymentStatus.FAILED);
            verify(reversalService).reverseWithdrawal(txn);
        }
    }

    // =========================================================================
    // handleCinetPayCallback tests
    // =========================================================================

    @Nested
    @DisplayName("handleCinetPayCallback()")
    class CinetPayCallbackTests {

        @Test
        @DisplayName("should use MTN payment type for MOMO payment method")
        void handleCinetPayCallback_depositViaMtn_useMtnPaymentType() {
            PaymentTransaction txn = new PaymentTransaction(
                    "txn-cp1", "cp-ref-1", EXTERNAL_ID, ACCOUNT_ID,
                    PaymentProvider.CINETPAY, PaymentResponse.TransactionType.DEPOSIT,
                    BigDecimal.valueOf(10000), "XAF", PaymentStatus.PENDING);

            CinetPayCallbackRequest callback = CinetPayCallbackRequest.builder()
                    .transactionId("txn-cp1")
                    .resultCode("00")
                    .paymentMethod("MOMO")
                    .paymentId("cp-pay-123")
                    .build();

            when(cinetPayClient.validateCallbackSignature(callback)).thenReturn(true);
            when(transactionRepository.findByIdForUpdate("txn-cp1")).thenReturn(Optional.of(txn));
            when(mtnConfig.getFineractPaymentTypeId()).thenReturn(1L);
            when(fineractClient.createDeposit(eq(ACCOUNT_ID), eq(BigDecimal.valueOf(10000)),
                    eq(1L), eq("cp-pay-123"))).thenReturn(555L);

            paymentService.handleCinetPayCallback(callback);

            assertThat(txn.getStatus()).isEqualTo(PaymentStatus.SUCCESSFUL);
            verify(fineractClient).createDeposit(eq(ACCOUNT_ID), any(), eq(1L), any());
        }

        @Test
        @DisplayName("should use Orange payment type for OM payment method")
        void handleCinetPayCallback_depositViaOrange_useOrangePaymentType() {
            PaymentTransaction txn = new PaymentTransaction(
                    "txn-cp2", "cp-ref-2", EXTERNAL_ID, ACCOUNT_ID,
                    PaymentProvider.CINETPAY, PaymentResponse.TransactionType.DEPOSIT,
                    BigDecimal.valueOf(10000), "XAF", PaymentStatus.PENDING);

            CinetPayCallbackRequest callback = CinetPayCallbackRequest.builder()
                    .transactionId("txn-cp2")
                    .resultCode("00")
                    .paymentMethod("OM")
                    .paymentId("cp-pay-456")
                    .build();

            when(cinetPayClient.validateCallbackSignature(callback)).thenReturn(true);
            when(transactionRepository.findByIdForUpdate("txn-cp2")).thenReturn(Optional.of(txn));
            when(orangeConfig.getFineractPaymentTypeId()).thenReturn(2L);
            when(fineractClient.createDeposit(eq(ACCOUNT_ID), eq(BigDecimal.valueOf(10000)),
                    eq(2L), eq("cp-pay-456"))).thenReturn(666L);

            paymentService.handleCinetPayCallback(callback);

            assertThat(txn.getStatus()).isEqualTo(PaymentStatus.SUCCESSFUL);
            verify(fineractClient).createDeposit(eq(ACCOUNT_ID), any(), eq(2L), any());
        }

        @Test
        @DisplayName("should ignore callback with invalid signature")
        void handleCinetPayCallback_invalidSignature_ignored() {
            CinetPayCallbackRequest callback = CinetPayCallbackRequest.builder()
                    .transactionId("txn-cp3")
                    .resultCode("00")
                    .build();

            when(cinetPayClient.validateCallbackSignature(callback)).thenReturn(false);

            paymentService.handleCinetPayCallback(callback);

            verify(transactionRepository, never()).findById(any());
            verify(transactionRepository, never()).save(any());
        }
    }

    // =========================================================================
    // getTransactionStatus tests
    // =========================================================================

    @Nested
    @DisplayName("getTransactionStatus()")
    class GetTransactionStatusTests {

        @Test
        @DisplayName("should return status for existing transaction")
        void getTransactionStatus_found_returnsResponse() {
            PaymentTransaction txn = new PaymentTransaction(
                    "txn-s1", "mtn-ref-s1", EXTERNAL_ID, ACCOUNT_ID,
                    PaymentProvider.MTN_MOMO, PaymentResponse.TransactionType.DEPOSIT,
                    BigDecimal.valueOf(10000), "XAF", PaymentStatus.SUCCESSFUL);
            txn.setFineractTransactionId(999L);

            when(transactionRepository.findById("txn-s1")).thenReturn(Optional.of(txn));

            TransactionStatusResponse response = paymentService.getTransactionStatus("txn-s1");

            assertThat(response).isNotNull();
            assertThat(response.getTransactionId()).isEqualTo("txn-s1");
            assertThat(response.getStatus()).isEqualTo(PaymentStatus.SUCCESSFUL);
            assertThat(response.getExternalId()).isEqualTo(EXTERNAL_ID);
            assertThat(response.getAccountId()).isEqualTo(ACCOUNT_ID);
            assertThat(response.getFineractTransactionId()).isEqualTo(999L);
        }

        @Test
        @DisplayName("should throw for unknown transaction")
        void getTransactionStatus_notFound_throws() {
            when(transactionRepository.findById("unknown")).thenReturn(Optional.empty());

            assertThatThrownBy(() -> paymentService.getTransactionStatus("unknown"))
                    .isInstanceOf(PaymentException.class)
                    .hasMessageContaining("Transaction not found");
        }
    }
}
