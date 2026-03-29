package com.adorsys.fineract.gateway.service;

import com.adorsys.fineract.gateway.client.CinetPayClient;
import com.adorsys.fineract.gateway.client.FineractClient;
import com.adorsys.fineract.gateway.config.CinetPayConfig;
import com.adorsys.fineract.gateway.config.MtnMomoConfig;
import com.adorsys.fineract.gateway.config.OrangeMoneyConfig;
import com.adorsys.fineract.gateway.dto.*;
import com.adorsys.fineract.gateway.entity.PaymentTransaction;
import com.adorsys.fineract.gateway.exception.PaymentException;
import com.adorsys.fineract.gateway.metrics.PaymentMetrics;
import com.adorsys.fineract.gateway.repository.PaymentTransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

/**
 * Handles the transactional part of callback processing.
 * Extracted from PaymentService so that @Retryable (on PaymentService) correctly wraps
 * @Transactional (on this class) via separate Spring AOP proxies.
 *
 * Returns a {@link CallbackResult} indicating whether a reversal is needed,
 * so the caller can invoke ReversalService AFTER this transaction commits
 * (preventing double-credit on retry).
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class CallbackHandlerDelegate {

    private final PaymentTransactionRepository transactionRepository;
    private final FineractClient fineractClient;
    private final MtnMomoConfig mtnConfig;
    private final OrangeMoneyConfig orangeConfig;
    private final CinetPayClient cinetPayClient;
    private final CinetPayConfig cinetPayConfig;
    private final PaymentMetrics paymentMetrics;

    /**
     * Result of processing a callback inside a transaction.
     * @param reversalNeeded true if the caller should invoke ReversalService after commit
     * @param transaction the transaction entity (for reversal context)
     */
    public record CallbackResult(boolean reversalNeeded, PaymentTransaction transaction) {
        public static CallbackResult noReversal() { return new CallbackResult(false, null); }
        public static CallbackResult needsReversal(PaymentTransaction txn) { return new CallbackResult(true, txn); }
    }

    // ==================== MTN Collection (Deposit) ====================

    @Transactional
    public void processMtnCollectionCallback(MtnCallbackRequest callback) {
        if (callback.getExternalId() == null || callback.getStatus() == null) {
            log.warn("MTN collection callback missing required fields: externalId={}, status={}",
                callback.getExternalId(), callback.getStatus());
            paymentMetrics.incrementCallbackRejected(PaymentProvider.MTN_MOMO, "missing_fields");
            return;
        }

        PaymentTransaction txn = transactionRepository
            .findByProviderReferenceForUpdate(callback.getExternalId())
            .orElse(null);

        if (txn == null) {
            log.warn("Transaction not found for MTN callback: {}", callback.getExternalId());
            return;
        }

        if (txn.getStatus() == PaymentStatus.SUCCESSFUL || txn.getStatus() == PaymentStatus.FAILED) {
            log.info("Transaction already in terminal state: {}, status={}",
                txn.getTransactionId(), txn.getStatus());
            return;
        }

        if (callback.isSuccessful()) {
            verifyCallbackAmount(callback.getAmount(), txn, PaymentProvider.MTN_MOMO);

            Long fineractTxnId = fineractClient.createDeposit(
                txn.getAccountId(),
                txn.getAmount(),
                mtnConfig.getFineractPaymentTypeId(),
                callback.getFinancialTransactionId()
            );

            txn.setStatus(PaymentStatus.SUCCESSFUL);
            txn.setFineractTransactionId(fineractTxnId);
            transactionRepository.save(txn);

            paymentMetrics.incrementCallbackReceived(PaymentProvider.MTN_MOMO, PaymentStatus.SUCCESSFUL);
            paymentMetrics.recordPaymentAmountTotal(PaymentProvider.MTN_MOMO, PaymentResponse.TransactionType.DEPOSIT, txn.getAmount());
            log.info("Deposit completed: txnId={}, fineractTxnId={}", txn.getTransactionId(), fineractTxnId);

        } else if (callback.isFailed()) {
            txn.setStatus(PaymentStatus.FAILED);
            transactionRepository.save(txn);

            paymentMetrics.incrementCallbackReceived(PaymentProvider.MTN_MOMO, PaymentStatus.FAILED);
            log.warn("Deposit failed: txnId={}, reason={}", txn.getTransactionId(), callback.getReason());
        }
    }

    // ==================== MTN Disbursement (Withdrawal) ====================

    @Transactional
    public CallbackResult processMtnDisbursementCallback(MtnCallbackRequest callback) {
        if (callback.getExternalId() == null || callback.getStatus() == null) {
            log.warn("MTN disbursement callback missing required fields: externalId={}, status={}",
                callback.getExternalId(), callback.getStatus());
            paymentMetrics.incrementCallbackRejected(PaymentProvider.MTN_MOMO, "missing_fields");
            return CallbackResult.noReversal();
        }

        PaymentTransaction txn = transactionRepository
            .findByProviderReferenceForUpdate(callback.getExternalId())
            .orElse(null);

        if (txn == null) {
            log.warn("Transaction not found for MTN callback: {}", callback.getExternalId());
            return CallbackResult.noReversal();
        }

        if (txn.getStatus() == PaymentStatus.SUCCESSFUL || txn.getStatus() == PaymentStatus.FAILED) {
            return CallbackResult.noReversal();
        }

        if (callback.isSuccessful()) {
            txn.setStatus(PaymentStatus.SUCCESSFUL);
            transactionRepository.save(txn);

            paymentMetrics.incrementCallbackReceived(PaymentProvider.MTN_MOMO, PaymentStatus.SUCCESSFUL);
            paymentMetrics.recordPaymentAmountTotal(PaymentProvider.MTN_MOMO, PaymentResponse.TransactionType.WITHDRAWAL, txn.getAmount());
            log.info("Withdrawal completed: txnId={}", txn.getTransactionId());
            return CallbackResult.noReversal();

        } else if (callback.isFailed()) {
            log.warn("MTN withdrawal failed: txnId={}, reason={}. Reversal needed.",
                txn.getTransactionId(), callback.getReason());
            txn.setStatus(PaymentStatus.FAILED);
            transactionRepository.save(txn);

            paymentMetrics.incrementCallbackReceived(PaymentProvider.MTN_MOMO, PaymentStatus.FAILED);
            return CallbackResult.needsReversal(txn);
        }

        return CallbackResult.noReversal();
    }

    // ==================== Orange Money ====================

    @Transactional
    public CallbackResult processOrangeCallback(OrangeCallbackRequest callback) {
        if (callback.getOrderId() == null || callback.getStatus() == null) {
            log.warn("Orange callback missing required fields: orderId={}, status={}",
                callback.getOrderId(), callback.getStatus());
            paymentMetrics.incrementCallbackRejected(PaymentProvider.ORANGE_MONEY, "missing_fields");
            return CallbackResult.noReversal();
        }

        PaymentTransaction txn = transactionRepository.findByIdForUpdate(callback.getOrderId())
            .orElse(null);

        if (txn == null) {
            log.warn("Transaction not found for Orange callback: {}", callback.getOrderId());
            return CallbackResult.noReversal();
        }

        // Validate Orange notif_token to authenticate the callback
        if (txn.getNotifToken() != null && !txn.getNotifToken().isEmpty()) {
            if (callback.getNotifToken() == null || !txn.getNotifToken().equals(callback.getNotifToken())) {
                log.warn("Orange callback notif_token mismatch for txnId={}: expected={}, received={}",
                    txn.getTransactionId(), txn.getNotifToken(), callback.getNotifToken());
                paymentMetrics.incrementCallbackRejected(PaymentProvider.ORANGE_MONEY, "invalid_notif_token");
                return CallbackResult.noReversal();
            }
        } else {
            log.warn("No notif_token stored for Orange transaction {}. Accepting callback without token validation.",
                txn.getTransactionId());
        }

        if (txn.getStatus() == PaymentStatus.SUCCESSFUL || txn.getStatus() == PaymentStatus.FAILED) {
            return CallbackResult.noReversal();
        }

        if (txn.getType() == PaymentResponse.TransactionType.DEPOSIT) {
            if (callback.isSuccessful()) {
                verifyCallbackAmount(callback.getAmount(), txn, PaymentProvider.ORANGE_MONEY);

                Long fineractTxnId = fineractClient.createDeposit(
                    txn.getAccountId(),
                    txn.getAmount(),
                    orangeConfig.getFineractPaymentTypeId(),
                    callback.getTransactionId()
                );
                txn.setStatus(PaymentStatus.SUCCESSFUL);
                txn.setFineractTransactionId(fineractTxnId);
                transactionRepository.save(txn);

                paymentMetrics.incrementCallbackReceived(PaymentProvider.ORANGE_MONEY, PaymentStatus.SUCCESSFUL);
                paymentMetrics.recordPaymentAmountTotal(PaymentProvider.ORANGE_MONEY, PaymentResponse.TransactionType.DEPOSIT, txn.getAmount());
            } else {
                txn.setStatus(PaymentStatus.FAILED);
                transactionRepository.save(txn);
                paymentMetrics.incrementCallbackReceived(PaymentProvider.ORANGE_MONEY, PaymentStatus.FAILED);
            }
            return CallbackResult.noReversal();
        } else {
            // Withdrawal
            if (callback.isSuccessful()) {
                txn.setStatus(PaymentStatus.SUCCESSFUL);
                transactionRepository.save(txn);

                paymentMetrics.incrementCallbackReceived(PaymentProvider.ORANGE_MONEY, PaymentStatus.SUCCESSFUL);
                paymentMetrics.recordPaymentAmountTotal(PaymentProvider.ORANGE_MONEY, PaymentResponse.TransactionType.WITHDRAWAL, txn.getAmount());
                return CallbackResult.noReversal();
            } else {
                log.warn("Orange withdrawal failed: txnId={}. Reversal needed.", txn.getTransactionId());
                txn.setStatus(PaymentStatus.FAILED);
                transactionRepository.save(txn);
                paymentMetrics.incrementCallbackReceived(PaymentProvider.ORANGE_MONEY, PaymentStatus.FAILED);
                return CallbackResult.needsReversal(txn);
            }
        }
    }

    // ==================== CinetPay ====================

    @Transactional
    public CallbackResult processCinetPayCallback(CinetPayCallbackRequest callback) {
        if (callback.getTransactionId() == null) {
            log.warn("CinetPay callback missing transactionId");
            paymentMetrics.incrementCallbackRejected(PaymentProvider.CINETPAY, "missing_fields");
            return CallbackResult.noReversal();
        }

        if (!cinetPayClient.validateCallbackSignature(callback)) {
            log.warn("CinetPay callback signature validation failed: transactionId={}",
                callback.getTransactionId());
            paymentMetrics.incrementCallbackRejected(PaymentProvider.CINETPAY, "invalid_signature");
            return CallbackResult.noReversal();
        }

        PaymentTransaction txn = transactionRepository.findByIdForUpdate(callback.getTransactionId())
            .orElse(null);

        if (txn == null) {
            log.warn("Transaction not found for CinetPay callback: {}", callback.getTransactionId());
            return CallbackResult.noReversal();
        }

        if (txn.getStatus() == PaymentStatus.SUCCESSFUL || txn.getStatus() == PaymentStatus.FAILED) {
            return CallbackResult.noReversal();
        }

        if (txn.getType() == PaymentResponse.TransactionType.DEPOSIT) {
            processCinetPayDepositCallback(callback, txn);
            return CallbackResult.noReversal();
        } else {
            return processCinetPayWithdrawalCallback(callback, txn);
        }
    }

    private void processCinetPayDepositCallback(CinetPayCallbackRequest callback, PaymentTransaction txn) {
        if (callback.isSuccessful()) {
            verifyCallbackAmount(callback.getAmount(), txn, PaymentProvider.CINETPAY);

            PaymentProvider actualProvider = callback.getActualProvider();
            Long paymentTypeId;

            if (actualProvider == PaymentProvider.MTN_MOMO) {
                paymentTypeId = mtnConfig.getFineractPaymentTypeId();
                log.info("CinetPay deposit via MTN MoMo: transactionId={}, paymentTypeId={}", txn.getTransactionId(), paymentTypeId);
            } else if (actualProvider == PaymentProvider.ORANGE_MONEY) {
                paymentTypeId = orangeConfig.getFineractPaymentTypeId();
                log.info("CinetPay deposit via Orange Money: transactionId={}, paymentTypeId={}", txn.getTransactionId(), paymentTypeId);
            } else {
                log.error("Unknown CinetPay payment method: '{}'. Marking txn FAILED for safety.",
                    callback.getPaymentMethod());
                txn.setStatus(PaymentStatus.FAILED);
                transactionRepository.save(txn);
                paymentMetrics.incrementCallbackReceived(PaymentProvider.CINETPAY, PaymentStatus.FAILED);
                return;
            }

            Long fineractTxnId = fineractClient.createDeposit(
                txn.getAccountId(),
                txn.getAmount(),
                paymentTypeId,
                callback.getPaymentId()
            );

            txn.setStatus(PaymentStatus.SUCCESSFUL);
            txn.setFineractTransactionId(fineractTxnId);
            transactionRepository.save(txn);

            paymentMetrics.incrementCallbackReceived(PaymentProvider.CINETPAY, PaymentStatus.SUCCESSFUL);
            paymentMetrics.recordPaymentAmountTotal(PaymentProvider.CINETPAY, PaymentResponse.TransactionType.DEPOSIT, txn.getAmount());
            log.info("CinetPay deposit completed: txnId={}, fineractTxnId={}", txn.getTransactionId(), fineractTxnId);

        } else if (callback.isFailed() || callback.isCancelled()) {
            txn.setStatus(PaymentStatus.FAILED);
            transactionRepository.save(txn);

            paymentMetrics.incrementCallbackReceived(PaymentProvider.CINETPAY, PaymentStatus.FAILED);
            log.warn("CinetPay deposit failed: txnId={}, reason={}", txn.getTransactionId(), callback.getErrorMessage());
        }
    }

    private CallbackResult processCinetPayWithdrawalCallback(CinetPayCallbackRequest callback, PaymentTransaction txn) {
        if (callback.isSuccessful()) {
            txn.setStatus(PaymentStatus.SUCCESSFUL);
            transactionRepository.save(txn);

            paymentMetrics.incrementCallbackReceived(PaymentProvider.CINETPAY, PaymentStatus.SUCCESSFUL);
            paymentMetrics.recordPaymentAmountTotal(PaymentProvider.CINETPAY, PaymentResponse.TransactionType.WITHDRAWAL, txn.getAmount());
            log.info("CinetPay withdrawal completed: txnId={}", txn.getTransactionId());
            return CallbackResult.noReversal();

        } else if (callback.isFailed() || callback.isCancelled()) {
            log.warn("CinetPay withdrawal failed: txnId={}, reason={}. Reversal needed.",
                txn.getTransactionId(), callback.getErrorMessage());
            txn.setStatus(PaymentStatus.FAILED);
            transactionRepository.save(txn);

            paymentMetrics.incrementCallbackReceived(PaymentProvider.CINETPAY, PaymentStatus.FAILED);
            return CallbackResult.needsReversal(txn);
        }

        return CallbackResult.noReversal();
    }

    // ==================== Shared helpers ====================

    /**
     * Verify callback-reported amount matches expected transaction amount.
     * Blocks processing if the mismatch exceeds 1 unit (tolerance for XAF rounding).
     */
    private void verifyCallbackAmount(String callbackAmountStr, PaymentTransaction txn, PaymentProvider provider) {
        if (callbackAmountStr == null || callbackAmountStr.isEmpty()) {
            // MTN and CinetPay always include amount — missing amount is suspicious
            if (provider == PaymentProvider.MTN_MOMO || provider == PaymentProvider.CINETPAY) {
                log.error("AMOUNT MISSING in callback for txnId={}, provider={}. Rejecting for safety.",
                    txn.getTransactionId(), provider);
                paymentMetrics.incrementCallbackAmountMismatch(provider);
                throw new PaymentException("Callback amount missing for provider " + provider);
            }
            log.warn("Callback amount not provided for txnId={}, provider={}. Skipping amount check.",
                txn.getTransactionId(), provider);
            return;
        }
        try {
            BigDecimal callbackAmount = new BigDecimal(callbackAmountStr);
            BigDecimal difference = callbackAmount.subtract(txn.getAmount()).abs();
            if (difference.compareTo(BigDecimal.ONE) > 0) {
                log.error("AMOUNT MISMATCH BLOCKED: txnId={}, expected={}, provider_reported={}, provider={}",
                    txn.getTransactionId(), txn.getAmount(), callbackAmount, provider);
                paymentMetrics.incrementCallbackAmountMismatch(provider);
                throw new PaymentException("Callback amount mismatch: expected " + txn.getAmount()
                    + " but received " + callbackAmount);
            }
        } catch (NumberFormatException e) {
            log.warn("Could not parse callback amount '{}' for txnId={}", callbackAmountStr, txn.getTransactionId());
        }
    }
}
