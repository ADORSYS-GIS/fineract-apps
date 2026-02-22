package com.adorsys.fineract.gateway.service;

import com.adorsys.fineract.gateway.client.CinetPayClient;
import com.adorsys.fineract.gateway.client.FineractClient;
import com.adorsys.fineract.gateway.client.MtnMomoClient;
import com.adorsys.fineract.gateway.client.OrangeMoneyClient;
import com.adorsys.fineract.gateway.config.CinetPayConfig;
import com.adorsys.fineract.gateway.config.MtnMomoConfig;
import com.adorsys.fineract.gateway.config.OrangeMoneyConfig;
import com.adorsys.fineract.gateway.dto.*;
import com.adorsys.fineract.gateway.entity.PaymentTransaction;
import com.adorsys.fineract.gateway.entity.ReversalDeadLetter;
import com.adorsys.fineract.gateway.exception.PaymentException;
import com.adorsys.fineract.gateway.metrics.PaymentMetrics;
import com.adorsys.fineract.gateway.repository.PaymentTransactionRepository;
import com.adorsys.fineract.gateway.repository.ReversalDeadLetterRepository;
import com.adorsys.fineract.gateway.util.PhoneNumberUtils;
import io.micrometer.core.instrument.Timer;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.CannotAcquireLockException;
import org.springframework.dao.PessimisticLockingFailureException;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

