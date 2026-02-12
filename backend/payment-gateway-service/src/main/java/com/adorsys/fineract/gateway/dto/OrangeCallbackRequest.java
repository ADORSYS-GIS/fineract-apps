package com.adorsys.fineract.gateway.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Callback payload from Orange Money API.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrangeCallbackRequest {

    /**
     * Merchant's order ID (our transaction ID)
     */
    @JsonProperty("order_id")
    private String orderId;

    /**
     * Orange Money transaction ID
     */
    @JsonProperty("txnid")
    private String transactionId;

    /**
     * Transaction status: SUCCESS, FAILED, CANCELLED, EXPIRED
     */
    @JsonProperty("status")
    private String status;

    /**
     * Transaction amount
     */
    @JsonProperty("amount")
    private String amount;

    /**
     * Currency code
     */
    @JsonProperty("currency")
    private String currency;

    /**
     * Payer's phone number (MSISDN)
     */
    @JsonProperty("pay_token")
    private String payToken;

    /**
     * Payment method used
     */
    @JsonProperty("payment_method")
    private String paymentMethod;

    /**
     * Error message (if failed)
     */
    @JsonProperty("message")
    private String message;

    /**
     * Notif token for verification
     */
    @JsonProperty("notif_token")
    private String notifToken;

    public boolean isSuccessful() {
        return "SUCCESS".equalsIgnoreCase(status);
    }

    public boolean isFailed() {
        return "FAILED".equalsIgnoreCase(status);
    }

    public boolean isCancelled() {
        return "CANCELLED".equalsIgnoreCase(status);
    }
}
