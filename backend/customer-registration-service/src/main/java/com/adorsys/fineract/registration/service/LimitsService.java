package com.adorsys.fineract.registration.service;

import com.adorsys.fineract.registration.dto.LimitsResponse;
import com.adorsys.fineract.registration.metrics.RegistrationMetrics;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class LimitsService {

    private final FineractService fineractService;
    private final RegistrationMetrics registrationMetrics;

    private static final ZoneId WAT_ZONE = ZoneId.of("Africa/Lagos");

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
     * Get transaction limits with actual usage for a customer.
     */
    public LimitsResponse getLimitsWithUsage(int kycTier, Long clientId) {
        BigDecimal dailyDepositUsed = BigDecimal.ZERO;
        BigDecimal dailyWithdrawalUsed = BigDecimal.ZERO;
        BigDecimal monthlyUsed = BigDecimal.ZERO;

        if (clientId != null) {
            try {
                UsageSummary usage = calculateUsage(clientId);
                dailyDepositUsed = usage.dailyDeposits;
                dailyWithdrawalUsed = usage.dailyWithdrawals;
                monthlyUsed = usage.monthlyTotal;
            } catch (Exception e) {
                log.warn("Failed to calculate usage for client {}, returning zero usage: {}", clientId, e.getMessage());
            }
        }

        BigDecimal dailyDepositLimit = kycTier >= 2 ? TIER2_DAILY_DEPOSIT : TIER1_DAILY_DEPOSIT;
        BigDecimal dailyWithdrawalLimit = kycTier >= 2 ? TIER2_DAILY_WITHDRAWAL : TIER1_DAILY_WITHDRAWAL;

        return LimitsResponse.builder()
                .kycTier(kycTier)
                .tierName(kycTier >= 2 ? "Verified" : "Unverified")
                .limits(LimitsResponse.LimitsDto.builder()
                        .dailyDepositLimit(dailyDepositLimit)
                        .dailyWithdrawalLimit(dailyWithdrawalLimit)
                        .perTransactionLimit(kycTier >= 2 ? TIER2_PER_TRANSACTION : TIER1_PER_TRANSACTION)
                        .monthlyTransactionLimit(kycTier >= 2 ? TIER2_MONTHLY : TIER1_MONTHLY)
                        .build())
                .usage(LimitsResponse.UsageDto.builder()
                        .dailyDepositUsed(dailyDepositUsed)
                        .dailyWithdrawalUsed(dailyWithdrawalUsed)
                        .monthlyUsed(monthlyUsed)
                        .build())
                .available(LimitsResponse.AvailableDto.builder()
                        .depositRemaining(dailyDepositLimit.subtract(dailyDepositUsed).max(BigDecimal.ZERO))
                        .withdrawalRemaining(dailyWithdrawalLimit.subtract(dailyWithdrawalUsed).max(BigDecimal.ZERO))
                        .build())
                .allowedPaymentMethods(kycTier >= 2 ? TIER2_PAYMENT_METHODS : TIER1_PAYMENT_METHODS)
                .restrictedFeatures(kycTier >= 2 ? TIER2_RESTRICTED : TIER1_RESTRICTED)
                .currency("XAF")
                .build();
    }

    /**
     * Get transaction limits based on KYC tier (static, without usage calculation).
     */
    public LimitsResponse getLimits(int kycTier) {
        return getLimitsWithUsage(kycTier, null);
    }

    /**
     * Check if a transaction is within limits.
     */
    public String validateTransaction(int kycTier, BigDecimal amount, String paymentMethod, boolean isDeposit, Long clientId) {
        LimitsResponse limits = getLimits(kycTier);

        // Check payment method is allowed
        if (!limits.getAllowedPaymentMethods().contains(paymentMethod)) {
            registrationMetrics.incrementLimitViolation("payment_method");
            return String.format("%s is only available for verified customers. Please complete KYC verification.",
                    formatPaymentMethod(paymentMethod));
        }

        // Check per-transaction limit
        if (amount.compareTo(limits.getLimits().getPerTransactionLimit()) > 0) {
            registrationMetrics.incrementLimitViolation("per_transaction");
            return String.format("Transaction amount of %s XAF exceeds your per-transaction limit of %s XAF.",
                    amount.toPlainString(), limits.getLimits().getPerTransactionLimit().toPlainString());
        }

        // Check daily limit with actual usage
        BigDecimal dailyLimit = isDeposit ?
                limits.getLimits().getDailyDepositLimit() :
                limits.getLimits().getDailyWithdrawalLimit();

        if (clientId != null) {
            try {
                UsageSummary usage = calculateUsage(clientId);
                BigDecimal dailyUsed = isDeposit ? usage.dailyDeposits : usage.dailyWithdrawals;
                if (dailyUsed.add(amount).compareTo(dailyLimit) > 0) {
                    String limitType = isDeposit ? "deposit" : "withdrawal";
                    registrationMetrics.incrementLimitViolation("daily_" + limitType);
                    return String.format("Daily %s limit of %s XAF exceeded (used: %s XAF). Complete KYC to increase your limits.",
                            limitType, dailyLimit.toPlainString(), dailyUsed.toPlainString());
                }

                // Check monthly limit
                BigDecimal monthlyLimit = kycTier >= 2 ? TIER2_MONTHLY : TIER1_MONTHLY;
                if (usage.monthlyTotal.add(amount).compareTo(monthlyLimit) > 0) {
                    registrationMetrics.incrementLimitViolation("monthly");
                    return String.format("Monthly transaction limit of %s XAF exceeded (used: %s XAF).",
                            monthlyLimit.toPlainString(), usage.monthlyTotal.toPlainString());
                }
            } catch (Exception e) {
                log.warn("Failed to calculate usage for limit check, falling back to per-transaction check: {}", e.getMessage());
            }
        }

        // Fallback: simple per-transaction check if no clientId or usage calc failed
        if (amount.compareTo(dailyLimit) > 0) {
            String limitType = isDeposit ? "deposit" : "withdrawal";
            registrationMetrics.incrementLimitViolation("daily_" + limitType);
            return String.format("Daily %s limit of %s XAF exceeded. Complete KYC to increase your limits.",
                    limitType, dailyLimit.toPlainString());
        }

        return null; // Transaction allowed
    }

    /**
     * Calculate daily and monthly usage from Fineract transactions.
     */
    private UsageSummary calculateUsage(Long clientId) {
        List<Map<String, Object>> accounts = fineractService.getSavingsAccountsByClientId(clientId);

        BigDecimal dailyDeposits = BigDecimal.ZERO;
        BigDecimal dailyWithdrawals = BigDecimal.ZERO;
        BigDecimal monthlyTotal = BigDecimal.ZERO;

        LocalDate today = LocalDate.now(WAT_ZONE);
        LocalDate monthStart = today.withDayOfMonth(1);

        for (Map<String, Object> account : accounts) {
            if (!account.containsKey("id")) continue;
            Long accountId = ((Number) account.get("id")).longValue();

            List<Map<String, Object>> transactions = fineractService.getSavingsAccountTransactions(accountId);
            for (Map<String, Object> txn : transactions) {
                LocalDate txnDate = extractTransactionDate(txn);
                if (txnDate == null) continue;

                BigDecimal txnAmount = extractTransactionAmount(txn);
                boolean isDeposit = isDepositTransaction(txn);

                // Monthly total
                if (!txnDate.isBefore(monthStart)) {
                    monthlyTotal = monthlyTotal.add(txnAmount);
                }

                // Daily totals
                if (txnDate.equals(today)) {
                    if (isDeposit) {
                        dailyDeposits = dailyDeposits.add(txnAmount);
                    } else {
                        dailyWithdrawals = dailyWithdrawals.add(txnAmount);
                    }
                }
            }
        }

        return new UsageSummary(dailyDeposits, dailyWithdrawals, monthlyTotal);
    }

    @SuppressWarnings("unchecked")
    private LocalDate extractTransactionDate(Map<String, Object> txn) {
        try {
            Object dateObj = txn.get("date");
            if (dateObj instanceof List<?> dateList && dateList.size() >= 3) {
                return LocalDate.of(
                        ((Number) dateList.get(0)).intValue(),
                        ((Number) dateList.get(1)).intValue(),
                        ((Number) dateList.get(2)).intValue()
                );
            }
        } catch (Exception e) {
            log.debug("Failed to parse transaction date: {}", e.getMessage());
        }
        return null;
    }

    private BigDecimal extractTransactionAmount(Map<String, Object> txn) {
        Object amount = txn.get("amount");
        if (amount instanceof Number) {
            return BigDecimal.valueOf(((Number) amount).doubleValue());
        }
        return BigDecimal.ZERO;
    }

    private boolean isDepositTransaction(Map<String, Object> txn) {
        Object typeObj = txn.get("transactionType");
        if (typeObj instanceof Map<?, ?> typeMap) {
            Object deposit = typeMap.get("deposit");
            return Boolean.TRUE.equals(deposit);
        }
        return false;
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

    private record UsageSummary(BigDecimal dailyDeposits, BigDecimal dailyWithdrawals, BigDecimal monthlyTotal) {}
}
