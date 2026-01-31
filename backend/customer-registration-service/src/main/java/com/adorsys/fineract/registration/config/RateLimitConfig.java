package com.adorsys.fineract.registration.config;

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
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Rate limiting configuration to protect against abuse.
 *
 * Note: In production, use Redis-backed rate limiting for distributed systems.
 * This in-memory implementation is suitable for single-instance deployments.
 */
@Slf4j
@Configuration
public class RateLimitConfig {

    // Rate limit: 10 requests per minute per IP for registration
    private static final int REGISTRATION_LIMIT = 10;
    private static final Duration REGISTRATION_DURATION = Duration.ofMinutes(1);

    // Rate limit: 100 requests per minute per IP for general endpoints
    private static final int GENERAL_LIMIT = 100;
    private static final Duration GENERAL_DURATION = Duration.ofMinutes(1);

    private final Map<String, Bucket> registrationBuckets = new ConcurrentHashMap<>();
    private final Map<String, Bucket> generalBuckets = new ConcurrentHashMap<>();

    @Bean
    public RateLimitFilter rateLimitFilter() {
        return new RateLimitFilter();
    }

    public class RateLimitFilter extends OncePerRequestFilter {

        @Override
        protected void doFilterInternal(HttpServletRequest request,
                                        HttpServletResponse response,
                                        FilterChain filterChain) throws ServletException, IOException {

            String clientIp = getClientIp(request);
            String path = request.getRequestURI();

            Bucket bucket;
            if (path.contains("/register")) {
                bucket = registrationBuckets.computeIfAbsent(clientIp, this::createRegistrationBucket);
            } else {
                bucket = generalBuckets.computeIfAbsent(clientIp, this::createGeneralBucket);
            }

            if (bucket.tryConsume(1)) {
                filterChain.doFilter(request, response);
            } else {
                log.warn("Rate limit exceeded for IP: {} on path: {}", clientIp, path);
                response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
                response.setContentType("application/json");
                response.getWriter().write("{\"error\":\"TOO_MANY_REQUESTS\",\"message\":\"Rate limit exceeded. Please try again later.\"}");
            }
        }

        private Bucket createRegistrationBucket(String key) {
            return Bucket.builder()
                    .addLimit(Bandwidth.classic(REGISTRATION_LIMIT,
                            Refill.greedy(REGISTRATION_LIMIT, REGISTRATION_DURATION)))
                    .build();
        }

        private Bucket createGeneralBucket(String key) {
            return Bucket.builder()
                    .addLimit(Bandwidth.classic(GENERAL_LIMIT,
                            Refill.greedy(GENERAL_LIMIT, GENERAL_DURATION)))
                    .build();
        }

        private String getClientIp(HttpServletRequest request) {
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
    }
}
