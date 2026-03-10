package com.adorsys.fineract.gateway.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Callback payload from CinetPay API.
 *
 * CinetPay is a payment gateway - the actual payment method (MTN MoMo, Orange Money)
 * is determined by the customer at checkout and returned in cpm_payment_method.
 *
 * Documentation: https://docs.cinetpay.com/api/1.0-en/checkout/notification
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CinetPayCallbackRequest {

    /**
     * CinetPay site ID
     */
    @JsonProperty("cpm_site_id")
    private String siteId;

    /**
     * Our transaction ID (sent as transaction_id in the request)
     */
    @JsonProperty("cpm_trans_id")
    private String transactionId;

    public String getTransactionId() {
        if (transactionId != null) return transactionId;
        return clientTransactionId;
    }

    /**
     * Transaction date
     */
    @JsonProperty("cpm_trans_date")
    private String transactionDate;

    /**
     * Transaction amount
     */
    @JsonProperty("cpm_amount")
    private String amount;

    /**
     * Currency code
     */
    @JsonProperty("cpm_currency")
    private String currency;

    /**
     * Payment method used by customer.
     * Values: "MOMO" (MTN), "OM" (Orange Money), "FLOOZ", "VISA", "MASTERCARD", etc.
     */
    @JsonProperty("cpm_payment_method")
    private String paymentMethod;

    /**
     * Customer's phone number (MSISDN)
     */
    @JsonProperty("cpm_phone_prefixe")
    private String phonePrefix;

    @JsonProperty("cpm_cell_phone_num")
    private String phoneNumber;

    /**
     * Transaction status code
     * "00" = SUCCESS
     * "600" = PAYMENT_FAILED
     * "602" = INSUFFICIENT_BALANCE
     * "627" = CANCELLED
     */
    @JsonProperty("cpm_result")
    private String resultCode;

    /**
     * Error message (if failed)
     */
    @JsonProperty("cpm_error_message")
    private String errorMessage;

    /**
     * Payment operator transaction ID
     */
    @JsonProperty("cpm_payid")
    private String paymentId;

    /**
     * Custom data (we can use for reference)
     */
    @JsonProperty("cpm_custom")
    private String customData;

    @JsonProperty("cpm_language")
    private String language;

    @JsonProperty("cpm_version")
    private String version;

    @JsonProperty("cpm_payment_config")
    private String paymentConfig;

    @JsonProperty("cpm_page_action")
    private String pageAction;

    @JsonProperty("cpm_designation")
    private String designation;

    // --- Transfer Specific Fields ---
    @JsonProperty("client_transaction_id")
    private String clientTransactionId;

    @JsonProperty("treatment_status")
    private String treatmentStatus;

    @JsonProperty("sending_status")
    private String sendingStatus;

    @JsonProperty("receiver")
    private String receiver;

    @JsonProperty("operator_transaction_id")
    private String operatorTransactionId;

    /**
     * Callback signature for verification
     */
    @JsonProperty("signature")
    private String signature;

    /**
     * HMAC token from header (x-token)
     */
    private String xToken;

    /**
     * Check if the transaction was successful.
     */
    public boolean isSuccessful() {
        if (treatmentStatus != null) {
            return "VAL".equals(treatmentStatus); // Validated
        }
        return "00".equals(resultCode);
    }

    /**
     * Check if the transaction failed.
     */
    public boolean isFailed() {
        if (treatmentStatus != null) {
            return "REJ".equals(treatmentStatus); // Rejected (Assumption based on docs saying 'rejected')
        }
        return "600".equals(resultCode) || "602".equals(resultCode);
    }

    /**
     * Check if the transaction was cancelled.
     */
    public boolean isCancelled() {
        return "627".equals(resultCode);
    }

    /**
     * Map CinetPay payment method to our internal provider for GL account lookup.
     * This allows us to use existing MTN/Orange GL accounts instead of a separate CinetPay GL.
     *
     * @return The actual payment provider based on the payment method used
     */
    public PaymentProvider getActualProvider() {
        if (paymentMethod == null) {
            return null;
        }

        return switch (paymentMethod.toUpperCase()) {
            case "MOMO", "MTNCM" -> PaymentProvider.MTN_MOMO;      // MTN Mobile Money
            case "OM", "OMCM" -> PaymentProvider.ORANGE_MONEY;    // Orange Money
            // Add more mappings as CinetPay adds providers
            // case "FLOOZ" -> PaymentProvider.MOOV_MONEY;
            // case "VISA", "MASTERCARD" -> PaymentProvider.CARD;
            default -> null;  // Unknown - will be logged as warning
        };
    }

    /**
     * Get the full phone number with prefix.
     */
    public String getFullPhoneNumber() {
        if (phonePrefix != null && phoneNumber != null) {
            return phonePrefix + phoneNumber;
        }
        return phoneNumber;
    }
}
