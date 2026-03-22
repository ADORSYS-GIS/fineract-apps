package com.adorsys.fineract.registration.dto.webank;

public record LimitsResponse(
    int kycLevel,
    long p2pPerTxn,
    long p2pDaily,
    long p2pDailyUsed,
    long topupMonthly,
    long topupMonthlyUsed,
    long cashoutPerOp,
    long merchantPerTxn,
    long sendMomo
) {}
