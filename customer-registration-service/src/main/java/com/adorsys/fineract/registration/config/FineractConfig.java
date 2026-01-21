package com.adorsys.fineract.registration.config;

import com.adorsys.fineract.registration.client.FineractTokenProvider;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.web.client.RestClient;

import java.util.Base64;

/**
 * Configuration for Fineract API client.
 * Supports both OAuth2 (default) and Basic Auth authentication.
 *
 * Auth type is controlled by the 'fineract.auth-type' property:
 * - oauth: Uses OAuth2 client credentials flow (default)
 * - basic: Uses HTTP Basic Authentication
 */
@Configuration
@ConfigurationProperties(prefix = "fineract")
@Getter
@Setter
public class FineractConfig {

    private String url;
    private String tenant = "default";

    /**
     * Authentication type: "oauth" (default) or "basic"
     */
    private String authType = "oauth";

    // OAuth2 settings (used when auth-type=oauth)
    private String tokenUrl;
    private String clientId;
    private String clientSecret;

    // Basic auth settings (used when auth-type=basic)
    private String username;
    private String password;

    // Fineract defaults
    private Long defaultOfficeId = 1L;
    private Long defaultSavingsProductId = 1L;

    public boolean isOAuthEnabled() {
        return "oauth".equalsIgnoreCase(authType);
    }

    @Bean
    public RestClient fineractRestClient(FineractTokenProvider tokenProvider) {
        RestClient.Builder builder = RestClient.builder()
                .baseUrl(url)
                .defaultHeader("Fineract-Platform-TenantId", tenant)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .defaultHeader(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE);

        if (isOAuthEnabled()) {
            // OAuth: Use request interceptor to add Bearer token dynamically
            builder.requestInterceptor(oauthInterceptor(tokenProvider));
        } else {
            // Basic Auth: Add static header
            String credentials = username + ":" + password;
            String encodedCredentials = Base64.getEncoder().encodeToString(credentials.getBytes());
            builder.defaultHeader(HttpHeaders.AUTHORIZATION, "Basic " + encodedCredentials);
        }

        return builder.build();
    }

    private ClientHttpRequestInterceptor oauthInterceptor(FineractTokenProvider tokenProvider) {
        return (request, body, execution) -> {
            request.getHeaders().set(HttpHeaders.AUTHORIZATION, "Bearer " + tokenProvider.getAccessToken());
            return execution.execute(request, body);
        };
    }
}
