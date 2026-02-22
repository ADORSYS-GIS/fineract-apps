package com.adorsys.fineract.asset.service;

import com.adorsys.fineract.asset.dto.TradeSide;
import com.adorsys.fineract.asset.entity.Asset;
import com.adorsys.fineract.asset.entity.UserPosition;
import com.adorsys.fineract.asset.exception.TradingException;
import com.adorsys.fineract.asset.metrics.AssetMetrics;
import com.adorsys.fineract.asset.repository.UserPositionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Optional;

/**
 * Enforces per-asset trading limits: max order size, max position percentage,
 * and daily trade volume. Uses Redis for daily volume tracking.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ExposureLimitService {

    private final UserPositionRepository userPositionRepository;
    private final RedisTemplate<String, String> redisTemplate;
    private final AssetMetrics assetMetrics;

    private static final String DAILY_VOLUME_PREFIX = "trade:daily:";
    private static final Duration DAILY_VOLUME_TTL = Duration.ofHours(25);

    /**
     * Validate all exposure limits before trade execution.
     * Called from TradingService pre-lock validation.
     */
    public void validateLimits(Asset asset, Long userId, TradeSide side, BigDecimal units, BigDecimal cashAmount) {
        validateOrderSize(asset, units);
        if (side == TradeSide.BUY) {
            validatePositionPercent(asset, userId, units);
        }
        validateDailyLimit(asset, userId, cashAmount);
    }

    /**
     * Reject if order units exceed the asset's max order size.
     */
    private void validateOrderSize(Asset asset, BigDecimal units) {
        if (asset.getMaxOrderSize() == null) return;
        if (units.compareTo(asset.getMaxOrderSize()) > 0) {
            assetMetrics.recordExposureLimitRejection(asset.getId(), "ORDER_SIZE");
            throw new TradingException(
                    "Order size " + units + " exceeds maximum of " + asset.getMaxOrderSize() + " units",
                    "ORDER_SIZE_LIMIT_EXCEEDED");
        }
    }

    /**
     * BUY only: reject if the resulting position would exceed maxPositionPercent of total supply.
     */
    private void validatePositionPercent(Asset asset, Long userId, BigDecimal buyUnits) {
        if (asset.getMaxPositionPercent() == null) return;

        BigDecimal currentUnits = BigDecimal.ZERO;
        Optional<UserPosition> position = userPositionRepository.findByUserIdAndAssetId(userId, asset.getId());
        if (position.isPresent()) {
            currentUnits = position.get().getTotalUnits();
        }

        BigDecimal projectedUnits = currentUnits.add(buyUnits);
        BigDecimal maxUnits = asset.getTotalSupply()
                .multiply(asset.getMaxPositionPercent())
                .divide(new BigDecimal("100"), 8, RoundingMode.HALF_UP);

        if (projectedUnits.compareTo(maxUnits) > 0) {
            assetMetrics.recordExposureLimitRejection(asset.getId(), "POSITION_PCT");
            throw new TradingException(
                    "Position would be " + projectedUnits + " units (" +
                            projectedUnits.multiply(new BigDecimal("100")).divide(asset.getTotalSupply(), 2, RoundingMode.HALF_UP) +
                            "% of supply), exceeding the " + asset.getMaxPositionPercent() + "% limit",
                    "POSITION_LIMIT_EXCEEDED");
        }
    }

    /**
     * Reject if user's daily trading volume (XAF) would exceed the asset's limit.
     */
    private void validateDailyLimit(Asset asset, Long userId, BigDecimal cashAmount) {
        if (asset.getDailyTradeLimitXaf() == null) return;

        BigDecimal currentVolume = getDailyVolume(userId, asset.getId());
        BigDecimal projectedVolume = currentVolume.add(cashAmount);

        if (projectedVolume.compareTo(asset.getDailyTradeLimitXaf()) > 0) {
            assetMetrics.recordExposureLimitRejection(asset.getId(), "DAILY_LIMIT");
            throw new TradingException(
                    "Daily trading volume would be " + projectedVolume + " XAF, exceeding the " +
                            asset.getDailyTradeLimitXaf() + " XAF daily limit. Already traded: " + currentVolume + " XAF today.",
                    "DAILY_LIMIT_EXCEEDED");
        }
    }

    /**
     * Record trade volume after successful execution (called post-fill).
     */
    public void recordTradeVolume(Long userId, String assetId, BigDecimal cashAmount) {
        String key = dailyVolumeKey(userId, assetId);
        try {
            redisTemplate.opsForValue().increment(key, cashAmount.longValue());
            redisTemplate.expire(key, DAILY_VOLUME_TTL);
        } catch (Exception e) {
            log.warn("Failed to record daily trade volume for user {} asset {}: {}", userId, assetId, e.getMessage());
        }
    }

    /**
     * Get current daily traded volume from Redis.
     */
    public BigDecimal getDailyVolume(Long userId, String assetId) {
        String key = dailyVolumeKey(userId, assetId);
        try {
            String value = redisTemplate.opsForValue().get(key);
            if (value != null) {
                return new BigDecimal(value);
            }
        } catch (Exception e) {
            log.warn("Failed to read daily trade volume for user {} asset {}: {}", userId, assetId, e.getMessage());
        }
        return BigDecimal.ZERO;
    }

    private String dailyVolumeKey(Long userId, String assetId) {
        return DAILY_VOLUME_PREFIX + userId + ":" + assetId + ":" + LocalDate.now().format(DateTimeFormatter.ISO_LOCAL_DATE);
    }
}
