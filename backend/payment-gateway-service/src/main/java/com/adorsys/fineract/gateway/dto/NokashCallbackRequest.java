package com.adorsys.fineract.gateway.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Callback payload from NOKASH API.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NokashCallbackRequest {

    /**
     * Our transaction ID
     */
    @JsonProperty("order_id")
    private String orderId;

    /**
     * Transaction status: SUCCESS, FAILED, PENDING
     */
    @JsonProperty("status")
    private String status;

    /**
     * Transaction amount
     */
    @JsonProperty("amount")
    private String amount;

    /**
     * NOKASH transaction reference
     */
    @JsonProperty("reference")
    private String reference;

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

    public boolean isSuccessful() {
        return "SUCCESS".equalsIgnoreCase(status);
    }

    public boolean isFailed() {
        return "FAILED".equalsIgnoreCase(status) || "CANCELLED".equalsIgnoreCase(status);
    }
}
