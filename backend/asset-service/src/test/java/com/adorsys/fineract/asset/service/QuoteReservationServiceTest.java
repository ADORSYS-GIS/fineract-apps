package com.adorsys.fineract.asset.service;

import com.adorsys.fineract.asset.config.AssetServiceConfig;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.RedisConnectionFailureException;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.data.redis.core.script.DefaultRedisScript;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class QuoteReservationServiceTest {

    @Mock private RedisTemplate<String, String> redisTemplate;
    @Mock private AssetServiceConfig config;
    @Mock private ValueOperations<String, String> valueOps;

    @InjectMocks
    private QuoteReservationService quoteReservationService;

    @BeforeEach
    void setUp() {
        AssetServiceConfig.Quote quoteConfig = new AssetServiceConfig.Quote();
        quoteConfig.setTtlSeconds(30);
        lenient().when(config.getQuote()).thenReturn(quoteConfig);
        lenient().when(redisTemplate.opsForValue()).thenReturn(valueOps);
    }

    @Test
    void reserve_executesLuaScript() {
        when(redisTemplate.execute(any(DefaultRedisScript.class), anyList(), any()))
                .thenReturn(1L);

        quoteReservationService.reserve("asset-001", "order-001", new BigDecimal("10"));

        verify(redisTemplate).execute(any(DefaultRedisScript.class), anyList(),
                eq("10"), eq("32"), eq("600"));
    }

    @Test
    void reserve_redisDown_failsOpenSilently() {
        when(redisTemplate.execute(any(DefaultRedisScript.class), anyList(), any()))
                .thenThrow(new RedisConnectionFailureException("Connection refused"));

        assertDoesNotThrow(() ->
                quoteReservationService.reserve("asset-001", "order-001", new BigDecimal("10")));
    }

    @Test
    void release_executesLuaScript() {
        when(redisTemplate.execute(any(DefaultRedisScript.class), anyList(), any()))
                .thenReturn(1L);

        quoteReservationService.release("asset-001", "order-001", new BigDecimal("10"));

        verify(redisTemplate).execute(any(DefaultRedisScript.class),
                eq(List.of("quote:reserve:asset-001:order-001", "quote:reserved-total:asset-001")),
                eq("10"));
    }

    @Test
    void release_redisDown_failsOpenSilently() {
        when(redisTemplate.execute(any(DefaultRedisScript.class), anyList(), any()))
                .thenThrow(new RedisConnectionFailureException("Connection refused"));

        assertDoesNotThrow(() ->
                quoteReservationService.release("asset-001", "order-001", new BigDecimal("10")));
    }

    @Test
    void getReservedUnits_returnsValue() {
        when(valueOps.get("quote:reserved-total:asset-001")).thenReturn("50");

        BigDecimal result = quoteReservationService.getReservedUnits("asset-001");

        assertEquals(new BigDecimal("50"), result);
    }

    @Test
    void getReservedUnits_nullValue_returnsZero() {
        when(valueOps.get("quote:reserved-total:asset-001")).thenReturn(null);

        BigDecimal result = quoteReservationService.getReservedUnits("asset-001");

        assertEquals(BigDecimal.ZERO, result);
    }

    @Test
    void getReservedUnits_redisDown_returnsZero() {
        when(redisTemplate.opsForValue()).thenThrow(new RedisConnectionFailureException("Down"));

        BigDecimal result = quoteReservationService.getReservedUnits("asset-001");

        assertEquals(BigDecimal.ZERO, result);
    }
}
