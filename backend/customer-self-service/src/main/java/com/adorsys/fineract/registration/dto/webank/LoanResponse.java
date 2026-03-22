package com.adorsys.fineract.registration.dto.webank;

import java.util.List;

public record LoanResponse(
    String loanId,
    long amount,
    String disbursedAt,
    String firstRepaymentDate,
    List<RepaymentEntry> repaymentSchedule
) {
    public record RepaymentEntry(String date, long amount, String status) {}
}
