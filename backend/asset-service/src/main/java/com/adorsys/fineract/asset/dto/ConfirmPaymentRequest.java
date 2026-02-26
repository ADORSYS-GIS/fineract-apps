package com.adorsys.fineract.asset.dto;

import java.math.BigDecimal;

public record ConfirmPaymentRequest(
    /** Optional override for amount per unit. Only used for INCOME type; ignored for COUPON. */
    BigDecimal amountPerUnit
) {}
