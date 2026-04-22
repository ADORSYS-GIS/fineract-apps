package com.adorsys.fineract.asset.config;

import jakarta.annotation.PostConstruct;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * Configuration properties for Fineract API integration.
 * Supports both OAuth2 and Basic Auth authentication.
 */
@Data
@Configuration
@ConfigurationProperties(prefix = "fineract")
public class FineractConfig {

    private String url = "https://localhost:8443";
    private String tenant = "default";
    private String authType = "oauth";

    // OAuth2 settings
    private String tokenUrl;
    private String clientId;
    private String clientSecret;

    // Basic auth settings
    private String username;
    private String password;

    private int timeoutSeconds = 30;

    public boolean isOAuthEnabled() {
        return "oauth".equalsIgnoreCase(authType);
    }

    @PostConstruct
    public void validate() {
        if ("basic".equalsIgnoreCase(authType)) {
            if (username == null || username.isBlank()) {
                throw new IllegalStateException(
                        "fineract.username must be set when fineract.auth-type=basic");
            }
            if (password == null || password.isBlank()) {
                throw new IllegalStateException(
                        "fineract.password must be set when fineract.auth-type=basic");
            }
        }
    }
}
