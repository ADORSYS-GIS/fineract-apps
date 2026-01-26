package com.adorsys.fineract.registration.service;

import com.adorsys.fineract.registration.dto.LimitsResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Slf4j
@Service
public class LimitsService {

    // Tier 1: Unverified customers
    private static final BigDecimal TIER1_DAILY_DEPOSIT = new BigDecimal("50000");
    private static final BigDecimal TIER1_DAILY_WITHDRAWAL = new BigDecimal("25000");
    private static final BigDecimal TIER1_PER_TRANSACTION = new BigDecimal("25000");
    private static final BigDecimal TIER1_MONTHLY = new BigDecimal("200000");
    private static final List<String> TIER1_PAYMENT_METHODS = List.of("MTN_TRANSFER", "ORANGE_TRANSFER");
    private static final List<String> TIER1_RESTRICTED = List.of("BANK_TRANSFER", "INTERNATIONAL_TRANSFER");

    // Tier 2: KYC Verified customers
    private static final BigDecimal TIER2_DAILY_DEPOSIT = new BigDecimal("500000");
    private static final BigDecimal TIER2_DAILY_WITHDRAWAL = new BigDecimal("250000");
    private static final BigDecimal TIER2_PER_TRANSACTION = new BigDecimal("100000");
    private static final BigDecimal TIER2_MONTHLY = new BigDecimal("2000000");
    private static final List<String> TIER2_PAYMENT_METHODS = List.of(
            "MTN_TRANSFER", "ORANGE_TRANSFER", "UBA_BANK_TRANSFER", "AFRILAND_BANK_TRANSFER"
    );
    private static final List<String> TIER2_RESTRICTED = List.of();

    /**
     * Get transaction limits based on KYC tier.
     *
     * @param kycTier Customer's KYC tier (1 = unverified, 2 = verified)
     * @return Limits response with current limits and usage
     */
    public LimitsResponse getLimits(int kycTier) {
        // For now, return static limits. In future, calculate actual usage.
        return kycTier >= 2 ? getTier2Limits() : getTier1Limits();
    }

    /**
     * Check if a transaction is within limits.
     *
     * @param kycTier         Customer's KYC tier
     * @param amount          Transaction amount
     * @param paymentMethod   Payment method code
     * @param isDeposit       true for deposit, false for withdrawal
     * @return null if allowed, error message if blocked
     */
    public String validateTransaction(int kycTier, BigDecimal amount, String paymentMethod, boolean isDeposit) {
        LimitsResponse limits = getLimits(kycTier);

        // Check payment method is allowed
        if (!limits.getAllowedPaymentMethods().contains(paymentMethod)) {
            return String.format("%s is only available for verified customers. Please complete KYC verification.",
                    formatPaymentMethod(paymentMethod));
        }

        // Check per-transaction limit
        if (amount.compareTo(limits.getLimits().getPerTransactionLimit()) > 0) {
            return String.format("Transaction amount of %s XAF exceeds your per-transaction limit of %s XAF.",
                    amount.toPlainString(), limits.getLimits().getPerTransactionLimit().toPlainString());
        }

        // Check daily limit
        BigDecimal dailyLimit = isDeposit ?
                limits.getLimits().getDailyDepositLimit() :
                limits.getLimits().getDailyWithdrawalLimit();

        // TODO: Calculate actual daily usage from Fineract transactions
        // For now, assume no prior usage
        if (amount.compareTo(dailyLimit) > 0) {
            String limitType = isDeposit ? "deposit" : "withdrawal";
            return String.format("Daily %s limit of %s XAF exceeded. Complete KYC to increase your limits.",
                    limitType, dailyLimit.toPlainString());
        }

        return null; // Transaction allowed
    }

    private LimitsResponse getTier1Limits() {
        return LimitsResponse.builder()
                .kycTier(1)
                .tierName("Unverified")
                .limits(LimitsResponse.LimitsDto.builder()
                        .dailyDepositLimit(TIER1_DAILY_DEPOSIT)
                        .dailyWithdrawalLimit(TIER1_DAILY_WITHDRAWAL)
                        .perTransactionLimit(TIER1_PER_TRANSACTION)
                        .monthlyTransactionLimit(TIER1_MONTHLY)
                        .build())
                .usage(LimitsResponse.UsageDto.builder()
                        .dailyDepositUsed(BigDecimal.ZERO)
                        .dailyWithdrawalUsed(BigDecimal.ZERO)
                        .monthlyUsed(BigDecimal.ZERO)
                        .build())
                .available(LimitsResponse.AvailableDto.builder()
                        .depositRemaining(TIER1_DAILY_DEPOSIT)
                        .withdrawalRemaining(TIER1_DAILY_WITHDRAWAL)
                        .build())
                .allowedPaymentMethods(TIER1_PAYMENT_METHODS)
                .restrictedFeatures(TIER1_RESTRICTED)
                .currency("XAF")
                .build();
    }

    private LimitsResponse getTier2Limits() {
        return LimitsResponse.builder()
                .kycTier(2)
                .tierName("Verified")
                .limits(LimitsResponse.LimitsDto.builder()
                        .dailyDepositLimit(TIER2_DAILY_DEPOSIT)
                        .dailyWithdrawalLimit(TIER2_DAILY_WITHDRAWAL)
                        .perTransactionLimit(TIER2_PER_TRANSACTION)
                        .monthlyTransactionLimit(TIER2_MONTHLY)
                        .build())
                .usage(LimitsResponse.UsageDto.builder()
                        .dailyDepositUsed(BigDecimal.ZERO)
                        .dailyWithdrawalUsed(BigDecimal.ZERO)
                        .monthlyUsed(BigDecimal.ZERO)
                        .build())
                .available(LimitsResponse.AvailableDto.builder()
                        .depositRemaining(TIER2_DAILY_DEPOSIT)
                        .withdrawalRemaining(TIER2_DAILY_WITHDRAWAL)
                        .build())
                .allowedPaymentMethods(TIER2_PAYMENT_METHODS)
                .restrictedFeatures(TIER2_RESTRICTED)
                .currency("XAF")
                .build();
    }

    private String formatPaymentMethod(String code) {
        return switch (code) {
            case "MTN_TRANSFER" -> "MTN Mobile Money";
            case "ORANGE_TRANSFER" -> "Orange Money";
            case "UBA_BANK_TRANSFER" -> "UBA Bank Transfer";
            case "AFRILAND_BANK_TRANSFER" -> "Afriland Bank Transfer";
            default -> code;
        };
    }
}
