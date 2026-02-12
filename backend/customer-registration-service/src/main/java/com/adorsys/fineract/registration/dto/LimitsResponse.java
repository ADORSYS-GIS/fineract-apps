package com.adorsys.fineract.registration.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LimitsResponse {

    private Integer kycTier;
    private String tierName;
    private LimitsDto limits;
    private UsageDto usage;
    private AvailableDto available;
    private List<String> allowedPaymentMethods;
    private List<String> restrictedFeatures;
    private String currency;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LimitsDto {
        private BigDecimal dailyDepositLimit;
        private BigDecimal dailyWithdrawalLimit;
        private BigDecimal perTransactionLimit;
        private BigDecimal monthlyTransactionLimit;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UsageDto {
        private BigDecimal dailyDepositUsed;
        private BigDecimal dailyWithdrawalUsed;
        private BigDecimal monthlyUsed;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AvailableDto {
        private BigDecimal depositRemaining;
        private BigDecimal withdrawalRemaining;
    }
}
