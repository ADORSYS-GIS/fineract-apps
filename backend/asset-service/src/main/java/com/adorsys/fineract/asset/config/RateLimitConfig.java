package com.adorsys.fineract.asset.config;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;
import java.util.Comparator;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.Function;

/**
 * Rate limiting configuration for trading and API endpoints.
 */
@Slf4j
@Configuration
@ConditionalOnProperty(name = "asset-service.rate-limit.enabled", havingValue = "true", matchIfMissing = true)
public class RateLimitConfig {

    @Value("${asset-service.rate-limit.trade-limit:10}")
    private int tradeLimit;

    @Value("${asset-service.rate-limit.trade-duration-minutes:1}")
    private int tradeDurationMinutes;

    @Value("${asset-service.rate-limit.general-limit:100}")
    private int generalLimit;

    @Value("${asset-service.rate-limit.general-duration-minutes:1}")
    private int generalDurationMinutes;

    private static final int MAX_BUCKETS = 10_000;
    private static final long BUCKET_TTL_MILLIS = 3_600_000L; // 1 hour
    private static final double EVICT_OLDEST_FRACTION = 0.20;

    private record BucketEntry(Bucket bucket, long lastAccessMillis) {}

    private final Map<String, BucketEntry> tradeBuckets = new ConcurrentHashMap<>();
    private final Map<String, BucketEntry> generalBuckets = new ConcurrentHashMap<>();

    @Bean
    public RateLimitFilter rateLimitFilter() {
        return new RateLimitFilter();
    }

    /**
     * Evict entries not accessed within the TTL window. If maps still exceed MAX_BUCKETS
     * after TTL eviction, remove the 20% oldest entries by lastAccess to cap memory.
     */
    @Scheduled(fixedRate = 600000)
    public void evictStaleBuckets() {
        long cutoff = System.currentTimeMillis() - BUCKET_TTL_MILLIS;
        tradeBuckets.entrySet().removeIf(e -> e.getValue().lastAccessMillis() < cutoff);
        generalBuckets.entrySet().removeIf(e -> e.getValue().lastAccessMillis() < cutoff);

        evictOldestIfOverLimit(tradeBuckets);
        evictOldestIfOverLimit(generalBuckets);

        log.debug("Evicted stale rate limit buckets (trade={}, general={})",
                tradeBuckets.size(), generalBuckets.size());
    }

    private void evictOldestIfOverLimit(Map<String, BucketEntry> map) {
        if (map.size() <= MAX_BUCKETS) return;
        int toRemove = (int) (map.size() * EVICT_OLDEST_FRACTION);
        map.entrySet().stream()
                .sorted(Comparator.comparingLong(e -> e.getValue().lastAccessMillis()))
                .limit(toRemove)
                .map(Map.Entry::getKey)
                .forEach(map::remove);
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
                bucket = getOrCreateBucket(tradeBuckets, clientIdentifier, this::createTradeBucket);
            } else {
                bucket = getOrCreateBucket(generalBuckets, clientIdentifier, this::createGeneralBucket);
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

        private Bucket getOrCreateBucket(Map<String, BucketEntry> map, String key,
                                          Function<String, Bucket> factory) {
            long now = System.currentTimeMillis();
            BucketEntry entry = map.compute(key, (k, existing) -> {
                if (existing != null) {
                    return new BucketEntry(existing.bucket(), now);
                }
                return new BucketEntry(factory.apply(k), now);
            });
            return entry.bucket();
        }

        private Bucket createTradeBucket(String key) {
            return Bucket.builder()
                    .addLimit(Bandwidth.classic(tradeLimit, Refill.greedy(tradeLimit, Duration.ofMinutes(tradeDurationMinutes))))
                    .build();
        }

        private Bucket createGeneralBucket(String key) {
            return Bucket.builder()
                    .addLimit(Bandwidth.classic(generalLimit, Refill.greedy(generalLimit, Duration.ofMinutes(generalDurationMinutes))))
                    .build();
        }

        private String getClientIdentifier(HttpServletRequest request) {
            String authHeader = request.getHeader("Authorization");
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                // Use a hash of the token to avoid trusting unverified claims.
                // Spring Security verifies signatures later; this is just for rate-limit keying.
                String token = authHeader.substring(7);
                int tokenHash = token.hashCode();
                return "token:" + tokenHash;
            }
            // server.forward-headers-strategy=FRAMEWORK ensures ForwardedHeaderFilter
            // has already resolved the real client IP from the trusted proxy chain.
            // Using getRemoteAddr() here is safe and cannot be spoofed by clients.
            return "ip:" + request.getRemoteAddr();
        }
    }
}
