package com.adorsys.fineract.registration.config;

import com.adorsys.fineract.registration.client.FineractTokenProvider;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.web.client.RestClient;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.stream.Collectors;

/**
 * Configuration for Fineract API client.
 * Supports both OAuth2 (default) and Basic Auth authentication.
 *
 * Auth type is controlled by the 'fineract.auth-type' property:
 * - oauth: Uses OAuth2 client credentials flow (default)
 * - basic: Uses HTTP Basic Authentication
 */
@Slf4j
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

    private String grantType = "client_credentials";
    private String oauthUsername;
    private String oauthPassword;

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
                .defaultHeader(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
                .requestInterceptor(loggingInterceptor());

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

    private ClientHttpRequestInterceptor loggingInterceptor() {
        return (request, body, execution) -> {
            log.debug("Request to Fineract: {} {}", request.getMethod(), request.getURI());
            log.trace("Request headers: {}", request.getHeaders());
            if (body.length > 0) {
                log.trace("Request body: {}", new String(body, StandardCharsets.UTF_8));
            }

            var response = execution.execute(request, body);

            log.debug("Response from Fineract: {}", response.getStatusCode());
            log.trace("Response headers: {}", response.getHeaders());
            // Buffer the response body to be able to read it here and downstream
            var responseBody = new BufferedReader(new InputStreamReader(response.getBody(), StandardCharsets.UTF_8))
                    .lines()
                    .collect(Collectors.joining("\n"));
            if (!responseBody.isEmpty()) {
                log.trace("Response body: {}", responseBody);
            }

            return response;
        };
    }
}
