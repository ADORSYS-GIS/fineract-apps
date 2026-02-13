package com.adorsys.fineract.gateway.scheduler;

import com.adorsys.fineract.gateway.dto.PaymentStatus;
import com.adorsys.fineract.gateway.entity.PaymentTransaction;
import com.adorsys.fineract.gateway.metrics.PaymentMetrics;
import com.adorsys.fineract.gateway.repository.PaymentTransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

/**
 * Scheduled task that expires stale PENDING transactions.
 * Transactions that remain PENDING beyond the configured threshold
 * are marked EXPIRED to prevent indefinite limbo state.
 */
@Slf4j
@Component
@RequiredArgsConstructor
@ConditionalOnProperty(name = "app.cleanup.enabled", havingValue = "true", matchIfMissing = true)
public class StaleTransactionCleanupScheduler {

    private final PaymentTransactionRepository transactionRepository;
    private final PaymentMetrics paymentMetrics;

    @Value("${app.cleanup.stale-minutes:30}")
    private int staleMinutes;

    @Scheduled(fixedDelayString = "${app.cleanup.interval-ms:300000}")
    @Transactional
    public void cleanupStalePendingTransactions() {
        Instant cutoff = Instant.now().minus(staleMinutes, ChronoUnit.MINUTES);
        List<PaymentTransaction> staleTransactions = transactionRepository.findStalePendingTransactions(cutoff);

        if (staleTransactions.isEmpty()) {
            return;
        }

        log.info("Found {} stale PENDING transactions older than {} minutes",
            staleTransactions.size(), staleMinutes);

        for (PaymentTransaction txn : staleTransactions) {
            txn.setStatus(PaymentStatus.EXPIRED);
            transactionRepository.save(txn);
            paymentMetrics.incrementTransactionExpired(txn.getProvider());
            log.info("Expired stale transaction: txnId={}, provider={}, createdAt={}",
                txn.getTransactionId(), txn.getProvider(), txn.getCreatedAt());
        }

        log.info("Expired {} stale transactions", staleTransactions.size());
    }
}
