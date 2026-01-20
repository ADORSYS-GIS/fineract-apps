package com.adorsys.fineract.gateway.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * Configuration properties for Orange Money API integration.
 *
 * Orange Money API uses OAuth2 for authentication and requires:
 * - Client ID and secret for token generation
 * - Merchant code for payment collection
 */
@Data
@Configuration
@ConfigurationProperties(prefix = "payment.orange")
public class OrangeMoneyConfig {

    /**
     * Orange Money API base URL
     * Sandbox: https://api.orange.com/orange-money-webpay/dev/v1
     * Production: https://api.orange.com/orange-money-webpay/cm/v1
     */
    private String baseUrl = "https://api.orange.com/orange-money-webpay/dev/v1";

    /**
     * OAuth2 token URL
     */
    private String tokenUrl = "https://api.orange.com/oauth/v3/token";

    /**
     * OAuth2 client ID
     */
    private String clientId;

    /**
     * OAuth2 client secret
     */
    private String clientSecret;

    /**
     * Merchant code for payment collection
     */
    private String merchantCode;

    /**
     * Callback URL for payment notifications
     */
    private String callbackUrl;

    /**
     * Return URL after payment completion
     */
    private String returnUrl;

    /**
     * Cancel URL if payment is cancelled
     */
    private String cancelUrl;

    /**
     * Currency code (XAF for Central Africa)
     */
    private String currency = "XAF";

    /**
     * Request timeout in seconds
     */
    private int timeoutSeconds = 30;

    /**
     * Payment type ID in Fineract for Orange transfers
     */
    private Long fineractPaymentTypeId;

    /**
     * GL account code for Orange Money in Fineract
     */
    private String glAccountCode = "44";
}
