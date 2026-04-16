package com.adorsys.fineract.gateway.service;

import com.adorsys.fineract.gateway.dto.PaymentProvider;
import com.adorsys.fineract.gateway.dto.PaymentResponse;
import com.adorsys.fineract.gateway.dto.PaymentStatus;
import com.adorsys.fineract.gateway.entity.PaymentTransaction;
import com.adorsys.fineract.gateway.metrics.PaymentMetrics;
import com.adorsys.fineract.gateway.repository.PaymentTransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Reconciles stale PENDING transactions by polling the payment provider and
 * updating local state to match.
 *
 * Used by StaleTransactionCleanupScheduler (batch) and PaymentService (on-demand).
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class StaleTransactionReconciler {

    private final PaymentTransactionRepository transactionRepository;
    private final ProviderStatusPoller providerStatusPoller;
    private final CallbackHandlerDelegate callbackDelegate;
    private final PaymentMetrics paymentMetrics;

    @Value("${app.cleanup.stale-processing-max-retries:5}")
    private int maxRetries;

    /**
     * Result of a reconciliation attempt.
     *
     * @param resolved         true when the transaction reached a terminal state
     * @param resolvedStatus   the new terminal status (SUCCESSFUL or FAILED), or null if not resolved
     * @param reversalNeeded   true when a Fineract reversal must be triggered by the caller (after commit)
     * @param transactionForReversal the locked entity to pass to ReversalService, or null
     */
    public record ReconcileResult(
        boolean resolved,
        PaymentStatus resolvedStatus,
        boolean reversalNeeded,
        PaymentTransaction transactionForReversal
    ) {
        public static ReconcileResult alreadyResolved() {
            return new ReconcileResult(true, null, false, null);
        }

        public static ReconcileResult stillPending() {
            return new ReconcileResult(false, null, false, null);
        }

        public static ReconcileResult success() {
            return new ReconcileResult(true, PaymentStatus.SUCCESSFUL, false, null);
        }

        public static ReconcileResult failed() {
            return new ReconcileResult(true, PaymentStatus.FAILED, false, null);
        }

        public static ReconcileResult failedWithReversal(PaymentTransaction txn) {
            return new ReconcileResult(true, PaymentStatus.FAILED, true, txn);
        }
    }

    /**
     * Attempt to reconcile a PENDING transaction against its payment provider.
     * Acquires a pessimistic write lock to prevent concurrent processing.
     * Retry count is incremented when the provider still reports PENDING;
     * after maxRetries the transaction is marked EXPIRED.
     */
    @Transactional
    public ReconcileResult reconcile(PaymentTransaction txn) {
        PaymentTransaction locked = transactionRepository.findByIdForUpdate(txn.getTransactionId()).orElse(null);
        if (locked == null || locked.getStatus() != PaymentStatus.PENDING) {
            return ReconcileResult.alreadyResolved();
        }

        ProviderStatusPoller.PollResult poll = providerStatusPoller.poll(locked);

        if (poll.status() == PaymentStatus.SUCCESSFUL) {
            return handleSuccessfulPending(locked, poll.cinetPayProvider());

        } else if (poll.status() == PaymentStatus.FAILED) {
            locked.setStatus(PaymentStatus.FAILED);
            transactionRepository.save(locked);
            paymentMetrics.incrementStaleProcessingResolved(locked.getProvider(), "pending_confirmed_failed");
            log.warn("Stale PENDING resolved as FAILED via polling: txnId={}", locked.getTransactionId());
            if (locked.getType() == PaymentResponse.TransactionType.WITHDRAWAL) {
                return ReconcileResult.failedWithReversal(locked);
            }
            return ReconcileResult.failed();

        } else {
            // Still pending — increment retry or expire
            locked.setStaleResolutionRetryCount(locked.getStaleResolutionRetryCount() + 1);
            if (locked.getStaleResolutionRetryCount() >= maxRetries) {
                locked.setStatus(PaymentStatus.EXPIRED);
                paymentMetrics.incrementTransactionExpired(locked.getProvider());
                log.error("Stale PENDING expired after {} retries: txnId={}, provider={}",
                    maxRetries, locked.getTransactionId(), locked.getProvider());
            } else {
                log.info("Stale PENDING still pending at provider, retry {}/{}: txnId={}",
                    locked.getStaleResolutionRetryCount(), maxRetries, locked.getTransactionId());
            }
            transactionRepository.save(locked);
            return ReconcileResult.stillPending();
        }
    }

    private ReconcileResult handleSuccessfulPending(PaymentTransaction locked, PaymentProvider cinetPayProvider) {
        if (locked.getType() == PaymentResponse.TransactionType.DEPOSIT) {
            switch (locked.getProvider()) {
                case MTN_MOMO -> callbackDelegate.processMtnCollectionCallbackByRef(
                    locked.getTransactionId(), PaymentStatus.SUCCESSFUL);
                case ORANGE_MONEY -> callbackDelegate.processOrangeDepositCallbackByRef(
                    locked.getTransactionId(), PaymentStatus.SUCCESSFUL);
                case CINETPAY -> callbackDelegate.processCinetPayDepositCallbackByRef(
                    locked.getTransactionId(), PaymentStatus.SUCCESSFUL, cinetPayProvider);
                default -> log.warn("Unknown provider {} for deposit reconciliation", locked.getProvider());
            }
        } else {
            // Withdrawal SUCCESSFUL: Fineract already deducted the funds; just confirm
            locked.setStatus(PaymentStatus.SUCCESSFUL);
            transactionRepository.save(locked);
        }
        paymentMetrics.incrementStaleProcessingResolved(locked.getProvider(), "pending_confirmed_success");
        log.info("Stale PENDING resolved as SUCCESSFUL via polling: txnId={}", locked.getTransactionId());
        return ReconcileResult.success();
    }
}
