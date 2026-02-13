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
import com.adorsys.fineract.gateway.exception.PaymentException;
import com.adorsys.fineract.gateway.metrics.PaymentMetrics;
import com.adorsys.fineract.gateway.repository.PaymentTransactionRepository;
import io.micrometer.core.instrument.Timer;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.CannotAcquireLockException;
import org.springframework.dao.PessimisticLockingFailureException;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

/**
 * Service for handling payment operations (deposits and withdrawals).
 *
 * Orchestrates communication between:
 * - Payment providers (MTN MoMo, Orange Money)
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

    /**
     * Initiate a deposit operation.
     */
    @Transactional
    public PaymentResponse initiateDeposit(DepositRequest request, String idempotencyKey) {
        log.info("Initiating deposit: externalId={}, amount={}, provider={}, idempotencyKey={}",
            request.getExternalId(), request.getAmount(), request.getProvider(), idempotencyKey);

        // Validate idempotency key format
        validateIdempotencyKey(idempotencyKey);

        // Idempotency check: Return existing transaction if already processed
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

        String transactionId = idempotencyKey;
        String currency = getProviderCurrency(request.getProvider());

        PaymentResponse response = switch (request.getProvider()) {
            case MTN_MOMO -> initiateMtnDeposit(transactionId, request);
            case ORANGE_MONEY -> initiateOrangeDeposit(transactionId, request);
            case CINETPAY -> initiateCinetPayDeposit(transactionId, request);
            default -> throw new PaymentException("Unsupported payment provider for deposits: " + request.getProvider());
        };

        // Save to database
        PaymentTransaction txn = new PaymentTransaction(
            transactionId,
            response.getProviderReference(),
            request.getExternalId(),
            request.getAccountId(),
            request.getProvider(),
            PaymentResponse.TransactionType.DEPOSIT,
            request.getAmount(),
            currency,
            PaymentStatus.PENDING
        );
        transactionRepository.save(txn);

        // Record metrics
        paymentMetrics.incrementTransaction(request.getProvider(), PaymentResponse.TransactionType.DEPOSIT, PaymentStatus.PENDING);
        paymentMetrics.recordPaymentAmount(request.getProvider(), PaymentResponse.TransactionType.DEPOSIT, request.getAmount());
        paymentMetrics.stopProcessingTimer(timerSample, request.getProvider(), PaymentResponse.TransactionType.DEPOSIT, PaymentStatus.PENDING);

        return response;
    }

    /**
     * Initiate a withdrawal operation.
     */
    @Transactional
    public PaymentResponse initiateWithdrawal(WithdrawalRequest request, String idempotencyKey) {
        log.info("Initiating withdrawal: externalId={}, amount={}, provider={}, idempotencyKey={}",
            request.getExternalId(), request.getAmount(), request.getProvider(), idempotencyKey);

        // Validate idempotency key format
        validateIdempotencyKey(idempotencyKey);

        // Idempotency check
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

        // Check available balance
        Map<String, Object> account = fineractClient.getSavingsAccount(request.getAccountId());
        BigDecimal availableBalance;
        
        // Fineract usually nests balance info in 'summary'
        if (account.containsKey("summary")) {
            Map<String, Object> summary = (Map<String, Object>) account.get("summary");
            availableBalance = new BigDecimal(String.valueOf(summary.get("availableBalance")));
        } else if (account.containsKey("availableBalance")) {
            availableBalance = new BigDecimal(String.valueOf(account.get("availableBalance")));
        } else {
            log.error("Could not find availableBalance. Account response: {}", account);
            throw new PaymentException("Could not determine account balance");
        }

        if (availableBalance.compareTo(request.getAmount()) < 0) {
            paymentMetrics.incrementInsufficientFunds();
            throw new PaymentException("Insufficient funds");
        }

        String transactionId = idempotencyKey;
        String currency = getProviderCurrency(request.getProvider());

        // For withdrawals, we first create the Fineract transaction, then send money
        Long paymentTypeId = getPaymentTypeId(request.getProvider());
        Long fineractTxnId = fineractClient.createWithdrawal(
            request.getAccountId(),
            request.getAmount(),
            paymentTypeId,
            transactionId
        );

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
                // Compensating transaction: Credit the money back
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
            }
            
            paymentMetrics.incrementTransaction(request.getProvider(), PaymentResponse.TransactionType.WITHDRAWAL, PaymentStatus.FAILED);
            throw e;
        }

        // Save to database
        PaymentTransaction txn = new PaymentTransaction(
            transactionId,
            response.getProviderReference(),
            request.getExternalId(),
            request.getAccountId(),
            request.getProvider(),
            PaymentResponse.TransactionType.WITHDRAWAL,
            request.getAmount(),
            currency,
            PaymentStatus.PROCESSING // Withdrawal starts as PROCESSING (money left account)
        );
        txn.setFineractTransactionId(fineractTxnId);
        transactionRepository.save(txn);

        // Record metrics
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

        // Idempotency: Skip if already in terminal state
        if (txn.getStatus() == PaymentStatus.SUCCESSFUL || txn.getStatus() == PaymentStatus.FAILED) {
            log.info("Transaction already in terminal state: {}, status={}",
                txn.getTransactionId(), txn.getStatus());
            return;
        }

        if (callback.isSuccessful()) {
            // Create Fineract deposit
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

        if (txn.getStatus() == PaymentStatus.SUCCESSFUL || txn.getStatus() == PaymentStatus.FAILED) {
            return;
        }

        if (txn.getType() == PaymentResponse.TransactionType.DEPOSIT) {
            if (callback.isSuccessful()) {
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

        // Validate callback signature
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
            // Dynamic GL mapping based on actual payment method used
            PaymentProvider actualProvider = callback.getActualProvider();
            Long paymentTypeId;

            if (actualProvider == PaymentProvider.MTN_MOMO) {
                paymentTypeId = mtnConfig.getFineractPaymentTypeId();
                log.info("CinetPay deposit via MTN MoMo: transactionId={}, paymentTypeId={}", txn.getTransactionId(), paymentTypeId);
            } else if (actualProvider == PaymentProvider.ORANGE_MONEY) {
                paymentTypeId = orangeConfig.getFineractPaymentTypeId();
                log.info("CinetPay deposit via Orange Money: transactionId={}, paymentTypeId={}", txn.getTransactionId(), paymentTypeId);
            } else {
                // Unknown payment method - cannot safely map GL account, mark FAILED
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

    private PaymentResponse initiateOrangeDeposit(String transactionId, DepositRequest request) {
        OrangeMoneyClient.PaymentInitResponse initResponse = orangeClient.initializePayment(
            transactionId,
            request.getAmount(),
            "Deposit to Webank account"
        );

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
        String normalizedPhone = com.adorsys.fineract.gateway.util.PhoneNumberUtils.normalizePhoneNumber(request.getPhoneNumber());
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

    private Long getPaymentTypeId(PaymentProvider provider) {
        return switch (provider) {
            case MTN_MOMO -> mtnConfig.getFineractPaymentTypeId();
            case ORANGE_MONEY -> orangeConfig.getFineractPaymentTypeId();
            // For CinetPay transfers, we default to MTN payment type
            // (actual routing depends on phone number prefix)
            case CINETPAY -> mtnConfig.getFineractPaymentTypeId();
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
