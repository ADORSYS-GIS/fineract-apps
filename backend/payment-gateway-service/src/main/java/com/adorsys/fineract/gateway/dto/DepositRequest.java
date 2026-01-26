package com.adorsys.fineract.gateway.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * Request to initiate a deposit via mobile money or bank transfer.
 */
@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
public class DepositRequest {

    /**
     * Customer's Fineract external ID (from Keycloak token)
     */
    @NotBlank(message = "External ID is required")
    @Size(min = 36, max = 36, message = "External ID must be a valid UUID")
    @Pattern(regexp = "^[a-f0-9-]{36}$", message = "External ID must be a valid UUID format")
    private String externalId;

    /**
     * Fineract savings account ID
     */
    @NotNull(message = "Account ID is required")
    @Positive(message = "Account ID must be positive")
    private Long accountId;

    /**
     * Amount to deposit (in XAF)
     */
    @NotNull(message = "Amount is required")
    @DecimalMin(value = "100", message = "Minimum deposit is 100 XAF")
    @DecimalMax(value = "10000000", message = "Maximum deposit is 10,000,000 XAF")
    private BigDecimal amount;

    /**
     * Payment provider to use
     */
    @NotNull(message = "Payment provider is required")
    private PaymentProvider provider;

    /**
     * Customer's phone number for mobile money (required for MTN/Orange)
     */
    @Pattern(regexp = "^\\+?237[0-9]{9}$|^[0-9]{9}$", message = "Invalid Cameroon phone number")
    private String phoneNumber;

    /**
     * Optional reference/note for the transaction
     */
    @Size(max = 100, message = "Reference cannot exceed 100 characters")
    private String reference;
}
