package com.adorsys.fineract.gateway.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Distributed token cache backed by Redis with in-memory fallback.
 * Used by payment provider clients (MTN, Orange, CinetPay, Fineract) to cache auth tokens.
 */
@Slf4j
@Service
public class TokenCacheService {

    private final RedisTemplate<String, String> redisTemplate;
    private final Map<String, CachedToken> localCache = new ConcurrentHashMap<>();

    private static final String PREFIX = "pgw:token:";

    public TokenCacheService(RedisTemplate<String, String> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public Optional<String> getToken(String cacheKey) {
        try {
            String token = redisTemplate.opsForValue().get(PREFIX + cacheKey);
            if (token != null) {
                return Optional.of(token);
            }
        } catch (Exception e) {
            log.debug("Redis unavailable for token cache, using local fallback: {}", e.getMessage());
        }

        // Fallback to local cache
        CachedToken local = localCache.get(cacheKey);
        if (local != null && !local.isExpired()) {
            return Optional.of(local.token);
        }
        return Optional.empty();
    }

    public void putToken(String cacheKey, String token, long ttlSeconds) {
        Duration ttl = Duration.ofSeconds(ttlSeconds);

        // Always update local cache as fallback
        localCache.put(cacheKey, new CachedToken(token, System.currentTimeMillis() + (ttlSeconds * 1000)));

        try {
            redisTemplate.opsForValue().set(PREFIX + cacheKey, token, ttl);
        } catch (Exception e) {
            log.debug("Redis unavailable for token cache, using local fallback: {}", e.getMessage());
        }
    }

    public void clear(String cacheKey) {
        localCache.remove(cacheKey);
        try {
            redisTemplate.delete(PREFIX + cacheKey);
        } catch (Exception e) {
            log.debug("Redis unavailable for cache clear: {}", e.getMessage());
        }
    }

    private record CachedToken(String token, long expiresAt) {
        boolean isExpired() {
            return System.currentTimeMillis() >= expiresAt;
        }
    }
}
