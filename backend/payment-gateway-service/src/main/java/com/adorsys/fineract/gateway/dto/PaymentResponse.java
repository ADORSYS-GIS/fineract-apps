package com.adorsys.fineract.gateway.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * Response for a payment initiation request.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponse {

    /**
     * Internal transaction reference ID
     */
    private String transactionId;

    /**
     * External reference from payment provider
     */
    private String providerReference;

    /**
     * Payment provider used
     */
    private PaymentProvider provider;

    /**
     * Transaction type (DEPOSIT or WITHDRAWAL)
     */
    private TransactionType type;

    /**
     * Transaction amount
     */
    private BigDecimal amount;

    /**
     * Currency code
     */
    private String currency;

    /**
     * Current status
     */
    private PaymentStatus status;

    /**
     * Status message or error description
     */
    private String message;

    /**
     * Payment URL (for redirect-based flows)
     */
    private String paymentUrl;

    /**
     * USSD code to dial (for USSD-based flows)
     */
    private String ussdCode;

    /**
     * Timestamp of transaction initiation
     */
    private Instant createdAt;

    /**
     * Fineract transaction ID (set after successful completion)
     */
    private Long fineractTransactionId;

    public enum TransactionType {
        DEPOSIT,
        WITHDRAWAL
    }

    public static PaymentResponse pending(String transactionId, PaymentProvider provider,
                                          TransactionType type, BigDecimal amount, String currency) {
        return PaymentResponse.builder()
            .transactionId(transactionId)
            .provider(provider)
            .type(type)
            .amount(amount)
            .currency(currency)
            .status(PaymentStatus.PENDING)
            .createdAt(Instant.now())
            .build();
    }

    public static PaymentResponse failed(String transactionId, String message) {
        return PaymentResponse.builder()
            .transactionId(transactionId)
            .status(PaymentStatus.FAILED)
            .message(message)
            .createdAt(Instant.now())
            .build();
    }
}
