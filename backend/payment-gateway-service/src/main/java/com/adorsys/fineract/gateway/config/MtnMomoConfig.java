package com.adorsys.fineract.gateway.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * Configuration properties for MTN Mobile Money API integration.
 *
 * MTN MoMo API uses OAuth2 for authentication and requires:
 * - Subscription key (API key)
 * - API user ID and secret for token generation
 * - Target environment (sandbox/production)
 */
@Data
@Configuration
@ConfigurationProperties(prefix = "payment.mtn")
public class MtnMomoConfig {

    /**
     * MTN MoMo API base URL
     * Sandbox: https://sandbox.momodeveloper.mtn.com
     * Production: https://momodeveloper.mtn.com
     */
    private String baseUrl = "https://sandbox.momodeveloper.mtn.com";

    /**
     * Collection API subscription key (Ocp-Apim-Subscription-Key)
     */
    private String collectionSubscriptionKey;

    /**
     * Disbursement API subscription key
     */
    private String disbursementSubscriptionKey;

    /**
     * API User ID (UUID format)
     */
    private String apiUserId;

    /**
     * API Key (generated from API user)
     */
    private String apiKey;

    /**
     * Target environment: sandbox or production
     */
    private String targetEnvironment = "sandbox";

    /**
     * Callback URL for payment notifications
     */
    private String callbackUrl;

    /**
     * Currency code (XAF for Central Africa)
     */
    private String currency = "XAF";

    /**
     * Request timeout in seconds
     */
    private int timeoutSeconds = 30;

    /**
     * Payment type ID in Fineract for MTN transfers
     */
    private Long fineractPaymentTypeId;

    /**
     * GL account code for MTN MoMo in Fineract
     */
    private String glAccountCode = "43";
}
