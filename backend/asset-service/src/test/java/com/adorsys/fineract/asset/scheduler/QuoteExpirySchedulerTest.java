package com.adorsys.fineract.asset.scheduler;

import com.adorsys.fineract.asset.config.AssetServiceConfig;
import com.adorsys.fineract.asset.dto.OrderStatus;
import com.adorsys.fineract.asset.dto.TradeSide;
import com.adorsys.fineract.asset.entity.Order;
import com.adorsys.fineract.asset.event.OrderStatusChangedEvent;
import com.adorsys.fineract.asset.metrics.AssetMetrics;
import com.adorsys.fineract.asset.repository.OrderRepository;
import com.adorsys.fineract.asset.service.QuoteReservationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.ApplicationEventPublisher;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class QuoteExpirySchedulerTest {

    @Mock private OrderRepository orderRepository;
    @Mock private AssetServiceConfig config;
    @Mock private ApplicationEventPublisher eventPublisher;
    @Mock private AssetMetrics assetMetrics;
    @Mock private QuoteReservationService quoteReservationService;

    @InjectMocks
    private QuoteExpiryScheduler quoteExpiryScheduler;

    @Captor private ArgumentCaptor<Order> orderCaptor;
    @Captor private ArgumentCaptor<OrderStatusChangedEvent> eventCaptor;

    @BeforeEach
    void setUp() {
        AssetServiceConfig.Quote quoteConfig = new AssetServiceConfig.Quote();
        quoteConfig.setTtlSeconds(30);
        lenient().when(config.getQuote()).thenReturn(quoteConfig);
    }

    @Test
    void expireQuotes_noExpired_doesNothing() {
        when(orderRepository.findByStatusAndQuoteExpiresAtBefore(eq(OrderStatus.QUOTED), any(Instant.class)))
                .thenReturn(List.of());

        quoteExpiryScheduler.expireQuotes();

        verify(orderRepository, never()).save(any());
        verifyNoInteractions(eventPublisher);
    }

    @Test
    void expireQuotes_expiredBuyQuote_cancelsAndReleases() {
        Order buyOrder = Order.builder()
                .id("order-001")
                .userId(42L)
                .assetId("asset-001")
                .side(TradeSide.BUY)
                .status(OrderStatus.QUOTED)
                .units(new BigDecimal("10"))
                .executionPrice(new BigDecimal("100"))
                .cashAmount(new BigDecimal("1000"))
                .fee(new BigDecimal("5"))
                .quoteExpiresAt(Instant.now().minusSeconds(10))
                .build();

        when(orderRepository.findByStatusAndQuoteExpiresAtBefore(eq(OrderStatus.QUOTED), any(Instant.class)))
                .thenReturn(List.of(buyOrder));

        quoteExpiryScheduler.expireQuotes();

        verify(orderRepository).save(orderCaptor.capture());
        assertEquals(OrderStatus.CANCELLED, orderCaptor.getValue().getStatus());
        assertTrue(orderCaptor.getValue().getFailureReason().contains("30 seconds"));

        verify(quoteReservationService).release("asset-001", "order-001", new BigDecimal("10"));

        verify(eventPublisher).publishEvent(eventCaptor.capture());
        assertEquals(OrderStatus.CANCELLED, eventCaptor.getValue().newStatus());
        assertEquals(OrderStatus.QUOTED, eventCaptor.getValue().previousStatus());
    }

    @Test
    void expireQuotes_expiredSellQuote_cancelsWithoutRelease() {
        Order sellOrder = Order.builder()
                .id("order-002")
                .userId(42L)
                .assetId("asset-001")
                .side(TradeSide.SELL)
                .status(OrderStatus.QUOTED)
                .units(new BigDecimal("5"))
                .executionPrice(new BigDecimal("95"))
                .cashAmount(new BigDecimal("475"))
                .fee(new BigDecimal("2"))
                .quoteExpiresAt(Instant.now().minusSeconds(10))
                .build();

        when(orderRepository.findByStatusAndQuoteExpiresAtBefore(eq(OrderStatus.QUOTED), any(Instant.class)))
                .thenReturn(List.of(sellOrder));

        quoteExpiryScheduler.expireQuotes();

        verify(orderRepository).save(orderCaptor.capture());
        assertEquals(OrderStatus.CANCELLED, orderCaptor.getValue().getStatus());

        verify(quoteReservationService, never()).release(anyString(), anyString(), any());
        verify(eventPublisher).publishEvent(any(OrderStatusChangedEvent.class));
    }

    @Test
    void expireQuotes_multipleExpired_processesAll() {
        List<Order> expiredOrders = List.of(
                Order.builder().id("o1").userId(1L).assetId("a1").side(TradeSide.BUY)
                        .status(OrderStatus.QUOTED).units(BigDecimal.ONE)
                        .quoteExpiresAt(Instant.now().minusSeconds(5)).build(),
                Order.builder().id("o2").userId(2L).assetId("a2").side(TradeSide.SELL)
                        .status(OrderStatus.QUOTED).units(BigDecimal.TEN)
                        .quoteExpiresAt(Instant.now().minusSeconds(5)).build(),
                Order.builder().id("o3").userId(3L).assetId("a3").side(TradeSide.BUY)
                        .status(OrderStatus.QUOTED).units(new BigDecimal("5"))
                        .quoteExpiresAt(Instant.now().minusSeconds(5)).build()
        );

        when(orderRepository.findByStatusAndQuoteExpiresAtBefore(eq(OrderStatus.QUOTED), any(Instant.class)))
                .thenReturn(expiredOrders);

        quoteExpiryScheduler.expireQuotes();

        verify(orderRepository, times(3)).save(any(Order.class));
        verify(eventPublisher, times(3)).publishEvent(any(OrderStatusChangedEvent.class));
        verify(assetMetrics).recordQuotesExpired(3);
        // BUY orders release, SELL orders don't
        verify(quoteReservationService, times(2)).release(anyString(), anyString(), any());
    }

    @Test
    void expireQuotes_setsFailureReason() {
        Order order = Order.builder()
                .id("order-001")
                .userId(42L)
                .assetId("asset-001")
                .side(TradeSide.SELL)
                .status(OrderStatus.QUOTED)
                .units(BigDecimal.ONE)
                .quoteExpiresAt(Instant.now().minusSeconds(10))
                .build();

        when(orderRepository.findByStatusAndQuoteExpiresAtBefore(eq(OrderStatus.QUOTED), any(Instant.class)))
                .thenReturn(List.of(order));

        quoteExpiryScheduler.expireQuotes();

        verify(orderRepository).save(orderCaptor.capture());
        assertTrue(orderCaptor.getValue().getFailureReason().contains("30 seconds"));
    }
}
