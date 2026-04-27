package com.adorsys.fineract.gateway.service;

import com.adorsys.fineract.gateway.client.CinetPayClient;
import com.adorsys.fineract.gateway.client.FineractClient;
import com.adorsys.fineract.gateway.config.CinetPayConfig;
import com.adorsys.fineract.gateway.config.MtnMomoConfig;
import com.adorsys.fineract.gateway.config.NokashConfig;
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
    private final NokashConfig nokashConfig;
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

    // ==================== MTN Collection (Deposit) — path-based ====================

    /**
     * Process MTN collection callback when identified by referenceId (our transactionId).
     * Called when MTN sends an empty body; status comes from polling MTN directly.
     */
    @Transactional
    public void processMtnCollectionCallbackByRef(String referenceId, PaymentStatus polledStatus) {
        PaymentTransaction txn = transactionRepository.findByIdForUpdate(referenceId).orElse(null);
        if (txn == null) {
            log.warn("MTN collection callback: transaction not found for referenceId={}", referenceId);
            return;
        }
        if (txn.getStatus() == PaymentStatus.SUCCESSFUL || txn.getStatus() == PaymentStatus.FAILED) {
            log.info("MTN collection callback: transaction already in terminal state txnId={}, status={}",
                referenceId, txn.getStatus());
            return;
        }
        if (polledStatus == PaymentStatus.SUCCESSFUL) {
            try {
                Long fineractTxnId = fineractClient.createDeposit(
                    txn.getAccountId(),
                    txn.getAmount(),
                    mtnConfig.getFineractPaymentTypeId(),
                    null
                );
                txn.setStatus(PaymentStatus.SUCCESSFUL);
                txn.setFineractTransactionId(fineractTxnId);
                transactionRepository.save(txn);
                paymentMetrics.incrementCallbackReceived(PaymentProvider.MTN_MOMO, PaymentStatus.SUCCESSFUL);
                paymentMetrics.recordPaymentAmountTotal(PaymentProvider.MTN_MOMO, PaymentResponse.TransactionType.DEPOSIT, txn.getAmount());
                log.info("Deposit completed via polling: txnId={}, fineractTxnId={}", referenceId, fineractTxnId);
            } catch (Exception e) {
                log.error("CRITICAL: Fineract createDeposit failed after MTN collected funds. " +
                    "Marking PROCESSING so stale scheduler retries. " +
                    "txnId={}, accountId={}, amount={}, error={}",
                    referenceId, txn.getAccountId(), txn.getAmount(), e.getMessage());
                txn.setStatus(PaymentStatus.PROCESSING);
                transactionRepository.save(txn);
            }
        } else if (polledStatus == PaymentStatus.FAILED) {
            txn.setStatus(PaymentStatus.FAILED);
            transactionRepository.save(txn);
            paymentMetrics.incrementCallbackReceived(PaymentProvider.MTN_MOMO, PaymentStatus.FAILED);
            log.warn("Deposit failed via polling: txnId={}", referenceId);
        } else {
            log.info("MTN collection still PENDING for txnId={}, ignoring callback", referenceId);
        }
    }

    // ==================== MTN Disbursement (Withdrawal) — path-based ====================

    /**
     * Process MTN disbursement callback when identified by referenceId (our transactionId).
     * Called when MTN sends an empty body; status comes from polling MTN directly.
     */
    @Transactional
    public CallbackResult processMtnDisbursementCallbackByRef(String referenceId, PaymentStatus polledStatus) {
        PaymentTransaction txn = transactionRepository.findByIdForUpdate(referenceId).orElse(null);
        if (txn == null) {
            log.warn("MTN disbursement callback: transaction not found for referenceId={}", referenceId);
            return CallbackResult.noReversal();
        }
        if (txn.getStatus() == PaymentStatus.SUCCESSFUL || txn.getStatus() == PaymentStatus.FAILED) {
            return CallbackResult.noReversal();
        }
        if (polledStatus == PaymentStatus.SUCCESSFUL) {
            txn.setStatus(PaymentStatus.SUCCESSFUL);
            transactionRepository.save(txn);
            paymentMetrics.incrementCallbackReceived(PaymentProvider.MTN_MOMO, PaymentStatus.SUCCESSFUL);
            paymentMetrics.recordPaymentAmountTotal(PaymentProvider.MTN_MOMO, PaymentResponse.TransactionType.WITHDRAWAL, txn.getAmount());
            log.info("Withdrawal completed via polling: txnId={}", referenceId);
            return CallbackResult.noReversal();
        } else if (polledStatus == PaymentStatus.FAILED) {
            log.warn("MTN withdrawal failed via polling: txnId={}. Reversal needed.", referenceId);
            txn.setStatus(PaymentStatus.FAILED);
            transactionRepository.save(txn);
            paymentMetrics.incrementCallbackReceived(PaymentProvider.MTN_MOMO, PaymentStatus.FAILED);
            return CallbackResult.needsReversal(txn);
        }
        return CallbackResult.noReversal();
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

            try {
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
            } catch (Exception e) {
                log.error("CRITICAL: Fineract createDeposit failed after MTN collected funds. " +
                    "Marking PROCESSING so stale scheduler retries. " +
                    "txnId={}, accountId={}, amount={}, error={}",
                    txn.getTransactionId(), txn.getAccountId(), txn.getAmount(), e.getMessage());
                txn.setStatus(PaymentStatus.PROCESSING);
                transactionRepository.save(txn);
            }

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

        // Validate Orange notif_token to authenticate the callback. Only enforced for deposits:
        // Orange's WebPayment init returns notif_token, but the cashout endpoint does not, so
        // withdrawal transactions never have one stored. Cashout callbacks are still protected by
        // the CallbackGuardFilter (X-Callback-Secret header + IP whitelist).
        if (txn.getType() == PaymentResponse.TransactionType.DEPOSIT) {
            if (txn.getNotifToken() != null && !txn.getNotifToken().isEmpty()) {
                if (callback.getNotifToken() == null || !txn.getNotifToken().equals(callback.getNotifToken())) {
                    log.warn("Orange callback notif_token mismatch for txnId={}: expected={}, received={}",
                        txn.getTransactionId(), txn.getNotifToken(), callback.getNotifToken());
                    paymentMetrics.incrementCallbackRejected(PaymentProvider.ORANGE_MONEY, "invalid_notif_token");
                    return CallbackResult.noReversal();
                }
            } else {
                log.error("SECURITY: No notif_token stored for Orange deposit {} — rejecting callback.",
                    txn.getTransactionId());
                paymentMetrics.incrementCallbackRejected(PaymentProvider.ORANGE_MONEY, "missing_stored_token");
                return CallbackResult.noReversal();
            }
        }

        if (txn.getStatus() == PaymentStatus.SUCCESSFUL || txn.getStatus() == PaymentStatus.FAILED) {
            return CallbackResult.noReversal();
        }

        if (txn.getType() == PaymentResponse.TransactionType.DEPOSIT) {
            if (callback.isSuccessful()) {
                verifyCallbackAmount(callback.getAmount(), txn, PaymentProvider.ORANGE_MONEY);

                try {
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
                } catch (Exception e) {
                    log.error("CRITICAL: Fineract createDeposit failed after Orange collected funds. " +
                        "Marking PROCESSING so stale scheduler retries. " +
                        "txnId={}, accountId={}, amount={}, error={}",
                        txn.getTransactionId(), txn.getAccountId(), txn.getAmount(), e.getMessage());
                    txn.setStatus(PaymentStatus.PROCESSING);
                    transactionRepository.save(txn);
                }
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

            try {
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
            } catch (Exception e) {
                log.error("CRITICAL: Fineract createDeposit failed after CinetPay collected funds. " +
                    "Marking PROCESSING so stale scheduler retries. " +
                    "txnId={}, accountId={}, amount={}, error={}",
                    txn.getTransactionId(), txn.getAccountId(), txn.getAmount(), e.getMessage());
                txn.setStatus(PaymentStatus.PROCESSING);
                transactionRepository.save(txn);
            }

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

    // ==================== NOKASH ====================

    @Transactional
    public CallbackResult processNokashCallback(NokashCallbackRequest callback) {
        if (callback.getOrderId() == null || callback.getStatus() == null) {
            log.warn("NOKASH callback missing required fields: orderId={}, status={}",
                callback.getOrderId(), callback.getStatus());
            paymentMetrics.incrementCallbackRejected(PaymentProvider.NOKASH, "missing_fields");
            return CallbackResult.noReversal();
        }

        PaymentTransaction txn = transactionRepository.findByIdForUpdate(callback.getOrderId())
            .orElse(null);

        if (txn == null) {
            log.warn("Transaction not found for NOKASH callback: {}", callback.getOrderId());
            return CallbackResult.noReversal();
        }

        if (txn.getStatus() == PaymentStatus.SUCCESSFUL || txn.getStatus() == PaymentStatus.FAILED) {
            return CallbackResult.noReversal();
        }

        if (txn.getType() == PaymentResponse.TransactionType.DEPOSIT) {
            if (callback.isSuccessful()) {
                verifyCallbackAmount(callback.getAmount(), txn, PaymentProvider.NOKASH);

                try {
                    Long fineractTxnId = fineractClient.createDeposit(
                        txn.getAccountId(),
                        txn.getAmount(),
                        nokashConfig.getFineractPaymentTypeId(),
                        callback.getReference()
                    );
                    txn.setStatus(PaymentStatus.SUCCESSFUL);
                    txn.setFineractTransactionId(fineractTxnId);
                    transactionRepository.save(txn);
                    paymentMetrics.incrementCallbackReceived(PaymentProvider.NOKASH, PaymentStatus.SUCCESSFUL);
                    paymentMetrics.recordPaymentAmountTotal(PaymentProvider.NOKASH, PaymentResponse.TransactionType.DEPOSIT, txn.getAmount());
                } catch (Exception e) {
                    log.error("CRITICAL: Fineract createDeposit failed after NOKASH collected funds. " +
                        "Marking PROCESSING so stale scheduler retries. " +
                        "txnId={}, accountId={}, amount={}, error={}",
                        txn.getTransactionId(), txn.getAccountId(), txn.getAmount(), e.getMessage());
                    txn.setStatus(PaymentStatus.PROCESSING);
                    transactionRepository.save(txn);
                }
            } else {
                txn.setStatus(PaymentStatus.FAILED);
                transactionRepository.save(txn);
                paymentMetrics.incrementCallbackReceived(PaymentProvider.NOKASH, PaymentStatus.FAILED);
            }
            return CallbackResult.noReversal();
        } else {
            // Withdrawal
            if (callback.isSuccessful()) {
                txn.setStatus(PaymentStatus.SUCCESSFUL);
                transactionRepository.save(txn);

                paymentMetrics.incrementCallbackReceived(PaymentProvider.NOKASH, PaymentStatus.SUCCESSFUL);
                paymentMetrics.recordPaymentAmountTotal(PaymentProvider.NOKASH, PaymentResponse.TransactionType.WITHDRAWAL, txn.getAmount());
                return CallbackResult.noReversal();
            } else {
                log.warn("NOKASH withdrawal failed: txnId={}. Reversal needed.", txn.getTransactionId());
                txn.setStatus(PaymentStatus.FAILED);
                transactionRepository.save(txn);
                paymentMetrics.incrementCallbackReceived(PaymentProvider.NOKASH, PaymentStatus.FAILED);
                return CallbackResult.needsReversal(txn);
            }
        }
    }

    // ==================== Shared helpers ====================

    /**
     * Verify callback-reported amount matches expected transaction amount.
     * Blocks processing if the mismatch exceeds 1 unit (tolerance for XAF rounding).
     */
    // ==================== NOKASH — byRef (for scheduler/reconciler) ====================

    /**
     * Process NOKASH deposit callback identified by our transactionId (status from polling).
     * No amount verification — the provider-polled status is trusted.
     */
    @Transactional
    public void processNokashDepositCallbackByRef(String transactionId, PaymentStatus polledStatus) {
        PaymentTransaction txn = transactionRepository.findByIdForUpdate(transactionId).orElse(null);
        if (txn == null) {
            log.warn("NOKASH deposit byRef: transaction not found txnId={}", transactionId);
            return;
        }
        if (txn.getStatus() == PaymentStatus.SUCCESSFUL || txn.getStatus() == PaymentStatus.FAILED) {
            return;
        }
        if (polledStatus == PaymentStatus.SUCCESSFUL) {
            try {
                Long fineractTxnId = fineractClient.createDeposit(
                    txn.getAccountId(), txn.getAmount(), nokashConfig.getFineractPaymentTypeId(), null);
                txn.setStatus(PaymentStatus.SUCCESSFUL);
                txn.setFineractTransactionId(fineractTxnId);
                transactionRepository.save(txn);
                paymentMetrics.incrementCallbackReceived(PaymentProvider.NOKASH, PaymentStatus.SUCCESSFUL);
                log.info("NOKASH deposit completed via polling: txnId={}, fineractTxnId={}", transactionId, fineractTxnId);
            } catch (Exception e) {
                log.error("CRITICAL: Fineract createDeposit failed after NOKASH collected funds via polling. " +
                    "Marking PROCESSING so stale scheduler retries. txnId={}, error={}", transactionId, e.getMessage());
                txn.setStatus(PaymentStatus.PROCESSING);
                transactionRepository.save(txn);
            }
        } else if (polledStatus == PaymentStatus.FAILED) {
            txn.setStatus(PaymentStatus.FAILED);
            transactionRepository.save(txn);
            paymentMetrics.incrementCallbackReceived(PaymentProvider.NOKASH, PaymentStatus.FAILED);
            log.warn("NOKASH deposit failed via polling: txnId={}", transactionId);
        }
    }

    // ==================== Orange Money — byRef (for scheduler/reconciler) ====================

    /**
     * Process Orange Money deposit callback identified by our transactionId (status from polling).
     * No amount verification — the provider-polled status is trusted.
     */
    @Transactional
    public void processOrangeDepositCallbackByRef(String transactionId, PaymentStatus polledStatus) {
        PaymentTransaction txn = transactionRepository.findByIdForUpdate(transactionId).orElse(null);
        if (txn == null) {
            log.warn("Orange deposit byRef: transaction not found txnId={}", transactionId);
            return;
        }
        if (txn.getStatus() == PaymentStatus.SUCCESSFUL || txn.getStatus() == PaymentStatus.FAILED) {
            return;
        }
        if (polledStatus == PaymentStatus.SUCCESSFUL) {
            try {
                Long fineractTxnId = fineractClient.createDeposit(
                    txn.getAccountId(), txn.getAmount(), orangeConfig.getFineractPaymentTypeId(), null);
                txn.setStatus(PaymentStatus.SUCCESSFUL);
                txn.setFineractTransactionId(fineractTxnId);
                transactionRepository.save(txn);
                paymentMetrics.incrementCallbackReceived(PaymentProvider.ORANGE_MONEY, PaymentStatus.SUCCESSFUL);
                log.info("Orange deposit completed via polling: txnId={}, fineractTxnId={}", transactionId, fineractTxnId);
            } catch (Exception e) {
                log.error("CRITICAL: Fineract createDeposit failed after Orange collected funds via polling. " +
                    "Marking PROCESSING so stale scheduler retries. txnId={}, error={}", transactionId, e.getMessage());
                txn.setStatus(PaymentStatus.PROCESSING);
                transactionRepository.save(txn);
            }
        } else if (polledStatus == PaymentStatus.FAILED) {
            txn.setStatus(PaymentStatus.FAILED);
            transactionRepository.save(txn);
            paymentMetrics.incrementCallbackReceived(PaymentProvider.ORANGE_MONEY, PaymentStatus.FAILED);
            log.warn("Orange deposit failed via polling: txnId={}", transactionId);
        }
    }

    /**
     * Process Orange Money withdrawal callback identified by transactionId (status from polling).
     */
    @Transactional
    public CallbackResult processOrangeWithdrawalCallbackByRef(String transactionId, PaymentStatus polledStatus) {
        PaymentTransaction txn = transactionRepository.findByIdForUpdate(transactionId).orElse(null);
        if (txn == null) {
            log.warn("Orange withdrawal byRef: transaction not found txnId={}", transactionId);
            return CallbackResult.noReversal();
        }
        if (txn.getStatus() == PaymentStatus.SUCCESSFUL || txn.getStatus() == PaymentStatus.FAILED) {
            return CallbackResult.noReversal();
        }
        if (polledStatus == PaymentStatus.SUCCESSFUL) {
            txn.setStatus(PaymentStatus.SUCCESSFUL);
            transactionRepository.save(txn);
            paymentMetrics.incrementCallbackReceived(PaymentProvider.ORANGE_MONEY, PaymentStatus.SUCCESSFUL);
            log.info("Orange withdrawal completed via polling: txnId={}", transactionId);
            return CallbackResult.noReversal();
        } else if (polledStatus == PaymentStatus.FAILED) {
            txn.setStatus(PaymentStatus.FAILED);
            transactionRepository.save(txn);
            paymentMetrics.incrementCallbackReceived(PaymentProvider.ORANGE_MONEY, PaymentStatus.FAILED);
            log.warn("Orange withdrawal failed via polling: txnId={}. Reversal needed.", transactionId);
            return CallbackResult.needsReversal(txn);
        }
        return CallbackResult.noReversal();
    }

    // ==================== CinetPay — byRef (for scheduler/reconciler) ====================

    /**
     * Process CinetPay deposit callback identified by transactionId (status from polling).
     * actualProvider is the underlying MTN/Orange provider detected from the CinetPay verify response;
     * falls back to MTN payment type when unknown.
     */
    @Transactional
    public void processCinetPayDepositCallbackByRef(String transactionId, PaymentStatus polledStatus,
                                                    PaymentProvider actualProvider) {
        PaymentTransaction txn = transactionRepository.findByIdForUpdate(transactionId).orElse(null);
        if (txn == null) {
            log.warn("CinetPay deposit byRef: transaction not found txnId={}", transactionId);
            return;
        }
        if (txn.getStatus() == PaymentStatus.SUCCESSFUL || txn.getStatus() == PaymentStatus.FAILED) {
            return;
        }
        if (polledStatus == PaymentStatus.SUCCESSFUL) {
            Long paymentTypeId;
            if (actualProvider == PaymentProvider.ORANGE_MONEY) {
                paymentTypeId = orangeConfig.getFineractPaymentTypeId();
            } else {
                // Default to MTN when unknown; log so it can be investigated
                if (actualProvider == null) {
                    log.warn("CinetPay deposit byRef: actual provider unknown, defaulting to MTN payment type. txnId={}", transactionId);
                }
                paymentTypeId = mtnConfig.getFineractPaymentTypeId();
            }
            try {
                Long fineractTxnId = fineractClient.createDeposit(
                    txn.getAccountId(), txn.getAmount(), paymentTypeId, null);
                txn.setStatus(PaymentStatus.SUCCESSFUL);
                txn.setFineractTransactionId(fineractTxnId);
                transactionRepository.save(txn);
                paymentMetrics.incrementCallbackReceived(PaymentProvider.CINETPAY, PaymentStatus.SUCCESSFUL);
                log.info("CinetPay deposit completed via polling: txnId={}, fineractTxnId={}, actualProvider={}",
                    transactionId, fineractTxnId, actualProvider);
            } catch (Exception e) {
                log.error("CRITICAL: Fineract createDeposit failed after CinetPay collected funds via polling. " +
                    "Marking PROCESSING so stale scheduler retries. txnId={}, error={}", transactionId, e.getMessage());
                txn.setStatus(PaymentStatus.PROCESSING);
                transactionRepository.save(txn);
            }
        } else if (polledStatus == PaymentStatus.FAILED) {
            txn.setStatus(PaymentStatus.FAILED);
            transactionRepository.save(txn);
            paymentMetrics.incrementCallbackReceived(PaymentProvider.CINETPAY, PaymentStatus.FAILED);
            log.warn("CinetPay deposit failed via polling: txnId={}", transactionId);
        }
    }

    /**
     * Process CinetPay withdrawal callback identified by transactionId (status from polling).
     */
    @Transactional
    public CallbackResult processCinetPayWithdrawalCallbackByRef(String transactionId, PaymentStatus polledStatus) {
        PaymentTransaction txn = transactionRepository.findByIdForUpdate(transactionId).orElse(null);
        if (txn == null) {
            log.warn("CinetPay withdrawal byRef: transaction not found txnId={}", transactionId);
            return CallbackResult.noReversal();
        }
        if (txn.getStatus() == PaymentStatus.SUCCESSFUL || txn.getStatus() == PaymentStatus.FAILED) {
            return CallbackResult.noReversal();
        }
        if (polledStatus == PaymentStatus.SUCCESSFUL) {
            txn.setStatus(PaymentStatus.SUCCESSFUL);
            transactionRepository.save(txn);
            paymentMetrics.incrementCallbackReceived(PaymentProvider.CINETPAY, PaymentStatus.SUCCESSFUL);
            log.info("CinetPay withdrawal completed via polling: txnId={}", transactionId);
            return CallbackResult.noReversal();
        } else if (polledStatus == PaymentStatus.FAILED) {
            txn.setStatus(PaymentStatus.FAILED);
            transactionRepository.save(txn);
            paymentMetrics.incrementCallbackReceived(PaymentProvider.CINETPAY, PaymentStatus.FAILED);
            log.warn("CinetPay withdrawal failed via polling: txnId={}. Reversal needed.", transactionId);
            return CallbackResult.needsReversal(txn);
        }
        return CallbackResult.noReversal();
    }

    // ==================== Shared helpers ====================

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
