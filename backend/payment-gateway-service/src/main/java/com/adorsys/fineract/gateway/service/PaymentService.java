package com.adorsys.fineract.gateway.service;

import com.adorsys.fineract.gateway.client.CinetPayClient;
import com.adorsys.fineract.gateway.client.FineractClient;
import com.adorsys.fineract.gateway.client.MtnMomoClient;
import com.adorsys.fineract.gateway.client.OrangeMoneyClient;
import com.adorsys.fineract.gateway.config.CinetPayConfig;
import com.adorsys.fineract.gateway.config.MtnMomoConfig;
import com.adorsys.fineract.gateway.config.OrangeMoneyConfig;
import com.adorsys.fineract.gateway.dto.*;
import com.adorsys.fineract.gateway.exception.PaymentException;
import com.adorsys.fineract.gateway.metrics.PaymentMetrics;
import io.micrometer.core.instrument.Timer;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

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

    // In-memory transaction store (in production, use database)
    private final Map<String, TransactionRecord> transactions = new ConcurrentHashMap<>();

    /**
     * Initiate a deposit operation.
     */
    public PaymentResponse initiateDeposit(DepositRequest request) {
        log.info("Initiating deposit: externalId={}, amount={}, provider={}",
            request.getExternalId(), request.getAmount(), request.getProvider());

        Timer.Sample timerSample = paymentMetrics.startTimer();

        // Verify account ownership
        if (!fineractClient.verifyAccountOwnership(request.getExternalId(), request.getAccountId())) {
            throw new PaymentException("Account does not belong to the customer");
        }

        String transactionId = UUID.randomUUID().toString();
        String currency = "XAF";

        PaymentResponse response = switch (request.getProvider()) {
            case MTN_MOMO -> initiateMtnDeposit(transactionId, request);
            case ORANGE_MONEY -> initiateOrangeDeposit(transactionId, request);
            case CINETPAY -> initiateCinetPayDeposit(transactionId, request);
            default -> throw new PaymentException("Unsupported payment provider for deposits: " + request.getProvider());
        };

        // Store transaction record
        transactions.put(transactionId, new TransactionRecord(
            transactionId,
            response.getProviderReference(),
            request.getExternalId(),
            request.getAccountId(),
            request.getProvider(),
            PaymentResponse.TransactionType.DEPOSIT,
            request.getAmount(),
            currency,
            PaymentStatus.PENDING,
            Instant.now(),
            null,
            null
        ));

        // Record metrics
        paymentMetrics.incrementTransaction(request.getProvider(), PaymentResponse.TransactionType.DEPOSIT, PaymentStatus.PENDING);
        paymentMetrics.recordPaymentAmount(request.getProvider(), PaymentResponse.TransactionType.DEPOSIT, request.getAmount());
        paymentMetrics.stopProcessingTimer(timerSample, request.getProvider(), PaymentResponse.TransactionType.DEPOSIT, PaymentStatus.PENDING);

        return response;
    }

    /**
     * Initiate a withdrawal operation.
     */
    public PaymentResponse initiateWithdrawal(WithdrawalRequest request) {
        log.info("Initiating withdrawal: externalId={}, amount={}, provider={}",
            request.getExternalId(), request.getAmount(), request.getProvider());

        Timer.Sample timerSample = paymentMetrics.startTimer();

        // Verify account ownership
        if (!fineractClient.verifyAccountOwnership(request.getExternalId(), request.getAccountId())) {
            throw new PaymentException("Account does not belong to the customer");
        }

        // Check available balance
        Map<String, Object> account = fineractClient.getSavingsAccount(request.getAccountId());
        BigDecimal availableBalance = new BigDecimal(account.get("availableBalance").toString());
        if (availableBalance.compareTo(request.getAmount()) < 0) {
            paymentMetrics.incrementInsufficientFunds();
            throw new PaymentException("Insufficient funds");
        }

        String transactionId = UUID.randomUUID().toString();
        String currency = "XAF";

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
            // TODO: Reverse the Fineract transaction if provider call fails
            log.error("Withdrawal to provider failed, Fineract transaction may need reversal: {}", e.getMessage());
            paymentMetrics.incrementTransaction(request.getProvider(), PaymentResponse.TransactionType.WITHDRAWAL, PaymentStatus.FAILED);
            throw e;
        }

        // Store transaction record
        transactions.put(transactionId, new TransactionRecord(
            transactionId,
            response.getProviderReference(),
            request.getExternalId(),
            request.getAccountId(),
            request.getProvider(),
            PaymentResponse.TransactionType.WITHDRAWAL,
            request.getAmount(),
            currency,
            PaymentStatus.PROCESSING,
            Instant.now(),
            null,
            fineractTxnId
        ));

        // Record metrics
        paymentMetrics.incrementTransaction(request.getProvider(), PaymentResponse.TransactionType.WITHDRAWAL, PaymentStatus.PROCESSING);
        paymentMetrics.recordPaymentAmount(request.getProvider(), PaymentResponse.TransactionType.WITHDRAWAL, request.getAmount());
        paymentMetrics.stopProcessingTimer(timerSample, request.getProvider(), PaymentResponse.TransactionType.WITHDRAWAL, PaymentStatus.PROCESSING);

        return response;
    }

    /**
     * Handle MTN callback for collections (deposits).
     */
    public void handleMtnCollectionCallback(MtnCallbackRequest callback) {
        log.info("Processing MTN collection callback: ref={}, status={}",
            callback.getReferenceId(), callback.getStatus());

        TransactionRecord record = findTransactionByProviderRef(callback.getExternalId());
        if (record == null) {
            log.warn("Transaction not found for MTN callback: {}", callback.getExternalId());
            return;
        }

        if (callback.isSuccessful()) {
            // Create Fineract deposit
            Long fineractTxnId = fineractClient.createDeposit(
                record.accountId(),
                record.amount(),
                mtnConfig.getFineractPaymentTypeId(),
                callback.getFinancialTransactionId()
            );

            updateTransactionStatus(record.transactionId(), PaymentStatus.SUCCESSFUL, fineractTxnId);
            paymentMetrics.incrementCallbackReceived(PaymentProvider.MTN_MOMO, PaymentStatus.SUCCESSFUL);
            paymentMetrics.recordPaymentAmountTotal(PaymentProvider.MTN_MOMO, PaymentResponse.TransactionType.DEPOSIT, record.amount());
            log.info("Deposit completed: txnId={}, fineractTxnId={}", record.transactionId(), fineractTxnId);

        } else if (callback.isFailed()) {
            updateTransactionStatus(record.transactionId(), PaymentStatus.FAILED, null);
            paymentMetrics.incrementCallbackReceived(PaymentProvider.MTN_MOMO, PaymentStatus.FAILED);
            log.warn("Deposit failed: txnId={}, reason={}", record.transactionId(), callback.getReason());
        }
    }

    /**
     * Handle MTN callback for disbursements (withdrawals).
     */
    public void handleMtnDisbursementCallback(MtnCallbackRequest callback) {
        log.info("Processing MTN disbursement callback: ref={}, status={}",
            callback.getReferenceId(), callback.getStatus());

        TransactionRecord record = findTransactionByProviderRef(callback.getExternalId());
        if (record == null) {
            log.warn("Transaction not found for MTN callback: {}", callback.getExternalId());
            return;
        }

        if (callback.isSuccessful()) {
            updateTransactionStatus(record.transactionId(), PaymentStatus.SUCCESSFUL, record.fineractTransactionId());
            paymentMetrics.incrementCallbackReceived(PaymentProvider.MTN_MOMO, PaymentStatus.SUCCESSFUL);
            paymentMetrics.recordPaymentAmountTotal(PaymentProvider.MTN_MOMO, PaymentResponse.TransactionType.WITHDRAWAL, record.amount());
            log.info("Withdrawal completed: txnId={}", record.transactionId());

        } else if (callback.isFailed()) {
            // TODO: Reverse the Fineract withdrawal
            updateTransactionStatus(record.transactionId(), PaymentStatus.FAILED, record.fineractTransactionId());
            paymentMetrics.incrementCallbackReceived(PaymentProvider.MTN_MOMO, PaymentStatus.FAILED);
            log.warn("Withdrawal failed: txnId={}, reason={}", record.transactionId(), callback.getReason());
        }
    }

    /**
     * Handle Orange Money callback.
     */
    public void handleOrangeCallback(OrangeCallbackRequest callback) {
        log.info("Processing Orange callback: orderId={}, status={}",
            callback.getOrderId(), callback.getStatus());

        TransactionRecord record = transactions.get(callback.getOrderId());
        if (record == null) {
            log.warn("Transaction not found for Orange callback: {}", callback.getOrderId());
            return;
        }

        if (record.type() == PaymentResponse.TransactionType.DEPOSIT) {
            if (callback.isSuccessful()) {
                Long fineractTxnId = fineractClient.createDeposit(
                    record.accountId(),
                    record.amount(),
                    orangeConfig.getFineractPaymentTypeId(),
                    callback.getTransactionId()
                );
                updateTransactionStatus(record.transactionId(), PaymentStatus.SUCCESSFUL, fineractTxnId);
                paymentMetrics.incrementCallbackReceived(PaymentProvider.ORANGE_MONEY, PaymentStatus.SUCCESSFUL);
                paymentMetrics.recordPaymentAmountTotal(PaymentProvider.ORANGE_MONEY, PaymentResponse.TransactionType.DEPOSIT, record.amount());
            } else {
                updateTransactionStatus(record.transactionId(), PaymentStatus.FAILED, null);
                paymentMetrics.incrementCallbackReceived(PaymentProvider.ORANGE_MONEY, PaymentStatus.FAILED);
            }
        } else {
            // Withdrawal
            if (callback.isSuccessful()) {
                updateTransactionStatus(record.transactionId(), PaymentStatus.SUCCESSFUL, record.fineractTransactionId());
                paymentMetrics.incrementCallbackReceived(PaymentProvider.ORANGE_MONEY, PaymentStatus.SUCCESSFUL);
                paymentMetrics.recordPaymentAmountTotal(PaymentProvider.ORANGE_MONEY, PaymentResponse.TransactionType.WITHDRAWAL, record.amount());
            } else {
                // TODO: Reverse the Fineract withdrawal
                updateTransactionStatus(record.transactionId(), PaymentStatus.FAILED, record.fineractTransactionId());
                paymentMetrics.incrementCallbackReceived(PaymentProvider.ORANGE_MONEY, PaymentStatus.FAILED);
            }
        }
    }

    /**
     * Get transaction status.
     */
    public TransactionStatusResponse getTransactionStatus(String transactionId) {
        TransactionRecord record = transactions.get(transactionId);
        if (record == null) {
            throw new PaymentException("Transaction not found: " + transactionId);
        }

        return TransactionStatusResponse.builder()
            .transactionId(record.transactionId())
            .providerReference(record.providerReference())
            .provider(record.provider())
            .type(record.type())
            .amount(record.amount())
            .currency(record.currency())
            .status(record.status())
            .createdAt(record.createdAt())
            .updatedAt(record.updatedAt())
            .fineractTransactionId(record.fineractTransactionId())
            .externalId(record.externalId())
            .accountId(record.accountId())
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
            .currency("XAF")
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
            .currency("XAF")
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
            .currency("XAF")
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
            .currency("XAF")
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
            .currency("XAF")
            .status(PaymentStatus.PENDING)
            .message("Complete payment using the link below")
            .paymentUrl(initResponse.paymentUrl())
            .createdAt(Instant.now())
            .build();
    }

    private PaymentResponse initiateCinetPayWithdrawal(String transactionId, WithdrawalRequest request) {
        String normalizedPhone = cinetPayClient.normalizePhoneNumber(request.getPhoneNumber());
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
            .currency("XAF")
            .status(PaymentStatus.PROCESSING)
            .message("Withdrawal is being processed")
            .createdAt(Instant.now())
            .build();
    }

    /**
     * Handle CinetPay callback with dynamic GL mapping.
     * CinetPay is a gateway - actual payment method (MTN/Orange) determines GL account.
     */
    public void handleCinetPayCallback(CinetPayCallbackRequest callback) {
        log.info("Processing CinetPay callback: transactionId={}, status={}, paymentMethod={}",
            callback.getTransactionId(), callback.getResultCode(), callback.getPaymentMethod());

        // Validate callback signature
        if (!cinetPayClient.validateCallbackSignature(callback)) {
            log.warn("CinetPay callback signature validation failed: transactionId={}",
                callback.getTransactionId());
            return;
        }

        TransactionRecord record = transactions.get(callback.getTransactionId());
        if (record == null) {
            log.warn("Transaction not found for CinetPay callback: {}", callback.getTransactionId());
            return;
        }

        if (record.type() == PaymentResponse.TransactionType.DEPOSIT) {
            handleCinetPayDepositCallback(callback, record);
        } else {
            handleCinetPayWithdrawalCallback(callback, record);
        }
    }

    private void handleCinetPayDepositCallback(CinetPayCallbackRequest callback, TransactionRecord record) {
        if (callback.isSuccessful()) {
            // Dynamic GL mapping based on actual payment method used
            PaymentProvider actualProvider = callback.getActualProvider();
            Long paymentTypeId;

            if (actualProvider == PaymentProvider.MTN_MOMO) {
                paymentTypeId = mtnConfig.getFineractPaymentTypeId();
                log.info("CinetPay deposit via MTN MoMo: transactionId={}", record.transactionId());
            } else if (actualProvider == PaymentProvider.ORANGE_MONEY) {
                paymentTypeId = orangeConfig.getFineractPaymentTypeId();
                log.info("CinetPay deposit via Orange Money: transactionId={}", record.transactionId());
            } else {
                // Unknown payment method - log warning and use default (MTN)
                log.warn("Unknown CinetPay payment method: {}, defaulting to MTN",
                    callback.getPaymentMethod());
                paymentTypeId = mtnConfig.getFineractPaymentTypeId();
            }

            Long fineractTxnId = fineractClient.createDeposit(
                record.accountId(),
                record.amount(),
                paymentTypeId,
                callback.getPaymentId()
            );

            updateTransactionStatus(record.transactionId(), PaymentStatus.SUCCESSFUL, fineractTxnId);
            paymentMetrics.incrementCallbackReceived(PaymentProvider.CINETPAY, PaymentStatus.SUCCESSFUL);
            paymentMetrics.recordPaymentAmountTotal(PaymentProvider.CINETPAY, PaymentResponse.TransactionType.DEPOSIT, record.amount());
            log.info("CinetPay deposit completed: txnId={}, fineractTxnId={}", record.transactionId(), fineractTxnId);

        } else if (callback.isFailed() || callback.isCancelled()) {
            updateTransactionStatus(record.transactionId(), PaymentStatus.FAILED, null);
            paymentMetrics.incrementCallbackReceived(PaymentProvider.CINETPAY, PaymentStatus.FAILED);
            log.warn("CinetPay deposit failed: txnId={}, reason={}", record.transactionId(), callback.getErrorMessage());
        }
    }

    private void handleCinetPayWithdrawalCallback(CinetPayCallbackRequest callback, TransactionRecord record) {
        if (callback.isSuccessful()) {
            updateTransactionStatus(record.transactionId(), PaymentStatus.SUCCESSFUL, record.fineractTransactionId());
            paymentMetrics.incrementCallbackReceived(PaymentProvider.CINETPAY, PaymentStatus.SUCCESSFUL);
            paymentMetrics.recordPaymentAmountTotal(PaymentProvider.CINETPAY, PaymentResponse.TransactionType.WITHDRAWAL, record.amount());
            log.info("CinetPay withdrawal completed: txnId={}", record.transactionId());

        } else if (callback.isFailed() || callback.isCancelled()) {
            // TODO: Reverse the Fineract withdrawal
            updateTransactionStatus(record.transactionId(), PaymentStatus.FAILED, record.fineractTransactionId());
            paymentMetrics.incrementCallbackReceived(PaymentProvider.CINETPAY, PaymentStatus.FAILED);
            log.warn("CinetPay withdrawal failed: txnId={}, reason={}", record.transactionId(), callback.getErrorMessage());
        }
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

    private TransactionRecord findTransactionByProviderRef(String providerRef) {
        return transactions.values().stream()
            .filter(t -> providerRef.equals(t.providerReference()))
            .findFirst()
            .orElse(null);
    }

    private void updateTransactionStatus(String transactionId, PaymentStatus status, Long fineractTxnId) {
        TransactionRecord existing = transactions.get(transactionId);
        if (existing != null) {
            transactions.put(transactionId, new TransactionRecord(
                existing.transactionId(),
                existing.providerReference(),
                existing.externalId(),
                existing.accountId(),
                existing.provider(),
                existing.type(),
                existing.amount(),
                existing.currency(),
                status,
                existing.createdAt(),
                Instant.now(),
                fineractTxnId != null ? fineractTxnId : existing.fineractTransactionId()
            ));
        }
    }

    private record TransactionRecord(
        String transactionId,
        String providerReference,
        String externalId,
        Long accountId,
        PaymentProvider provider,
        PaymentResponse.TransactionType type,
        BigDecimal amount,
        String currency,
        PaymentStatus status,
        Instant createdAt,
        Instant updatedAt,
        Long fineractTransactionId
    ) {}
}
