package com.adorsys.fineract.gateway.config;

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
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.filter.OncePerRequestFilter;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;

import java.io.IOException;
import java.time.Duration;
import java.util.Comparator;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

/**
 * Rate limiting configuration for payment endpoints.
 * Uses Redis for distributed rate limiting across K8s pods.
 * Falls back to in-memory Bucket4j if Redis is unavailable.
 */
@Slf4j
@Configuration
@ConditionalOnProperty(name = "app.rate-limit.enabled", havingValue = "true", matchIfMissing = true)
public class RateLimitConfig {

    @Value("${app.rate-limit.payment-per-minute:5}")
    private int paymentLimit;

    @Value("${app.rate-limit.status-per-minute:50}")
    private int statusLimit;

    @Value("${app.rate-limit.callback-per-minute:100}")
    private int callbackLimit;

    private static final Duration WINDOW = Duration.ofMinutes(1);

    private static final int MAX_FALLBACK_BUCKETS = 10_000;
    private static final long FALLBACK_TTL_MILLIS = Duration.ofHours(1).toMillis();
    private static final int TRIM_PERCENT = 20;

    private record FallbackEntry(Bucket bucket, long lastAccessMillis) {}

    private final Map<String, FallbackEntry> fallbackBuckets = new ConcurrentHashMap<>();

    private final RedisTemplate<String, String> redisTemplate;

    public RateLimitConfig(RedisTemplate<String, String> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    @Bean
    public RateLimitFilter rateLimitFilter() {
        return new RateLimitFilter();
    }

    @Scheduled(fixedRate = 60_000)
    public void evictStaleFallbackBuckets() {
        long cutoff = System.currentTimeMillis() - FALLBACK_TTL_MILLIS;
        fallbackBuckets.entrySet().removeIf(e -> e.getValue().lastAccessMillis() < cutoff);

        int over = fallbackBuckets.size() - MAX_FALLBACK_BUCKETS;
        if (over <= 0) return;

        int trimCount = Math.max(over, MAX_FALLBACK_BUCKETS * TRIM_PERCENT / 100);
        fallbackBuckets.entrySet().stream()
            .sorted(Comparator.comparingLong(e -> e.getValue().lastAccessMillis()))
            .limit(trimCount)
            .map(Map.Entry::getKey)
            .toList()
            .forEach(fallbackBuckets::remove);
    }

    public class RateLimitFilter extends OncePerRequestFilter {

        @Override
        protected void doFilterInternal(HttpServletRequest request,
                                        HttpServletResponse response,
                                        FilterChain filterChain) throws ServletException, IOException {

            String path = request.getRequestURI();

            if (path.contains("/callbacks")) {
                String clientId = "ip:" + getIpAddress(request);
                if (isAllowed("callback", clientId, callbackLimit)) {
                    filterChain.doFilter(request, response);
                } else {
                    log.warn("Callback rate limit exceeded for IP: {} on path: {}", clientId, path);
                    response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
                }
                return;
            }

            if (path.contains("/actuator")) {
                filterChain.doFilter(request, response);
                return;
            }

            String clientId = getClientIdentifier(request);

            if (path.contains("/deposit") || path.contains("/withdraw")) {
                if (isAllowed("payment", clientId, paymentLimit)) {
                    filterChain.doFilter(request, response);
                } else {
                    log.warn("Rate limit exceeded for client: {} on path: {}", clientId, path);
                    sendRateLimitResponse(response);
                }
            } else {
                if (isAllowed("status", clientId, statusLimit)) {
                    filterChain.doFilter(request, response);
                } else {
                    log.warn("Rate limit exceeded for client: {} on path: {}", clientId, path);
                    sendRateLimitResponse(response);
                }
            }
        }

        /**
         * Check if a request is within the rate limit.
         * Uses Redis INCR + EXPIRE for distributed counting.
         * Falls back to in-memory Bucket4j if Redis is unavailable.
         */
        private boolean isAllowed(String type, String clientId, int limit) {
            String redisKey = "rate-limit:" + type + ":" + clientId;
            try {
                Long count = redisTemplate.opsForValue().increment(redisKey);
                if (count != null && count == 1) {
                    redisTemplate.expire(redisKey, WINDOW.toSeconds(), TimeUnit.SECONDS);
                }
                return count != null && count <= limit;
            } catch (Exception e) {
                log.debug("Redis unavailable for rate limiting, using in-memory fallback: {}", e.getMessage());
                return fallbackIsAllowed(type, clientId, limit);
            }
        }

        private boolean fallbackIsAllowed(String type, String clientId, int limit) {
            String key = type + ":" + clientId;
            long now = System.currentTimeMillis();
            FallbackEntry entry = fallbackBuckets.compute(key, (k, existing) -> {
                Bucket bucket = existing != null
                    ? existing.bucket()
                    : Bucket.builder()
                        .addLimit(Bandwidth.classic(limit, Refill.greedy(limit, WINDOW)))
                        .build();
                return new FallbackEntry(bucket, now);
            });
            return entry.bucket().tryConsume(1);
        }

        private void sendRateLimitResponse(HttpServletResponse response) throws IOException {
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setContentType("application/json");
            response.getWriter().write(
                    "{\"error\":\"TOO_MANY_REQUESTS\",\"message\":\"Rate limit exceeded. Please wait before making another payment request.\"}"
            );
        }

        String getIpAddress(HttpServletRequest request) {
            // Spring's ForwardedHeaderFilter (enabled via server.forward-headers-strategy=framework)
            // resolves the correct remote address from trusted proxy headers.
            return request.getRemoteAddr();
        }

        private String getClientIdentifier(HttpServletRequest request) {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.getPrincipal() instanceof Jwt jwt) {
                return "user:" + jwt.getSubject();
            }
            return "ip:" + getIpAddress(request);
        }
    }
}
