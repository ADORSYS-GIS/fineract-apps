package com.adorsys.fineract.asset.service;

import com.adorsys.fineract.asset.dto.AssetCategory;
import com.adorsys.fineract.asset.dto.BondType;
import com.adorsys.fineract.asset.dto.DayCountConvention;
import com.adorsys.fineract.asset.entity.Asset;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;

/**
 * Calculates accrued interest ("pied du coupon") for OTA coupon bond trades.
 * When a coupon bond is traded between coupon dates, the buyer compensates the seller
 * for the interest accrued since the last coupon payment.
 *
 * Formula: units × faceValue × (rate/100) × daysSinceLastCoupon / dayCountBasis
 */
@Component
public class AccruedInterestCalculator {

    /**
     * Calculate accrued interest for a bond trade.
     *
     * @param asset the bond asset
     * @param units number of units being traded
     * @return accrued interest amount, or BigDecimal.ZERO if not applicable
     */
    public BigDecimal calculate(Asset asset, BigDecimal units) {
        if (asset.getCategory() != AssetCategory.BONDS) return BigDecimal.ZERO;
        if (asset.getBondType() == BondType.DISCOUNT) return BigDecimal.ZERO;
        if (asset.getInterestRate() == null || asset.getEffectiveFaceValue() == null) return BigDecimal.ZERO;
        if (asset.getCouponFrequencyMonths() == null) return BigDecimal.ZERO;

        LocalDate lastCouponDate = computeLastCouponDate(asset);
        if (lastCouponDate == null) return BigDecimal.ZERO;

        DayCountConvention convention = asset.getDayCountConvention() != null
                ? asset.getDayCountConvention() : DayCountConvention.ACT_365;
        long daysSinceLastCoupon = convention.daysBetween(lastCouponDate, LocalDate.now());
        if (daysSinceLastCoupon <= 0) return BigDecimal.ZERO;

        int dayCountBasis = convention.getBasis();

        return units
                .multiply(asset.getEffectiveFaceValue())
                .multiply(asset.getInterestRate())
                .divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(daysSinceLastCoupon))
                .divide(BigDecimal.valueOf(dayCountBasis), 0, RoundingMode.HALF_UP);
    }

    /**
     * Derive the last coupon date from the next coupon date and frequency.
     * lastCouponDate = nextCouponDate - couponFrequencyMonths
     */
    private LocalDate computeLastCouponDate(Asset asset) {
        LocalDate nextCoupon = asset.getNextCouponDate();
        if (nextCoupon == null) return null;
        return nextCoupon.minusMonths(asset.getCouponFrequencyMonths());
    }
}
