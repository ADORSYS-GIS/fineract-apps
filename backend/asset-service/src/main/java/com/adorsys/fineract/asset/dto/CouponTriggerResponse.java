package com.adorsys.fineract.asset.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record CouponTriggerResponse(
    String assetId,
    String symbol,
    LocalDate couponDate,
    int holdersPaid,
    int holdersFailed,
    BigDecimal totalAmountPaid,
    LocalDate nextCouponDate
) {}
