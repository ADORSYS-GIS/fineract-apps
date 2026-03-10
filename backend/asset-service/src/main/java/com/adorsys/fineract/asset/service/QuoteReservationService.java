package com.adorsys.fineract.asset.service;

import com.adorsys.fineract.asset.config.AssetServiceConfig;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataAccessException;
import org.springframework.data.redis.RedisConnectionFailureException;
import org.springframework.data.redis.core.RedisOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.SessionCallback;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Duration;
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

    private final RedisTemplate<String, String> redisTemplate;
    private final AssetServiceConfig config;

    /**
     * Soft-reserve units for a quote. Sets a per-quote Redis key with TTL and
     * increments the per-asset total counter. Operations are atomic via MULTI/EXEC.
     */
    public void reserve(String assetId, String orderId, BigDecimal units) {
        int ttl = config.getQuote().getTtlSeconds() + 2;
        String key = RESERVE_KEY_PREFIX + assetId + ":" + orderId;
        String totalKey = TOTAL_KEY_PREFIX + assetId;
        try {
            redisTemplate.execute(new SessionCallback<List<Object>>() {
                @Override
                @SuppressWarnings("unchecked")
                public List<Object> execute(RedisOperations operations) throws DataAccessException {
                    operations.multi();
                    operations.opsForValue().set(key, units.toPlainString(), Duration.ofSeconds(ttl));
                    // Read current total, add units, write back (handles fractional correctly)
                    String current = (String) redisTemplate.opsForValue().get(totalKey);
                    BigDecimal newTotal = (current != null ? new BigDecimal(current) : BigDecimal.ZERO).add(units);
                    operations.opsForValue().set(totalKey, newTotal.toPlainString(), Duration.ofMinutes(10));
                    return operations.exec();
                }
            });
        } catch (RedisConnectionFailureException e) {
            log.warn("Redis unavailable, skipping soft-reserve for quote {} asset {}", orderId, assetId);
        } catch (Exception e) {
            log.warn("Failed to soft-reserve quote {} for asset {}: {}", orderId, assetId, e.getMessage());
        }
    }

    /**
     * Release a soft reservation (on cancel, expiry, or successful execution).
     * Only decrements the total counter if the per-quote key was still present,
     * preventing negative counters from partial reserve failures.
     */
    public void release(String assetId, String orderId, BigDecimal units) {
        String key = RESERVE_KEY_PREFIX + assetId + ":" + orderId;
        String totalKey = TOTAL_KEY_PREFIX + assetId;
        try {
            Boolean deleted = redisTemplate.delete(key);
            if (Boolean.TRUE.equals(deleted)) {
                String current = redisTemplate.opsForValue().get(totalKey);
                BigDecimal newTotal = (current != null ? new BigDecimal(current) : BigDecimal.ZERO).subtract(units);
                if (newTotal.compareTo(BigDecimal.ZERO) <= 0) {
                    redisTemplate.delete(totalKey);
                } else {
                    redisTemplate.opsForValue().set(totalKey, newTotal.toPlainString(), Duration.ofMinutes(10));
                }
            }
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
