package com.adorsys.fineract.asset.service;

import com.adorsys.fineract.asset.config.AssetServiceConfig;
import com.adorsys.fineract.asset.exception.TradeLockException;
import com.adorsys.fineract.asset.metrics.AssetMetrics;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.RedisConnectionFailureException;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.script.DefaultRedisScript;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.locks.ReentrantLock;

/**
 * Redis-based distributed lock for trade operations.
 * Uses Lua scripts to atomically acquire/release dual locks (user + treasury).
 * Falls back to JVM-local locks if Redis is unavailable.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class TradeLockService {

    private final RedisTemplate<String, String> redisTemplate;
    private final DefaultRedisScript<Long> acquireTradeLockScript;
    private final DefaultRedisScript<Long> releaseTradeLockScript;
    private final AssetServiceConfig config;
    private final AssetMetrics assetMetrics;

    private static final String USER_LOCK_PREFIX = "lock:trade:user:";
    private static final String TREASURY_LOCK_PREFIX = "lock:trade:treasury:";
    private static final String LOCAL_LOCK_PREFIX = "LOCAL:";

    private final ConcurrentHashMap<String, ReentrantLock> localLocks = new ConcurrentHashMap<>();

    /**
     * Acquire dual lock for a trade operation.
     * Falls back to local JVM lock if Redis is unavailable.
     *
     * @return Lock value to use for release
     * @throws TradeLockException if lock cannot be acquired
     */
    public String acquireTradeLock(Long userId, String assetId) {
        String lockValue = UUID.randomUUID().toString();
        String userKey = USER_LOCK_PREFIX + userId;
        String treasuryKey = TREASURY_LOCK_PREFIX + assetId;
        int ttl = config.getTradeLock().getTtlSeconds();

        try {
            Long result = redisTemplate.execute(
                    acquireTradeLockScript,
                    Arrays.asList(userKey, treasuryKey),
                    lockValue, String.valueOf(ttl)
            );

            if (result == null || result != 1L) {
                log.warn("Failed to acquire trade lock: userId={}, assetId={}", userId, assetId);
                assetMetrics.recordTradeLockFailure();
                throw new TradeLockException("Another trade is in progress. Please wait and try again.");
            }

            log.debug("Acquired trade lock: userId={}, assetId={}, lockValue={}", userId, assetId, lockValue);
            return lockValue;
        } catch (RedisConnectionFailureException e) {
            log.warn("Redis unavailable, falling back to local lock: userId={}, assetId={}", userId, assetId);
            String localKey = userKey + ":" + treasuryKey;
            ReentrantLock lock = localLocks.computeIfAbsent(localKey, k -> new ReentrantLock());
            if (!lock.tryLock()) {
                assetMetrics.recordTradeLockFailure();
                throw new TradeLockException("Another trade is in progress (local lock). Please wait.");
            }
            return LOCAL_LOCK_PREFIX + localKey;
        }
    }

    /**
     * Release dual lock after trade completion.
     */
    public void releaseTradeLock(Long userId, String assetId, String lockValue) {
        if (lockValue != null && lockValue.startsWith(LOCAL_LOCK_PREFIX)) {
            String localKey = lockValue.substring(LOCAL_LOCK_PREFIX.length());
            ReentrantLock lock = localLocks.get(localKey);
            if (lock != null && lock.isHeldByCurrentThread()) {
                lock.unlock();
            }
            return;
        }

        String userKey = USER_LOCK_PREFIX + userId;
        String treasuryKey = TREASURY_LOCK_PREFIX + assetId;

        try {
            Long released = redisTemplate.execute(
                    releaseTradeLockScript,
                    Arrays.asList(userKey, treasuryKey),
                    lockValue
            );
            log.debug("Released trade lock: userId={}, assetId={}, released={}", userId, assetId, released);
        } catch (RedisConnectionFailureException e) {
            log.warn("Redis unavailable during lock release: userId={}, assetId={}", userId, assetId);
        }
    }
}
