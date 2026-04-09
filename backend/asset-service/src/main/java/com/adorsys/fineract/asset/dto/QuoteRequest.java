package com.adorsys.fineract.asset.dto;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

/**
 * Request to create a price-locked trade quote, sent to {@code POST /api/orders/quote}.
 *
 * <p>A quote reserves the current LP price for a short window (typically 30 seconds),
 * giving the user time to review the cost breakdown before confirming. The returned
 * {@link QuoteResponse} contains an {@code orderId} that must be used to confirm
 * or cancel.</p>
 *
 * <p>Exactly one of {@code units} or {@code amount} must be provided — not both, not neither:</p>
 * <ul>
 *   <li><b>Unit-based</b> ({@code units} provided): the quote is for a fixed number of units.
 *       The cash cost is computed as {@code units * executionPrice + fees}.</li>
 *   <li><b>Amount-based</b> ({@code amount} provided): the system calculates the maximum
 *       number of whole units purchasable for the given XAF budget (including all fees
 *       and taxes). The leftover XAF that cannot buy another unit is returned as
 *       {@code remainder} in the response.</li>
 * </ul>
 *
 * <p>Amount-based quoting applies only to BUY orders. For SELL, always provide {@code units}.</p>
 */
public record QuoteRequest(
    /**
     * Internal asset ID to trade (e.g. {@code "asset_abc123"}).
     * Must correspond to an existing asset in {@code ACTIVE} status.
     */
    @NotBlank String assetId,

    /**
     * Trade direction: {@code BUY} to purchase units with XAF cash,
     * or {@code SELL} to exchange units for XAF cash.
     */
    @NotNull TradeSide side,

    /**
     * Number of units to buy or sell.
     * Mutually exclusive with {@code amount} — provide exactly one.
     * Max 10,000,000 units per order. Must be positive when provided.
     */
    @DecimalMax("10000000") BigDecimal units,

    /**
     * Maximum XAF cash budget for an amount-based BUY quote.
     * The system computes how many whole units can be purchased within this budget
     * after deducting fees and taxes. Mutually exclusive with {@code units}.
     * Max 100,000,000,000 XAF per order. Must be positive when provided.
     */
    @DecimalMax("100000000000") BigDecimal amount
) {
    /**
     * Validates that exactly one of {@code units} or {@code amount} is provided
     * and that the supplied value is strictly positive.
     * Jakarta Validation invokes this automatically on request deserialization.
     */
    @AssertTrue(message = "Exactly one of 'units' or 'amount' must be provided and must be positive")
    boolean isValid() {
        boolean exactlyOne = (units != null) ^ (amount != null);
        if (!exactlyOne) return false;
        BigDecimal value = units != null ? units : amount;
        return value.compareTo(BigDecimal.ZERO) > 0;
    }
}
