package com.adorsys.fineract.asset.service;

import com.adorsys.fineract.asset.dto.AssetCategory;
import com.adorsys.fineract.asset.dto.IncomeBenefitProjection;
import com.adorsys.fineract.asset.entity.Asset;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

/**
 * Calculates income benefit projections for non-bond assets (DIVIDEND, RENT,
 * HARVEST_YIELD, PROFIT_SHARE). Used by TradingService (purchase preview) and
 * PortfolioService (holding view).
 *
 * <p>Formula (matches IncomeDistributionService):
 * {@code incomePerPeriod = units * currentPrice * (rate/100) * (frequencyMonths/12)}</p>
 *
 * <p>Unlike bonds (fixed face value), income is based on current market price,
 * so all projections are estimates that vary with price changes.</p>
 */
@Slf4j
@Service
public class IncomeBenefitService {

    /**
     * Calculate income projections for a prospective purchase.
     *
     * @param asset          the asset (must have incomeType set, must NOT be BONDS)
     * @param units          number of units being purchased
     * @param currentPrice   current market price per unit
     * @param investmentCost total cost to buyer (grossAmount + fee), for yield calculation
     * @return projection record, or null if asset has no income or is a bond
     */
    public IncomeBenefitProjection calculateForPurchase(Asset asset, BigDecimal units,
                                                         BigDecimal currentPrice,
                                                         BigDecimal investmentCost) {
        if (!isIncomeAsset(asset)) {
            return null;
        }

        BigDecimal incomePerPeriod = computeIncomePerPeriod(units, currentPrice,
                asset.getIncomeRate(), asset.getDistributionFrequencyMonths());
        BigDecimal annualIncome = computeAnnualIncome(incomePerPeriod,
                asset.getDistributionFrequencyMonths());
        BigDecimal yieldPercent = computeYield(annualIncome, investmentCost);

        return new IncomeBenefitProjection(
                asset.getIncomeType(),
                asset.getIncomeRate(),
                asset.getDistributionFrequencyMonths(),
                asset.getNextDistributionDate(),
                incomePerPeriod,
                annualIncome,
                yieldPercent,
                true // always variable — based on market price
        );
    }

    /**
     * Calculate income projections for an existing holding in a portfolio.
     * Investment cost and yield are not applicable (null).
     *
     * @param asset        the asset
     * @param units        number of units currently held
     * @param currentPrice current market price per unit
     * @return projection record, or null if asset has no income or is a bond
     */
    public IncomeBenefitProjection calculateForHolding(Asset asset, BigDecimal units,
                                                        BigDecimal currentPrice) {
        if (!isIncomeAsset(asset)) {
            return null;
        }

        BigDecimal incomePerPeriod = computeIncomePerPeriod(units, currentPrice,
                asset.getIncomeRate(), asset.getDistributionFrequencyMonths());
        BigDecimal annualIncome = computeAnnualIncome(incomePerPeriod,
                asset.getDistributionFrequencyMonths());

        return new IncomeBenefitProjection(
                asset.getIncomeType(),
                asset.getIncomeRate(),
                asset.getDistributionFrequencyMonths(),
                asset.getNextDistributionDate(),
                incomePerPeriod,
                annualIncome,
                null, // no yield in portfolio context
                true
        );
    }

    private boolean isIncomeAsset(Asset asset) {
        if (asset.getCategory() == AssetCategory.BONDS) {
            return false;
        }
        String incomeType = asset.getIncomeType();
        if (incomeType == null || incomeType.isBlank()) {
            return false;
        }
        if (asset.getIncomeRate() == null || asset.getDistributionFrequencyMonths() == null) {
            log.warn("Asset {} has incomeType={} but missing rate or frequency",
                    asset.getSymbol(), incomeType);
            return false;
        }
        return true;
    }

    /**
     * Income per period formula — matches IncomeDistributionService:72-78.
     * {@code units * currentPrice * (rate / 100) * (frequencyMonths / 12)}
     */
    BigDecimal computeIncomePerPeriod(BigDecimal units, BigDecimal currentPrice,
                                       BigDecimal rate, int frequencyMonths) {
        return units
                .multiply(currentPrice)
                .multiply(rate)
                .divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(frequencyMonths))
                .divide(BigDecimal.valueOf(12), 0, RoundingMode.HALF_UP);
    }

    private BigDecimal computeAnnualIncome(BigDecimal incomePerPeriod, int frequencyMonths) {
        int periodsPerYear = 12 / frequencyMonths;
        return incomePerPeriod.multiply(BigDecimal.valueOf(periodsPerYear));
    }

    private BigDecimal computeYield(BigDecimal annualIncome, BigDecimal investmentCost) {
        if (investmentCost == null || investmentCost.compareTo(BigDecimal.ZERO) <= 0) {
            return BigDecimal.ZERO;
        }
        return annualIncome
                .divide(investmentCost, 8, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100))
                .setScale(2, RoundingMode.HALF_UP);
    }
}
