package com.adorsys.fineract.asset.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;

/**
 * Tax configuration properties for Cameroon/CEMAC compliance.
 * Bound from TAX_* environment variables (prefix: tax).
 */
@Data
@Configuration
@ConfigurationProperties(prefix = "tax")
public class TaxConfig {

    /** External ID of the DGI Tax Authority client in Fineract. */
    private String authorityExternalId = "TAX-AUTHORITY";

    /** External ID of the registration duty collection savings account. */
    private String regDutyAccountExternalId = "TAX-REG-DUTY";

    /** External ID of the IRCM collection savings account. */
    private String ircmAccountExternalId = "TAX-IRCM";

    /** External ID of the capital gains tax collection savings account. */
    private String capGainsAccountExternalId = "TAX-CAP-GAINS";

    /** External ID of the TVA (VAT) collection savings account. */
    private String tvaAccountExternalId = "TAX-TVA";

    /** Default registration duty rate (2% = 0.02). */
    private BigDecimal defaultRegistrationDutyRate = new BigDecimal("0.02");

    /** Default IRCM rate on dividends (16.5% = 0.165). */
    private BigDecimal defaultIrcmDividendRate = new BigDecimal("0.165");

    /** IRCM rate for BVMAC-listed securities (11% = 0.11). */
    private BigDecimal defaultIrcmBvmacRate = new BigDecimal("0.11");

    /** IRCM rate on bond coupons with maturity >= 5 years (5.5% = 0.055). */
    private BigDecimal defaultIrcmBondRate = new BigDecimal("0.055");

    /** Default capital gains tax rate (16.5% = 0.165). */
    private BigDecimal defaultCapitalGainsRate = new BigDecimal("0.165");

    /** Annual capital gains exemption threshold in XAF. Gains below this are exempt. */
    private BigDecimal capitalGainsAnnualExemption = new BigDecimal("500000");

    /** Default TVA (VAT) rate (19.25% = 0.1925). */
    private BigDecimal defaultTvaRate = new BigDecimal("0.1925");
}
