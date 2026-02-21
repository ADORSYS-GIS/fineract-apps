package com.adorsys.fineract.asset.event;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Published after a coupon (interest) payment is successfully transferred to a holder.
 */
public record CouponPaidEvent(
        Long userId,
        String assetId,
        String assetSymbol,
        BigDecimal cashAmount,
        BigDecimal annualRate,
        LocalDate couponDate
) implements AssetServiceEvent {}
