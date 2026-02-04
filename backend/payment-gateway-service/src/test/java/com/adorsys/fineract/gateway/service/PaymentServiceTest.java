// package com.adorsys.fineract.gateway.service;

// import com.adorsys.fineract.gateway.client.FineractClient;
// import com.adorsys.fineract.gateway.client.MtnMomoClient;
// import com.adorsys.fineract.gateway.client.OrangeMoneyClient;
// import com.adorsys.fineract.gateway.config.MtnMomoConfig;
// import com.adorsys.fineract.gateway.config.OrangeMoneyConfig;
// import com.adorsys.fineract.gateway.dto.*;
// import com.adorsys.fineract.gateway.exception.PaymentException;
// import org.junit.jupiter.api.BeforeEach;
// import org.junit.jupiter.api.DisplayName;
// import org.junit.jupiter.api.Nested;
// import org.junit.jupiter.api.Test;
// import org.junit.jupiter.api.extension.ExtendWith;
// import org.mockito.InjectMocks;
// import org.mockito.Mock;
// import org.mockito.junit.jupiter.MockitoExtension;

// import java.math.BigDecimal;
// import java.util.Map;

// import static org.assertj.core.api.Assertions.*;
// import static org.mockito.ArgumentMatchers.*;
// import static org.mockito.Mockito.*;

// @ExtendWith(MockitoExtension.class)
// class PaymentServiceTest {

//     @Mock
//     private MtnMomoClient mtnClient;

//     @Mock
//     private OrangeMoneyClient orangeClient;

//     @Mock
//     private FineractClient fineractClient;

//     @Mock
//     private MtnMomoConfig mtnConfig;

//     @Mock
//     private OrangeMoneyConfig orangeConfig;

//     @InjectMocks
//     private PaymentService paymentService;

//     private DepositRequest depositRequest;
//     private WithdrawalRequest withdrawalRequest;

//     @BeforeEach
//     void setUp() {
//         depositRequest = DepositRequest.builder()
//                 .externalId("ext-123")
//                 .accountId(456L)
//                 .amount(BigDecimal.valueOf(10000))
//                 .provider(PaymentProvider.MTN_MOMO)
//                 .phoneNumber("+237612345678")
//                 .build();

//         withdrawalRequest = WithdrawalRequest.builder()
//                 .externalId("ext-123")
//                 .accountId(456L)
//                 .amount(BigDecimal.valueOf(5000))
//                 .provider(PaymentProvider.MTN_MOMO)
//                 .phoneNumber("+237612345678")
//                 .build();
//     }

//     @Nested
//     @DisplayName("initiateDeposit() tests")
//     class InitiateDepositTests {

//         @Test
//         @DisplayName("should initiate MTN deposit successfully")
//         void shouldInitiateMtnDepositSuccessfully() {
//             // Given
//             when(fineractClient.verifyAccountOwnership("ext-123", 456L)).thenReturn(true);
//             when(mtnClient.requestToPay(anyString(), eq(BigDecimal.valueOf(10000)),
//                     eq("+237612345678"), anyString())).thenReturn("mtn-ref-123");

//             // When
//             PaymentResponse response = paymentService.initiateDeposit(depositRequest);

//             // Then
//             assertThat(response).isNotNull();
//             assertThat(response.getTransactionId()).isNotNull();
//             assertThat(response.getProviderReference()).isEqualTo("mtn-ref-123");
//             assertThat(response.getProvider()).isEqualTo(PaymentProvider.MTN_MOMO);
//             assertThat(response.getType()).isEqualTo(PaymentResponse.TransactionType.DEPOSIT);
//             assertThat(response.getStatus()).isEqualTo(PaymentStatus.PENDING);
//             assertThat(response.getAmount()).isEqualByComparingTo(BigDecimal.valueOf(10000));
//         }

//         @Test
//         @DisplayName("should initiate Orange deposit successfully")
//         void shouldInitiateOrangeDepositSuccessfully() {
//             // Given
//             depositRequest = depositRequest.toBuilder()
//                     .provider(PaymentProvider.ORANGE_MONEY)
//                     .build();

