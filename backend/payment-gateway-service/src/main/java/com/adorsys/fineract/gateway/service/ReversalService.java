package com.adorsys.fineract.gateway.service;

import com.adorsys.fineract.gateway.client.FineractClient;
import com.adorsys.fineract.gateway.config.CinetPayConfig;
import com.adorsys.fineract.gateway.config.MtnMomoConfig;
import com.adorsys.fineract.gateway.config.NokashConfig;
import com.adorsys.fineract.gateway.config.OrangeMoneyConfig;
import com.adorsys.fineract.gateway.dto.PaymentProvider;
import com.adorsys.fineract.gateway.entity.PaymentTransaction;
import com.adorsys.fineract.gateway.entity.ReversalDeadLetter;
import com.adorsys.fineract.gateway.exception.PaymentException;
import com.adorsys.fineract.gateway.metrics.PaymentMetrics;
import com.adorsys.fineract.gateway.repository.ReversalDeadLetterRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Recover;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

/**
 * Handles Fineract withdrawal reversals via compensating deposits.
 * Extracted to a separate service so Spring AOP @Retryable works
 * (self-invocations bypass the proxy).
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ReversalService {

    private final FineractClient fineractClient;
    private final MtnMomoConfig mtnConfig;
    private final OrangeMoneyConfig orangeConfig;
    private final CinetPayConfig cinetPayConfig;
    private final NokashConfig nokashConfig;
    private final PaymentMetrics paymentMetrics;
    private final ReversalDeadLetterRepository deadLetterRepository;

    @Value("${app.dlq.admin-max-retries:10}")
    private int adminMaxRetries;

    /**
     * Reverse a Fineract withdrawal via compensating deposit.
     * Retries up to 3 times with exponential backoff.
     */
    @Retryable(retryFor = Exception.class, maxAttempts = 3,
               backoff = @Backoff(delay = 1000, multiplier = 2))
    public void reverseWithdrawal(PaymentTransaction txn) {
        if (txn.getFineractTransactionId() == null) {
            log.warn("No Fineract transaction ID to reverse for txnId={}", txn.getTransactionId());
            return;
        }
        // For CinetPay, the notifToken stores the underlying provider name for correct GL mapping
        Long paymentTypeId = getPaymentTypeId(txn.getProvider(), txn.getNotifToken());
        fineractClient.createDeposit(
            txn.getAccountId(),
            txn.getAmount(),
            paymentTypeId,
            "REVERSAL-" + txn.getTransactionId()
        );
        paymentMetrics.incrementReversalSuccess();
        log.info("Fineract withdrawal reversed successfully for transactionId={}", txn.getTransactionId());
    }

    @Recover
    public void reverseWithdrawalFallback(Exception ex, PaymentTransaction txn) {
        paymentMetrics.incrementReversalFailure();
        log.error("CRITICAL: Failed to reverse Fineract withdrawal after retries. Manual intervention required! " +
            "transactionId={}, fineractTxnId={}, amount={}, accountId={}",
            txn.getTransactionId(), txn.getFineractTransactionId(),
            txn.getAmount(), txn.getAccountId(), ex);

        try {
            sendToDeadLetter(txn, truncate(ex.getMessage(), 500));
        } catch (Exception dlqEx) {
            log.error("CRITICAL: Failed to persist reversal to dead-letter queue! transactionId={}",
                txn.getTransactionId(), dlqEx);
        }
    }

    public enum AdminRetryResult { RESOLVED, FAILED, NOT_FOUND, ALREADY_RESOLVED, MAX_RETRIES_EXCEEDED }

    /**
     * Transactional admin retry of a dead-letter entry.
     * Acquires a pessimistic write lock to prevent concurrent retries from the same entry.
     * Does NOT use @Retryable — avoids creating a second DLQ entry if the retry also fails.
     */
    @Transactional
    public AdminRetryResult retryDeadLetterEntry(Long dlqId, String adminSub) {
        ReversalDeadLetter entry = deadLetterRepository.findByIdForUpdate(dlqId).orElse(null);
        if (entry == null) return AdminRetryResult.NOT_FOUND;
        if (entry.isResolved()) return AdminRetryResult.ALREADY_RESOLVED;
        if (entry.getRetryCount() >= adminMaxRetries) return AdminRetryResult.MAX_RETRIES_EXCEEDED;

        entry.setRetryCount(entry.getRetryCount() + 1);

        try {
            Long paymentTypeId = getPaymentTypeId(entry.getProvider(), entry.getProviderHint());
            fineractClient.createDeposit(
                entry.getAccountId(),
                entry.getAmount(),
                paymentTypeId,
                "REVERSAL-" + entry.getTransactionId()
            );
            entry.setResolved(true);
            entry.setResolvedAt(Instant.now());
            entry.setResolvedBy(adminSub);
            entry.setNotes("Resolved via admin retry");
            paymentMetrics.incrementReversalSuccess();
            log.info("Admin DLQ retry succeeded: dlqId={}, txnId={}, by={}", dlqId, entry.getTransactionId(), adminSub);
            deadLetterRepository.save(entry);
            return AdminRetryResult.RESOLVED;
        } catch (Exception e) {
            log.error("Admin DLQ retry failed: dlqId={}, txnId={}, retryCount={}, error={}",
                dlqId, entry.getTransactionId(), entry.getRetryCount(), e.getMessage());
            deadLetterRepository.save(entry);
            return AdminRetryResult.FAILED;
        }
    }

    public void sendToDeadLetter(PaymentTransaction txn, String reason) {
        ReversalDeadLetter dlq = new ReversalDeadLetter(
            txn.getTransactionId(),
            txn.getFineractTransactionId(),
            txn.getAccountId(),
            txn.getAmount(),
            txn.getCurrency(),
            txn.getProvider(),
            reason
        );
        // For CinetPay, persist underlying provider hint for correct GL mapping on DLQ retry
        dlq.setProviderHint(txn.getNotifToken());
        deadLetterRepository.save(dlq);
    }

    private static String truncate(String s, int maxLen) {
        return s != null && s.length() > maxLen ? s.substring(0, maxLen) : s;
    }

    /**
     * Resolve payment type ID for a provider.
     * For CinetPay, uses the notifToken field (repurposed to store the detected underlying provider).
     */
    public Long getPaymentTypeId(PaymentProvider provider) {
        return getPaymentTypeId(provider, null);
    }

    public Long getPaymentTypeId(PaymentProvider provider, String underlyingProviderHint) {
        return switch (provider) {
            case MTN_MOMO -> mtnConfig.getFineractPaymentTypeId();
            case ORANGE_MONEY -> orangeConfig.getFineractPaymentTypeId();
            case CINETPAY -> resolveCinetPayPaymentTypeId(underlyingProviderHint);
            case NOKASH -> nokashConfig.getFineractPaymentTypeId();
            default -> throw new PaymentException("Unknown payment type for provider: " + provider);
        };
    }

    private Long resolveCinetPayPaymentTypeId(String underlyingProviderHint) {
        if (underlyingProviderHint != null) {
            if ("MTN_MOMO".equals(underlyingProviderHint)) {
                return mtnConfig.getFineractPaymentTypeId();
            }
            if ("ORANGE_MONEY".equals(underlyingProviderHint)) {
                return orangeConfig.getFineractPaymentTypeId();
            }
        }
        // Fallback: default to MTN but log a warning
        log.warn("Could not determine underlying CinetPay provider. Defaulting to MTN payment type.");
        return mtnConfig.getFineractPaymentTypeId();
    }
}
