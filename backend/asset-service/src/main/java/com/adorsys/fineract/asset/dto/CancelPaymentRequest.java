package com.adorsys.fineract.asset.dto;

/**
 * Request body for the admin cancel-payment endpoint
 * ({@code POST /admin/scheduled-payments/{id}/cancel}). Allows an operator to abort
 * a pending coupon or income distribution payment before it is processed. The reason
 * is stored in the audit log and on the payment record for compliance purposes.
 */
public record CancelPaymentRequest(
    /**
     * Free-text explanation for why the payment is being cancelled. Stored in the
     * audit log and on the payment record. May be null if no reason is provided,
     * though operators are encouraged to always supply a reason for traceability.
     */
    String reason
) {}
