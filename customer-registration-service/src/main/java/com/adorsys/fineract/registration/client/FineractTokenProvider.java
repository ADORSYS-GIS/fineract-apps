package com.adorsys.fineract.registration.client;

import com.adorsys.fineract.registration.config.FineractConfig;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.Base64;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

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

    private final Map<String, TokenInfo> tokenCache = new ConcurrentHashMap<>();

    private static final String CACHE_KEY = "fineract";
    private static final long EXPIRATION_BUFFER_MS = 60_000; // 60 seconds buffer

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

        TokenInfo cached = tokenCache.get(CACHE_KEY);
        if (cached != null && !cached.isExpired()) {
            log.debug("Using cached Fineract OAuth token (expires in {} seconds)",
                    (cached.expiresAt - System.currentTimeMillis()) / 1000);
            return cached.token;
        }

        return refreshToken();
    }

    /**
     * Force refresh the OAuth token.
     */
    @SuppressWarnings("unchecked")
    private synchronized String refreshToken() {
        // Double-check pattern: another thread might have refreshed while we waited
        TokenInfo cached = tokenCache.get(CACHE_KEY);
        if (cached != null && !cached.isExpired()) {
            return cached.token;
        }

        log.info("Fetching new Fineract OAuth token from: {}", config.getTokenUrl());

        try {
            // Build credentials for Basic Auth header (client_id:client_secret)
            String credentials = config.getClientId() + ":" + config.getClientSecret();
            String encodedCredentials = Base64.getEncoder().encodeToString(credentials.getBytes());

            // Create a simple RestClient for token endpoint
            RestClient tokenClient = RestClient.builder()
                    .baseUrl(config.getTokenUrl())
                    .build();

            Map<String, Object> response = tokenClient.post()
                    .header(HttpHeaders.AUTHORIZATION, "Basic " + encodedCredentials)
                    .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                    .body("grant_type=client_credentials")
                    .retrieve()
                    .body(Map.class);

            if (response == null) {
                throw new RuntimeException("Empty response from token endpoint");
            }

            String accessToken = (String) response.get("access_token");
            if (accessToken == null) {
                throw new RuntimeException("No access_token in response: " + response);
            }

            // Get expiration time (default to 5 minutes if not provided)
            int expiresIn = 300;
            Object expiresInObj = response.get("expires_in");
            if (expiresInObj instanceof Number) {
                expiresIn = ((Number) expiresInObj).intValue();
            }

            // Cache token with buffer before actual expiration
            long expiresAt = System.currentTimeMillis() + (expiresIn * 1000L) - EXPIRATION_BUFFER_MS;
            tokenCache.put(CACHE_KEY, new TokenInfo(accessToken, expiresAt));

            log.info("Successfully obtained Fineract OAuth token (expires in {} seconds)", expiresIn);
            return accessToken;

        } catch (Exception e) {
            log.error("Failed to obtain Fineract OAuth token: {}", e.getMessage());
            throw new RuntimeException("Failed to obtain Fineract OAuth token", e);
        }
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
        tokenCache.clear();
        log.info("Fineract OAuth token cache cleared");
    }

    private record TokenInfo(String token, long expiresAt) {
        boolean isExpired() {
            return System.currentTimeMillis() >= expiresAt;
        }
    }
}
