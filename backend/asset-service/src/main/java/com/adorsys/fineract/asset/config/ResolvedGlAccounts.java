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

    /** Database ID of the digital asset inventory GL account. */
    private Long digitalAssetInventoryId;

    /** Database ID of the customer digital asset holdings GL account. */
    private Long customerDigitalAssetHoldingsId;

    /** Database ID of the transfers in suspense GL account. */
    private Long transfersInSuspenseId;

    /** Database ID of the income from interest GL account. */
    private Long incomeFromInterestId;

    /** Database ID of the expense account (for interest on savings / write-off). */
    private Long expenseAccountId;

    /** Database ID of the asset issuance payment type. */
    private Long assetIssuancePaymentTypeId;

    /** Database ID of the fund source / cash reference GL account. */
    private Long fundSourceId;

    /** Database ID of the platform-wide fee collection savings account (mandatory). */
    private Long feeCollectionAccountId;

    // --- New GL accounts for proper accounting separation ---

    /** Database ID of the asset equity / LP capital GL account (EQUITY type). */
    private Long assetEquityId;

    /** Database ID of the platform fee income GL account (INCOME type). */
    private Long platformFeeIncomeId;

    /** Database ID of the trading spread income GL account (INCOME type). */
    private Long spreadIncomeId;

    /** Database ID of the registration duty tax expense GL account (EXPENSE type). */
    private Long taxExpenseRegDutyId;

    /** Database ID of the capital gains tax expense GL account (EXPENSE type). */
    private Long taxExpenseCapGainsId;

    /** Database ID of the IRCM withholding tax expense GL account (EXPENSE type). */
    private Long taxExpenseIrcmId;
}
