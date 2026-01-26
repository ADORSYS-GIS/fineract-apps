package com.adorsys.fineract.gateway.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * Configuration properties for Fineract API integration.
 *
 * Supports both OAuth2 (default) and Basic Auth authentication.
 * Auth type is controlled by the 'fineract.auth-type' property:
 * - oauth: Uses OAuth2 client credentials flow (default)
 * - basic: Uses HTTP Basic Authentication
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
     * Authentication type: "oauth" (default) or "basic"
     */
    private String authType = "oauth";

    // OAuth2 settings (used when auth-type=oauth)

    /**
     * OAuth2 token endpoint URL (typically Keycloak)
     */
    private String tokenUrl;

    /**
     * OAuth2 client ID for Fineract API access
     */
    private String clientId;

    /**
     * OAuth2 client secret
     */
    private String clientSecret;

    // Basic auth settings (used when auth-type=basic)

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

    public boolean isOAuthEnabled() {
        return "oauth".equalsIgnoreCase(authType);
    }
}
