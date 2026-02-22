package com.adorsys.fineract.asset.service;

import com.adorsys.fineract.asset.dto.CurrentPriceResponse;
import com.adorsys.fineract.asset.entity.AssetPrice;
import com.adorsys.fineract.asset.repository.AssetPriceRepository;
import com.adorsys.fineract.asset.repository.AssetRepository;
import com.adorsys.fineract.asset.repository.PriceHistoryRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.RedisConnectionFailureException;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PricingServiceTest {

    @Mock private AssetPriceRepository assetPriceRepository;
    @Mock private PriceHistoryRepository priceHistoryRepository;
    @Mock private AssetRepository assetRepository;
    @Mock private RedisTemplate<String, String> redisTemplate;
    @Mock private ValueOperations<String, String> valueOperations;

    @InjectMocks
    private PricingService pricingService;

    private static final String ASSET_ID = "asset-001";
    private static final String CACHE_KEY = "asset:price:" + ASSET_ID;

    private AssetPrice buildAssetPrice(BigDecimal price, BigDecimal change) {
        return AssetPrice.builder()
                .assetId(ASSET_ID)
                .currentPrice(price)
                .change24hPercent(change)
                .updatedAt(Instant.now())
                .build();
    }

    @Test
    void getCurrentPrice_cacheHit_returnsFromRedis() {
        // Arrange: Redis has cached value "100:5.5"
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(valueOperations.get(CACHE_KEY)).thenReturn("100:5.5");

        // Act
        CurrentPriceResponse response = pricingService.getCurrentPrice(ASSET_ID);

        // Assert
        assertNotNull(response);
        assertEquals(ASSET_ID, response.assetId());
        assertEquals(0, new BigDecimal("100").compareTo(response.currentPrice()));
        assertEquals(0, new BigDecimal("5.5").compareTo(response.change24hPercent()));

        // Verify DB was NOT queried
        verifyNoInteractions(assetPriceRepository);
    }

    @Test
    void getCurrentPrice_cacheMiss_fetchesFromDb() {
        // Arrange: Redis returns null (cache miss)
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(valueOperations.get(CACHE_KEY)).thenReturn(null);

        AssetPrice dbPrice = buildAssetPrice(new BigDecimal("200"), new BigDecimal("3.25"));
        when(assetPriceRepository.findById(ASSET_ID)).thenReturn(Optional.of(dbPrice));

        // Act
        CurrentPriceResponse response = pricingService.getCurrentPrice(ASSET_ID);

        // Assert
        assertNotNull(response);
        assertEquals(ASSET_ID, response.assetId());
        assertEquals(0, new BigDecimal("200").compareTo(response.currentPrice()));
        assertEquals(0, new BigDecimal("3.25").compareTo(response.change24hPercent()));

        // Verify DB was queried
        verify(assetPriceRepository).findById(ASSET_ID);

        // Verify the price was cached back in Redis
        verify(valueOperations).set(eq(CACHE_KEY), anyString(), any());
    }

    @Test
    void getCurrentPrice_redisDown_fallsBackToDb() {
        // Arrange: Redis throws connection failure on opsForValue().get()
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(valueOperations.get(CACHE_KEY))
                .thenThrow(new RedisConnectionFailureException("Connection refused"));

        AssetPrice dbPrice = buildAssetPrice(new BigDecimal("150"), new BigDecimal("-1.0"));
        when(assetPriceRepository.findById(ASSET_ID)).thenReturn(Optional.of(dbPrice));

        // Act
        CurrentPriceResponse response = pricingService.getCurrentPrice(ASSET_ID);

        // Assert: should fall back to DB gracefully
        assertNotNull(response);
        assertEquals(ASSET_ID, response.assetId());
        assertEquals(0, new BigDecimal("150").compareTo(response.currentPrice()));
        assertEquals(0, new BigDecimal("-1.0").compareTo(response.change24hPercent()));

        verify(assetPriceRepository).findById(ASSET_ID);
    }

    @Test
    void getCurrentPrice_malformedCache_fallsBackToDb() {
        // Arrange: Redis returns malformed value that cannot be parsed
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(valueOperations.get(CACHE_KEY)).thenReturn("invalid");

        // The malformed parse triggers a delete of the bad cache entry
        when(redisTemplate.delete(CACHE_KEY)).thenReturn(true);

        AssetPrice dbPrice = buildAssetPrice(new BigDecimal("300"), new BigDecimal("0.5"));
        when(assetPriceRepository.findById(ASSET_ID)).thenReturn(Optional.of(dbPrice));

        // Act
        CurrentPriceResponse response = pricingService.getCurrentPrice(ASSET_ID);

        // Assert: should fall back to DB after malformed cache
        assertNotNull(response);
        assertEquals(ASSET_ID, response.assetId());
        assertEquals(0, new BigDecimal("300").compareTo(response.currentPrice()));
        assertEquals(0, new BigDecimal("0.5").compareTo(response.change24hPercent()));

        // Verify the malformed cache entry was deleted
        verify(redisTemplate).delete(CACHE_KEY);

        // Verify DB was queried as fallback
        verify(assetPriceRepository).findById(ASSET_ID);
    }
}
