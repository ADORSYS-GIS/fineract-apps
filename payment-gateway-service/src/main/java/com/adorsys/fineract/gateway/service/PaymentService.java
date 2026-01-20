package com.adorsys.fineract.gateway.service;

import com.adorsys.fineract.gateway.client.FineractClient;
import com.adorsys.fineract.gateway.client.MtnMomoClient;
import com.adorsys.fineract.gateway.client.OrangeMoneyClient;
import com.adorsys.fineract.gateway.config.MtnMomoConfig;
import com.adorsys.fineract.gateway.config.OrangeMoneyConfig;
import com.adorsys.fineract.gateway.dto.*;
import com.adorsys.fineract.gateway.exception.PaymentException;
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
    private final FineractClient fineractClient;
    private final MtnMomoConfig mtnConfig;
    private final OrangeMoneyConfig orangeConfig;

    // In-memory transaction store (in production, use database)
    private final Map<String, TransactionRecord> transactions = new ConcurrentHashMap<>();

    /**
     * Initiate a deposit operation.
     */
    public PaymentResponse initiateDeposit(DepositRequest request) {
        log.info("Initiating deposit: externalId={}, amount={}, provider={}",
            request.getExternalId(), request.getAmount(), request.getProvider());

        // Verify account ownership
        if (!fineractClient.verifyAccountOwnership(request.getExternalId(), request.getAccountId())) {
            throw new PaymentException("Account does not belong to the customer");
        }

        String transactionId = UUID.randomUUID().toString();
        String currency = "XAF";

        PaymentResponse response = switch (request.getProvider()) {
            case MTN_MOMO -> initiateMtnDeposit(transactionId, request);
            case ORANGE_MONEY -> initiateOrangeDeposit(transactionId, request);
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

        return response;
    }

    /**
     * Initiate a withdrawal operation.
     */
    public PaymentResponse initiateWithdrawal(WithdrawalRequest request) {
        log.info("Initiating withdrawal: externalId={}, amount={}, provider={}",
            request.getExternalId(), request.getAmount(), request.getProvider());

        // Verify account ownership
        if (!fineractClient.verifyAccountOwnership(request.getExternalId(), request.getAccountId())) {
            throw new PaymentException("Account does not belong to the customer");
        }

        // Check available balance
        Map<String, Object> account = fineractClient.getSavingsAccount(request.getAccountId());
        BigDecimal availableBalance = new BigDecimal(account.get("availableBalance").toString());
        if (availableBalance.compareTo(request.getAmount()) < 0) {
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
                default -> throw new PaymentException("Unsupported payment provider for withdrawals: " + request.getProvider());
            };
            response.setFineractTransactionId(fineractTxnId);
        } catch (Exception e) {
            // TODO: Reverse the Fineract transaction if provider call fails
            log.error("Withdrawal to provider failed, Fineract transaction may need reversal: {}", e.getMessage());
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
            log.info("Deposit completed: txnId={}, fineractTxnId={}", record.transactionId(), fineractTxnId);

        } else if (callback.isFailed()) {
            updateTransactionStatus(record.transactionId(), PaymentStatus.FAILED, null);
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
            log.info("Withdrawal completed: txnId={}", record.transactionId());

        } else if (callback.isFailed()) {
            // TODO: Reverse the Fineract withdrawal
            updateTransactionStatus(record.transactionId(), PaymentStatus.FAILED, record.fineractTransactionId());
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
            } else {
                updateTransactionStatus(record.transactionId(), PaymentStatus.FAILED, null);
            }
        } else {
            // Withdrawal
            if (callback.isSuccessful()) {
                updateTransactionStatus(record.transactionId(), PaymentStatus.SUCCESSFUL, record.fineractTransactionId());
            } else {
                // TODO: Reverse the Fineract withdrawal
                updateTransactionStatus(record.transactionId(), PaymentStatus.FAILED, record.fineractTransactionId());
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

    private Long getPaymentTypeId(PaymentProvider provider) {
        return switch (provider) {
            case MTN_MOMO -> mtnConfig.getFineractPaymentTypeId();
            case ORANGE_MONEY -> orangeConfig.getFineractPaymentTypeId();
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
