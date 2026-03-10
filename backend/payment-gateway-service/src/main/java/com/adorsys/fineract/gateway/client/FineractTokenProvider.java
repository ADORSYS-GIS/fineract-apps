package com.adorsys.fineract.gateway.client;

import com.adorsys.fineract.gateway.config.FineractConfig;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import com.adorsys.fineract.gateway.service.TokenCacheService;

import java.time.Duration;
import java.util.Base64;
import java.util.Map;

/**
 * Provides OAuth2 access tokens for Fineract API authentication.
 *
 * Features:
 * - Automatic token caching with expiration tracking
 * - Thread-safe token refresh (ConcurrentHashMap)
 * - 60-second buffer before actual expiration to prevent token-in-flight expiry
 * - Falls back gracefully if OAuth is not configured
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class FineractTokenProvider {

    private final FineractConfig config;
    private final TokenCacheService tokenCacheService;

    private static final String CACHE_KEY = "fineract:oauth";

    /**
     * Get a valid access token for Fineract API.
     * Returns cached token if still valid, otherwise fetches a new one.
     *
     * @return OAuth2 access token
     * @throws IllegalStateException if OAuth is not configured properly
     */
    public String getAccessToken() {
        if (!config.isOAuthEnabled()) {
            throw new IllegalStateException("OAuth is not enabled. Set fineract.auth-type=oauth to use OAuth authentication.");
        }

        validateOAuthConfig();

        return tokenCacheService.getToken(CACHE_KEY).orElseGet(this::refreshToken);
    }

    /**
     * Force refresh the OAuth token.
     */
    @SuppressWarnings("unchecked")
    private synchronized String refreshToken() {
        // Double-check: another thread might have refreshed while we waited
        return tokenCacheService.getToken(CACHE_KEY).orElseGet(() -> {
            log.info("Fetching new Fineract OAuth token from: {}", config.getTokenUrl());

            try {
                String credentials = config.getClientId() + ":" + config.getClientSecret();
                String encodedCredentials = Base64.getEncoder().encodeToString(credentials.getBytes());

                WebClient tokenClient = WebClient.builder()
                        .baseUrl(config.getTokenUrl())
                        .build();

                Map<String, Object> response = tokenClient.post()
                        .header(HttpHeaders.AUTHORIZATION, "Basic " + encodedCredentials)
                        .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                        .bodyValue("grant_type=client_credentials")
                        .retrieve()
                        .bodyToMono(Map.class)
                        .timeout(Duration.ofSeconds(10))
                        .block();

                if (response == null) {
                    throw new RuntimeException("Empty response from token endpoint");
                }

                String accessToken = (String) response.get("access_token");
                if (accessToken == null) {
                    throw new RuntimeException("No access_token in response: " + response);
                }

                int expiresIn = 300;
                Object expiresInObj = response.get("expires_in");
                if (expiresInObj instanceof Number) {
                    expiresIn = ((Number) expiresInObj).intValue();
                }

                long ttlSeconds = expiresIn - 60; // 60s buffer before expiry
                tokenCacheService.putToken(CACHE_KEY, accessToken, ttlSeconds);

                log.info("Successfully obtained Fineract OAuth token (expires in {} seconds)", expiresIn);
                return accessToken;

            } catch (Exception e) {
                log.error("Failed to obtain Fineract OAuth token: {}", e.getMessage());
                throw new RuntimeException("Failed to obtain Fineract OAuth token", e);
            }
        });
    }

    private void validateOAuthConfig() {
        if (config.getTokenUrl() == null || config.getTokenUrl().isBlank()) {
            throw new IllegalStateException("fineract.token-url is required for OAuth authentication");
        }
        if (config.getClientId() == null || config.getClientId().isBlank()) {
            throw new IllegalStateException("fineract.client-id is required for OAuth authentication");
        }
        if (config.getClientSecret() == null || config.getClientSecret().isBlank()) {
            throw new IllegalStateException("fineract.client-secret is required for OAuth authentication");
        }
    }

    /**
     * Clear the token cache (useful for testing or forced refresh).
     */
    public void clearCache() {
        tokenCacheService.clear(CACHE_KEY);
        log.info("Fineract OAuth token cache cleared");
    }
}
