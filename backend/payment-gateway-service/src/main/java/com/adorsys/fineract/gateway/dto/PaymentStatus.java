package com.adorsys.fineract.gateway.dto;

/**
 * Payment transaction status.
 */
public enum PaymentStatus {
    /**
     * Payment request initiated, waiting for provider
     */
    PENDING,

    /**
     * Payment is being processed by provider
     */
    PROCESSING,

    /**
     * Payment completed successfully
     */
    SUCCESSFUL,

    /**
     * Payment failed
     */
    FAILED,

    /**
     * Payment was cancelled by user
     */
    CANCELLED,

    /**
     * Payment expired (timeout)
     */
    EXPIRED,

    /**
     * Payment was refunded
     */
    REFUNDED
}