//             when(fineractClient.verifyAccountOwnership("ext-123", 456L)).thenReturn(true);
//             when(orangeClient.initializePayment(anyString(), eq(BigDecimal.valueOf(10000)), anyString()))
//                     .thenReturn(new OrangeMoneyClient.PaymentInitResponse(
//                             "https://payment.orange.com/pay", "pay-token-123", "notif-token-123"));

//             // When
//             PaymentResponse response = paymentService.initiateDeposit(depositRequest);

//             // Then
//             assertThat(response).isNotNull();
//             assertThat(response.getProvider()).isEqualTo(PaymentProvider.ORANGE_MONEY);
//             assertThat(response.getPaymentUrl()).isEqualTo("https://payment.orange.com/pay");
//             assertThat(response.getStatus()).isEqualTo(PaymentStatus.PENDING);
//         }

//         @Test
//         @DisplayName("should throw exception when account ownership verification fails")
//         void shouldThrowWhenOwnershipVerificationFails() {
//             // Given
//             when(fineractClient.verifyAccountOwnership("ext-123", 456L)).thenReturn(false);

//             // When/Then
//             assertThatThrownBy(() -> paymentService.initiateDeposit(depositRequest))
//                     .isInstanceOf(PaymentException.class)
//                     .hasMessageContaining("Account does not belong to the customer");
//         }

//         @Test
//         @DisplayName("should throw exception for unsupported provider")
//         void shouldThrowForUnsupportedProvider() {
//             // Given
//             depositRequest = depositRequest.toBuilder()
//                     .provider(PaymentProvider.UBA_BANK)
//                     .build();

//             when(fineractClient.verifyAccountOwnership("ext-123", 456L)).thenReturn(true);

//             // When/Then
//             assertThatThrownBy(() -> paymentService.initiateDeposit(depositRequest))
//                     .isInstanceOf(PaymentException.class)
//                     .hasMessageContaining("Unsupported payment provider");
//         }
//     }

//     @Nested
//     @DisplayName("initiateWithdrawal() tests")
//     class InitiateWithdrawalTests {

//         @Test
//         @DisplayName("should initiate MTN withdrawal successfully")
//         void shouldInitiateMtnWithdrawalSuccessfully() {
//             // Given
//             when(fineractClient.verifyAccountOwnership("ext-123", 456L)).thenReturn(true);
//             when(fineractClient.getSavingsAccount(456L)).thenReturn(Map.of("availableBalance", 10000));
//             when(mtnConfig.getFineractPaymentTypeId()).thenReturn(1L);
//             when(fineractClient.createWithdrawal(eq(456L), eq(BigDecimal.valueOf(5000)), eq(1L), anyString()))
//                     .thenReturn(789L);
//             when(mtnClient.transfer(anyString(), eq(BigDecimal.valueOf(5000)),
//                     eq("+237612345678"), anyString())).thenReturn("mtn-transfer-ref");

//             // When
//             PaymentResponse response = paymentService.initiateWithdrawal(withdrawalRequest);

//             // Then
//             assertThat(response).isNotNull();
//             assertThat(response.getType()).isEqualTo(PaymentResponse.TransactionType.WITHDRAWAL);
//             assertThat(response.getStatus()).isEqualTo(PaymentStatus.PROCESSING);
//             assertThat(response.getFineractTransactionId()).isEqualTo(789L);
//         }

//         @Test
//         @DisplayName("should throw exception when insufficient funds")
//         void shouldThrowWhenInsufficientFunds() {
//             // Given
//             when(fineractClient.verifyAccountOwnership("ext-123", 456L)).thenReturn(true);
//             when(fineractClient.getSavingsAccount(456L)).thenReturn(Map.of("availableBalance", 1000));

//             // When/Then
//             assertThatThrownBy(() -> paymentService.initiateWithdrawal(withdrawalRequest))
//                     .isInstanceOf(PaymentException.class)
//                     .hasMessageContaining("Insufficient funds");
//         }

//         @Test
//         @DisplayName("should throw exception when account ownership verification fails")
//         void shouldThrowWhenOwnershipFails() {
//             // Given
//             when(fineractClient.verifyAccountOwnership("ext-123", 456L)).thenReturn(false);

//             // When/Then
//             assertThatThrownBy(() -> paymentService.initiateWithdrawal(withdrawalRequest))
//                     .isInstanceOf(PaymentException.class)
//                     .hasMessageContaining("Account does not belong to the customer");
//         }
//     }

