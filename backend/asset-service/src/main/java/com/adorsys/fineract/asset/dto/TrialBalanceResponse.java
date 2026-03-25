package com.adorsys.fineract.asset.dto;

import java.math.BigDecimal;
import java.util.List;

public record TrialBalanceResponse(
        String currencyCode,
        String fromDate,
        String toDate,
        List<TrialBalanceEntry> entries,
        BigDecimal totalDebits,
        BigDecimal totalCredits
) {
    public record TrialBalanceEntry(
            Long glAccountId,
            String glCode,
            String glAccountName,
            String glAccountType,
            BigDecimal debitAmount,
            BigDecimal creditAmount,
            BigDecimal balance
    ) {}
}
