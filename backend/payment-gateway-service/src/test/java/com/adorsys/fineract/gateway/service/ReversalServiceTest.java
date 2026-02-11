package com.adorsys.fineract.gateway.service;

import com.adorsys.fineract.gateway.client.FineractClient;
import com.adorsys.fineract.gateway.config.MtnMomoConfig;
import com.adorsys.fineract.gateway.config.OrangeMoneyConfig;
import com.adorsys.fineract.gateway.dto.PaymentProvider;
import com.adorsys.fineract.gateway.dto.PaymentResponse;
import com.adorsys.fineract.gateway.dto.PaymentStatus;
import com.adorsys.fineract.gateway.entity.PaymentTransaction;
import com.adorsys.fineract.gateway.metrics.PaymentMetrics;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReversalServiceTest {

    @Mock private FineractClient fineractClient;
    @Mock private MtnMomoConfig mtnConfig;
    @Mock private OrangeMoneyConfig orangeConfig;
    @Mock private PaymentMetrics paymentMetrics;

    @InjectMocks
    private ReversalService reversalService;

    @Test
    @DisplayName("should reverse withdrawal via compensating deposit")
    void reverseWithdrawal_success() {
        PaymentTransaction txn = new PaymentTransaction(
            "txn-1", "ref-1", "ext-1", 100L,
            PaymentProvider.MTN_MOMO, PaymentResponse.TransactionType.WITHDRAWAL,
            BigDecimal.valueOf(5000), "XAF", PaymentStatus.PROCESSING);
        txn.setFineractTransactionId(789L);

        when(mtnConfig.getFineractPaymentTypeId()).thenReturn(1L);
        when(fineractClient.createDeposit(eq(100L), eq(BigDecimal.valueOf(5000)),
            eq(1L), eq("REVERSAL-txn-1"))).thenReturn(790L);

        reversalService.reverseWithdrawal(txn);

        verify(fineractClient).createDeposit(eq(100L), eq(BigDecimal.valueOf(5000)),
            eq(1L), eq("REVERSAL-txn-1"));
        verify(paymentMetrics).incrementReversalSuccess();
    }

    @Test
    @DisplayName("should skip reversal when no Fineract transaction ID")
    void reverseWithdrawal_nullFineractTxnId_skips() {
        PaymentTransaction txn = new PaymentTransaction(
            "txn-2", "ref-2", "ext-2", 100L,
            PaymentProvider.MTN_MOMO, PaymentResponse.TransactionType.WITHDRAWAL,
            BigDecimal.valueOf(5000), "XAF", PaymentStatus.PROCESSING);

        reversalService.reverseWithdrawal(txn);

        verify(fineractClient, never()).createDeposit(any(), any(), any(), any());
    }

    @Test
    @DisplayName("should log critical error in fallback after retries exhausted")
    void reverseWithdrawalFallback_logsCritical() {
        PaymentTransaction txn = new PaymentTransaction(
            "txn-3", "ref-3", "ext-3", 100L,
            PaymentProvider.MTN_MOMO, PaymentResponse.TransactionType.WITHDRAWAL,
            BigDecimal.valueOf(5000), "XAF", PaymentStatus.PROCESSING);
        txn.setFineractTransactionId(789L);

        reversalService.reverseWithdrawalFallback(new RuntimeException("connection refused"), txn);

        verify(paymentMetrics).incrementReversalFailure();
    }
}
