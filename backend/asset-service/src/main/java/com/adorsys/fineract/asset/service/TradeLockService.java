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

    private static final long STUCK_LOCK_THRESHOLD_MILLIS = 5 * 60 * 1_000L; // 5 minutes

    private record LockEntry(ReentrantLock lock, long createdAt) {}

    private final ConcurrentHashMap<String, LockEntry> localLocks = new ConcurrentHashMap<>();

    /**
     * Evict unlocked entries. Logs a warning for locks held beyond the stuck threshold but does
     * NOT remove them — the thread holding the lock will eventually call releaseTradeLock, which
     * finds the entry and unlocks it normally. Evicting a live locked entry would cause
     * releaseTradeLock to silently no-op and allow a second concurrent trade for the same user.
     */
    @Scheduled(fixedRate = 60_000)
    public void evictStaleLocalLocks() {
        long now = System.currentTimeMillis();
        int before = localLocks.size();
        localLocks.entrySet().removeIf(entry -> {
            LockEntry le = entry.getValue();
            if (!le.lock().isLocked()) return true;
            // Warn about stuck locks but keep them so releaseTradeLock can still unlock normally
            if (now - le.createdAt() > STUCK_LOCK_THRESHOLD_MILLIS) {
                log.warn("Stuck local trade lock detected (NOT evicted): key={}, heldForMs={}",
                        entry.getKey(), now - le.createdAt());
            }
            return false;
        });
        int removed = before - localLocks.size();
        if (removed > 0) {
            log.debug("Evicted {} stale local trade locks, {} remaining", removed, localLocks.size());
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
            LockEntry entry = localLocks.computeIfAbsent(localKey,
                    k -> new LockEntry(new ReentrantLock(), System.currentTimeMillis()));
            try {
                int timeoutSeconds = config.getTradeLock().getLocalFallbackTimeoutSeconds();
                if (!entry.lock().tryLock(timeoutSeconds, java.util.concurrent.TimeUnit.SECONDS)) {
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
            LockEntry entry = localLocks.get(localKey);
            if (entry != null && entry.lock().isHeldByCurrentThread()) {
                entry.lock().unlock();
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
     * Uses Redis SET NX EX — atomic, self-expiring at quote TTL.
     * If Redis is unavailable the lock is skipped (best-effort); the max-active-quotes
     * DB check in TradingService still prevents runaway duplicates.
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
            // Redis unavailable — skip lock. The DB-level max-active-quotes guard still applies.
            log.warn("Redis unavailable for quote lock, skipping: userId={}, assetId={}, side={}", userId, assetId, side);
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
        }
    }
}
