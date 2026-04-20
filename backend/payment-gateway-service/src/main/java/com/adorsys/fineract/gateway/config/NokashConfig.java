package com.adorsys.fineract.gateway.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@ConfigurationProperties(prefix = "nokash")
public class NokashConfig {

    private boolean enabled = true;
    private String baseUrl = "https://api.nokash.app";
    private String iSpaceKey;
    private String appSpaceKey;
    private String callbackUrl = "http://localhost:8082/api/callbacks/nokash";
    private String country = "CM";
    private int timeoutSeconds = 90;
    private String currency = "XAF";
    private Long fineractPaymentTypeId = 2L;
    private String glAccountCode;
}
