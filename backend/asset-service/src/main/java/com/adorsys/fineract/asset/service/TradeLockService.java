package com.adorsys.fineract.asset.service;

import com.adorsys.fineract.asset.config.AssetServiceConfig;
import com.adorsys.fineract.asset.exception.TradeLockException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.script.DefaultRedisScript;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.UUID;

/**
 * Redis-based distributed lock for trade operations.
 * Uses Lua scripts to atomically acquire/release dual locks (user + treasury).
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class TradeLockService {

    private final RedisTemplate<String, String> redisTemplate;
    private final DefaultRedisScript<Long> acquireTradeLockScript;
    private final DefaultRedisScript<Long> releaseTradeLockScript;
    private final AssetServiceConfig config;

    private static final String USER_LOCK_PREFIX = "lock:trade:user:";
    private static final String TREASURY_LOCK_PREFIX = "lock:trade:treasury:";

    /**
     * Acquire dual lock for a trade operation.
     *
     * @return Lock value to use for release
     * @throws TradeLockException if lock cannot be acquired
     */
    public String acquireTradeLock(Long userId, String assetId) {
        String lockValue = UUID.randomUUID().toString();
        String userKey = USER_LOCK_PREFIX + userId;
        String treasuryKey = TREASURY_LOCK_PREFIX + assetId;
        int ttl = config.getTradeLock().getTtlSeconds();

        Long result = redisTemplate.execute(
                acquireTradeLockScript,
                Arrays.asList(userKey, treasuryKey),
                lockValue, String.valueOf(ttl)
        );

        if (result == null || result != 1L) {
            log.warn("Failed to acquire trade lock: userId={}, assetId={}", userId, assetId);
            throw new TradeLockException("Another trade is in progress. Please wait and try again.");
        }

        log.debug("Acquired trade lock: userId={}, assetId={}, lockValue={}", userId, assetId, lockValue);
        return lockValue;
    }

    /**
     * Release dual lock after trade completion.
     */
    public void releaseTradeLock(Long userId, String assetId, String lockValue) {
        String userKey = USER_LOCK_PREFIX + userId;
        String treasuryKey = TREASURY_LOCK_PREFIX + assetId;

        Long released = redisTemplate.execute(
                releaseTradeLockScript,
                Arrays.asList(userKey, treasuryKey),
                lockValue
        );

        log.debug("Released trade lock: userId={}, assetId={}, released={}", userId, assetId, released);
    }
}
