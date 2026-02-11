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

    // No rate limit for callbacks (they come from payment providers)
    private final Map<String, Bucket> paymentBuckets = new ConcurrentHashMap<>();
    private final Map<String, Bucket> statusBuckets = new ConcurrentHashMap<>();

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

            // Skip rate limiting for callbacks (provider webhooks)
            if (path.contains("/callbacks")) {
                filterChain.doFilter(request, response);
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

        private String getClientIdentifier(HttpServletRequest request) {
            // Prefer user identifier from JWT if available
            String authHeader = request.getHeader("Authorization");
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                // Use a hash of the token as identifier (in production, extract user ID)
                return "user:" + authHeader.hashCode();
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
    }
}
