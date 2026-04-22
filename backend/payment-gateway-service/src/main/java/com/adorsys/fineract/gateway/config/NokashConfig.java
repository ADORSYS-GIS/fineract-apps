package com.adorsys.fineract.gateway.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@ConfigurationProperties(prefix = "nokash")
public class NokashConfig {

    private boolean enabled;
    private String baseUrl;
    private String iSpaceKey;
    private String appSpaceKey;
    private String callbackUrl;
    private String country;
    private int timeoutSeconds;
    private String currency;
    private Long fineractPaymentTypeId;
    // TODO: Used for GL reconciliation reporting — not passed to createDeposit/createWithdrawal.
    // Fineract GL routing happens via paymentTypeId → paymentChannelToFundSourceMappings.
    private String glAccountCode;
    private String senderFirstName;
    private String senderLastName;
}
