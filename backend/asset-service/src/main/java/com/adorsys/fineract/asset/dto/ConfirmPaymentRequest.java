package com.adorsys.fineract.asset.dto;

import java.math.BigDecimal;

/**
 * Request body for the admin confirm-payment endpoint
 * ({@code POST /admin/scheduled-payments/{id}/confirm}). Allows an operator to manually
 * trigger processing of a pending coupon or income distribution payment, optionally
 * overriding the automatically calculated per-unit amount.
 *
 * <p>For COUPON bond payments the amount is always derived from the bond's configured
 * {@code interestRate} and {@code faceValue} and cannot be overridden here. For INCOME
 * payments (DIVIDEND, RENT, HARVEST_YIELD, PROFIT_SHARE) the amount is normally computed
 * from the asset's {@code incomeRate}, but this field allows an admin to specify a
 * different per-unit payout — for example when the actual dividend declared differs
 * from the configured rate estimate.</p>
 */
public record ConfirmPaymentRequest(
    /**
     * Per-unit payout amount in XAF to use instead of the calculated value.
     * Only honoured for INCOME type payments; silently ignored for COUPON payments
     * where the amount is always formula-derived. Null means "use the calculated amount".
     */
    BigDecimal amountPerUnit
) {}
