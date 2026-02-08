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
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;
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

    private final Map<String, Bucket> tradeBuckets = new ConcurrentHashMap<>();
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
            String path = request.getRequestURI();

            if (path.contains("/actuator") || path.contains("/swagger-ui") || path.contains("/api-docs")) {
                filterChain.doFilter(request, response);
                return;
            }

            String clientIdentifier = getClientIdentifier(request);
            Bucket bucket;

            if (path.contains("/trades/buy") || path.contains("/trades/sell")) {
                bucket = tradeBuckets.computeIfAbsent(clientIdentifier, this::createTradeBucket);
            } else {
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

        private String getClientIdentifier(HttpServletRequest request) {
            String authHeader = request.getHeader("Authorization");
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                return "user:" + authHeader.hashCode();
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
    }
}
