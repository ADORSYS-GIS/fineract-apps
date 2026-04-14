package com.adorsys.fineract.asset.service;

import com.adorsys.fineract.asset.config.AssetServiceConfig;
import com.adorsys.fineract.asset.dto.TradeSide;
import com.adorsys.fineract.asset.exception.TradeLockException;
import com.adorsys.fineract.asset.exception.TradingException;
import com.adorsys.fineract.asset.metrics.AssetMetrics;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.RedisConnectionFailureException;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.script.DefaultRedisScript;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
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
    private static final String QUOTE_LOCK_PREFIX = "lock:quote:";
    private static final String LOCAL_LOCK_PREFIX = "LOCAL:";

    private final ConcurrentHashMap<String, ReentrantLock> localLocks = new ConcurrentHashMap<>();

    /**
     * TTL-based local fallback for quote locks.
     * ReentrantLock is thread-bound; quote lock acquire and release happen on different HTTP threads,
     * so we use CAS on an expiry timestamp instead.
     */
    private final ConcurrentHashMap<String, Instant> localQuoteLocks = new ConcurrentHashMap<>();

    /**
     * Evict unlocked entries from the local fallback lock map to prevent unbounded growth.
     */
    @Scheduled(fixedRate = 600000)
    public void evictStaleLocalLocks() {
        int before = localLocks.size();
        localLocks.entrySet().removeIf(entry -> !entry.getValue().isLocked());
        int removed = before - localLocks.size();
        if (removed > 0) {
            log.debug("Evicted {} stale local trade locks, {} remaining", removed, localLocks.size());
        }

        Instant now = Instant.now();
        int quoteBefore = localQuoteLocks.size();
        localQuoteLocks.entrySet().removeIf(entry -> !now.isBefore(entry.getValue()));
        int quoteRemoved = quoteBefore - localQuoteLocks.size();
        if (quoteRemoved > 0) {
            log.debug("Evicted {} expired local quote locks, {} remaining", quoteRemoved, localQuoteLocks.size());
        }
    }

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
            try {
                int timeoutSeconds = config.getTradeLock().getLocalFallbackTimeoutSeconds();
                if (!lock.tryLock(timeoutSeconds, java.util.concurrent.TimeUnit.SECONDS)) {
                    assetMetrics.recordTradeLockFailure();
                    throw new TradeLockException("Another trade is in progress (local lock). Please wait.");
                }
            } catch (InterruptedException ie) {
                Thread.currentThread().interrupt();
                assetMetrics.recordTradeLockFailure();
                throw new TradeLockException("Trade lock acquisition was interrupted.");
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
            if (released == null || released == 0L) {
                log.warn("Trade lock already expired or lost (possible Redis failover): userId={}, assetId={}, lockValue={}",
                        userId, assetId, lockValue);
                assetMetrics.recordTradeLockFailure();
            } else {
                log.debug("Released trade lock: userId={}, assetId={}, released={}", userId, assetId, released);
            }
        } catch (RedisConnectionFailureException e) {
            log.warn("Redis unavailable during lock release: userId={}, assetId={}", userId, assetId);
        }
    }

    /**
     * Acquire a per-asset-side quote lock to prevent duplicate QUOTED orders.
     * Uses SET NX EX — atomic, self-expiring at quote TTL.
     *
     * @throws TradingException if a quote lock is already held for this userId+assetId+side
     */
    public void acquireQuoteLock(Long userId, String assetId, TradeSide side, int ttlSeconds) {
        String key = QUOTE_LOCK_PREFIX + userId + ":" + assetId + ":" + side;
        try {
            Boolean acquired = redisTemplate.opsForValue()
                    .setIfAbsent(key, "locked", Duration.ofSeconds(ttlSeconds));
            // Treat null (unexpected response) the same as false — do not assume ownership
            if (!Boolean.TRUE.equals(acquired)) {
                throw new TradingException(
                        "An active " + side + " quote already exists for this asset. " +
                        "Cancel it or wait for it to expire before creating a new one.",
                        "DUPLICATE_ACTIVE_QUOTE");
            }
            log.debug("Acquired quote lock: userId={}, assetId={}, side={}", userId, assetId, side);
        } catch (RedisConnectionFailureException e) {
            log.warn("Redis unavailable for quote lock, falling back to local: userId={}, assetId={}, side={}", userId, assetId, side);
            acquireLocalQuoteLock(key, ttlSeconds, side);
        }
    }

    /**
     * Release the per-asset-side quote lock. Called post-commit on quote confirm or cancel.
     */
    public void releaseQuoteLock(Long userId, String assetId, TradeSide side) {
        String key = QUOTE_LOCK_PREFIX + userId + ":" + assetId + ":" + side;
        try {
            redisTemplate.delete(key);
            log.debug("Released quote lock: userId={}, assetId={}, side={}", userId, assetId, side);
        } catch (RedisConnectionFailureException e) {
            log.warn("Redis unavailable during quote lock release: userId={}, assetId={}, side={}", userId, assetId, side);
            localQuoteLocks.remove(key);
        }
    }

    /**
     * TTL-aware local quote lock using CAS on an expiry timestamp.
     * ReentrantLock cannot be used here because acquire and release happen on different HTTP threads.
     */
    private void acquireLocalQuoteLock(String key, int ttlSeconds, TradeSide side) {
        Instant newExpiry = Instant.now().plusSeconds(ttlSeconds);
        Instant existing = localQuoteLocks.putIfAbsent(key, newExpiry);
        if (existing == null) {
            // No prior entry — we own it
            return;
        }
        if (Instant.now().isBefore(existing)) {
            // Prior lock still valid
            throw new TradingException(
                    "An active " + side + " quote already exists for this asset (local lock).",
                    "DUPLICATE_ACTIVE_QUOTE");
        }
        // Prior lock expired — replace atomically; if another thread wins the CAS we lose
        if (!localQuoteLocks.replace(key, existing, newExpiry)) {
            throw new TradingException(
                    "An active " + side + " quote already exists for this asset (local lock).",
                    "DUPLICATE_ACTIVE_QUOTE");
        }
    }
}