//     @Nested
//     @DisplayName("handleMtnCollectionCallback() tests")
//     class MtnCollectionCallbackTests {

//         @Test
//         @DisplayName("should process successful collection callback")
//         void shouldProcessSuccessfulCallback() {
//             // Given - First initiate a deposit to create the transaction
//             when(fineractClient.verifyAccountOwnership("ext-123", 456L)).thenReturn(true);
//             when(mtnClient.requestToPay(anyString(), any(), any(), any())).thenReturn("mtn-ref-123");

//             PaymentResponse depositResponse = paymentService.initiateDeposit(depositRequest);

//             // Then process callback
//             MtnCallbackRequest callback = MtnCallbackRequest.builder()
//                     .referenceId("ref-id")
//                     .externalId("mtn-ref-123")
//                     .status("SUCCESSFUL")
//                     .financialTransactionId("fin-txn-123")
//                     .build();

//             when(mtnConfig.getFineractPaymentTypeId()).thenReturn(1L);
//             when(fineractClient.createDeposit(eq(456L), any(), eq(1L), eq("fin-txn-123")))
//                     .thenReturn(999L);

//             // When
//             paymentService.handleMtnCollectionCallback(callback);

//             // Then
//             verify(fineractClient).createDeposit(eq(456L), any(), eq(1L), eq("fin-txn-123"));
//         }

//         @Test
//         @DisplayName("should handle failed collection callback")
//         void shouldHandleFailedCallback() {
//             // Given - First initiate a deposit
//             when(fineractClient.verifyAccountOwnership("ext-123", 456L)).thenReturn(true);
//             when(mtnClient.requestToPay(anyString(), any(), any(), any())).thenReturn("mtn-ref-456");

//             paymentService.initiateDeposit(depositRequest);

//             MtnCallbackRequest callback = MtnCallbackRequest.builder()
//                     .externalId("mtn-ref-456")
//                     .status("FAILED")
//                     .reason("User cancelled")
//                     .build();

//             // When
//             paymentService.handleMtnCollectionCallback(callback);

//             // Then - should not create Fineract deposit
//             verify(fineractClient, never()).createDeposit(any(), any(), any(), any());
//         }

//         @Test
//         @DisplayName("should ignore callback for unknown transaction")
//         void shouldIgnoreUnknownTransaction() {
//             // Given
//             MtnCallbackRequest callback = MtnCallbackRequest.builder()
//                     .externalId("unknown-ref")
//                     .status("SUCCESSFUL")
//                     .build();

//             // When
//             paymentService.handleMtnCollectionCallback(callback);

//             // Then - should not throw, just log warning
//             verify(fineractClient, never()).createDeposit(any(), any(), any(), any());
//         }
//     }

//     @Nested
//     @DisplayName("getTransactionStatus() tests")
//     class GetTransactionStatusTests {

//         @Test
//         @DisplayName("should return transaction status")
//         void shouldReturnTransactionStatus() {
//             // Given - First create a transaction
//             when(fineractClient.verifyAccountOwnership("ext-123", 456L)).thenReturn(true);
//             when(mtnClient.requestToPay(anyString(), any(), any(), any())).thenReturn("mtn-ref-789");

//             PaymentResponse depositResponse = paymentService.initiateDeposit(depositRequest);

//             // When
//             TransactionStatusResponse status = paymentService.getTransactionStatus(depositResponse.getTransactionId());

//             // Then
//             assertThat(status).isNotNull();
//             assertThat(status.getTransactionId()).isEqualTo(depositResponse.getTransactionId());
//             assertThat(status.getStatus()).isEqualTo(PaymentStatus.PENDING);
//             assertThat(status.getExternalId()).isEqualTo("ext-123");
//         }

//         @Test
//         @DisplayName("should throw exception for unknown transaction")
//         void shouldThrowForUnknownTransaction() {
//             // When/Then
//             assertThatThrownBy(() -> paymentService.getTransactionStatus("unknown-txn-id"))
//                     .isInstanceOf(PaymentException.class)
//                     .hasMessageContaining("Transaction not found");
//         }
//     }
// }
