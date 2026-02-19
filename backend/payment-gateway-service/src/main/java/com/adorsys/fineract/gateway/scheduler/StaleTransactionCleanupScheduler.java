package com.adorsys.fineract.gateway.scheduler;

import com.adorsys.fineract.gateway.client.CinetPayClient;
import com.adorsys.fineract.gateway.client.MtnMomoClient;
import com.adorsys.fineract.gateway.client.OrangeMoneyClient;
import com.adorsys.fineract.gateway.dto.PaymentProvider;
import com.adorsys.fineract.gateway.dto.PaymentResponse;
import com.adorsys.fineract.gateway.dto.PaymentStatus;
import com.adorsys.fineract.gateway.entity.PaymentTransaction;
import com.adorsys.fineract.gateway.metrics.PaymentMetrics;
import com.adorsys.fineract.gateway.repository.PaymentTransactionRepository;
import com.adorsys.fineract.gateway.service.ReversalService;
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
 * Scheduled task that handles stale transactions:
 * 1. Expires stale PENDING transactions (no callback received).
 * 2. Resolves stale PROCESSING withdrawals by polling providers (Fix #5, #15).
 */
@Slf4j
@Component
@RequiredArgsConstructor
@ConditionalOnProperty(name = "app.cleanup.enabled", havingValue = "true", matchIfMissing = true)
public class StaleTransactionCleanupScheduler {

    private final PaymentTransactionRepository transactionRepository;
    private final PaymentMetrics paymentMetrics;
    private final MtnMomoClient mtnClient;
    private final OrangeMoneyClient orangeClient;
    private final CinetPayClient cinetPayClient;
    private final ReversalService reversalService;

    @Value("${app.cleanup.stale-minutes:30}")
    private int staleMinutes;

    @Value("${app.cleanup.processing-stale-minutes:60}")
    private int processingStaleMinutes;

    /**
     * Expire stale PENDING transactions (original behavior).
     */
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

    /**
     * Fix #5 + #15: Resolve stale PROCESSING withdrawals by polling providers.
     * Withdrawals stuck in PROCESSING mean money was deducted from Fineract
     * but the provider never confirmed delivery. We poll the provider for status
     * and either confirm success or trigger a reversal.
     */
    @Scheduled(fixedDelayString = "${app.cleanup.processing-interval-ms:600000}")
    public void resolveStaleProcessingTransactions() {
        Instant cutoff = Instant.now().minus(processingStaleMinutes, ChronoUnit.MINUTES);
        List<PaymentTransaction> staleProcessing = transactionRepository.findStaleProcessingTransactions(cutoff);

        if (staleProcessing.isEmpty()) {
            return;
        }

        log.info("Found {} stale PROCESSING transactions older than {} minutes",
            staleProcessing.size(), processingStaleMinutes);

        for (PaymentTransaction txn : staleProcessing) {
            try {
                resolveStaleTransaction(txn);
            } catch (Exception e) {
                log.error("Failed to resolve stale PROCESSING transaction: txnId={}, error={}",
                    txn.getTransactionId(), e.getMessage());
            }
        }
    }

    @Transactional
    void resolveStaleTransaction(PaymentTransaction txn) {
        // Re-fetch with lock to prevent concurrent resolution
        PaymentTransaction locked = transactionRepository.findByIdForUpdate(txn.getTransactionId())
            .orElse(null);
        if (locked == null || locked.getStatus() != PaymentStatus.PROCESSING) {
            return; // Already resolved by a callback
        }

        PaymentStatus providerStatus = pollProviderStatus(locked);

        if (providerStatus == PaymentStatus.SUCCESSFUL) {
            locked.setStatus(PaymentStatus.SUCCESSFUL);
            transactionRepository.save(locked);
            paymentMetrics.incrementStaleProcessingResolved(locked.getProvider(), "confirmed_success");
            log.info("Stale PROCESSING resolved as SUCCESSFUL via polling: txnId={}", locked.getTransactionId());

        } else if (providerStatus == PaymentStatus.FAILED) {
            // Provider confirmed failure - reverse the Fineract withdrawal
            if (locked.getType() == PaymentResponse.TransactionType.WITHDRAWAL) {
                reversalService.reverseWithdrawal(locked);
            }
            locked.setStatus(PaymentStatus.FAILED);
            transactionRepository.save(locked);
            paymentMetrics.incrementStaleProcessingResolved(locked.getProvider(), "confirmed_failed");
            log.warn("Stale PROCESSING resolved as FAILED via polling: txnId={}", locked.getTransactionId());

        } else {
            // Still pending at provider - check if it's been too long (> 2 hours)
            Instant twoHoursAgo = Instant.now().minus(2, ChronoUnit.HOURS);
            if (locked.getCreatedAt().isBefore(twoHoursAgo)) {
                log.error("CRITICAL: Transaction stuck in PROCESSING for >2 hours. Manual review required! " +
                    "txnId={}, provider={}, amount={}, accountId={}",
                    locked.getTransactionId(), locked.getProvider(),
                    locked.getAmount(), locked.getAccountId());
                paymentMetrics.incrementStaleProcessingResolved(locked.getProvider(), "escalated");
            } else {
                log.info("Stale PROCESSING still pending at provider, will retry: txnId={}", locked.getTransactionId());
            }
        }
    }

    /**
     * Fix #15: Poll payment providers for the status of a pending transaction.
     */
    private PaymentStatus pollProviderStatus(PaymentTransaction txn) {
        try {
            return switch (txn.getProvider()) {
                case MTN_MOMO -> {
                    if (txn.getType() == PaymentResponse.TransactionType.DEPOSIT) {
                        yield mtnClient.getCollectionStatus(txn.getProviderReference());
                    } else {
                        yield mtnClient.getDisbursementStatus(txn.getProviderReference());
                    }
                }
                case ORANGE_MONEY -> orangeClient.getTransactionStatus(
                    txn.getTransactionId(), txn.getProviderReference());
                case CINETPAY -> cinetPayClient.verifyTransaction(txn.getTransactionId());
                default -> PaymentStatus.PENDING;
            };
        } catch (Exception e) {
            log.warn("Failed to poll provider status for txnId={}: {}", txn.getTransactionId(), e.getMessage());
            return PaymentStatus.PENDING;
        }
    }
}
