package com.adorsys.fineract.asset.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

/**
 * Trial balance report for all GL accounts within a date range, returned by
 * {@code GET /api/admin/accounting/trial-balance}.
 *
 * <p>Shows aggregated debit and credit totals per GL account for the specified period.
 * The report includes both header (parent) accounts and detail (leaf) accounts, structured
 * hierarchically using {@code depth} and {@code parentGlCode}. In a balanced ledger,
 * {@code totalDebits} and {@code totalCredits} are equal.</p>
 *
 * <p>GL account types follow the SYSCOHADA chart of accounts used in CEMAC:
 * 1xxx = Assets, 2xxx = Liabilities/Equity, 4xxx = Payables, 5xxx = Trust/Bank,
 * 7xxx = Income.</p>
 */
@Data
@Builder
public class TrialBalanceResponse {

    /**
     * ISO 4217 currency code for all monetary amounts in this report.
     * Typically {@code XAF} for CEMAC-denominated accounts.
     */
    private String currencyCode;

    /**
     * Start of the reporting period in {@code yyyy-MM-dd} format (inclusive).
     * Transactions on or after this date are included.
     */
    private String fromDate;

    /**
     * End of the reporting period in {@code yyyy-MM-dd} format (inclusive).
     * Transactions on or before this date are included.
     */
    private String toDate;

    /**
     * Ordered list of all GL accounts with their debit and credit totals for the period.
     * Includes both header accounts (aggregates) and detail accounts (leaf nodes).
     * Sorted by GL code for consistent display.
     */
    private List<TrialBalanceEntry> entries;

    /**
     * Sum of all debit amounts across all detail GL accounts for the period, in XAF.
     * Should equal {@code totalCredits} in a balanced ledger.
     */
    private BigDecimal totalDebits;

    /**
     * Sum of all credit amounts across all detail GL accounts for the period, in XAF.
     * Should equal {@code totalDebits} in a balanced ledger.
     */
    private BigDecimal totalCredits;

    /**
     * Single GL account row in the trial balance report.
     *
     * <p>Header accounts (where {@code header == true}) aggregate their children's balances.
     * Detail accounts are leaf nodes with actual transaction activity.</p>
     */
    @Data
    @Builder
    public static class TrialBalanceEntry {
        /** Internal Fineract GL account ID. */
        private Long glAccountId;

        /**
         * GL account code as configured in Fineract (e.g. {@code "4011"}, {@code "5011"}).
         * Used to identify accounts in settlement and reconciliation logic.
         */
        private String glCode;

        /**
         * Human-readable name of the GL account (e.g. "LP Settlement Payable", "UBA Trust Account").
         */
        private String glAccountName;

        /**
         * Broad category of this GL account.
         * One of: {@code ASSET}, {@code LIABILITY}, {@code EQUITY}, {@code INCOME}, {@code EXPENSE}.
         * Determines normal balance direction (debit or credit).
         */
        private String glAccountType;

        /**
         * Whether this is a header (parent/summary) account rather than a detail (leaf) account.
         * Header accounts do not directly hold transactions; their balances aggregate child accounts.
         */
        private boolean header;

        /**
         * GL code of the parent account in the chart of accounts hierarchy.
         * Null for top-level accounts with no parent.
         */
        private String parentGlCode;

        /**
         * Nesting depth in the GL hierarchy. {@code 0} for top-level accounts,
         * {@code 1} for direct children, and so on. Used for indented display in the UI.
         */
        private int depth;

        /**
         * Total debits posted to this GL account during the reporting period, in XAF.
         * Zero if no debits occurred in the period.
         */
        private BigDecimal debitAmount;

        /**
         * Total credits posted to this GL account during the reporting period, in XAF.
         * Zero if no credits occurred in the period.
         */
        private BigDecimal creditAmount;

        /**
         * Net balance for this account in the reporting period, in XAF.
         * Calculated as {@code debitAmount - creditAmount} for asset/expense accounts,
         * or {@code creditAmount - debitAmount} for liability/income/equity accounts.
         */
        private BigDecimal balance;
    }
}