/**
 * Service for handling payment operations (deposits and withdrawals).
 *
 * Orchestrates communication between:
 * - Payment providers (MTN MoMo, Orange Money, CinetPay)
 * - Fineract (savings transactions)
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentService {

    private final MtnMomoClient mtnClient;
    private final OrangeMoneyClient orangeClient;
    private final CinetPayClient cinetPayClient;
    private final FineractClient fineractClient;
    private final MtnMomoConfig mtnConfig;
    private final OrangeMoneyConfig orangeConfig;
    private final CinetPayConfig cinetPayConfig;
    private final PaymentMetrics paymentMetrics;
    private final PaymentTransactionRepository transactionRepository;
    private final ReversalService reversalService;
    private final ReversalDeadLetterRepository deadLetterRepository;

    @Value("${app.limits.daily-deposit-max:10000000}")
    private BigDecimal dailyDepositMax;

    @Value("${app.limits.daily-withdrawal-max:5000000}")
    private BigDecimal dailyWithdrawalMax;

    /**
     * Initiate a deposit operation.
     *
     * Fix #3: Reserves the idempotency key in the DB BEFORE calling the provider
     * to prevent TOCTOU race conditions where two concurrent requests both pass
     * the idempotency check and both initiate real provider payments.
     */
    public PaymentResponse initiateDeposit(DepositRequest request, String idempotencyKey) {
        log.info("Initiating deposit: externalId={}, amount={}, provider={}, idempotencyKey={}",
            request.getExternalId(), request.getAmount(), request.getProvider(), idempotencyKey);

        validateIdempotencyKey(idempotencyKey);

        // Fast path: return existing transaction for genuine retries
        Optional<PaymentTransaction> existing = transactionRepository.findById(idempotencyKey);
        if (existing.isPresent()) {
            log.info("Returning existing transaction for idempotency key: {}", idempotencyKey);
            return mapToResponse(existing.get());
        }

        Timer.Sample timerSample = paymentMetrics.startTimer();

        // Verify account ownership
        if (!fineractClient.verifyAccountOwnership(request.getExternalId(), request.getAccountId())) {
            throw new PaymentException("Account does not belong to the customer");
        }

        // Fix #14: Enforce daily deposit limit
        enforceDailyLimit(request.getExternalId(), PaymentResponse.TransactionType.DEPOSIT,
                request.getAmount(), dailyDepositMax);

        String transactionId = idempotencyKey;
        String currency = getProviderCurrency(request.getProvider());

        // Fix #3: Reserve the idempotency key atomically BEFORE calling the provider.
        // Uses INSERT ON CONFLICT DO NOTHING - returns 0 if another thread already reserved it.
        int inserted = transactionRepository.insertIfAbsent(
            transactionId, request.getExternalId(), request.getAccountId(),
            request.getProvider().name(), PaymentResponse.TransactionType.DEPOSIT.name(),
            request.getAmount(), currency, PaymentStatus.PENDING.name()
        );
        if (inserted == 0) {
            log.info("Concurrent idempotency key collision, returning existing: {}", idempotencyKey);
            return transactionRepository.findById(idempotencyKey)
                .map(this::mapToResponse)
                .orElseThrow(() -> new PaymentException("Concurrent transaction conflict"));
        }

        // Now call the provider - we hold the "lock" via the DB record
        PaymentResponse response;
        try {
            response = switch (request.getProvider()) {
                case MTN_MOMO -> initiateMtnDeposit(transactionId, request);
                case ORANGE_MONEY -> initiateOrangeDeposit(transactionId, request);
                case CINETPAY -> initiateCinetPayDeposit(transactionId, request);
                default -> throw new PaymentException("Unsupported payment provider for deposits: " + request.getProvider());
            };
        } catch (Exception e) {
            // Provider call failed - mark our reserved record as FAILED
            markTransactionFailed(transactionId);
            paymentMetrics.incrementTransaction(request.getProvider(), PaymentResponse.TransactionType.DEPOSIT, PaymentStatus.FAILED);
            throw e;
        }

        // Update the reserved record with provider reference
        updateTransactionAfterProviderCall(transactionId, response.getProviderReference(), null);

        paymentMetrics.incrementTransaction(request.getProvider(), PaymentResponse.TransactionType.DEPOSIT, PaymentStatus.PENDING);
        paymentMetrics.recordPaymentAmount(request.getProvider(), PaymentResponse.TransactionType.DEPOSIT, request.getAmount());
        paymentMetrics.stopProcessingTimer(timerSample, request.getProvider(), PaymentResponse.TransactionType.DEPOSIT, PaymentStatus.PENDING);

        return response;
    }

    /**
     * Initiate a withdrawal operation.
     *
     * Fix #2: The balance check is advisory. Fineract is the authoritative source
     * and will reject overdrafts. We handle Fineract rejection gracefully.
     * Fix #3: Idempotency key reserved before provider call.
     */
    public PaymentResponse initiateWithdrawal(WithdrawalRequest request, String idempotencyKey) {
        log.info("Initiating withdrawal: externalId={}, amount={}, provider={}, idempotencyKey={}",
            request.getExternalId(), request.getAmount(), request.getProvider(), idempotencyKey);

        validateIdempotencyKey(idempotencyKey);

        // Fast path: return existing transaction for genuine retries
        Optional<PaymentTransaction> existing = transactionRepository.findById(idempotencyKey);
        if (existing.isPresent()) {
            log.info("Returning existing transaction for idempotency key: {}", idempotencyKey);
            return mapToResponse(existing.get());
        }

        Timer.Sample timerSample = paymentMetrics.startTimer();

        // Verify account ownership
        if (!fineractClient.verifyAccountOwnership(request.getExternalId(), request.getAccountId())) {
            throw new PaymentException("Account does not belong to the customer");
        }

        // Fix #10: Safe balance extraction with proper error handling
        // Fix #2: This is an advisory check only. Fineract is the authoritative balance enforcer.
        BigDecimal availableBalance = extractAvailableBalance(
                fineractClient.getSavingsAccount(request.getAccountId()));

        if (availableBalance.compareTo(request.getAmount()) < 0) {
            paymentMetrics.incrementInsufficientFunds();
            throw new PaymentException("Insufficient funds");
        }

        // Fix #14: Enforce daily withdrawal limit
        enforceDailyLimit(request.getExternalId(), PaymentResponse.TransactionType.WITHDRAWAL,
                request.getAmount(), dailyWithdrawalMax);

        String transactionId = idempotencyKey;
        String currency = getProviderCurrency(request.getProvider());

        // Fix #4: For CinetPay, detect actual provider from phone number for correct GL mapping
        Long paymentTypeId = getPaymentTypeId(request.getProvider(), request.getPhoneNumber());
        String underlyingProvider = null;
        if (request.getProvider() == PaymentProvider.CINETPAY && request.getPhoneNumber() != null) {
            PaymentProvider detected = PhoneNumberUtils.detectProvider(request.getPhoneNumber());
            if (detected != null) {
                underlyingProvider = detected.name();
            }
        }

        // Fix #3: Reserve the idempotency key BEFORE any financial operations
        int inserted = transactionRepository.insertIfAbsent(
            transactionId, request.getExternalId(), request.getAccountId(),
            request.getProvider().name(), PaymentResponse.TransactionType.WITHDRAWAL.name(),
            request.getAmount(), currency, PaymentStatus.PENDING.name()
        );
        if (inserted == 0) {
            log.info("Concurrent idempotency key collision, returning existing: {}", idempotencyKey);
            return transactionRepository.findById(idempotencyKey)
                .map(this::mapToResponse)
                .orElseThrow(() -> new PaymentException("Concurrent transaction conflict"));
        }

        // Fix #2: Create Fineract withdrawal - Fineract enforces balance atomically.
        // If Fineract rejects (e.g., concurrent overdraft), we mark our record FAILED.
        Long fineractTxnId;
        try {
            fineractTxnId = fineractClient.createWithdrawal(
                request.getAccountId(),
                request.getAmount(),
                paymentTypeId,
                transactionId
            );
        } catch (Exception e) {
            log.error("Fineract withdrawal rejected: {}", e.getMessage());
            markTransactionFailed(transactionId);
            paymentMetrics.incrementTransaction(request.getProvider(), PaymentResponse.TransactionType.WITHDRAWAL, PaymentStatus.FAILED);
            throw new PaymentException("Withdrawal rejected: " + e.getMessage(), e);
        }

        // Call the payment provider to disburse funds
        PaymentResponse response;
        try {
            response = switch (request.getProvider()) {
                case MTN_MOMO -> initiateMtnWithdrawal(transactionId, request);
                case ORANGE_MONEY -> initiateOrangeWithdrawal(transactionId, request);
                case CINETPAY -> initiateCinetPayWithdrawal(transactionId, request);
                default -> throw new PaymentException("Unsupported payment provider for withdrawals: " + request.getProvider());
            };
            response.setFineractTransactionId(fineractTxnId);
        } catch (Exception e) {
            log.error("Withdrawal to provider failed, reversing Fineract transaction: {}", e.getMessage());
            try {
                fineractClient.createDeposit(
                    request.getAccountId(),
                    request.getAmount(),
                    paymentTypeId,
                    "REVERSAL-" + transactionId
                );
                log.info("Fineract withdrawal reversed successfully for transactionId={}", transactionId);
            } catch (Exception revEx) {
                log.error("CRITICAL: Failed to reverse Fineract withdrawal. Manual intervention required! transactionId={}, error={}",
                    transactionId, revEx.getMessage());
                try {
                    String reason = revEx.getMessage();
                    if (reason != null && reason.length() > 500) reason = reason.substring(0, 500);
                    deadLetterRepository.save(new ReversalDeadLetter(
                        transactionId, fineractTxnId, request.getAccountId(),
                        request.getAmount(), "XAF", request.getProvider(), reason
                    ));
                } catch (Exception dlqEx) {
                    log.error("CRITICAL: Failed to persist reversal to dead-letter queue! transactionId={}",
                        transactionId, dlqEx);
                }
            }
            markTransactionFailed(transactionId);
            paymentMetrics.incrementTransaction(request.getProvider(), PaymentResponse.TransactionType.WITHDRAWAL, PaymentStatus.FAILED);
            throw e;
        }

        // Update the reserved record with provider reference, fineractTxnId, and PROCESSING status
        updateWithdrawalTransaction(transactionId, response.getProviderReference(), fineractTxnId, underlyingProvider);

        paymentMetrics.incrementTransaction(request.getProvider(), PaymentResponse.TransactionType.WITHDRAWAL, PaymentStatus.PROCESSING);
        paymentMetrics.recordPaymentAmount(request.getProvider(), PaymentResponse.TransactionType.WITHDRAWAL, request.getAmount());
        paymentMetrics.stopProcessingTimer(timerSample, request.getProvider(), PaymentResponse.TransactionType.WITHDRAWAL, PaymentStatus.PROCESSING);

        return response;
    }

    /**
     * Handle MTN callback for collections (deposits).
     */
    @Retryable(retryFor = {PessimisticLockingFailureException.class, CannotAcquireLockException.class},
               maxAttempts = 3, backoff = @Backoff(delay = 100, multiplier = 2))
    @Transactional
    public void handleMtnCollectionCallback(MtnCallbackRequest callback) {
        log.info("Processing MTN collection callback: ref={}, status={}",
            callback.getReferenceId(), callback.getStatus());

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

        // Fix #6: Verify callback amount matches expected amount
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

    /**
     * Handle MTN callback for disbursements (withdrawals).
     */
    @Retryable(retryFor = {PessimisticLockingFailureException.class, CannotAcquireLockException.class},
               maxAttempts = 3, backoff = @Backoff(delay = 100, multiplier = 2))
    @Transactional
    public void handleMtnDisbursementCallback(MtnCallbackRequest callback) {
        log.info("Processing MTN disbursement callback: ref={}, status={}",
            callback.getReferenceId(), callback.getStatus());

        if (callback.getExternalId() == null || callback.getStatus() == null) {
            log.warn("MTN disbursement callback missing required fields: externalId={}, status={}",
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
            return;
        }

        if (callback.isSuccessful()) {
            txn.setStatus(PaymentStatus.SUCCESSFUL);
            transactionRepository.save(txn);

            paymentMetrics.incrementCallbackReceived(PaymentProvider.MTN_MOMO, PaymentStatus.SUCCESSFUL);
            paymentMetrics.recordPaymentAmountTotal(PaymentProvider.MTN_MOMO, PaymentResponse.TransactionType.WITHDRAWAL, txn.getAmount());
            log.info("Withdrawal completed: txnId={}", txn.getTransactionId());

        } else if (callback.isFailed()) {
            log.warn("MTN withdrawal failed: txnId={}, reason={}. Reversing Fineract transaction...",
                txn.getTransactionId(), callback.getReason());
            reversalService.reverseWithdrawal(txn);
            txn.setStatus(PaymentStatus.FAILED);
            transactionRepository.save(txn);

            paymentMetrics.incrementCallbackReceived(PaymentProvider.MTN_MOMO, PaymentStatus.FAILED);
        }
    }

    /**
     * Handle Orange Money callback.
     * Fix #1: Validates notif_token from the callback against the stored token.
     */
    @Retryable(retryFor = {PessimisticLockingFailureException.class, CannotAcquireLockException.class},
               maxAttempts = 3, backoff = @Backoff(delay = 100, multiplier = 2))
    @Transactional
    public void handleOrangeCallback(OrangeCallbackRequest callback) {
        log.info("Processing Orange callback: orderId={}, status={}",
            callback.getOrderId(), callback.getStatus());

        if (callback.getOrderId() == null || callback.getStatus() == null) {
            log.warn("Orange callback missing required fields: orderId={}, status={}",
                callback.getOrderId(), callback.getStatus());
            paymentMetrics.incrementCallbackRejected(PaymentProvider.ORANGE_MONEY, "missing_fields");
            return;
        }

        PaymentTransaction txn = transactionRepository.findByIdForUpdate(callback.getOrderId())
            .orElse(null);

        if (txn == null) {
            log.warn("Transaction not found for Orange callback: {}", callback.getOrderId());
            return;
        }

        // Fix #1: Validate Orange notif_token to authenticate the callback
        if (txn.getNotifToken() != null && !txn.getNotifToken().isEmpty()) {
            if (callback.getNotifToken() == null || !txn.getNotifToken().equals(callback.getNotifToken())) {
                log.warn("Orange callback notif_token mismatch for txnId={}: expected={}, received={}",
                    txn.getTransactionId(), txn.getNotifToken(), callback.getNotifToken());
                paymentMetrics.incrementCallbackRejected(PaymentProvider.ORANGE_MONEY, "invalid_notif_token");
                return;
            }
        } else {
            log.warn("No notif_token stored for Orange transaction {}. Accepting callback without token validation.",
                txn.getTransactionId());
        }

        if (txn.getStatus() == PaymentStatus.SUCCESSFUL || txn.getStatus() == PaymentStatus.FAILED) {
            return;
        }

        if (txn.getType() == PaymentResponse.TransactionType.DEPOSIT) {
            if (callback.isSuccessful()) {
                // Fix #6: Verify callback amount
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
        } else {
            // Withdrawal
            if (callback.isSuccessful()) {
                txn.setStatus(PaymentStatus.SUCCESSFUL);
                transactionRepository.save(txn);

                paymentMetrics.incrementCallbackReceived(PaymentProvider.ORANGE_MONEY, PaymentStatus.SUCCESSFUL);
                paymentMetrics.recordPaymentAmountTotal(PaymentProvider.ORANGE_MONEY, PaymentResponse.TransactionType.WITHDRAWAL, txn.getAmount());
            } else {
                log.warn("Orange withdrawal failed: txnId={}. Reversing Fineract transaction...",
                    txn.getTransactionId());
                reversalService.reverseWithdrawal(txn);
                txn.setStatus(PaymentStatus.FAILED);
                transactionRepository.save(txn);
                paymentMetrics.incrementCallbackReceived(PaymentProvider.ORANGE_MONEY, PaymentStatus.FAILED);
            }
        }
    }

    /**
     * Handle CinetPay callback with dynamic GL mapping.
     */
    @Retryable(retryFor = {PessimisticLockingFailureException.class, CannotAcquireLockException.class},
               maxAttempts = 3, backoff = @Backoff(delay = 100, multiplier = 2))
    @Transactional
    public void handleCinetPayCallback(CinetPayCallbackRequest callback) {
        log.info("Processing CinetPay callback: transactionId={}, status={}, paymentMethod={}",
            callback.getTransactionId(), callback.getResultCode(), callback.getPaymentMethod());

        if (callback.getTransactionId() == null) {
            log.warn("CinetPay callback missing transactionId");
            paymentMetrics.incrementCallbackRejected(PaymentProvider.CINETPAY, "missing_fields");
            return;
        }

        if (!cinetPayClient.validateCallbackSignature(callback)) {
            log.warn("CinetPay callback signature validation failed: transactionId={}",
                callback.getTransactionId());
            paymentMetrics.incrementCallbackRejected(PaymentProvider.CINETPAY, "invalid_signature");
            return;
        }

        PaymentTransaction txn = transactionRepository.findByIdForUpdate(callback.getTransactionId())
            .orElse(null);

        if (txn == null) {
            log.warn("Transaction not found for CinetPay callback: {}", callback.getTransactionId());
            return;
        }

        if (txn.getStatus() == PaymentStatus.SUCCESSFUL || txn.getStatus() == PaymentStatus.FAILED) {
            return;
        }

        if (txn.getType() == PaymentResponse.TransactionType.DEPOSIT) {
            handleCinetPayDepositCallback(callback, txn);
        } else {
            handleCinetPayWithdrawalCallback(callback, txn);
        }
    }

    private void handleCinetPayDepositCallback(CinetPayCallbackRequest callback, PaymentTransaction txn) {
        if (callback.isSuccessful()) {
            // Fix #6: Verify callback amount
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

    private void handleCinetPayWithdrawalCallback(CinetPayCallbackRequest callback, PaymentTransaction txn) {
        if (callback.isSuccessful()) {
            txn.setStatus(PaymentStatus.SUCCESSFUL);
            transactionRepository.save(txn);

            paymentMetrics.incrementCallbackReceived(PaymentProvider.CINETPAY, PaymentStatus.SUCCESSFUL);
            paymentMetrics.recordPaymentAmountTotal(PaymentProvider.CINETPAY, PaymentResponse.TransactionType.WITHDRAWAL, txn.getAmount());
            log.info("CinetPay withdrawal completed: txnId={}", txn.getTransactionId());

        } else if (callback.isFailed() || callback.isCancelled()) {
            log.warn("CinetPay withdrawal failed: txnId={}, reason={}. Reversing Fineract transaction...",
                txn.getTransactionId(), callback.getErrorMessage());
            reversalService.reverseWithdrawal(txn);
            txn.setStatus(PaymentStatus.FAILED);
            transactionRepository.save(txn);

            paymentMetrics.incrementCallbackReceived(PaymentProvider.CINETPAY, PaymentStatus.FAILED);
        }
    }

    /**
     * Get transaction status.
     */
    public TransactionStatusResponse getTransactionStatus(String transactionId) {
        PaymentTransaction txn = transactionRepository.findById(transactionId)
            .orElseThrow(() -> new PaymentException("Transaction not found: " + transactionId));

        return TransactionStatusResponse.builder()
            .transactionId(txn.getTransactionId())
            .providerReference(txn.getProviderReference())
            .provider(txn.getProvider())
            .type(txn.getType())
            .amount(txn.getAmount())
            .currency(txn.getCurrency())
            .status(txn.getStatus())
            .createdAt(txn.getCreatedAt())
            .updatedAt(txn.getUpdatedAt())
            .fineractTransactionId(txn.getFineractTransactionId())
            .externalId(txn.getExternalId())
            .accountId(txn.getAccountId())
            .build();
    }

    // ==================== Private helpers ====================

    /**
     * Fix #10: Safely extract available balance from Fineract account response.
     */
    private BigDecimal extractAvailableBalance(Map<String, Object> account) {
        try {
            if (account.containsKey("summary")) {
                Object summaryObj = account.get("summary");
                if (summaryObj instanceof Map) {
                    @SuppressWarnings("unchecked")
                    Map<String, Object> summary = (Map<String, Object>) summaryObj;
                    Object balance = summary.get("availableBalance");
                    if (balance != null) {
                        return new BigDecimal(String.valueOf(balance));
                    }
                }
            }
            if (account.containsKey("availableBalance")) {
                Object balance = account.get("availableBalance");
                if (balance != null) {
                    return new BigDecimal(String.valueOf(balance));
                }
            }
        } catch (NumberFormatException e) {
            log.error("Failed to parse availableBalance from Fineract response: {}", e.getMessage());
        }
        log.error("Could not find availableBalance. Account response keys: {}", account.keySet());
        throw new PaymentException("Could not determine account balance");
    }

    /**
     * Fix #6: Verify callback-reported amount matches expected transaction amount.
     * Logs a warning and increments a metric if there's a mismatch, but does not block processing
     * (the mismatch may be due to provider formatting differences like decimal precision).
     */
    private void verifyCallbackAmount(String callbackAmountStr, PaymentTransaction txn, PaymentProvider provider) {
        if (callbackAmountStr == null || callbackAmountStr.isEmpty()) {
            return; // Some callbacks don't include amount
        }
        try {
            BigDecimal callbackAmount = new BigDecimal(callbackAmountStr);
            if (callbackAmount.compareTo(txn.getAmount()) != 0) {
                log.error("AMOUNT MISMATCH: txnId={}, expected={}, provider_reported={}, provider={}",
                    txn.getTransactionId(), txn.getAmount(), callbackAmount, provider);
                paymentMetrics.incrementCallbackAmountMismatch(provider);
            }
        } catch (NumberFormatException e) {
            log.warn("Could not parse callback amount '{}' for txnId={}", callbackAmountStr, txn.getTransactionId());
        }
    }

    /**
     * Fix #14: Enforce daily transaction limits.
     */
    private void enforceDailyLimit(String externalId, PaymentResponse.TransactionType type,
                                   BigDecimal requestAmount, BigDecimal maxDaily) {
        Instant dayStart = LocalDate.now(ZoneOffset.UTC).atStartOfDay().toInstant(ZoneOffset.UTC);
        Instant dayEnd = dayStart.plusSeconds(86400);

        BigDecimal todayTotal = transactionRepository.sumAmountByExternalIdAndTypeInPeriod(
            externalId, type, dayStart, dayEnd);

        if (todayTotal.add(requestAmount).compareTo(maxDaily) > 0) {
            paymentMetrics.incrementDailyLimitExceeded();
            throw new PaymentException(
                String.format("Daily %s limit exceeded. Today's total: %s XAF, requested: %s XAF, max: %s XAF",
                    type.name().toLowerCase(), todayTotal, requestAmount, maxDaily),
                "DAILY_LIMIT_EXCEEDED");
        }
    }

    /**
     * Mark a reserved transaction as FAILED (used when provider call fails after DB reservation).
     */
    @Transactional
    void markTransactionFailed(String transactionId) {
        transactionRepository.findById(transactionId).ifPresent(txn -> {
            txn.setStatus(PaymentStatus.FAILED);
            transactionRepository.save(txn);
        });
    }

    /**
     * Update a reserved deposit transaction with the provider reference after successful provider call.
     * Fix #1: Also stores Orange notifToken for callback verification.
     */
    @Transactional
    void updateTransactionAfterProviderCall(String transactionId, String providerReference, String notifToken) {
        transactionRepository.findById(transactionId).ifPresent(txn -> {
            txn.setProviderReference(providerReference);
            if (notifToken != null) {
                txn.setNotifToken(notifToken);
            }
            transactionRepository.save(txn);
        });
    }

    /**
     * Update a reserved withdrawal transaction after successful provider call.
     * Fix #4: Stores underlying provider hint in notifToken for CinetPay GL mapping.
     */
    @Transactional
    void updateWithdrawalTransaction(String transactionId, String providerReference,
                                     Long fineractTxnId, String underlyingProvider) {
        transactionRepository.findById(transactionId).ifPresent(txn -> {
            txn.setProviderReference(providerReference);
            txn.setFineractTransactionId(fineractTxnId);
            txn.setStatus(PaymentStatus.PROCESSING);
            // For CinetPay, store the underlying provider name for correct GL mapping on reversals
            if (underlyingProvider != null) {
                txn.setNotifToken(underlyingProvider);
            }
            transactionRepository.save(txn);
        });
    }

    private PaymentResponse initiateMtnDeposit(String transactionId, DepositRequest request) {
        String externalId = mtnClient.requestToPay(
            transactionId,
            request.getAmount(),
            request.getPhoneNumber(),
            "Deposit to Webank account"
        );

        return PaymentResponse.builder()
            .transactionId(transactionId)
            .providerReference(externalId)
            .provider(PaymentProvider.MTN_MOMO)
            .type(PaymentResponse.TransactionType.DEPOSIT)
            .amount(request.getAmount())
            .currency(mtnConfig.getCurrency())
            .status(PaymentStatus.PENDING)
            .message("Please approve the payment on your phone")
            .createdAt(Instant.now())
            .build();
    }

    /**
     * Fix #1: Store notifToken from Orange response for callback verification.
     */
    private PaymentResponse initiateOrangeDeposit(String transactionId, DepositRequest request) {
        OrangeMoneyClient.PaymentInitResponse initResponse = orangeClient.initializePayment(
            transactionId,
            request.getAmount(),
            "Deposit to Webank account"
        );

        // Store notifToken for callback verification
        if (initResponse.notifToken() != null) {
            updateTransactionAfterProviderCall(transactionId, initResponse.payToken(), initResponse.notifToken());
        }

        return PaymentResponse.builder()
            .transactionId(transactionId)
            .providerReference(initResponse.payToken())
            .provider(PaymentProvider.ORANGE_MONEY)
            .type(PaymentResponse.TransactionType.DEPOSIT)
            .amount(request.getAmount())
            .currency(orangeConfig.getCurrency())
            .status(PaymentStatus.PENDING)
            .message("Complete payment using the link below")
            .paymentUrl(initResponse.paymentUrl())
            .createdAt(Instant.now())
            .build();
    }

    private PaymentResponse initiateMtnWithdrawal(String transactionId, WithdrawalRequest request) {
        String externalId = mtnClient.transfer(
            transactionId,
            request.getAmount(),
            request.getPhoneNumber(),
            "Withdrawal from Webank account"
        );

        return PaymentResponse.builder()
            .transactionId(transactionId)
            .providerReference(externalId)
            .provider(PaymentProvider.MTN_MOMO)
            .type(PaymentResponse.TransactionType.WITHDRAWAL)
            .amount(request.getAmount())
            .currency(mtnConfig.getCurrency())
            .status(PaymentStatus.PROCESSING)
            .message("Withdrawal is being processed")
            .createdAt(Instant.now())
            .build();
    }

    private PaymentResponse initiateOrangeWithdrawal(String transactionId, WithdrawalRequest request) {
        String txnId = orangeClient.cashOut(
            transactionId,
            request.getAmount(),
            request.getPhoneNumber()
        );

        return PaymentResponse.builder()
            .transactionId(transactionId)
            .providerReference(txnId)
            .provider(PaymentProvider.ORANGE_MONEY)
            .type(PaymentResponse.TransactionType.WITHDRAWAL)
            .amount(request.getAmount())
            .currency(orangeConfig.getCurrency())
            .status(PaymentStatus.PROCESSING)
            .message("Withdrawal is being processed")
            .createdAt(Instant.now())
            .build();
    }

    private PaymentResponse initiateCinetPayDeposit(String transactionId, DepositRequest request) {
        CinetPayClient.PaymentInitResponse initResponse = cinetPayClient.initializePayment(
            transactionId,
            request.getAmount(),
            "Deposit to Webank account",
            request.getPhoneNumber()
        );

        return PaymentResponse.builder()
            .transactionId(transactionId)
            .providerReference(initResponse.paymentToken())
            .provider(PaymentProvider.CINETPAY)
            .type(PaymentResponse.TransactionType.DEPOSIT)
            .amount(request.getAmount())
            .currency(cinetPayConfig.getCurrency())
            .status(PaymentStatus.PENDING)
            .message("Complete payment using the link below")
            .paymentUrl(initResponse.paymentUrl())
            .createdAt(Instant.now())
            .build();
    }

    private PaymentResponse initiateCinetPayWithdrawal(String transactionId, WithdrawalRequest request) {
        String normalizedPhone = PhoneNumberUtils.normalizePhoneNumber(request.getPhoneNumber());
        String prefix = "237";
        String phone = normalizedPhone;
        if (normalizedPhone.startsWith("237")) {
            phone = normalizedPhone.substring(3);
        }

        String transferId = cinetPayClient.initiateTransfer(
            transactionId,
            request.getAmount(),
            phone,
            prefix
        );

        return PaymentResponse.builder()
            .transactionId(transactionId)
            .providerReference(transferId)
            .provider(PaymentProvider.CINETPAY)
            .type(PaymentResponse.TransactionType.WITHDRAWAL)
            .amount(request.getAmount())
            .currency(cinetPayConfig.getCurrency())
            .status(PaymentStatus.PROCESSING)
            .message("Withdrawal is being processed")
            .createdAt(Instant.now())
            .build();
    }

    private String getProviderCurrency(PaymentProvider provider) {
        return switch (provider) {
            case MTN_MOMO -> mtnConfig.getCurrency();
            case ORANGE_MONEY -> orangeConfig.getCurrency();
            case CINETPAY -> cinetPayConfig.getCurrency();
            default -> "XAF";
        };
    }

    /**
     * Fix #4: For CinetPay, detect underlying provider from phone number for correct GL mapping.
     */
    private Long getPaymentTypeId(PaymentProvider provider, String phoneNumber) {
        return switch (provider) {
            case MTN_MOMO -> mtnConfig.getFineractPaymentTypeId();
            case ORANGE_MONEY -> orangeConfig.getFineractPaymentTypeId();
            case CINETPAY -> {
                if (phoneNumber != null) {
                    PaymentProvider detected = PhoneNumberUtils.detectProvider(phoneNumber);
                    if (detected == PaymentProvider.ORANGE_MONEY) {
                        yield orangeConfig.getFineractPaymentTypeId();
                    }
                }
                // Default to MTN for CinetPay if provider cannot be detected
                yield mtnConfig.getFineractPaymentTypeId();
            }
            default -> throw new PaymentException("Unknown payment type for provider: " + provider);
        };
    }

    private void validateIdempotencyKey(String idempotencyKey) {
        try {
            UUID.fromString(idempotencyKey);
        } catch (IllegalArgumentException e) {
            throw new PaymentException("X-Idempotency-Key must be a valid UUID");
        }
    }

    private PaymentResponse mapToResponse(PaymentTransaction txn) {
        return PaymentResponse.builder()
            .transactionId(txn.getTransactionId())
            .providerReference(txn.getProviderReference())
            .provider(txn.getProvider())
            .type(txn.getType())
            .amount(txn.getAmount())
            .currency(txn.getCurrency())
            .status(txn.getStatus())
            .createdAt(txn.getCreatedAt())
            .fineractTransactionId(txn.getFineractTransactionId())
            .build();
    }
}
