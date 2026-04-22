package com.adorsys.fineract.gateway.service;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

/**
 * Distributed token cache backed by Redis with in-memory fallback.
 * Used by payment provider clients (MTN, Orange, CinetPay, Fineract) to cache auth tokens.
 */
@Slf4j
@Service
public class TokenCacheService {

    private final RedisTemplate<String, String> redisTemplate;
    private final Cache<String, CachedToken> localCache;

    private static final String PREFIX = "pgw:token:";
    private static final int LOCAL_CACHE_TTL_MINUTES = 5;

    public TokenCacheService(RedisTemplate<String, String> redisTemplate) {
        this.redisTemplate = redisTemplate;
        this.localCache = Caffeine.newBuilder()
            .maximumSize(10)
            .expireAfterWrite(LOCAL_CACHE_TTL_MINUTES, TimeUnit.MINUTES)
            .build();
    }

    public Optional<String> getToken(String cacheKey) {
        try {
            String token = redisTemplate.opsForValue().get(PREFIX + cacheKey);
            if (token != null) {
                return Optional.of(token);
            }
        } catch (Exception e) {
            log.warn("Redis unavailable for token cache, using local fallback: {}", e.getMessage());
        }

        CachedToken local = localCache.getIfPresent(cacheKey);
        if (local != null) {
            return Optional.of(local.token);
        }
        return Optional.empty();
    }

    public void putToken(String cacheKey, String token, long ttlSeconds) {
        Duration ttl = Duration.ofSeconds(ttlSeconds);

        localCache.put(cacheKey, new CachedToken(token));

        try {
            redisTemplate.opsForValue().set(PREFIX + cacheKey, token, ttl);
        } catch (Exception e) {
            log.warn("Redis unavailable for token cache, using local fallback: {}", e.getMessage());
        }
    }

    public void clear(String cacheKey) {
        localCache.invalidate(cacheKey);
        try {
            redisTemplate.delete(PREFIX + cacheKey);
        } catch (Exception e) {
            log.warn("Redis unavailable for cache clear: {}", e.getMessage());
        }
    }

    private record CachedToken(String token) {}
}
