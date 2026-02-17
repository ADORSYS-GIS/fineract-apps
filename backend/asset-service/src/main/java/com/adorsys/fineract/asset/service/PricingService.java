package com.adorsys.fineract.asset.service;

import com.adorsys.fineract.asset.config.AssetServiceConfig;
import com.adorsys.fineract.asset.dto.*;
import com.adorsys.fineract.asset.entity.AssetPrice;
import com.adorsys.fineract.asset.entity.PriceHistory;
import com.adorsys.fineract.asset.exception.AssetException;
import com.adorsys.fineract.asset.repository.AssetPriceRepository;
import com.adorsys.fineract.asset.repository.AssetRepository;
import com.adorsys.fineract.asset.repository.PriceHistoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

/**
 * Service for price management, OHLC tracking, and price history.
 * Uses Redis for price caching.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class PricingService {

    private final AssetPriceRepository assetPriceRepository;
    private final PriceHistoryRepository priceHistoryRepository;
    private final AssetRepository assetRepository;
    private final RedisTemplate<String, String> redisTemplate;
    private final AssetServiceConfig config;

    private static final String PRICE_CACHE_PREFIX = "asset:price:";
    private static final Duration CACHE_TTL = Duration.ofMinutes(1);

    /**
     * Get current price for an asset. Checks Redis cache first (1-minute TTL),
     * falls back to the asset_prices table. The returned price is the same value
     * shown in AssetResponse and AssetDetailResponse — this method just provides
     * a faster, cached path for the trading engine (BUY/SELL execution).
     */
    @Transactional(readOnly = true)
    public CurrentPriceResponse getCurrentPrice(String assetId) {
        // Try Redis cache first
        try {
            String cached = redisTemplate.opsForValue().get(PRICE_CACHE_PREFIX + assetId);
            if (cached != null) {
                try {
                    String[] parts = cached.split(":");
                    return new CurrentPriceResponse(assetId, new BigDecimal(parts[0]),
                            parts.length > 1 ? new BigDecimal(parts[1]) : null);
                } catch (NumberFormatException | ArrayIndexOutOfBoundsException e) {
                    log.warn("Malformed price cache for asset {}, falling back to DB: {}", assetId, cached);
                    redisTemplate.delete(PRICE_CACHE_PREFIX + assetId);
                }
            }
        } catch (Exception e) {
            log.warn("Redis error fetching price cache for asset {}: {}", assetId, e.getMessage());
        }

        AssetPrice price = assetPriceRepository.findById(assetId)
                .orElseThrow(() -> new AssetException("Price not found for asset: " + assetId));

        // Cache in Redis (best-effort)
        try {
            String cacheValue = price.getCurrentPrice().toPlainString() + ":" +
                    (price.getChange24hPercent() != null ? price.getChange24hPercent().toPlainString() : "0");
            redisTemplate.opsForValue().set(PRICE_CACHE_PREFIX + assetId, cacheValue, CACHE_TTL);
        } catch (Exception e) {
            log.warn("Redis error caching price for asset {}: {}", assetId, e.getMessage());
        }

        return new CurrentPriceResponse(assetId, price.getCurrentPrice(), price.getChange24hPercent());
    }

    /**
     * Get OHLC data for an asset.
     */
    @Transactional(readOnly = true)
    public OhlcResponse getOhlc(String assetId) {
        AssetPrice price = assetPriceRepository.findById(assetId)
                .orElseThrow(() -> new AssetException("Price not found for asset: " + assetId));

        return new OhlcResponse(assetId, price.getDayOpen(), price.getDayHigh(),
                price.getDayLow(), price.getDayClose());
    }

    /**
     * Get price history for charts.
     */
    @Transactional(readOnly = true)
    public PriceHistoryResponse getPriceHistory(String assetId, String period) {
        Instant after = switch (period.toUpperCase()) {
            case "1D" -> Instant.now().minus(1, ChronoUnit.DAYS);
            case "1W" -> Instant.now().minus(7, ChronoUnit.DAYS);
            case "1M" -> Instant.now().minus(30, ChronoUnit.DAYS);
            case "3M" -> Instant.now().minus(90, ChronoUnit.DAYS);
            case "1Y" -> Instant.now().minus(365, ChronoUnit.DAYS);
            case "ALL" -> Instant.EPOCH;
            default -> Instant.now().minus(365, ChronoUnit.DAYS);
        };

        List<PriceHistory> history;
        if ("ALL".equalsIgnoreCase(period)) {
            history = priceHistoryRepository.findByAssetIdOrderByCapturedAtAsc(assetId);
        } else {
            history = priceHistoryRepository.findByAssetIdAndCapturedAtAfterOrderByCapturedAtAsc(assetId, after);
        }

        List<PricePointDto> points = history.stream()
                .map(h -> new PricePointDto(h.getPrice(), h.getCapturedAt()))
                .toList();

        return new PriceHistoryResponse(assetId, period, points);
    }

    /**
     * Manually set an asset's price (admin).
     */
    @Transactional
    @PreAuthorize("@adminSecurity.isOpen() or hasRole('ASSET_MANAGER')")
    public void setPrice(String assetId, SetPriceRequest request) {
        var asset = assetRepository.findById(assetId)
                .orElseThrow(() -> new AssetException("Asset not found: " + assetId));

        AssetPrice price = assetPriceRepository.findById(assetId)
                .orElseThrow(() -> new AssetException("Price not found for asset: " + assetId));

        BigDecimal oldPrice = price.getCurrentPrice();
        price.setCurrentPrice(request.price());

        if (oldPrice.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal change = request.price().subtract(oldPrice)
                    .divide(oldPrice, 4, RoundingMode.HALF_UP)
                    .multiply(new BigDecimal("100"));
            price.setChange24hPercent(change);

            BigDecimal maxChangePercent = config.getPricing().getMaxChangePercent();
            if (maxChangePercent != null && change.abs().compareTo(maxChangePercent) > 0) {
                log.warn("Large price change detected for asset {}: {}% (threshold: {}%). "
                        + "Old price: {}, New price: {}",
                        assetId, change, maxChangePercent, oldPrice, request.price());
            }
        }

        // Update OHLC
        if (price.getDayHigh() == null || request.price().compareTo(price.getDayHigh()) > 0) {
            price.setDayHigh(request.price());
        }
        if (price.getDayLow() == null || request.price().compareTo(price.getDayLow()) < 0) {
            price.setDayLow(request.price());
        }

        assetPriceRepository.save(price);

        // Record price change in history for charts
        PriceHistory history = PriceHistory.builder()
                .assetId(assetId)
                .price(request.price())
                .capturedAt(Instant.now())
                .build();
        priceHistoryRepository.save(history);

        // Update price mode on asset if specified
        if (request.priceMode() != null) {
            asset.setPriceMode(request.priceMode());
            asset.setManualPrice(request.price());
            assetRepository.save(asset);
        }

        // Invalidate cache
        redisTemplate.delete(PRICE_CACHE_PREFIX + assetId);

        log.info("Set price for asset {}: {} -> {}", assetId, oldPrice, request.price());
    }

    /**
     * Update OHLC after a trade execution.
     */
    @Transactional
    public void updateOhlcAfterTrade(String assetId, BigDecimal tradePrice) {
        AssetPrice price = assetPriceRepository.findById(assetId).orElse(null);
        if (price == null) return;

        price.setCurrentPrice(tradePrice);

        if (price.getDayOpen() == null) {
            price.setDayOpen(tradePrice);
        }
        if (price.getDayHigh() == null || tradePrice.compareTo(price.getDayHigh()) > 0) {
            price.setDayHigh(tradePrice);
        }
        if (price.getDayLow() == null || tradePrice.compareTo(price.getDayLow()) < 0) {
            price.setDayLow(tradePrice);
        }

        if (price.getPreviousClose() != null && price.getPreviousClose().compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal change = tradePrice.subtract(price.getPreviousClose())
                    .divide(price.getPreviousClose(), 4, RoundingMode.HALF_UP)
                    .multiply(new BigDecimal("100"));
            price.setChange24hPercent(change);
        }

        assetPriceRepository.save(price);

        // Invalidate cache (best-effort)
        try {
            redisTemplate.delete(PRICE_CACHE_PREFIX + assetId);
        } catch (Exception e) {
            log.warn("Redis error invalidating price cache for asset {}: {}", assetId, e.getMessage());
        }
    }

    /**
     * Snapshot current prices to history (called by scheduler).
     */
    @Transactional
    public void snapshotPrices() {
        List<AssetPrice> prices = assetPriceRepository.findAll();
        for (AssetPrice price : prices) {
            PriceHistory history = PriceHistory.builder()
                    .assetId(price.getAssetId())
                    .price(price.getCurrentPrice())
                    .capturedAt(Instant.now())
                    .build();
            priceHistoryRepository.save(history);
        }
        log.info("Snapshotted {} prices to history", prices.size());
    }

    /**
     * Reset OHLC for a new trading day (called by scheduler at market open).
     */
    @Transactional
    public void resetDailyOhlc() {
        List<AssetPrice> prices = assetPriceRepository.findAll();
        for (AssetPrice price : prices) {
            price.setPreviousClose(price.getCurrentPrice());
            price.setDayOpen(price.getCurrentPrice());
            price.setDayHigh(price.getCurrentPrice());
            price.setDayLow(price.getCurrentPrice());
            price.setDayClose(null);
            assetPriceRepository.save(price);
        }
        log.info("Reset daily OHLC for {} assets", prices.size());
    }

    /**
     * Close OHLC for the day (called by scheduler at market close).
     */
    @Transactional
    public void closeDailyOhlc() {
        List<AssetPrice> prices = assetPriceRepository.findAll();
        for (AssetPrice price : prices) {
            price.setDayClose(price.getCurrentPrice());
            assetPriceRepository.save(price);
        }
        log.info("Closed daily OHLC for {} assets", prices.size());
    }
}
