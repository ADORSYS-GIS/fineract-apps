package com.adorsys.fineract.gateway.service;

import com.adorsys.fineract.gateway.client.FineractClient;
import com.adorsys.fineract.gateway.config.CinetPayConfig;
import com.adorsys.fineract.gateway.config.MtnMomoConfig;
import com.adorsys.fineract.gateway.config.OrangeMoneyConfig;
import com.adorsys.fineract.gateway.dto.PaymentProvider;
import com.adorsys.fineract.gateway.entity.PaymentTransaction;
import com.adorsys.fineract.gateway.exception.PaymentException;
import com.adorsys.fineract.gateway.metrics.PaymentMetrics;
import com.adorsys.fineract.gateway.util.PhoneNumberUtils;
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
    private final CinetPayConfig cinetPayConfig;
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
    }

    /**
     * Resolve payment type ID for a provider.
     * For CinetPay, uses the notifToken field (repurposed to store the detected underlying provider).
     */
    Long getPaymentTypeId(PaymentProvider provider) {
        return getPaymentTypeId(provider, null);
    }

    Long getPaymentTypeId(PaymentProvider provider, String underlyingProviderHint) {
        return switch (provider) {
            case MTN_MOMO -> mtnConfig.getFineractPaymentTypeId();
            case ORANGE_MONEY -> orangeConfig.getFineractPaymentTypeId();
            case CINETPAY -> resolveCinetPayPaymentTypeId(underlyingProviderHint);
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
