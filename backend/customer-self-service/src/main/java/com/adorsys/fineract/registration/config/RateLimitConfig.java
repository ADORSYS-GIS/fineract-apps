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
import java.util.Comparator;
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
@org.springframework.context.annotation.Profile("!e2e")
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
            "/actuator", "/swagger-ui", "/api-docs","/api/registration/register"

    );

    private static final long IDLE_EVICTION_MS = 3_600_000L; // 1 hour

    private record BucketEntry(Bucket bucket, long lastAccessMillis) {}

    private final Map<String, BucketEntry> registrationBuckets = new ConcurrentHashMap<>();
    private final Map<String, BucketEntry> generalBuckets = new ConcurrentHashMap<>();

    @Bean
    public RateLimitFilter rateLimitFilter() {
        return new RateLimitFilter();
    }

    @Scheduled(fixedRate = 60_000)
    public void cleanupBuckets() {
        evictStale(registrationBuckets, "registration");
        evictStale(generalBuckets, "general");
    }

    private void evictStale(Map<String, BucketEntry> map, String label) {
        long cutoff = System.currentTimeMillis() - IDLE_EVICTION_MS;
        map.entrySet().removeIf(e -> e.getValue().lastAccessMillis() < cutoff);

        if (map.size() > MAX_BUCKETS) {
            int toRemove = map.size() / 5; // trim 20%
            map.entrySet().stream()
                    .sorted(Comparator.comparingLong(e -> e.getValue().lastAccessMillis()))
                    .limit(toRemove)
                    .map(Map.Entry::getKey)
                    .forEach(map::remove);
            log.debug("Rate limit trim: removed {} oldest {} buckets, {} remaining", toRemove, label, map.size());
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
                bucket = touchBucket(registrationBuckets, clientIp, true);
            } else {
                bucket = touchBucket(generalBuckets, clientIp, false);
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

        private Bucket touchBucket(Map<String, BucketEntry> map, String clientIp, boolean registration) {
            long now = System.currentTimeMillis();
            BucketEntry entry = map.compute(clientIp, (k, existing) -> {
                if (existing != null) {
                    return new BucketEntry(existing.bucket(), now);
                }
                Bucket newBucket = registration ? newRegistrationBucket() : newGeneralBucket();
                return new BucketEntry(newBucket, now);
            });
            return entry.bucket();
        }

        private Bucket newRegistrationBucket() {
            return Bucket.builder()
                    .addLimit(Bandwidth.classic(REGISTRATION_LIMIT,
                            Refill.greedy(REGISTRATION_LIMIT, REGISTRATION_DURATION)))
                    .build();
        }

        private Bucket newGeneralBucket() {
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
