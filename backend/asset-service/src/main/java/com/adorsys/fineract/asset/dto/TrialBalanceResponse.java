package com.adorsys.fineract.asset.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

/**
 * Trial balance response showing all GL accounts with debit/credit totals.
 */
@Data
@Builder
public class TrialBalanceResponse {

    private String currencyCode;
    private String fromDate;
    private String toDate;
    private List<TrialBalanceEntry> entries;
    private BigDecimal totalDebits;
    private BigDecimal totalCredits;

    @Data
    @Builder
    public static class TrialBalanceEntry {
        private Long glAccountId;
        private String glCode;
        private String glAccountName;
        /** ASSET, LIABILITY, EQUITY, INCOME, EXPENSE */
        private String glAccountType;
        /** True if this is a header/parent account. */
        private boolean header;
        /** Parent GL code (null for top-level accounts). */
        private String parentGlCode;
        /** Nesting depth (0 for top-level, 1 for children). */
        private int depth;
        private BigDecimal debitAmount;
        private BigDecimal creditAmount;
        private BigDecimal balance;
    }
}
