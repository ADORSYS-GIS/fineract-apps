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
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;
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

    // In-memory fallback buckets (used when Redis is unavailable)
    private final Map<String, Bucket> fallbackBuckets = new ConcurrentHashMap<>();

    private final RedisTemplate<String, String> redisTemplate;

    public RateLimitConfig(RedisTemplate<String, String> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

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
            Bucket bucket = fallbackBuckets.computeIfAbsent(key,
                k -> Bucket.builder()
                    .addLimit(Bandwidth.classic(limit, Refill.greedy(limit, WINDOW)))
                    .build());
            return bucket.tryConsume(1);
        }

        private void sendRateLimitResponse(HttpServletResponse response) throws IOException {
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setContentType("application/json");
            response.getWriter().write(
                    "{\"error\":\"TOO_MANY_REQUESTS\",\"message\":\"Rate limit exceeded. Please wait before making another payment request.\"}"
            );
        }

        String getIpAddress(HttpServletRequest request) {
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
            String authHeader = request.getHeader("Authorization");
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String subject = extractJwtSubject(authHeader.substring(7));
                if (subject != null) {
                    return "user:" + subject;
                }
            }
            return "ip:" + getIpAddress(request);
        }

        private String extractJwtSubject(String token) {
            try {
                String[] parts = token.split("\\.");
                if (parts.length < 2) return null;
                String payload = new String(java.util.Base64.getUrlDecoder().decode(parts[1]),
                    java.nio.charset.StandardCharsets.UTF_8);
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
