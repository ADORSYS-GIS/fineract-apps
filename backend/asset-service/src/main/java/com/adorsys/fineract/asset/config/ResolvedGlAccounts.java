package com.adorsys.fineract.asset.config;

import lombok.Data;
import org.springframework.stereotype.Component;

/**
 * Holds the resolved Fineract database IDs for GL accounts and payment types.
 * Populated at startup by {@link com.adorsys.fineract.asset.client.GlAccountResolver}
 * which maps GL codes (from configuration) to their actual database IDs via the Fineract API.
 */
@Data
@Component
public class ResolvedGlAccounts {

    // --- Client GL accounts ---
    /** Database ID of the fund source / cash reference GL account (client side). */
    private Long fundSourceId;
    /** Database ID of the client savings control GL account. */
    private Long savingsControlId;
    /** Database ID of the customer digital asset holdings GL account. */
    private Long customerDigitalAssetHoldingsId;

    // --- LP GL accounts ---
    /** Database ID of the LP settlement control GL account. */
    private Long lpSettlementControlId;
    /** Database ID of the LP spread payable GL account. */
    private Long lpSpreadPayableId;
    /** Database ID of the LP tax withholding GL account. */
    private Long lpTaxWithholdingId;
    /** Database ID of the LP fund source GL account (UBA bank trust). */
    private Long lpFundSourceId;

    // --- Trust accounts ---
    private Long mtnMoMoId;
    private Long orangeMoneyId;
    private Long ubaBankId;
    private Long afrilandBankId;

    // --- Inventory & suspense ---
    /** Database ID of the digital asset inventory GL account. */
    private Long digitalAssetInventoryId;
    /** Database ID of the transfers in suspense GL account. */
    private Long transfersInSuspenseId;

    // --- Income ---
    /** Database ID of the platform fee payable GL account (4201). */
    private Long platformFeePayableId;
    /** Database ID of the platform fee income GL account. */
    private Long platformFeeIncomeId;
    /** Database ID of the income from interest GL account. */
    private Long incomeFromInterestId;
    /** Database ID of the trading fee income GL account (alias for platformFeeIncome). */
    private Long feeIncomeId;

    // --- Expense ---
    /** Database ID of the expense account (for interest on savings / write-off). */
    private Long expenseAccountId;
    /** Database ID of the tax expense - registration duty GL account. */
    private Long taxExpenseRegDutyId;
    /** Database ID of the tax expense - capital gains GL account. */
    private Long taxExpenseCapGainsId;
    /** Database ID of the tax expense - IRCM GL account. */
    private Long taxExpenseIrcmId;
    /** Database ID of the tax expense - TVA GL account. */
    private Long taxExpenseTvaId;

    // --- Equity ---
    /** Database ID of the LP asset equity GL account. */
    private Long assetEquityId;

    // --- Tax payable ---
    /** Database ID of the tax payable fund source (Afriland tax account). */
    private Long taxPayableFundSourceId;

    // --- Payment types ---
    /** Database ID of the asset issuance payment type. */
    private Long assetIssuancePaymentTypeId;

    // --- Savings accounts ---
    /** Database ID of the platform-wide fee collection savings account (mandatory). */
    private Long feeCollectionAccountId;

    /** Database ID of the clearing account for BUY trade routing. */
    private Long clearingAccountId;
}
