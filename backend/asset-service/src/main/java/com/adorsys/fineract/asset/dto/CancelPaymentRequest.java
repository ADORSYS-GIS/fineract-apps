package com.adorsys.fineract.asset.dto;

public record CancelPaymentRequest(
    /** Optional reason for cancellation. */
    String reason
) {}
