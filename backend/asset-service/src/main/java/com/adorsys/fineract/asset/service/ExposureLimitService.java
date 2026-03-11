package com.adorsys.fineract.asset.service;

import com.adorsys.fineract.asset.config.AssetServiceConfig;
import com.adorsys.fineract.asset.dto.TradeSide;
import com.adorsys.fineract.asset.entity.Asset;
import com.adorsys.fineract.asset.entity.AssetPrice;
import com.adorsys.fineract.asset.entity.UserPosition;
import com.adorsys.fineract.asset.exception.TradingException;
import com.adorsys.fineract.asset.metrics.AssetMetrics;
import com.adorsys.fineract.asset.repository.AssetPriceRepository;
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
import java.util.List;
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
    private final AssetPriceRepository assetPriceRepository;
    private final AssetServiceConfig assetServiceConfig;
    private final RedisTemplate<String, String> redisTemplate;
    private final AssetMetrics assetMetrics;

    private static final String DAILY_VOLUME_PREFIX = "trade:daily:";
    private static final Duration DAILY_VOLUME_TTL = Duration.ofHours(25);

    /**
     * Validate all exposure limits before trade execution.
     * Called from TradingService pre-lock validation.
     */
    public void validateLimits(Asset asset, Long userId, TradeSide side, BigDecimal units, BigDecimal cashAmount) {
        validateMinOrderSize(asset, units, cashAmount);
        validateOrderSize(asset, units);
        if (side == TradeSide.BUY) {
            validatePositionPercent(asset, userId, units);
            validatePortfolioExposure(userId, cashAmount);
        }
        validateDailyLimit(asset, userId, cashAmount);
    }

    /**
     * Reject if order units or cash amount fall below the asset's minimums.
     */
    private void validateMinOrderSize(Asset asset, BigDecimal units, BigDecimal cashAmount) {
        if (asset.getMinOrderSize() != null && units.compareTo(asset.getMinOrderSize()) < 0) {
            assetMetrics.recordExposureLimitRejection(asset.getId(), "MIN_ORDER_SIZE");
            throw new TradingException(
                    "Order size " + units + " is below the minimum of " + asset.getMinOrderSize() + " units",
                    "MIN_ORDER_SIZE_NOT_MET");
        }
        if (asset.getMinOrderCashAmount() != null && cashAmount.compareTo(asset.getMinOrderCashAmount()) < 0) {
            assetMetrics.recordExposureLimitRejection(asset.getId(), "MIN_ORDER_CASH");
            throw new TradingException(
                    "Order amount " + cashAmount + " XAF is below the minimum of " + asset.getMinOrderCashAmount() + " XAF",
                    "MIN_ORDER_CASH_NOT_MET");
        }
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
            String current = redisTemplate.opsForValue().get(key);
            BigDecimal newTotal = (current != null ? new BigDecimal(current) : BigDecimal.ZERO).add(cashAmount);
            redisTemplate.opsForValue().set(key, newTotal.toPlainString(), DAILY_VOLUME_TTL);
        } catch (Exception e) {
            log.warn("Failed to record daily trade volume for user {} asset {}: {}", userId, assetId, e.getMessage());
        }
    }

    /**
     * Get current daily traded volume from Redis.
     * Returns ZERO on Redis failure (fail-open) but logs at ERROR level
     * so the gap is visible in monitoring and can be reconciled.
     */
    public BigDecimal getDailyVolume(Long userId, String assetId) {
        String key = dailyVolumeKey(userId, assetId);
        try {
            String value = redisTemplate.opsForValue().get(key);
            if (value != null) {
                return new BigDecimal(value);
            }
        } catch (Exception e) {
            log.error("Redis unavailable for daily limit check (fail-open). "
                    + "Daily limits NOT enforced for user {} asset {}. Cause: {}",
                    userId, assetId, e.getMessage());
        }
        return BigDecimal.ZERO;
    }

    /**
     * BUY only: reject if total portfolio value + this order exceeds the platform-wide exposure limit.
     */
    private void validatePortfolioExposure(Long userId, BigDecimal cashAmount) {
        BigDecimal limit = assetServiceConfig.getPortfolioExposureLimitXaf();
        if (limit == null) return;

        BigDecimal portfolioValue = calculatePortfolioValue(userId);
        BigDecimal projectedValue = portfolioValue.add(cashAmount);

        if (projectedValue.compareTo(limit) > 0) {
            assetMetrics.recordExposureLimitRejection("PORTFOLIO", "PORTFOLIO_LIMIT");
            throw new TradingException(
                    "Portfolio exposure would be " + projectedValue + " XAF, exceeding the platform limit of "
                            + limit + " XAF. Current portfolio: " + portfolioValue + " XAF.",
                    "PORTFOLIO_EXPOSURE_EXCEEDED");
        }
    }

    /**
     * Calculate total portfolio value across all positions at current prices.
     */
    private BigDecimal calculatePortfolioValue(Long userId) {
        // Check Redis cache first
        String cacheKey = "portfolio:value:" + userId;
        try {
            String cached = redisTemplate.opsForValue().get(cacheKey);
            if (cached != null) {
                return new BigDecimal(cached);
            }
        } catch (Exception e) {
            log.warn("Redis unavailable for portfolio value cache: {}", e.getMessage());
        }

        // Calculate from DB
        List<UserPosition> positions = userPositionRepository.findByUserId(userId);
        BigDecimal totalValue = BigDecimal.ZERO;
        for (UserPosition pos : positions) {
            if (pos.getTotalUnits().compareTo(BigDecimal.ZERO) <= 0) continue;
            BigDecimal price = assetPriceRepository.findById(pos.getAssetId())
                    .map(AssetPrice::getAskPrice)
                    .orElse(BigDecimal.ZERO);
            totalValue = totalValue.add(pos.getTotalUnits().multiply(price));
        }

        // Cache for 1 minute
        try {
            redisTemplate.opsForValue().set(cacheKey, totalValue.toPlainString(), Duration.ofMinutes(1));
        } catch (Exception e) {
            log.warn("Failed to cache portfolio value: {}", e.getMessage());
        }

        return totalValue;
    }

    private String dailyVolumeKey(Long userId, String assetId) {
        return DAILY_VOLUME_PREFIX + userId + ":" + assetId + ":" + LocalDate.now().format(DateTimeFormatter.ISO_LOCAL_DATE);
    }
}
