package com.adorsys.fineract.gateway.service;

import com.adorsys.fineract.gateway.client.FineractClient;
import com.adorsys.fineract.gateway.config.MtnMomoConfig;
import com.adorsys.fineract.gateway.config.OrangeMoneyConfig;
import com.adorsys.fineract.gateway.dto.PaymentProvider;
import com.adorsys.fineract.gateway.entity.PaymentTransaction;
import com.adorsys.fineract.gateway.exception.PaymentException;
import com.adorsys.fineract.gateway.metrics.PaymentMetrics;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Recover;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Service;

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
    private final PaymentMetrics paymentMetrics;

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
        Long paymentTypeId = getPaymentTypeId(txn.getProvider());
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
    }

    private Long getPaymentTypeId(PaymentProvider provider) {
        return switch (provider) {
            case MTN_MOMO -> mtnConfig.getFineractPaymentTypeId();
            case ORANGE_MONEY -> orangeConfig.getFineractPaymentTypeId();
            case CINETPAY -> mtnConfig.getFineractPaymentTypeId();
            default -> throw new PaymentException("Unknown payment type for provider: " + provider);
        };
    }
}
