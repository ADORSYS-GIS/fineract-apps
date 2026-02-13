package com.adorsys.fineract.gateway.config;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Rate limiting configuration for payment endpoints.
 *
 * Protects against:
 * - Brute force attacks on payment initiation
 * - DoS attacks
 * - Resource exhaustion
 *
 * Note: In production, use Redis-backed rate limiting for distributed systems.
 */
@Slf4j
@Configuration
@ConditionalOnProperty(name = "app.rate-limit.enabled", havingValue = "true", matchIfMissing = true)
public class RateLimitConfig {

    // Rate limit: 5 payment requests per minute per user
    private static final int PAYMENT_LIMIT = 5;
    private static final Duration PAYMENT_DURATION = Duration.ofMinutes(1);

    // Rate limit: 50 requests per minute per IP for status checks
    private static final int STATUS_LIMIT = 50;
    private static final Duration STATUS_DURATION = Duration.ofMinutes(1);

    // Rate limit: 100 callback requests per minute per IP (from payment providers)
    private static final int CALLBACK_LIMIT = 100;
    private static final Duration CALLBACK_DURATION = Duration.ofMinutes(1);

    private final Map<String, Bucket> paymentBuckets = new ConcurrentHashMap<>();
    private final Map<String, Bucket> statusBuckets = new ConcurrentHashMap<>();
    private final Map<String, Bucket> callbackBuckets = new ConcurrentHashMap<>();

    @Bean
    public RateLimitFilter rateLimitFilter() {
        return new RateLimitFilter();
    }

    public class RateLimitFilter extends OncePerRequestFilter {

        @Override
        protected void doFilterInternal(HttpServletRequest request,
                                        HttpServletResponse response,
                                        FilterChain filterChain) throws ServletException, IOException {

            String path = request.getRequestURI();

            // Rate limit callbacks separately (provider webhooks)
            if (path.contains("/callbacks")) {
                String callbackIp = getIpAddress(request);
                Bucket callbackBucket = callbackBuckets.computeIfAbsent(callbackIp, this::createCallbackBucket);
                if (callbackBucket.tryConsume(1)) {
                    filterChain.doFilter(request, response);
                } else {
                    log.warn("Callback rate limit exceeded for IP: {} on path: {}", callbackIp, path);
                    response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
                }
                return;
            }

            // Skip rate limiting for actuator endpoints
            if (path.contains("/actuator")) {
                filterChain.doFilter(request, response);
                return;
            }

            String clientIdentifier = getClientIdentifier(request);
            Bucket bucket;

            if (path.contains("/deposit") || path.contains("/withdraw")) {
                bucket = paymentBuckets.computeIfAbsent(clientIdentifier, this::createPaymentBucket);
            } else {
                bucket = statusBuckets.computeIfAbsent(clientIdentifier, this::createStatusBucket);
            }

            if (bucket.tryConsume(1)) {
                filterChain.doFilter(request, response);
            } else {
                log.warn("Rate limit exceeded for client: {} on path: {}", clientIdentifier, path);
                response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
                response.setContentType("application/json");
                response.getWriter().write(
                        "{\"error\":\"TOO_MANY_REQUESTS\",\"message\":\"Rate limit exceeded. Please wait before making another payment request.\"}"
                );
            }
        }

        private Bucket createPaymentBucket(String key) {
            return Bucket.builder()
                    .addLimit(Bandwidth.classic(PAYMENT_LIMIT,
                            Refill.greedy(PAYMENT_LIMIT, PAYMENT_DURATION)))
                    .build();
        }

        private Bucket createStatusBucket(String key) {
            return Bucket.builder()
                    .addLimit(Bandwidth.classic(STATUS_LIMIT,
                            Refill.greedy(STATUS_LIMIT, STATUS_DURATION)))
                    .build();
        }

        private Bucket createCallbackBucket(String key) {
            return Bucket.builder()
                    .addLimit(Bandwidth.classic(CALLBACK_LIMIT,
                            Refill.greedy(CALLBACK_LIMIT, CALLBACK_DURATION)))
                    .build();
        }

        private String getIpAddress(HttpServletRequest request) {
            String xForwardedFor = request.getHeader("X-Forwarded-For");
            if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
                return xForwardedFor.split(",")[0].trim();
            }
            String xRealIp = request.getHeader("X-Real-IP");
            if (xRealIp != null && !xRealIp.isEmpty()) {
                return xRealIp;
            }
            return request.getRemoteAddr();
        }

        private String getClientIdentifier(HttpServletRequest request) {
            // Prefer user identifier from JWT subject claim
            String authHeader = request.getHeader("Authorization");
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String subject = extractJwtSubject(authHeader.substring(7));
                if (subject != null) {
                    return "user:" + subject;
                }
                // Fallback: use first 16 chars of token as collision-resistant identifier
                String token = authHeader.substring(7);
                return "user:" + token.substring(0, Math.min(token.length(), 16));
            }

            // Fall back to IP address
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
         * Extract the "sub" claim from a JWT without full validation
         * (Spring Security handles validation separately).
         */
        private String extractJwtSubject(String token) {
            try {
                String[] parts = token.split("\\.");
                if (parts.length < 2) return null;
                String payload = new String(java.util.Base64.getUrlDecoder().decode(parts[1]),
                    java.nio.charset.StandardCharsets.UTF_8);
                // Simple extraction without pulling in a JSON library dependency
                int subIdx = payload.indexOf("\"sub\"");
                if (subIdx < 0) return null;
                int colonIdx = payload.indexOf(':', subIdx);
                int quoteStart = payload.indexOf('"', colonIdx + 1);
                int quoteEnd = payload.indexOf('"', quoteStart + 1);
                if (quoteStart >= 0 && quoteEnd > quoteStart) {
                    return payload.substring(quoteStart + 1, quoteEnd);
                }
                return null;
            } catch (Exception e) {
                log.debug("Could not extract JWT subject: {}", e.getMessage());
                return null;
            }
        }
    }
}
