package com.adorsys.fineract.gateway.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * Configuration properties for Fineract API integration.
 */
@Data
@Configuration
@ConfigurationProperties(prefix = "fineract")
public class FineractConfig {

    /**
     * Fineract API base URL
     */
    private String url = "https://localhost:8443";

    /**
     * Fineract tenant ID
     */
    private String tenant = "default";

    /**
     * Service account username for Fineract API
     */
    private String username;

    /**
     * Service account password for Fineract API
     */
    private String password;

    /**
     * Default savings product ID for self-service accounts
     */
    private Long defaultSavingsProductId = 1L;

    /**
     * Request timeout in seconds
     */
    private int timeoutSeconds = 30;
}
