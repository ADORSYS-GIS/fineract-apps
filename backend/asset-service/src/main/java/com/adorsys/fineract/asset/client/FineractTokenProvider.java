package com.adorsys.fineract.asset.client;

import com.adorsys.fineract.asset.config.FineractConfig;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Duration;
import java.util.Base64;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Provides OAuth2 access tokens for Fineract API authentication.
 * Caches tokens with a 60-second buffer before expiration.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class FineractTokenProvider {

    private final FineractConfig config;

    private final Map<String, TokenInfo> tokenCache = new ConcurrentHashMap<>();
    private static final String CACHE_KEY = "fineract";
    private static final long EXPIRATION_BUFFER_MS = 60_000;

    /**
     * Get a valid access token for Fineract API.
     */
    public String getAccessToken() {
        if (!config.isOAuthEnabled()) {
            throw new IllegalStateException("OAuth is not enabled. Set fineract.auth-type=oauth.");
        }

        TokenInfo cached = tokenCache.get(CACHE_KEY);
        if (cached != null && !cached.isExpired()) {
            return cached.token;
        }

        return refreshToken();
    }

    @SuppressWarnings("unchecked")
    private synchronized String refreshToken() {
        TokenInfo cached = tokenCache.get(CACHE_KEY);
        if (cached != null && !cached.isExpired()) {
            return cached.token;
        }

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

            long expiresAt = System.currentTimeMillis() + (expiresIn * 1000L) - EXPIRATION_BUFFER_MS;
            tokenCache.put(CACHE_KEY, new TokenInfo(accessToken, expiresAt));

            log.info("Obtained Fineract OAuth token (expires in {} seconds)", expiresIn);
            return accessToken;

        } catch (Exception e) {
            log.error("Failed to obtain Fineract OAuth token: {}", e.getMessage());
            throw new RuntimeException("Failed to obtain Fineract OAuth token", e);
        }
    }

    public void clearCache() {
        tokenCache.clear();
    }

    private record TokenInfo(String token, long expiresAt) {
        boolean isExpired() {
            return System.currentTimeMillis() >= expiresAt;
        }
    }
}
