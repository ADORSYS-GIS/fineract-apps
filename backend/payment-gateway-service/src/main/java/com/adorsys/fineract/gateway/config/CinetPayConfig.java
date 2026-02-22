package com.adorsys.fineract.gateway.config;

import jakarta.annotation.PostConstruct;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * Configuration properties for CinetPay API integration.
 *
 * CinetPay is a payment gateway that routes to multiple providers (MTN MoMo, Orange Money, Cards).
 * GL account mapping is done dynamically based on the actual payment method used by the customer.
 *
 * API documentation: https://docs.cinetpay.com/
 */
@Slf4j
@Data
@Configuration
@ConfigurationProperties(prefix = "cinetpay")
public class CinetPayConfig {

    @PostConstruct
    public void validateConfig() {
        if (secretKey == null || secretKey.isEmpty()) {
            log.warn("CINETPAY_SECRET_KEY is not configured. All CinetPay callbacks will be rejected.");
        }
    }

    /**
     * CinetPay Checkout API base URL
     * Production: https://api-checkout.cinetpay.com
     */
    private String baseUrl = "https://api-checkout.cinetpay.com";

    /**
     * CinetPay Transfer API base URL (for disbursements)
     * Production: https://client.cinetpay.com
     */
    private String transferUrl = "https://client.cinetpay.com";

    /**
     * CinetPay API key
     */
    private String apiKey;

    /**
     * CinetPay site ID (merchant identifier)
     */
    private Integer siteId;

    /**
     * CinetPay API password (legacy/checkout)
     */
    private String apiPassword;

    /**
     * CinetPay Transfer API password (for /auth/login)
     */
    private String transferPassword;

    /**
     * CinetPay Secret Key (for HMAC validation)
     */
    private String secretKey;

    /**
     * Currency code (XAF for Central Africa)
     */
    private String currency = "XAF";

    /**
     * Request timeout in seconds
     */
    private int timeoutSeconds = 30;

    /**
     * Base URL for payment gateway service (ELB URL injected at deployment)
     * Used to construct callback URLs dynamically
     */
    @Value("${payment.gateway.base-url:}")
    private String gatewayBaseUrl;

    /**
     * Base URL for self-service app (ELB URL injected at deployment)
     * Used to construct return/cancel URLs dynamically
     */
    @Value("${self-service.app.base-url:}")
    private String selfServiceBaseUrl;

    /**
     * Get the callback URL for payment notifications.
     * Constructed dynamically from the gateway base URL.
     */
    public String getCallbackUrl() {
        return gatewayBaseUrl + "/api/callbacks/cinetpay";
    }

    /**
     * Get the return URL after payment completion.
     * Constructed dynamically from the self-service app base URL.
     */
    public String getReturnUrl() {
        return selfServiceBaseUrl + "/transactions";
    }

    /**
     * Get the cancel URL if payment is cancelled.
     * Constructed dynamically from the self-service app base URL.
     */
    public String getCancelUrl() {
        return selfServiceBaseUrl + "/transactions";
    }

    // Note: No fineractPaymentTypeId or glAccountCode here
    // GL mapping is done dynamically based on cpm_payment_method from callback
    // (MOMO -> MTN GL account, OM -> Orange GL account)
}
