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
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Rate limiting configuration to protect against abuse.
 *
 * Note: In production with multiple instances, use Redis-backed rate limiting.
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

    // Safety cap to prevent unbounded memory growth
    private static final int MAX_BUCKETS = 10_000;

    // Paths to skip rate limiting
    private static final Set<String> SKIP_PATHS = Set.of(
            "/actuator", "/swagger-ui", "/api-docs"
    );

    private final Map<String, Bucket> registrationBuckets = new ConcurrentHashMap<>();
    private final Map<String, Bucket> generalBuckets = new ConcurrentHashMap<>();

    @Bean
    public RateLimitFilter rateLimitFilter() {
        return new RateLimitFilter();
    }

    /**
     * Periodically clear rate limit buckets to prevent memory leaks.
     * Runs every 10 minutes.
     */
    @Scheduled(fixedRate = 600_000)
    public void cleanupBuckets() {
        int regSize = registrationBuckets.size();
        int genSize = generalBuckets.size();
        registrationBuckets.clear();
        generalBuckets.clear();
        if (regSize > 0 || genSize > 0) {
            log.debug("Rate limit bucket cleanup: cleared {} registration + {} general buckets", regSize, genSize);
        }
    }

    public class RateLimitFilter extends OncePerRequestFilter {

        @Override
        protected void doFilterInternal(HttpServletRequest request,
                                        HttpServletResponse response,
                                        FilterChain filterChain) throws ServletException, IOException {

            String path = request.getRequestURI();

            // Skip rate limiting for health/actuator/swagger endpoints
            if (SKIP_PATHS.stream().anyMatch(path::startsWith)) {
                filterChain.doFilter(request, response);
                return;
            }

            String clientIp = getClientIp(request);

            Bucket bucket;
            if (path.contains("/register")) {
                if (registrationBuckets.size() >= MAX_BUCKETS) {
                    log.warn("Registration rate limit buckets at capacity ({}), clearing", MAX_BUCKETS);
                    registrationBuckets.clear();
                }
                bucket = registrationBuckets.computeIfAbsent(clientIp, this::createRegistrationBucket);
            } else {
                if (generalBuckets.size() >= MAX_BUCKETS) {
                    log.warn("General rate limit buckets at capacity ({}), clearing", MAX_BUCKETS);
                    generalBuckets.clear();
                }
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
