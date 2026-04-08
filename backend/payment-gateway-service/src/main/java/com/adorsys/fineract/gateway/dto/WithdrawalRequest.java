package com.adorsys.fineract.gateway.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * Request to initiate a withdrawal to mobile money or bank account.
 */
@Data
@Builder(toBuilder = true)
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
    @Positive(message = "Account ID must be positive")
    private Long accountId;

    /**
     * Amount to withdraw (in XAF)
     */
    @NotNull(message = "Amount is required")
    @DecimalMin(value = "100", message = "Minimum withdrawal is 100 XAF")
    @DecimalMax(value = "5000000", message = "Maximum withdrawal is 5,000,000 XAF")
    private BigDecimal amount;

    /**
     * Payment provider to use
     */
    @NotNull(message = "Payment provider is required")
    private PaymentProvider provider;

    /**
     * Destination phone number (for mobile money)
     */
    @Pattern(regexp = "^\\+?237[0-9]{9}$|^[0-9]{9}$", message = "Invalid Cameroon phone number")
    private String phoneNumber;

    /**
     * Destination bank account number (for bank transfers)
     */
    @Size(max = 30, message = "Bank account number cannot exceed 30 characters")
    @Pattern(regexp = "^[A-Z0-9]*$", message = "Bank account number can only contain uppercase letters and numbers")
    private String bankAccountNumber;

    /**
     * Account holder name (for bank transfers)
     */
    @Size(max = 100, message = "Account holder name cannot exceed 100 characters")
    @Pattern(regexp = "^[A-Za-z\\s'-]*$", message = "Account holder name contains invalid characters")
    private String accountHolderName;

    /**
     * Optional reference/note for the transaction
     */
    @Size(max = 100, message = "Reference cannot exceed 100 characters")
    private String reference;

}
