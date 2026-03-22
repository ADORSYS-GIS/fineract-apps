package com.adorsys.fineract.registration.dto.webank;

public record BalanceResponse(
    long balance,
    String currency,
    int kycLevel,
    long dailyLimit,
    long dailyUsed,
    long monthlyTopupLimit,
    long monthlyTopupUsed,
    boolean recovering
) {}
