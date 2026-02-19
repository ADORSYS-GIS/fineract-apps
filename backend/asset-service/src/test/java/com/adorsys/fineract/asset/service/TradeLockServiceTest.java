package com.adorsys.fineract.asset.service;

import com.adorsys.fineract.asset.config.AssetServiceConfig;
import com.adorsys.fineract.asset.exception.TradeLockException;
import com.adorsys.fineract.asset.metrics.AssetMetrics;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.data.redis.RedisConnectionFailureException;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.script.DefaultRedisScript;
import org.springframework.data.redis.core.script.RedisScript;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class TradeLockServiceTest {

    private RedisTemplate<String, String> redisTemplate;
    private DefaultRedisScript<Long> acquireTradeLockScript;
    private DefaultRedisScript<Long> releaseTradeLockScript;
    private AssetServiceConfig config;
    private AssetMetrics assetMetrics;
    private TradeLockService tradeLockService;

    private static final Long USER_ID = 42L;
    private static final String ASSET_ID = "asset-001";

    @SuppressWarnings("unchecked")
    @BeforeEach
    void setUp() {
        redisTemplate = Mockito.mock(RedisTemplate.class);
        acquireTradeLockScript = Mockito.mock(DefaultRedisScript.class);
        releaseTradeLockScript = Mockito.mock(DefaultRedisScript.class);
        config = Mockito.mock(AssetServiceConfig.class);
        assetMetrics = Mockito.mock(AssetMetrics.class);

        AssetServiceConfig.TradeLock tradeLock = new AssetServiceConfig.TradeLock();
        tradeLock.setTtlSeconds(45);
        tradeLock.setLocalFallbackTimeoutSeconds(40);
        when(config.getTradeLock()).thenReturn(tradeLock);

        tradeLockService = new TradeLockService(
                redisTemplate, acquireTradeLockScript, releaseTradeLockScript, config, assetMetrics);
    }

    private void stubAcquireReturns(Long value) {
        doAnswer(invocation -> value)
                .when(redisTemplate)
                .execute(any(RedisScript.class), anyList(), any(String.class), any(String.class));
    }

    private void stubAcquireThrows(RuntimeException ex) {
        doThrow(ex)
                .when(redisTemplate)
                .execute(any(RedisScript.class), anyList(), any(String.class), any(String.class));
    }

    private void stubReleaseReturns(Long value) {
        doAnswer(invocation -> value)
                .when(redisTemplate)
                .execute(any(RedisScript.class), anyList(), any(String.class));
    }

    // -------------------------------------------------------------------------
    // acquireTradeLock tests
    // -------------------------------------------------------------------------

    @Test
    void acquireLock_redisSuccess_returnsLockValue() {
        stubAcquireReturns(1L);

        String lockValue = tradeLockService.acquireTradeLock(USER_ID, ASSET_ID);

        assertNotNull(lockValue);
        assertFalse(lockValue.startsWith("LOCAL:"));
        verify(assetMetrics, never()).recordTradeLockFailure();
    }

    @Test
    void acquireLock_redisReturnsNull_throws() {
        stubAcquireReturns(null);

        assertThrows(TradeLockException.class,
                () -> tradeLockService.acquireTradeLock(USER_ID, ASSET_ID));
        verify(assetMetrics).recordTradeLockFailure();
    }

    @Test
    void acquireLock_redisReturnsZero_throws() {
        stubAcquireReturns(0L);

        assertThrows(TradeLockException.class,
                () -> tradeLockService.acquireTradeLock(USER_ID, ASSET_ID));
        verify(assetMetrics).recordTradeLockFailure();
    }

    @Test
    void acquireLock_redisFails_fallsBackToLocal() {
        stubAcquireThrows(new RedisConnectionFailureException("Connection refused"));

        String lockValue = tradeLockService.acquireTradeLock(USER_ID, ASSET_ID);

        assertNotNull(lockValue);
        assertTrue(lockValue.startsWith("LOCAL:"));
    }

    // -------------------------------------------------------------------------
    // releaseTradeLock tests
    // -------------------------------------------------------------------------

    @Test
    void releaseLock_redisSuccess() {
        stubReleaseReturns(2L);

        tradeLockService.releaseTradeLock(USER_ID, ASSET_ID, "some-uuid-value");

        verify(assetMetrics, never()).recordTradeLockFailure();
    }

    @Test
    void releaseLock_localLock_unlocksLocalKey() {
        // First acquire a local lock via Redis fallback
        stubAcquireThrows(new RedisConnectionFailureException("Connection refused"));

        String lockValue = tradeLockService.acquireTradeLock(USER_ID, ASSET_ID);
        assertTrue(lockValue.startsWith("LOCAL:"));

        // Release the local lock — should not throw
        tradeLockService.releaseTradeLock(USER_ID, ASSET_ID, lockValue);
    }

    @Test
    void releaseLock_lockExpired_recordsFailure() {
        stubReleaseReturns(0L);

        tradeLockService.releaseTradeLock(USER_ID, ASSET_ID, "expired-lock-value");

        verify(assetMetrics).recordTradeLockFailure();
    }

    // -------------------------------------------------------------------------
    // evictStaleLocalLocks tests
    // -------------------------------------------------------------------------

    @Test
    void evictStaleLocalLocks_removesUnlockedEntries() {
        // Acquire a local lock and then release it to make it stale
        stubAcquireThrows(new RedisConnectionFailureException("Connection refused"));

        String lockValue = tradeLockService.acquireTradeLock(USER_ID, ASSET_ID);
        tradeLockService.releaseTradeLock(USER_ID, ASSET_ID, lockValue);

        // Should not throw
        tradeLockService.evictStaleLocalLocks();
    }
}
