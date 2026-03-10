package com.adorsys.fineract.asset.service;

import com.adorsys.fineract.asset.config.ResolvedTaxAccounts;
import com.adorsys.fineract.asset.config.TaxConfig;
import com.adorsys.fineract.asset.dto.AssetCategory;
import com.adorsys.fineract.asset.dto.TaxBreakdown;
import com.adorsys.fineract.asset.entity.Asset;
import com.adorsys.fineract.asset.entity.TaxTransaction;
import com.adorsys.fineract.asset.repository.TaxTransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.ZoneId;

/**
 * Tax calculation and recording service for Cameroon/CEMAC compliance.
 * Supports three tax types: Registration Duty, IRCM, and Capital Gains Tax.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class TaxService {

    private final TaxConfig taxConfig;
    private final ResolvedTaxAccounts resolvedTaxAccounts;
    private final TaxTransactionRepository taxTransactionRepository;

    /**
     * Calculate registration duty for a trade.
     * @return duty amount (0 if disabled on this asset)
     */
    public BigDecimal calculateRegistrationDuty(Asset asset, BigDecimal transactionValue) {
        if (!Boolean.TRUE.equals(asset.getRegistrationDutyEnabled())) {
            return BigDecimal.ZERO;
        }
        BigDecimal rate = asset.getRegistrationDutyRate() != null
                ? asset.getRegistrationDutyRate()
                : taxConfig.getDefaultRegistrationDutyRate();
        return transactionValue.multiply(rate).setScale(0, RoundingMode.HALF_UP);
    }

    /**
     * Get the effective registration duty rate for an asset.
     */
    public BigDecimal getRegistrationDutyRate(Asset asset) {
        if (!Boolean.TRUE.equals(asset.getRegistrationDutyEnabled())) {
            return BigDecimal.ZERO;
        }
        return asset.getRegistrationDutyRate() != null
                ? asset.getRegistrationDutyRate()
                : taxConfig.getDefaultRegistrationDutyRate();
    }

    /**
     * Determine the effective IRCM rate for income distributions on this asset.
     */
    public BigDecimal getEffectiveIrcmRate(Asset asset) {
        if (!Boolean.TRUE.equals(asset.getIrcmEnabled())) {
            return BigDecimal.ZERO;
        }
        if (Boolean.TRUE.equals(asset.getIrcmExempt()) || Boolean.TRUE.equals(asset.getIsGovernmentBond())) {
            return BigDecimal.ZERO;
        }
        if (asset.getIrcmRateOverride() != null) {
            return asset.getIrcmRateOverride();
        }
        // Bond with maturity >= 5 years: 5.5%
        if (asset.getCategory() == AssetCategory.BONDS && asset.getMaturityDate() != null) {
            LocalDate fiveYearsFromNow = LocalDate.now().minusYears(5);
            if (asset.getMaturityDate().isAfter(LocalDate.now().plusYears(5).minusDays(1))) {
                return taxConfig.getDefaultIrcmBondRate();
            }
        }
        // BVMAC-listed: 11%
        if (Boolean.TRUE.equals(asset.getIsBvmacListed())) {
            return taxConfig.getDefaultIrcmBvmacRate();
        }
        // Default dividend rate: 16.5%
        return taxConfig.getDefaultIrcmDividendRate();
    }

    /**
     * Calculate IRCM withholding on an income distribution.
     */
    public BigDecimal calculateIrcm(Asset asset, BigDecimal incomeAmount) {
        BigDecimal rate = getEffectiveIrcmRate(asset);
        return incomeAmount.multiply(rate).setScale(0, RoundingMode.HALF_UP);
    }

    /**
     * Calculate capital gains tax for a SELL trade.
     * Checks the annual 500,000 XAF exemption threshold.
     *
     * @param realizedGain the profit from this SELL (can be <= 0)
     * @return tax amount (0 if no profit, exempt, or disabled)
     */
    public BigDecimal calculateCapitalGainsTax(Asset asset, Long userId, BigDecimal realizedGain) {
        if (!Boolean.TRUE.equals(asset.getCapitalGainsTaxEnabled())) {
            return BigDecimal.ZERO;
        }
        if (realizedGain.compareTo(BigDecimal.ZERO) <= 0) {
            return BigDecimal.ZERO;
        }

        BigDecimal rate = asset.getCapitalGainsRate() != null
                ? asset.getCapitalGainsRate()
                : taxConfig.getDefaultCapitalGainsRate();

        // Check annual exemption
        int fiscalYear = LocalDate.now(ZoneId.of("Africa/Douala")).getYear();
        BigDecimal cumulativeGains = taxTransactionRepository.sumCapitalGainsByUserAndYear(userId, fiscalYear);
        BigDecimal exemptionThreshold = taxConfig.getCapitalGainsAnnualExemption();

        if (cumulativeGains.add(realizedGain).compareTo(exemptionThreshold) <= 0) {
            log.debug("Capital gains exempt: userId={}, cumulative={}, thisGain={}, threshold={}",
                    userId, cumulativeGains, realizedGain, exemptionThreshold);
            return BigDecimal.ZERO;
        }

        // Tax only the amount exceeding the threshold
        BigDecimal taxableGain;
        if (cumulativeGains.compareTo(exemptionThreshold) >= 0) {
            // Already exceeded threshold in prior trades — tax the full gain
            taxableGain = realizedGain;
        } else {
            // Partially exempt: only tax the portion above threshold
            taxableGain = cumulativeGains.add(realizedGain).subtract(exemptionThreshold);
        }

        return taxableGain.multiply(rate).setScale(0, RoundingMode.HALF_UP);
    }

    /**
     * Check if capital gains exemption was applied for this trade.
     */
    public boolean isCapitalGainsExemptionApplied(Asset asset, Long userId, BigDecimal realizedGain) {
        if (realizedGain.compareTo(BigDecimal.ZERO) <= 0) {
            return false;
        }
        int fiscalYear = LocalDate.now(ZoneId.of("Africa/Douala")).getYear();
        BigDecimal cumulativeGains = taxTransactionRepository.sumCapitalGainsByUserAndYear(userId, fiscalYear);
        return cumulativeGains.add(realizedGain).compareTo(taxConfig.getCapitalGainsAnnualExemption()) <= 0;
    }

    /**
     * Build a tax breakdown for a trade quote response.
     */
    public TaxBreakdown buildTaxBreakdown(Asset asset, Long userId, BigDecimal grossAmount,
                                           BigDecimal realizedGain, boolean isSell) {
        BigDecimal regDutyRate = getRegistrationDutyRate(asset);
        BigDecimal regDutyAmount = calculateRegistrationDuty(asset, grossAmount);

        BigDecimal cgtRate = BigDecimal.ZERO;
        BigDecimal cgtAmount = BigDecimal.ZERO;
        boolean cgtExemptionApplied = false;

        if (isSell && realizedGain != null && realizedGain.compareTo(BigDecimal.ZERO) > 0) {
            cgtRate = asset.getCapitalGainsRate() != null
                    ? asset.getCapitalGainsRate()
                    : taxConfig.getDefaultCapitalGainsRate();
            cgtAmount = calculateCapitalGainsTax(asset, userId, realizedGain);
            cgtExemptionApplied = isCapitalGainsExemptionApplied(asset, userId, realizedGain);
        }

        BigDecimal totalTax = regDutyAmount.add(cgtAmount);
        return new TaxBreakdown(regDutyRate, regDutyAmount, cgtRate, cgtAmount, totalTax, cgtExemptionApplied);
    }

    /**
     * Record a tax transaction in the audit trail.
     */
    public TaxTransaction recordTaxTransaction(String orderId, Long scheduledPaymentId,
                                                Long userId, String assetId, String taxType,
                                                BigDecimal taxableAmount, BigDecimal taxRate,
                                                BigDecimal taxAmount, Long fineractTransferId) {
        LocalDate now = LocalDate.now(ZoneId.of("Africa/Douala"));
        TaxTransaction tx = TaxTransaction.builder()
                .orderId(orderId)
                .scheduledPaymentId(scheduledPaymentId)
                .userId(userId)
                .assetId(assetId)
                .taxType(taxType)
                .taxableAmount(taxableAmount)
                .taxRate(taxRate)
                .taxAmount(taxAmount)
                .fineractTransferId(fineractTransferId)
                .fiscalYear(now.getYear())
                .fiscalMonth(now.getMonthValue())
                .build();
        return taxTransactionRepository.save(tx);
    }

    /** Get the resolved tax collection account ID for registration duty. */
    public Long getRegistrationDutyAccountId() {
        return resolvedTaxAccounts.getRegistrationDutyAccountId();
    }

    /** Get the resolved tax collection account ID for IRCM. */
    public Long getIrcmAccountId() {
        return resolvedTaxAccounts.getIrcmAccountId();
    }

    /** Get the resolved tax collection account ID for capital gains. */
    public Long getCapitalGainsAccountId() {
        return resolvedTaxAccounts.getCapitalGainsAccountId();
    }
}
