package com.adorsys.fineract.asset.service;

import com.adorsys.fineract.asset.dto.AssetCategory;
import com.adorsys.fineract.asset.dto.BondBenefitProjection;
import com.adorsys.fineract.asset.dto.BondType;
import com.adorsys.fineract.asset.entity.Asset;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.ZoneId;
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
     * @param asset              the bond asset (must have category BONDS)
     * @param units              number of units being purchased
     * @param investmentCost     total cost to the buyer (grossAmount + fee), from trade preview
     * @return projection record, or null if the asset is not a bond or has missing config
     */
    public BondBenefitProjection calculateForPurchase(Asset asset, BigDecimal units,
                                                       BigDecimal investmentCost) {
        return calculateForPurchase(asset, units, investmentCost, BigDecimal.ZERO);
    }

    /**
     * Calculate benefit projections for a prospective bond purchase, accounting for accrued interest.
     *
     * <p>For OTA coupon bonds, the buyer pays accrued interest to the seller at settlement.
     * That amount should be deducted from the first coupon projection since the buyer is
     * effectively pre-paying part of it. Without this deduction the projected income would
     * overstate the net benefit for the first coupon period.
     *
     * @param asset              the bond asset (must have category BONDS)
     * @param units              number of units being purchased
     * @param investmentCost     total cost to the buyer (grossAmount + fee), from trade preview
     * @param accruedInterestPaid accrued interest already paid at purchase (deducted from first coupon)
     * @return projection record, or null if the asset is not a bond or has missing config
     */
    public BondBenefitProjection calculateForPurchase(Asset asset, BigDecimal units,
                                                       BigDecimal investmentCost,
                                                       BigDecimal accruedInterestPaid) {
        if (asset.getCategory() != AssetCategory.BONDS) {
            return null;
        }

        BigDecimal faceValue = asset.getEffectiveFaceValue();
        if (faceValue == null) {
            log.warn("Bond {} has no faceValue configured", asset.getSymbol());
            return null;
        }

        // DISCOUNT (BTA) bonds: no coupons, return comes from face value - purchase price
        if (asset.getBondType() == BondType.DISCOUNT) {
            return calculateDiscountForPurchase(asset, units, faceValue, investmentCost);
        }

        BigDecimal rate = asset.getInterestRate();
        Integer freqMonths = asset.getCouponFrequencyMonths();

        if (rate == null || freqMonths == null) {
            log.warn("Bond {} has incomplete coupon configuration (rate={}, freq={})",
                    asset.getSymbol(), rate, freqMonths);
            return null;
        }

        BigDecimal couponPerPeriod = computeCouponPerPeriod(units, faceValue, rate, freqMonths);
        int remainingPayments = countRemainingCoupons(asset.getNextCouponDate(),
                asset.getMaturityDate(), freqMonths);

        // Deduct accrued interest already paid at purchase from total coupon projection.
        // The buyer pre-pays this to the seller; they'll recoup it in the first coupon,
        // but it offsets the net income for that period.
        BigDecimal paid = accruedInterestPaid != null ? accruedInterestPaid : BigDecimal.ZERO;
        BigDecimal totalCouponIncome = couponPerPeriod.multiply(BigDecimal.valueOf(remainingPayments))
                .subtract(paid).max(BigDecimal.ZERO);

        BigDecimal principalAtMaturity = units.multiply(faceValue).setScale(0, RoundingMode.HALF_UP);
        long daysToMaturity = computeDaysToMaturity(asset.getMaturityDate());

        BigDecimal totalProjectedReturn = totalCouponIncome.add(principalAtMaturity);
        BigDecimal netProjectedProfit = totalProjectedReturn.subtract(investmentCost);
        BigDecimal annualizedYield = computeAnnualizedYield(netProjectedProfit, investmentCost, daysToMaturity);

        return new BondBenefitProjection(
                BondType.COUPON,
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
     * @param marketPrice current market price per unit (for reference, not used in projections)
     * @return projection record, or null if the asset is not a bond or has missing config
     */
    public BondBenefitProjection calculateForHolding(Asset asset, BigDecimal units,
                                                      BigDecimal marketPrice) {
        if (asset.getCategory() != AssetCategory.BONDS) {
            return null;
        }

        BigDecimal faceValue = asset.getEffectiveFaceValue();
        if (faceValue == null) {
            log.warn("Bond {} has no faceValue configured", asset.getSymbol());
            return null;
        }

        // DISCOUNT (BTA) bonds: no coupons, return is face value at maturity
        if (asset.getBondType() == BondType.DISCOUNT) {
            return calculateDiscountForHolding(asset, units, faceValue);
        }

        BigDecimal rate = asset.getInterestRate();
        Integer freqMonths = asset.getCouponFrequencyMonths();

        if (rate == null || freqMonths == null) {
            log.warn("Bond {} has incomplete coupon configuration (rate={}, freq={})",
                    asset.getSymbol(), rate, freqMonths);
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
                BondType.COUPON,
                faceValue, rate, freqMonths,
                asset.getMaturityDate(), asset.getNextCouponDate(),
                couponPerPeriod, remainingPayments, totalCouponIncome,
                principalAtMaturity, null,
                totalProjectedReturn, null, null,
                daysToMaturity
        );
    }

    /**
     * Calculate benefit projection for a DISCOUNT (BTA) bond purchase.
     * No coupons — return comes from redeeming at face value.
     */
    private BondBenefitProjection calculateDiscountForPurchase(Asset asset, BigDecimal units,
                                                                BigDecimal faceValue, BigDecimal investmentCost) {
        BigDecimal principalAtMaturity = units.multiply(faceValue).setScale(0, RoundingMode.HALF_UP);
        long daysToMaturity = computeDaysToMaturity(asset.getMaturityDate());
        BigDecimal totalProjectedReturn = principalAtMaturity;
        BigDecimal netProjectedProfit = totalProjectedReturn.subtract(investmentCost);
        int basis = asset.getDayCountConvention() != null ? asset.getDayCountConvention().getBasis() : 360;
        BigDecimal annualizedYield = computeAnnualizedYield(netProjectedProfit, investmentCost, daysToMaturity, basis);

        return new BondBenefitProjection(
                BondType.DISCOUNT,
                faceValue, null, null,
                asset.getMaturityDate(), null,
                BigDecimal.ZERO, 0, BigDecimal.ZERO,
                principalAtMaturity, investmentCost,
                totalProjectedReturn, netProjectedProfit, annualizedYield,
                daysToMaturity
        );
    }

    /**
     * Calculate benefit projection for holding a DISCOUNT (BTA) bond.
     */
    private BondBenefitProjection calculateDiscountForHolding(Asset asset, BigDecimal units,
                                                               BigDecimal faceValue) {
        BigDecimal principalAtMaturity = units.multiply(faceValue).setScale(0, RoundingMode.HALF_UP);
        long daysToMaturity = computeDaysToMaturity(asset.getMaturityDate());

        return new BondBenefitProjection(
                BondType.DISCOUNT,
                faceValue, null, null,
                asset.getMaturityDate(), null,
                BigDecimal.ZERO, 0, BigDecimal.ZERO,
                principalAtMaturity, null,
                principalAtMaturity, null, null,
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
        return countRemainingCoupons(nextCouponDate, maturityDate, freqMonths,
                LocalDate.now(ZoneId.of("Africa/Douala")));
    }

    /**
     * Count coupon payments from referenceDate until maturityDate (inclusive).
     * Package-private to allow deterministic testing with a fixed reference date.
     */
    int countRemainingCoupons(LocalDate nextCouponDate, LocalDate maturityDate,
                               int freqMonths, LocalDate referenceDate) {
        if (nextCouponDate == null || maturityDate == null) {
            return 0;
        }
        int count = 0;
        LocalDate cursor = nextCouponDate;
        while (!cursor.isAfter(maturityDate)) {
            if (!cursor.isBefore(referenceDate)) {
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
        return Math.max(0, ChronoUnit.DAYS.between(LocalDate.now(ZoneId.of("Africa/Douala")), maturityDate));
    }

    private BigDecimal computeAnnualizedYield(BigDecimal netProfit, BigDecimal investmentCost,
                                               long daysToMaturity) {
        return computeAnnualizedYield(netProfit, investmentCost, daysToMaturity, 365);
    }

    private BigDecimal computeAnnualizedYield(BigDecimal netProfit, BigDecimal investmentCost,
                                               long daysToMaturity, int dayCountBasis) {
        if (daysToMaturity <= 0 || investmentCost == null
                || investmentCost.compareTo(BigDecimal.ZERO) <= 0) {
            return BigDecimal.ZERO;
        }
        return netProfit
                .divide(investmentCost, 8, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(dayCountBasis))
                .divide(BigDecimal.valueOf(daysToMaturity), 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100));
    }
}
