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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ExposureLimitServiceTest {

    @Mock private UserPositionRepository userPositionRepository;
    @Mock private AssetPriceRepository assetPriceRepository;
    @Mock private AssetServiceConfig assetServiceConfig;
    @Mock private RedisTemplate<String, String> redisTemplate;
    @Mock private ValueOperations<String, String> valueOperations;
    @Mock private AssetMetrics assetMetrics;

    @InjectMocks
    private ExposureLimitService exposureLimitService;

    private static final Long USER_ID = 42L;
    private static final String ASSET_ID = "asset-001";

    private Asset asset;

    @BeforeEach
    void setUp() {
        asset = Asset.builder()
                .id(ASSET_ID)
                .symbol("TST")
                .totalSupply(new BigDecimal("1000"))
                .build();

        lenient().when(redisTemplate.opsForValue()).thenReturn(valueOperations);
    }

    // -------------------------------------------------------------------------
    // Min Order Size tests
    // -------------------------------------------------------------------------

    @Test
    void validateLimits_belowMinOrderSize_throws() {
        asset.setMinOrderSize(new BigDecimal("5"));
        BigDecimal units = new BigDecimal("3");
        BigDecimal cash = new BigDecimal("300");

        TradingException ex = assertThrows(TradingException.class,
                () -> exposureLimitService.validateLimits(asset, USER_ID, TradeSide.BUY, units, cash));
        assertEquals("MIN_ORDER_SIZE_NOT_MET", ex.getCode());
    }

    @Test
    void validateLimits_atMinOrderSize_passes() {
        asset.setMinOrderSize(new BigDecimal("5"));
        BigDecimal units = new BigDecimal("5");
        BigDecimal cash = new BigDecimal("500");

        // no max/position/daily limits set, portfolio limit null
        lenient().when(assetServiceConfig.getPortfolioExposureLimitXaf()).thenReturn(null);

        assertDoesNotThrow(
                () -> exposureLimitService.validateLimits(asset, USER_ID, TradeSide.BUY, units, cash));
    }

    @Test
    void validateLimits_belowMinCashAmount_throws() {
        asset.setMinOrderCashAmount(new BigDecimal("10000"));
        BigDecimal units = new BigDecimal("10");
        BigDecimal cash = new BigDecimal("5000");

        TradingException ex = assertThrows(TradingException.class,
                () -> exposureLimitService.validateLimits(asset, USER_ID, TradeSide.BUY, units, cash));
        assertEquals("MIN_ORDER_CASH_NOT_MET", ex.getCode());
    }

    @Test
    void validateLimits_noMinOrderSize_passes() {
        // No min order size set (null)
        BigDecimal units = new BigDecimal("1");
        BigDecimal cash = new BigDecimal("100");

        lenient().when(assetServiceConfig.getPortfolioExposureLimitXaf()).thenReturn(null);

        assertDoesNotThrow(
                () -> exposureLimitService.validateLimits(asset, USER_ID, TradeSide.BUY, units, cash));
    }

    // -------------------------------------------------------------------------
    // Portfolio Exposure tests
    // -------------------------------------------------------------------------

    @Test
    void validateLimits_portfolioExposureExceeded_throws() {
        // Setup portfolio limit
        when(assetServiceConfig.getPortfolioExposureLimitXaf()).thenReturn(new BigDecimal("100000"));

        // User has existing position worth 90,000 XAF
        UserPosition pos = UserPosition.builder()
                .userId(USER_ID)
                .assetId(ASSET_ID)
                .totalUnits(new BigDecimal("100"))
                .build();
        when(userPositionRepository.findByUserId(USER_ID)).thenReturn(List.of(pos));
        when(assetPriceRepository.findById(ASSET_ID))
                .thenReturn(Optional.of(AssetPrice.builder()
                        .assetId(ASSET_ID)
                        .askPrice(new BigDecimal("900"))
                        .bidPrice(new BigDecimal("890"))
                        .build()));

        // Redis cache miss
        when(valueOperations.get(anyString())).thenReturn(null);

        BigDecimal units = new BigDecimal("20");
        BigDecimal cash = new BigDecimal("20000"); // 90000 + 20000 = 110000 > 100000

        TradingException ex = assertThrows(TradingException.class,
                () -> exposureLimitService.validateLimits(asset, USER_ID, TradeSide.BUY, units, cash));
        assertEquals("PORTFOLIO_EXPOSURE_EXCEEDED", ex.getCode());
    }

    @Test
    void validateLimits_portfolioExposureWithinLimit_passes() {
        when(assetServiceConfig.getPortfolioExposureLimitXaf()).thenReturn(new BigDecimal("200000"));

        UserPosition pos = UserPosition.builder()
                .userId(USER_ID)
                .assetId(ASSET_ID)
                .totalUnits(new BigDecimal("100"))
                .build();
        when(userPositionRepository.findByUserId(USER_ID)).thenReturn(List.of(pos));
        when(assetPriceRepository.findById(ASSET_ID))
                .thenReturn(Optional.of(AssetPrice.builder()
                        .assetId(ASSET_ID)
                        .askPrice(new BigDecimal("900"))
                        .bidPrice(new BigDecimal("890"))
                        .build()));

        when(valueOperations.get(anyString())).thenReturn(null);

        BigDecimal units = new BigDecimal("10");
        BigDecimal cash = new BigDecimal("10000"); // 90000 + 10000 = 100000 < 200000

        assertDoesNotThrow(
                () -> exposureLimitService.validateLimits(asset, USER_ID, TradeSide.BUY, units, cash));
    }

    @Test
    void validateLimits_portfolioLimitNull_skipsCheck() {
        when(assetServiceConfig.getPortfolioExposureLimitXaf()).thenReturn(null);

        BigDecimal units = new BigDecimal("10");
        BigDecimal cash = new BigDecimal("10000");

        assertDoesNotThrow(
                () -> exposureLimitService.validateLimits(asset, USER_ID, TradeSide.BUY, units, cash));
    }

    @Test
    void validateLimits_sellSide_skipsPortfolioAndPositionChecks() {
        // Even with portfolio limit set, SELL should skip those checks
        lenient().when(assetServiceConfig.getPortfolioExposureLimitXaf()).thenReturn(new BigDecimal("1"));

        BigDecimal units = new BigDecimal("10");
        BigDecimal cash = new BigDecimal("10000");

        assertDoesNotThrow(
                () -> exposureLimitService.validateLimits(asset, USER_ID, TradeSide.SELL, units, cash));

        // Should NOT have queried portfolio positions
        verify(userPositionRepository, never()).findByUserId(anyLong());
    }

    @Test
    void calculatePortfolioValue_usesCachedValueFromRedis() {
        when(assetServiceConfig.getPortfolioExposureLimitXaf()).thenReturn(new BigDecimal("200000"));
        when(valueOperations.get(anyString())).thenReturn("50000");

        BigDecimal units = new BigDecimal("10");
        BigDecimal cash = new BigDecimal("10000"); // 50000 + 10000 = 60000 < 200000

        assertDoesNotThrow(
                () -> exposureLimitService.validateLimits(asset, USER_ID, TradeSide.BUY, units, cash));

        // Should NOT query DB when Redis cache hit
        verify(userPositionRepository, never()).findByUserId(anyLong());
    }
}
