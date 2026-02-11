package com.adorsys.fineract.gateway.scheduler;

import com.adorsys.fineract.gateway.dto.PaymentProvider;
import com.adorsys.fineract.gateway.dto.PaymentResponse;
import com.adorsys.fineract.gateway.dto.PaymentStatus;
import com.adorsys.fineract.gateway.entity.PaymentTransaction;
import com.adorsys.fineract.gateway.metrics.PaymentMetrics;
import com.adorsys.fineract.gateway.repository.PaymentTransactionRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class StaleTransactionCleanupSchedulerTest {

    @Mock private PaymentTransactionRepository transactionRepository;
    @Mock private PaymentMetrics paymentMetrics;

    @InjectMocks
    private StaleTransactionCleanupScheduler scheduler;

    @Test
    @DisplayName("should expire stale pending transactions")
    void cleanupStalePendingTransactions_expiresStale() {
        PaymentTransaction staleTxn = new PaymentTransaction(
            "txn-stale", "ref-1", "ext-1", 100L,
            PaymentProvider.MTN_MOMO, PaymentResponse.TransactionType.DEPOSIT,
            BigDecimal.valueOf(5000), "XAF", PaymentStatus.PENDING);

        when(transactionRepository.findStalePendingTransactions(any(Instant.class)))
            .thenReturn(List.of(staleTxn));

        scheduler.cleanupStalePendingTransactions();

        verify(transactionRepository).save(staleTxn);
        verify(paymentMetrics).incrementTransactionExpired(PaymentProvider.MTN_MOMO);
        assertThat(staleTxn.getStatus()).isEqualTo(PaymentStatus.EXPIRED);
    }

    @Test
    @DisplayName("should do nothing when no stale transactions found")
    void cleanupStalePendingTransactions_noStale_doesNothing() {
        when(transactionRepository.findStalePendingTransactions(any(Instant.class)))
            .thenReturn(Collections.emptyList());

        scheduler.cleanupStalePendingTransactions();

        verify(transactionRepository, never()).save(any());
        verify(paymentMetrics, never()).incrementTransactionExpired(any());
    }
}
