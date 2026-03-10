package com.adorsys.fineract.asset.config;

import lombok.Data;
import org.springframework.stereotype.Component;

/**
 * Holds the resolved Fineract database IDs for tax collection savings accounts.
 * Populated at startup by {@link com.adorsys.fineract.asset.client.GlAccountResolver}.
 */
@Data
@Component
public class ResolvedTaxAccounts {

    /** Fineract savings account ID for registration duty collection (TAX-REG-DUTY). */
    private Long registrationDutyAccountId;

    /** Fineract savings account ID for IRCM withholding collection (TAX-IRCM). */
    private Long ircmAccountId;

    /** Fineract savings account ID for capital gains tax collection (TAX-CAP-GAINS). */
    private Long capitalGainsAccountId;
}
