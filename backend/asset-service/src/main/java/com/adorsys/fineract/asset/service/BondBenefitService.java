package com.adorsys.fineract.asset.service;

import com.adorsys.fineract.asset.dto.AssetCategory;
import com.adorsys.fineract.asset.dto.BondBenefitProjection;
import com.adorsys.fineract.asset.entity.Asset;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

/**
 * Calculates bond investment benefit projections (coupon income, principal return,
 * annualized yield). Used by both TradingService (purchase preview) and
 * PortfolioService (holding view).
 */
@Slf4j
@Service
public class BondBenefitService {

    /**
     * Calculate benefit projections for a prospective bond purchase.
     *
     * @param asset          the bond asset (must have category BONDS)
     * @param units          number of units being purchased
     * @param investmentCost total cost to the buyer (grossAmount + fee), from trade preview
     * @return projection record, or null if the asset is not a bond or has missing config
     */
    public BondBenefitProjection calculateForPurchase(Asset asset, BigDecimal units,
                                                       BigDecimal investmentCost) {
        if (asset.getCategory() != AssetCategory.BONDS) {
            return null;
        }

        BigDecimal faceValue = asset.getManualPrice();
        BigDecimal rate = asset.getInterestRate();
        Integer freqMonths = asset.getCouponFrequencyMonths();

        if (faceValue == null || rate == null || freqMonths == null) {
            log.warn("Bond {} has incomplete configuration (faceValue={}, rate={}, freq={})",
                    asset.getSymbol(), faceValue, rate, freqMonths);
            return null;
        }

        BigDecimal couponPerPeriod = computeCouponPerPeriod(units, faceValue, rate, freqMonths);
        int remainingPayments = countRemainingCoupons(asset.getNextCouponDate(),
                asset.getMaturityDate(), freqMonths);
        BigDecimal totalCouponIncome = couponPerPeriod.multiply(BigDecimal.valueOf(remainingPayments));
        BigDecimal principalAtMaturity = units.multiply(faceValue).setScale(0, RoundingMode.HALF_UP);
        long daysToMaturity = computeDaysToMaturity(asset.getMaturityDate());

        BigDecimal totalProjectedReturn = totalCouponIncome.add(principalAtMaturity);
        BigDecimal netProjectedProfit = totalProjectedReturn.subtract(investmentCost);
        BigDecimal annualizedYield = computeAnnualizedYield(netProjectedProfit, investmentCost, daysToMaturity);

        return new BondBenefitProjection(
                faceValue, rate, freqMonths,
                asset.getMaturityDate(), asset.getNextCouponDate(),
                couponPerPeriod, remainingPayments, totalCouponIncome,
                principalAtMaturity, investmentCost,
                totalProjectedReturn, netProjectedProfit, annualizedYield,
                daysToMaturity
        );
    }

    /**
     * Calculate benefit projections for an existing bond holding in a portfolio.
     * Investment cost and yield fields are null since the user already owns the position.
     *
     * @param asset        the bond asset
     * @param units        number of units currently held
     * @param currentPrice current market price per unit (for reference, not used in projections)
     * @return projection record, or null if the asset is not a bond or has missing config
     */
    public BondBenefitProjection calculateForHolding(Asset asset, BigDecimal units,
                                                      BigDecimal currentPrice) {
        if (asset.getCategory() != AssetCategory.BONDS) {
            return null;
        }

        BigDecimal faceValue = asset.getManualPrice();
        BigDecimal rate = asset.getInterestRate();
        Integer freqMonths = asset.getCouponFrequencyMonths();

        if (faceValue == null || rate == null || freqMonths == null) {
            log.warn("Bond {} has incomplete configuration (faceValue={}, rate={}, freq={})",
                    asset.getSymbol(), faceValue, rate, freqMonths);
            return null;
        }

        BigDecimal couponPerPeriod = computeCouponPerPeriod(units, faceValue, rate, freqMonths);
        int remainingPayments = countRemainingCoupons(asset.getNextCouponDate(),
                asset.getMaturityDate(), freqMonths);
        BigDecimal totalCouponIncome = couponPerPeriod.multiply(BigDecimal.valueOf(remainingPayments));
        BigDecimal principalAtMaturity = units.multiply(faceValue).setScale(0, RoundingMode.HALF_UP);
        long daysToMaturity = computeDaysToMaturity(asset.getMaturityDate());

        BigDecimal totalProjectedReturn = totalCouponIncome.add(principalAtMaturity);

        return new BondBenefitProjection(
                faceValue, rate, freqMonths,
                asset.getMaturityDate(), asset.getNextCouponDate(),
                couponPerPeriod, remainingPayments, totalCouponIncome,
                principalAtMaturity, null,
                totalProjectedReturn, null, null,
                daysToMaturity
        );
    }

    /**
     * Coupon per period formula — matches InterestPaymentScheduler:111-116.
     * {@code units * faceValue * (rate / 100) * (months / 12)}
     */
    BigDecimal computeCouponPerPeriod(BigDecimal units, BigDecimal faceValue,
                                       BigDecimal rate, int freqMonths) {
        return units
                .multiply(faceValue)
                .multiply(rate)
                .divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(freqMonths))
                .divide(BigDecimal.valueOf(12), 0, RoundingMode.HALF_UP);
    }

    /**
     * Count future coupon payments remaining from today until maturityDate (inclusive).
     * Only counts coupon dates that are today or in the future.
     */
    int countRemainingCoupons(LocalDate nextCouponDate, LocalDate maturityDate, int freqMonths) {
        if (nextCouponDate == null || maturityDate == null) {
            return 0;
        }
        LocalDate today = LocalDate.now();
        int count = 0;
        LocalDate cursor = nextCouponDate;
        while (!cursor.isAfter(maturityDate)) {
            if (!cursor.isBefore(today)) {
                count++;
            }
            cursor = cursor.plusMonths(freqMonths);
        }
        return count;
    }

    long computeDaysToMaturity(LocalDate maturityDate) {
        if (maturityDate == null) {
            return 0;
        }
        return Math.max(0, ChronoUnit.DAYS.between(LocalDate.now(), maturityDate));
    }

    private BigDecimal computeAnnualizedYield(BigDecimal netProfit, BigDecimal investmentCost,
                                               long daysToMaturity) {
        if (daysToMaturity <= 0 || investmentCost == null
                || investmentCost.compareTo(BigDecimal.ZERO) <= 0) {
            return BigDecimal.ZERO;
        }
        return netProfit
                .divide(investmentCost, 8, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(365))
                .divide(BigDecimal.valueOf(daysToMaturity), 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100));
    }
}
