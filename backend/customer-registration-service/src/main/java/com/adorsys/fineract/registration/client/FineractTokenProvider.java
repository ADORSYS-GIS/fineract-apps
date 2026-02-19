package com.adorsys.fineract.registration.client;

import com.adorsys.fineract.registration.config.FineractProperties;
import com.adorsys.fineract.registration.exception.FineractAuthenticationException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

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

    private final FineractProperties config;

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
        if (!"oauth".equalsIgnoreCase(config.getAuth().getType())) {
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

        log.info("Fetching new Fineract OAuth token from: {}", config.getAuth().getTokenUrl());

        try {
            String requestBody = buildTokenRequestBody();

            // Create a simple RestClient for token endpoint
            RestClient tokenClient = RestClient.builder()
                    .baseUrl(config.getAuth().getTokenUrl())
                    .build();

            Map<String, Object> response = tokenClient.post()
                    .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                    .body(requestBody)
                    .retrieve()
                    .body(Map.class);

            log.info("Received response from Keycloak: {}", response);

            if (response == null) {
                throw new FineractAuthenticationException("Empty response from token endpoint");
            }

            String accessToken = (String) response.get("access_token");
            if (accessToken == null) {
                throw new FineractAuthenticationException("No access_token in response: " + response);
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
            log.warn("Logging full access token for debugging purposes. Do not use this in production.");
            log.debug("Fineract access token: {}", accessToken);
            return accessToken;

        } catch (Exception e) {
            log.error("Failed to obtain Fineract OAuth token: {}", e.getMessage());
            throw new FineractAuthenticationException("Failed to obtain Fineract OAuth token", e);
        }
    }

    private String buildTokenRequestBody() {
        String grantType = config.getAuth().getGrantType();
        log.info("Building Fineract token request with grant type: {}", grantType);
        StringBuilder body = new StringBuilder("grant_type=").append(grantType);

        body.append("&client_id=").append(config.getAuth().getClientId());
        body.append("&client_secret=").append(config.getAuth().getClientSecret());

        if ("password".equalsIgnoreCase(grantType)) {
            body.append("&username=").append(config.getAuth().getOauthUsername());
            body.append("&password=").append(config.getAuth().getOauthPassword());
        }

        String requestBody = body.toString();
        log.debug("Fineract token request body: {}", requestBody.replaceAll("password=.*", "password=***"));
        return requestBody;
    }

    private void validateOAuthConfig() {
        FineractProperties.Auth auth = config.getAuth();
        if (auth.getTokenUrl() == null || auth.getTokenUrl().isBlank()) {
            throw new IllegalStateException("fineract.auth.token-url is required for OAuth authentication");
        }
        if (auth.getClientId() == null || auth.getClientId().isBlank()) {
            throw new IllegalStateException("fineract.auth.client-id is required for OAuth authentication");
        }
        if (auth.getClientSecret() == null || auth.getClientSecret().isBlank()) {
            throw new IllegalStateException("fineract.auth.client-secret is required for OAuth authentication");
        }
        if ("password".equalsIgnoreCase(auth.getGrantType())) {
            if (auth.getOauthUsername() == null || auth.getOauthUsername().isBlank()) {
                throw new IllegalStateException("fineract.auth.oauth-username is required for password grant type");
            }
            if (auth.getOauthPassword() == null || auth.getOauthPassword().isBlank()) {
                throw new IllegalStateException("fineract.auth.oauth-password is required for password grant type");
            }
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
