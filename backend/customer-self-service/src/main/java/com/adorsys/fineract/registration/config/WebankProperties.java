package com.adorsys.fineract.registration.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "webank.cs")
public record WebankProperties(
    String apiKey,
    long recoveryCoolingCap,
    long dailyLimitTtl,
    long monthlyLimitTtl
) {
    public WebankProperties {
        if (recoveryCoolingCap <= 0) recoveryCoolingCap = 50000;
        if (dailyLimitTtl <= 0) dailyLimitTtl = 86400;
        if (monthlyLimitTtl <= 0) monthlyLimitTtl = 2592000;
    }
}
