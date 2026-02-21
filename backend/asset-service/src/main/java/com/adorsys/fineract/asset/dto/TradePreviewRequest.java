package com.adorsys.fineract.asset.dto;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

/**
 * Request to preview a trade without executing it.
 * Exactly one of {@code units} or {@code amount} must be provided.
 * When {@code amount} is given, the system computes the maximum whole units
 * purchasable for that XAF amount (including fees).
 */
public record TradePreviewRequest(
    @NotBlank String assetId,
    @NotNull TradeSide side,
    @Positive @DecimalMax("10000000") BigDecimal units,
    @Positive @DecimalMax("100000000000") BigDecimal amount
) {
    @AssertTrue(message = "Exactly one of 'units' or 'amount' must be provided")
    boolean isValid() {
        return (units != null) ^ (amount != null);
    }
}
