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

import com.adorsys.fineract.asset.entity.Asset;
import org.springframework.data.domain.PageRequest;

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
    private final com.adorsys.fineract.asset.metrics.AssetMetrics assetMetrics;

    private static final String PRICE_CACHE_PREFIX = "asset:price:";
    private static final Duration CACHE_TTL = Duration.ofMinutes(1);

    /**
     * Get price for an asset. Checks Redis cache first (1-minute TTL),
     * falls back to the asset_prices table. Returns askPrice (buyer pays)
     * and bidPrice (seller receives).
     */
    @Transactional(readOnly = true)
    public PriceResponse getPrice(String assetId) {
        // Try Redis cache first (format: askPrice:bidPrice:change24h)
        try {
            String cached = redisTemplate.opsForValue().get(PRICE_CACHE_PREFIX + assetId);
            if (cached != null) {
                try {
                    String[] parts = cached.split(":");
                    BigDecimal askPrice = new BigDecimal(parts[0]);
                    BigDecimal bidPrice = parts.length > 1 && !"null".equals(parts[1]) ? new BigDecimal(parts[1]) : null;
                    BigDecimal change = parts.length > 2 && !"null".equals(parts[2]) ? new BigDecimal(parts[2]) : null;
                    return new PriceResponse(assetId, askPrice, bidPrice, change);
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
            String cacheValue = price.getAskPrice().toPlainString()
                    + ":" + price.getBidPrice().toPlainString()
                    + ":" + (price.getChange24hPercent() != null ? price.getChange24hPercent().toPlainString() : "0");
            redisTemplate.opsForValue().set(PRICE_CACHE_PREFIX + assetId, cacheValue, CACHE_TTL);
        } catch (Exception e) {
            log.warn("Redis error caching price for asset {}: {}", assetId, e.getMessage());
        }

        return new PriceResponse(assetId, price.getAskPrice(), price.getBidPrice(),
                price.getChange24hPercent());
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
    private static final int MAX_PRICE_HISTORY_POINTS = 1000;

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

        PageRequest limit = PageRequest.of(0, MAX_PRICE_HISTORY_POINTS);
        List<PriceHistory> history;
        if ("ALL".equalsIgnoreCase(period)) {
            history = priceHistoryRepository.findByAssetIdOrderByCapturedAtAsc(assetId, limit);
        } else {
            history = priceHistoryRepository.findByAssetIdAndCapturedAtAfterOrderByCapturedAtAsc(assetId, after, limit);
        }

        List<PricePointDto> points = history.stream()
                .map(h -> new PricePointDto(h.getPrice(), h.getCapturedAt()))
                .toList();

        return new PriceHistoryResponse(assetId, period, points);
    }

    /**
     * Manually set an asset's price (admin).
     * The askPrice is the primary input. If bidPrice is provided, it is set directly.
     * Otherwise, bidPrice is auto-derived by scaling proportionally to maintain
     * the existing spread structure.
     */
    @Transactional
    @PreAuthorize("@adminSecurity.isOpen() or hasRole('ASSET_MANAGER')")
    public void setPrice(String assetId, SetPriceRequest request) {
        var asset = assetRepository.findById(assetId)
                .orElseThrow(() -> new AssetException("Asset not found: " + assetId));

        AssetPrice price = assetPriceRepository.findById(assetId)
                .orElseThrow(() -> new AssetException("Price not found for asset: " + assetId));

        BigDecimal oldAskPrice = price.getAskPrice();
        price.setAskPrice(request.askPrice());

        if (oldAskPrice.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal change = request.askPrice().subtract(oldAskPrice)
                    .divide(oldAskPrice, 4, RoundingMode.HALF_UP)
                    .multiply(new BigDecimal("100"));
            price.setChange24hPercent(change);

            BigDecimal maxChangePercent = config.getPricing().getMaxChangePercent();
            if (maxChangePercent != null && change.abs().compareTo(maxChangePercent) > 0) {
                log.warn("Large price change detected for asset {}: {}% (threshold: {}%). "
                        + "Old askPrice: {}, New askPrice: {}",
                        assetId, change, maxChangePercent, oldAskPrice, request.askPrice());
            }
        }

        // Update OHLC based on askPrice
        if (price.getDayHigh() == null || request.askPrice().compareTo(price.getDayHigh()) > 0) {
            price.setDayHigh(request.askPrice());
        }
        if (price.getDayLow() == null || request.askPrice().compareTo(price.getDayLow()) < 0) {
            price.setDayLow(request.askPrice());
        }

        // Update bid: use explicit value if provided, otherwise auto-derive
        if (request.bidPrice() != null) {
            price.setBidPrice(request.bidPrice());
            // Validate bid <= ask
            if (request.bidPrice().compareTo(request.askPrice()) > 0) {
                throw new AssetException("Invalid spread: bid price (" + request.bidPrice()
                        + ") must not exceed ask price (" + request.askPrice() + ")");
            }
        } else if (oldAskPrice.compareTo(BigDecimal.ZERO) > 0) {
            // Auto-derive: scale bid proportionally to maintain spread ratio
            BigDecimal bidRatio = price.getBidPrice()
                    .divide(oldAskPrice, 6, RoundingMode.HALF_UP);
            price.setBidPrice(request.askPrice().multiply(bidRatio)
                    .setScale(0, RoundingMode.HALF_UP));
        }

        assetPriceRepository.save(price);

        // Record price change in history for charts
        PriceHistory history = PriceHistory.builder()
                .assetId(assetId)
                .price(request.askPrice())
                .capturedAt(Instant.now())
                .build();
        priceHistoryRepository.save(history);

        // Update price mode on asset if specified
        if (request.priceMode() != null) {
            asset.setPriceMode(request.priceMode());
            asset.setManualPrice(request.askPrice());
            assetRepository.save(asset);
        }

        // Invalidate cache
        redisTemplate.delete(PRICE_CACHE_PREFIX + assetId);

        log.info("Set price for asset {}: ask {} -> {} (bid={})",
                assetId, oldAskPrice, request.askPrice(), price.getBidPrice());
    }

    /**
     * Update OHLC after a trade execution.
     * Note: In the LP model, bid/ask prices are set directly by the LP and are NOT
     * recalculated from trade prices. Only OHLC values are updated here.
     */
    @Transactional
    public void updateOhlcAfterTrade(String assetId, BigDecimal tradePrice) {
        AssetPrice price = assetPriceRepository.findById(assetId).orElse(null);
        if (price == null) return;

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
            BigDecimal change = price.getAskPrice().subtract(price.getPreviousClose())
                    .divide(price.getPreviousClose(), 4, RoundingMode.HALF_UP)
                    .multiply(new BigDecimal("100"));
            price.setChange24hPercent(change);
        }

        // LP model: bid/ask are NOT recalculated from trades — they are set by the LP directly

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
        int snapshotted = 0;
        for (AssetPrice price : prices) {
            var last = priceHistoryRepository
                    .findTopByAssetIdOrderByCapturedAtDesc(price.getAssetId());
            if (last.isPresent() && last.get().getPrice().compareTo(price.getAskPrice()) == 0) {
                continue; // skip — price unchanged
            }
            PriceHistory history = PriceHistory.builder()
                    .assetId(price.getAssetId())
                    .price(price.getAskPrice())
                    .capturedAt(Instant.now())
                    .build();
            priceHistoryRepository.save(history);
            snapshotted++;
        }
        log.info("Snapshotted {} prices to history ({} unchanged, skipped)",
                snapshotted, prices.size() - snapshotted);
    }

    /**
     * Reset OHLC for a new trading day (called by scheduler at market open).
     * Note: In the LP model, bid/ask prices are NOT recalculated at market open.
     * They are managed directly by the liquidity partner.
     */
    @Transactional
    public void resetDailyOhlc() {
        List<AssetPrice> prices = assetPriceRepository.findAll();
        for (AssetPrice price : prices) {
            price.setPreviousClose(price.getAskPrice());
            price.setDayOpen(price.getAskPrice());
            price.setDayHigh(price.getAskPrice());
            price.setDayLow(price.getAskPrice());
            price.setDayClose(null);
            // LP model: bid/ask are NOT recalculated — they are managed by the LP
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
            price.setDayClose(price.getAskPrice());
            assetPriceRepository.save(price);
        }
        log.info("Closed daily OHLC for {} assets", prices.size());
    }
}
