package com.adorsys.fineract.gateway.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * Request to initiate a withdrawal to mobile money or bank account.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WithdrawalRequest {

    /**
     * Customer's Fineract external ID (from Keycloak token)
     */
    @NotBlank(message = "External ID is required")
    private String externalId;

    /**
     * Fineract savings account ID
     */
    @NotNull(message = "Account ID is required")
    private Long accountId;

    /**
     * Amount to withdraw
     */
    @NotNull(message = "Amount is required")
    @DecimalMin(value = "100", message = "Minimum withdrawal is 100 XAF")
    private BigDecimal amount;

    /**
     * Payment provider to use
     */
    @NotNull(message = "Payment provider is required")
    private PaymentProvider provider;

    /**
     * Destination phone number (for mobile money)
     */
    private String phoneNumber;

    /**
     * Destination bank account number (for bank transfers)
     */
    private String bankAccountNumber;

    /**
     * Account holder name (for bank transfers)
     */
    private String accountHolderName;

    /**
     * Optional reference/note for the transaction
     */
    private String reference;

    /**
     * Step-up authentication token (from WebAuthn verification)
     */
    private String stepUpToken;
}
