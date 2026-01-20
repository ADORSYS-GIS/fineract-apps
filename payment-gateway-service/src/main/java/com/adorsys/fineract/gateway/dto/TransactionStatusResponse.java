package com.adorsys.fineract.gateway.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * Response for transaction status inquiry.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionStatusResponse {

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
     * Transaction type
     */
    private PaymentResponse.TransactionType type;

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
     * Timestamp of transaction initiation
     */
    private Instant createdAt;

    /**
     * Timestamp of last status update
     */
    private Instant updatedAt;

    /**
     * Timestamp of completion (if successful)
     */
    private Instant completedAt;

    /**
     * Fineract transaction ID (set after successful completion)
     */
    private Long fineractTransactionId;

    /**
     * Customer's external ID
     */
    private String externalId;

    /**
     * Fineract savings account ID
     */
    private Long accountId;
}
