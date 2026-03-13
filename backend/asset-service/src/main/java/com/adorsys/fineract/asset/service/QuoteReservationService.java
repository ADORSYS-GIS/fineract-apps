package com.adorsys.fineract.asset.service;

import com.adorsys.fineract.asset.config.AssetServiceConfig;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.RedisConnectionFailureException;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.script.DefaultRedisScript;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Duration;
import java.util.Arrays;
import java.util.List;

/**
 * Soft-reserves asset inventory for active quotes using Redis TTL-based keys.
 * Prevents overselling when multiple users quote the same asset simultaneously.
 * <p>
 * Fail-open: if Redis is unavailable, reservations are skipped (worst case: two
 * quotes overlap on the same inventory, caught at execution time).
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class QuoteReservationService {

    private static final String RESERVE_KEY_PREFIX = "quote:reserve:";
    private static final String TOTAL_KEY_PREFIX = "quote:reserved-total:";

    /**
     * Lua script for atomic reserve: SET per-quote key with TTL, then INCR total.
     * KEYS[1] = per-quote key, KEYS[2] = total key
     * ARGV[1] = units string, ARGV[2] = per-quote TTL seconds, ARGV[3] = total TTL seconds
     */
    private static final String RESERVE_LUA =
            "redis.call('SET', KEYS[1], ARGV[1], 'EX', tonumber(ARGV[2])) " +
            "local current = redis.call('GET', KEYS[2]) " +
            "local newTotal = tonumber(current or '0') + tonumber(ARGV[1]) " +
            "redis.call('SET', KEYS[2], tostring(newTotal), 'EX', tonumber(ARGV[3])) " +
            "return 1";

    /**
     * Lua script for atomic release: DEL per-quote key, if deleted then DECR total.
     * KEYS[1] = per-quote key, KEYS[2] = total key
     * ARGV[1] = units string
     */
    private static final String RELEASE_LUA =
            "local deleted = redis.call('DEL', KEYS[1]) " +
            "if deleted == 1 then " +
            "  local current = redis.call('GET', KEYS[2]) " +
            "  local newTotal = tonumber(current or '0') - tonumber(ARGV[1]) " +
            "  if newTotal <= 0 then " +
            "    redis.call('DEL', KEYS[2]) " +
            "  else " +
            "    local ttl = redis.call('TTL', KEYS[2]) " +
            "    if ttl > 0 then " +
            "      redis.call('SET', KEYS[2], tostring(newTotal), 'EX', ttl) " +
            "    else " +
            "      redis.call('SET', KEYS[2], tostring(newTotal), 'EX', 600) " +
            "    end " +
            "  end " +
            "end " +
            "return deleted";

    private final RedisTemplate<String, String> redisTemplate;
    private final AssetServiceConfig config;

    /**
     * Soft-reserve units for a quote. Uses a Lua script for atomic per-quote key SET
     * and total counter increment.
     */
    public void reserve(String assetId, String orderId, BigDecimal units) {
        int ttl = config.getQuote().getTtlSeconds() + 2;
        String key = RESERVE_KEY_PREFIX + assetId + ":" + orderId;
        String totalKey = TOTAL_KEY_PREFIX + assetId;
        try {
            DefaultRedisScript<Long> script = new DefaultRedisScript<>(RESERVE_LUA, Long.class);
            redisTemplate.execute(script, Arrays.asList(key, totalKey),
                    units.toPlainString(), String.valueOf(ttl), "600");
        } catch (RedisConnectionFailureException e) {
            log.warn("Redis unavailable, skipping soft-reserve for quote {} asset {}", orderId, assetId);
        } catch (Exception e) {
            log.warn("Failed to soft-reserve quote {} for asset {}: {}", orderId, assetId, e.getMessage());
        }
    }

    /**
     * Release a soft reservation (on cancel, expiry, or successful execution).
     * Uses a Lua script to atomically delete the per-quote key and decrement total
     * only if the key was still present.
     */
    public void release(String assetId, String orderId, BigDecimal units) {
        String key = RESERVE_KEY_PREFIX + assetId + ":" + orderId;
        String totalKey = TOTAL_KEY_PREFIX + assetId;
        try {
            DefaultRedisScript<Long> script = new DefaultRedisScript<>(RELEASE_LUA, Long.class);
            redisTemplate.execute(script, Arrays.asList(key, totalKey), units.toPlainString());
        } catch (RedisConnectionFailureException e) {
            log.warn("Redis unavailable, skipping release for quote {} asset {}", orderId, assetId);
        } catch (Exception e) {
            log.warn("Failed to release reservation for quote {} on asset {}: {}", orderId, assetId, e.getMessage());
        }
    }

    /**
     * Get total soft-reserved units for an asset across all active quotes.
     * Returns zero if Redis is unavailable (fail-open).
     */
    public BigDecimal getReservedUnits(String assetId) {
        try {
            String val = redisTemplate.opsForValue().get(TOTAL_KEY_PREFIX + assetId);
            if (val != null) {
                BigDecimal parsed = new BigDecimal(val);
                return parsed.compareTo(BigDecimal.ZERO) > 0 ? parsed : BigDecimal.ZERO;
            }
            return BigDecimal.ZERO;
        } catch (Exception e) {
            log.debug("Could not read reserved units for asset {}: {}", assetId, e.getMessage());
            return BigDecimal.ZERO;
        }
    }
}
