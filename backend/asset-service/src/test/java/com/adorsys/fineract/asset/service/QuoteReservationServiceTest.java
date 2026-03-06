package com.adorsys.fineract.asset.service;

import com.adorsys.fineract.asset.config.AssetServiceConfig;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.RedisConnectionFailureException;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.SessionCallback;
import org.springframework.data.redis.core.ValueOperations;

import java.math.BigDecimal;

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
    void reserve_executesAtomicTransaction() {
        // SessionCallback is executed via redisTemplate.execute()
        when(redisTemplate.execute(any(SessionCallback.class))).thenReturn(null);

        quoteReservationService.reserve("asset-001", "order-001", new BigDecimal("10"));

        verify(redisTemplate).execute(any(SessionCallback.class));
    }

    @Test
    void reserve_redisDown_failsOpenSilently() {
        when(redisTemplate.execute(any(SessionCallback.class)))
                .thenThrow(new RedisConnectionFailureException("Connection refused"));

        assertDoesNotThrow(() ->
                quoteReservationService.reserve("asset-001", "order-001", new BigDecimal("10")));
    }

    @Test
    void release_deletesKeyAndDecrements() {
        when(redisTemplate.delete("quote:reserve:asset-001:order-001")).thenReturn(true);

        quoteReservationService.release("asset-001", "order-001", new BigDecimal("10"));

        verify(redisTemplate).delete("quote:reserve:asset-001:order-001");
        verify(valueOps).decrement("quote:reserved-total:asset-001", 10L);
    }

    @Test
    void release_keyNotFound_skipsDecrement() {
        when(redisTemplate.delete("quote:reserve:asset-001:order-001")).thenReturn(false);

        quoteReservationService.release("asset-001", "order-001", new BigDecimal("10"));

        verify(redisTemplate).delete("quote:reserve:asset-001:order-001");
        verifyNoInteractions(valueOps);
    }

    @Test
    void release_deleteReturnsNull_skipsDecrement() {
        when(redisTemplate.delete("quote:reserve:asset-001:order-001")).thenReturn(null);

        quoteReservationService.release("asset-001", "order-001", new BigDecimal("10"));

        verify(redisTemplate).delete("quote:reserve:asset-001:order-001");
        verifyNoInteractions(valueOps);
    }

    @Test
    void release_redisDown_failsOpenSilently() {
        when(redisTemplate.delete(anyString()))
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
