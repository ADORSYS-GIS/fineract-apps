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

    /** Database ID of the trading fee income GL account. */
    private Long feeIncomeId;

    /** Database ID of the fund source / cash reference GL account. */
    private Long fundSourceId;
}
