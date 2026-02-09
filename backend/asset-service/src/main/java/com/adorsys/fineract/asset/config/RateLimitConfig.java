package com.adorsys.fineract.asset.config;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Base64;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Rate limiting configuration for trading and API endpoints.
 */
@Slf4j
@Configuration
public class RateLimitConfig {

    private static final int TRADE_LIMIT = 10;
    private static final Duration TRADE_DURATION = Duration.ofMinutes(1);

    private static final int GENERAL_LIMIT = 100;
    private static final Duration GENERAL_DURATION = Duration.ofMinutes(1);

    private static final int MAX_BUCKETS = 10_000;

    private final Map<String, Bucket> tradeBuckets = new ConcurrentHashMap<>();
    private final Map<String, Bucket> generalBuckets = new ConcurrentHashMap<>();

    @Bean
    public RateLimitFilter rateLimitFilter() {
        return new RateLimitFilter();
    }

    /**
     * Evict all buckets every 10 minutes to prevent unbounded memory growth.
     * Buckets are recreated on next access with fresh token counts.
     */
    @Scheduled(fixedRate = 600000)
    public void evictStaleBuckets() {
        int tradeSize = tradeBuckets.size();
        int generalSize = generalBuckets.size();
        if (tradeSize > 0 || generalSize > 0) {
            tradeBuckets.clear();
            generalBuckets.clear();
            log.debug("Evicted rate limit buckets: {} trade, {} general", tradeSize, generalSize);
        }
    }

    public class RateLimitFilter extends OncePerRequestFilter {

        @Override
        protected void doFilterInternal(HttpServletRequest request,
                                        HttpServletResponse response,
                                        FilterChain filterChain) throws ServletException, IOException {
            String path = request.getRequestURI();

            if (path.contains("/actuator") || path.contains("/swagger-ui") || path.contains("/api-docs")) {
                filterChain.doFilter(request, response);
                return;
            }

            String clientIdentifier = getClientIdentifier(request);
            Bucket bucket;

            if (path.contains("/trades/buy") || path.contains("/trades/sell")) {
                // Safety check: don't let map grow beyond MAX_BUCKETS
                if (tradeBuckets.size() >= MAX_BUCKETS) {
                    tradeBuckets.clear();
                }
                bucket = tradeBuckets.computeIfAbsent(clientIdentifier, this::createTradeBucket);
            } else {
                if (generalBuckets.size() >= MAX_BUCKETS) {
                    generalBuckets.clear();
                }
                bucket = generalBuckets.computeIfAbsent(clientIdentifier, this::createGeneralBucket);
            }

            if (bucket.tryConsume(1)) {
                filterChain.doFilter(request, response);
            } else {
                log.warn("Rate limit exceeded for client: {} on path: {}", clientIdentifier, path);
                response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
                response.setContentType("application/json");
                response.getWriter().write(
                    "{\"error\":\"TOO_MANY_REQUESTS\",\"message\":\"Rate limit exceeded. Please wait before retrying.\"}"
                );
            }
        }

        private Bucket createTradeBucket(String key) {
            return Bucket.builder()
                    .addLimit(Bandwidth.classic(TRADE_LIMIT, Refill.greedy(TRADE_LIMIT, TRADE_DURATION)))
                    .build();
        }

        private Bucket createGeneralBucket(String key) {
            return Bucket.builder()
                    .addLimit(Bandwidth.classic(GENERAL_LIMIT, Refill.greedy(GENERAL_LIMIT, GENERAL_DURATION)))
                    .build();
        }

        /**
         * Extract a stable client identifier from the request.
         * For authenticated requests, extracts the JWT 'sub' claim for stable per-user limiting.
         * Falls back to IP address for unauthenticated requests.
         */
        private String getClientIdentifier(HttpServletRequest request) {
            String authHeader = request.getHeader("Authorization");
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String sub = extractJwtSubject(authHeader.substring(7));
                if (sub != null) {
                    return "user:" + sub;
                }
            }
            String xForwardedFor = request.getHeader("X-Forwarded-For");
            if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
                return "ip:" + xForwardedFor.split(",")[0].trim();
            }
            String xRealIp = request.getHeader("X-Real-IP");
            if (xRealIp != null && !xRealIp.isEmpty()) {
                return "ip:" + xRealIp;
            }
            return "ip:" + request.getRemoteAddr();
        }

        /**
         * Extract the 'sub' claim from a JWT token by base64-decoding the payload.
         * This is a lightweight extraction (no signature verification) used only for
         * rate-limit keying — actual auth is handled by Spring Security.
         */
        private String extractJwtSubject(String token) {
            try {
                String[] parts = token.split("\\.");
                if (parts.length < 2) return null;
                String payload = new String(Base64.getUrlDecoder().decode(parts[1]), StandardCharsets.UTF_8);
                // Simple extraction without a JSON parser — find "sub":"..."
                int subIdx = payload.indexOf("\"sub\"");
                if (subIdx < 0) return null;
                int colonIdx = payload.indexOf(':', subIdx);
                int quoteStart = payload.indexOf('"', colonIdx + 1);
                int quoteEnd = payload.indexOf('"', quoteStart + 1);
                if (quoteStart >= 0 && quoteEnd > quoteStart) {
                    return payload.substring(quoteStart + 1, quoteEnd);
                }
            } catch (Exception e) {
                // Fall through to null
            }
            return null;
        }
    }
}
