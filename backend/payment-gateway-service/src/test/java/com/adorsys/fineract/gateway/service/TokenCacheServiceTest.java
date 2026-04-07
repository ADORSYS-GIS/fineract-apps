package com.adorsys.fineract.gateway.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;

import java.time.Duration;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TokenCacheServiceTest {

    @Mock
    private RedisTemplate<String, String> redisTemplate;

    @Mock
    private ValueOperations<String, String> valueOperations;

    private TokenCacheService tokenCacheService;

    @BeforeEach
    void setUp() {
        tokenCacheService = new TokenCacheService(redisTemplate);
    }

    @Nested
    @DisplayName("getToken")
    class GetToken {

        @Test
        @DisplayName("returns token from Redis when available")
        void returnsTokenFromRedis() {
            when(redisTemplate.opsForValue()).thenReturn(valueOperations);
            when(valueOperations.get("pgw:token:mtn:collection")).thenReturn("redis-token");

            Optional<String> result = tokenCacheService.getToken("mtn:collection");

            assertThat(result).contains("redis-token");
        }

        @Test
        @DisplayName("falls back to local cache when Redis unavailable")
        void fallsBackToLocalCache() {
            // First, put a token (this stores in local cache)
            when(redisTemplate.opsForValue()).thenReturn(valueOperations);
            doNothing().when(valueOperations).set(anyString(), anyString(), any(Duration.class));
            tokenCacheService.putToken("test-key", "local-token", 3600);

            // Now simulate Redis failure on get
            when(redisTemplate.opsForValue()).thenThrow(new RuntimeException("Redis down"));

            Optional<String> result = tokenCacheService.getToken("test-key");

            assertThat(result).contains("local-token");
        }

        @Test
        @DisplayName("returns empty when neither Redis nor local cache has token")
        void returnsEmptyWhenNeitherHasToken() {
            when(redisTemplate.opsForValue()).thenReturn(valueOperations);
            when(valueOperations.get("pgw:token:unknown")).thenReturn(null);

            Optional<String> result = tokenCacheService.getToken("unknown");

            assertThat(result).isEmpty();
        }

        @Test
        @DisplayName("returns empty for expired local cache token")
        void returnsEmptyForExpiredToken() {
            // Store token with TTL=0 (immediately expired)
            when(redisTemplate.opsForValue()).thenReturn(valueOperations);
            doNothing().when(valueOperations).set(anyString(), anyString(), any(Duration.class));
            tokenCacheService.putToken("expired-key", "expired-token", 0);

            // Redis returns null, local cache should be expired
            when(valueOperations.get("pgw:token:expired-key")).thenReturn(null);

            Optional<String> result = tokenCacheService.getToken("expired-key");

            assertThat(result).isEmpty();
        }
    }

    @Nested
    @DisplayName("putToken")
    class PutToken {

        @Test
        @DisplayName("stores in both Redis and local cache")
        void storesInBoth() {
            when(redisTemplate.opsForValue()).thenReturn(valueOperations);

            tokenCacheService.putToken("test-key", "test-token", 3600);

            verify(valueOperations).set("pgw:token:test-key", "test-token", Duration.ofSeconds(3600));

            // Verify local cache also works (get from local after Redis failure)
            when(redisTemplate.opsForValue()).thenThrow(new RuntimeException("Redis down"));
            Optional<String> result = tokenCacheService.getToken("test-key");
            assertThat(result).contains("test-token");
        }

        @Test
        @DisplayName("stores in local cache when Redis unavailable")
        void storesInLocalWhenRedisDown() {
            when(redisTemplate.opsForValue()).thenReturn(valueOperations);
            doThrow(new RuntimeException("Redis down")).when(valueOperations)
                    .set(anyString(), anyString(), any(Duration.class));

            // Should not throw
            assertThatNoException().isThrownBy(() ->
                    tokenCacheService.putToken("test-key", "fallback-token", 3600));

            // Token should still be in local cache
            when(redisTemplate.opsForValue()).thenThrow(new RuntimeException("Redis still down"));
            Optional<String> result = tokenCacheService.getToken("test-key");
            assertThat(result).contains("fallback-token");
        }
    }

    @Nested
    @DisplayName("clear")
    class Clear {

        @Test
        @DisplayName("removes from both Redis and local cache")
        void removesFromBoth() {
            // First put a token
            when(redisTemplate.opsForValue()).thenReturn(valueOperations);
            doNothing().when(valueOperations).set(anyString(), anyString(), any(Duration.class));
            tokenCacheService.putToken("clear-key", "token-to-clear", 3600);

            // Clear it
            when(redisTemplate.delete("pgw:token:clear-key")).thenReturn(true);
            tokenCacheService.clear("clear-key");

            verify(redisTemplate).delete("pgw:token:clear-key");

            // Verify local cache is also cleared
            when(redisTemplate.opsForValue()).thenThrow(new RuntimeException("Redis down"));
            Optional<String> result = tokenCacheService.getToken("clear-key");
            assertThat(result).isEmpty();
        }

        @Test
        @DisplayName("clears local cache even when Redis unavailable")
        void clearsLocalWhenRedisDown() {
            // Put a token locally
            when(redisTemplate.opsForValue()).thenReturn(valueOperations);
            doNothing().when(valueOperations).set(anyString(), anyString(), any(Duration.class));
            tokenCacheService.putToken("clear-key", "token", 3600);

            // Redis fails on delete
            when(redisTemplate.delete("pgw:token:clear-key")).thenThrow(new RuntimeException("Redis down"));

            assertThatNoException().isThrownBy(() -> tokenCacheService.clear("clear-key"));

            // Local cache should be cleared
            when(redisTemplate.opsForValue()).thenThrow(new RuntimeException("Redis down"));
            Optional<String> result = tokenCacheService.getToken("clear-key");
            assertThat(result).isEmpty();
        }
    }
}
