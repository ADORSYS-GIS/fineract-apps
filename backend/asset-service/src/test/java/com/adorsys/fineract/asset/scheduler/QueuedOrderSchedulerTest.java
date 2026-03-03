package com.adorsys.fineract.asset.scheduler;

import com.adorsys.fineract.asset.config.AssetServiceConfig;
import com.adorsys.fineract.asset.dto.PriceResponse;
import com.adorsys.fineract.asset.dto.OrderStatus;
import com.adorsys.fineract.asset.dto.TradeSide;
import com.adorsys.fineract.asset.entity.Order;
import com.adorsys.fineract.asset.repository.OrderRepository;
import com.adorsys.fineract.asset.service.PricingService;
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
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class QueuedOrderSchedulerTest {

    @Mock private OrderRepository orderRepository;
    @Mock private PricingService pricingService;
    @Mock private AssetServiceConfig config;
    @Mock private ApplicationEventPublisher eventPublisher;

    @InjectMocks
    private QueuedOrderScheduler queuedOrderScheduler;

    @Captor private ArgumentCaptor<Order> orderCaptor;

    @BeforeEach
    void setUp() {
        AssetServiceConfig.QueuedOrders queuedConfig = new AssetServiceConfig.QueuedOrders();
        queuedConfig.setStalePriceThresholdPercent(new BigDecimal("5"));
        lenient().when(config.getQueuedOrders()).thenReturn(queuedConfig);
    }

    @Test
    void processQueuedOrders_noOrders_doesNothing() {
        when(orderRepository.findByStatusOrderByCreatedAtAsc(OrderStatus.QUEUED))
                .thenReturn(List.of());

        queuedOrderScheduler.processQueuedOrders();

        verify(orderRepository, never()).save(any());
    }

    @Test
    void processQueuedOrders_priceStable_promotesToPending() {
        Order order = Order.builder()
                .id("order-001")
                .assetId("asset-001")
                .side(TradeSide.BUY)
                .status(OrderStatus.QUEUED)
                .queuedPrice(new BigDecimal("100"))
                .build();
        when(orderRepository.findByStatusOrderByCreatedAtAsc(OrderStatus.QUEUED))
                .thenReturn(List.of(order));

        // Current price is close to queued price (within 5%)
        PriceResponse priceResp = new PriceResponse(
                "asset-001", new BigDecimal("102"), new BigDecimal("98"), null);
        when(pricingService.getPrice("asset-001")).thenReturn(priceResp);

        queuedOrderScheduler.processQueuedOrders();

        verify(orderRepository).save(orderCaptor.capture());
        Order saved = orderCaptor.getValue();
        assertEquals(OrderStatus.PENDING, saved.getStatus());
    }

    @Test
    void processQueuedOrders_priceStale_rejects() {
        Order order = Order.builder()
                .id("order-002")
                .assetId("asset-001")
                .side(TradeSide.BUY)
                .status(OrderStatus.QUEUED)
                .queuedPrice(new BigDecimal("100"))
                .build();
        when(orderRepository.findByStatusOrderByCreatedAtAsc(OrderStatus.QUEUED))
                .thenReturn(List.of(order));

        // Price moved 10% — beyond 5% threshold
        PriceResponse priceResp = new PriceResponse(
                "asset-001", new BigDecimal("110"), new BigDecimal("105"), null);
        when(pricingService.getPrice("asset-001")).thenReturn(priceResp);

        queuedOrderScheduler.processQueuedOrders();

        verify(orderRepository).save(orderCaptor.capture());
        Order saved = orderCaptor.getValue();
        assertEquals(OrderStatus.REJECTED, saved.getStatus());
        assertTrue(saved.getFailureReason().contains("stale"));
    }

    @Test
    void processQueuedOrders_noQueuedPrice_promotesToPending() {
        // Orders without queued price should be promoted (can't check staleness)
        Order order = Order.builder()
                .id("order-003")
                .assetId("asset-001")
                .side(TradeSide.BUY)
                .status(OrderStatus.QUEUED)
                .queuedPrice(null) // No queued price
                .build();
        when(orderRepository.findByStatusOrderByCreatedAtAsc(OrderStatus.QUEUED))
                .thenReturn(List.of(order));

        queuedOrderScheduler.processQueuedOrders();

        verify(orderRepository).save(orderCaptor.capture());
        assertEquals(OrderStatus.PENDING, orderCaptor.getValue().getStatus());
    }

    @Test
    void processQueuedOrders_usesAskPriceForBuy() {
        Order order = Order.builder()
                .id("order-004")
                .assetId("asset-001")
                .side(TradeSide.BUY)
                .status(OrderStatus.QUEUED)
                .queuedPrice(new BigDecimal("100"))
                .build();
        when(orderRepository.findByStatusOrderByCreatedAtAsc(OrderStatus.QUEUED))
                .thenReturn(List.of(order));

        // Ask price is used for BUY (104 → 4% change, within 5% threshold)
        PriceResponse priceResp = new PriceResponse(
                "asset-001", new BigDecimal("104"), new BigDecimal("95"), null);
        when(pricingService.getPrice("asset-001")).thenReturn(priceResp);

        queuedOrderScheduler.processQueuedOrders();

        verify(orderRepository).save(orderCaptor.capture());
        assertEquals(OrderStatus.PENDING, orderCaptor.getValue().getStatus());
    }

    @Test
    void processQueuedOrders_usesBidPriceForSell() {
        Order order = Order.builder()
                .id("order-005")
                .assetId("asset-001")
                .side(TradeSide.SELL)
                .status(OrderStatus.QUEUED)
                .queuedPrice(new BigDecimal("100"))
                .build();
        when(orderRepository.findByStatusOrderByCreatedAtAsc(OrderStatus.QUEUED))
                .thenReturn(List.of(order));

        // Bid price is used for SELL (96 → 4% change, within threshold)
        PriceResponse priceResp = new PriceResponse(
                "asset-001", new BigDecimal("115"), new BigDecimal("96"), null);
        when(pricingService.getPrice("asset-001")).thenReturn(priceResp);

        queuedOrderScheduler.processQueuedOrders();

        verify(orderRepository).save(orderCaptor.capture());
        assertEquals(OrderStatus.PENDING, orderCaptor.getValue().getStatus());
    }

    @Test
    void processQueuedOrders_processingError_rejectsOrder() {
        Order order = Order.builder()
                .id("order-006")
                .assetId("asset-001")
                .side(TradeSide.BUY)
                .status(OrderStatus.QUEUED)
                .queuedPrice(new BigDecimal("100"))
                .build();
        when(orderRepository.findByStatusOrderByCreatedAtAsc(OrderStatus.QUEUED))
                .thenReturn(List.of(order));

        // Price service throws
        when(pricingService.getPrice("asset-001"))
                .thenThrow(new RuntimeException("Price service unavailable"));

        queuedOrderScheduler.processQueuedOrders();

        verify(orderRepository).save(orderCaptor.capture());
        Order saved = orderCaptor.getValue();
        assertEquals(OrderStatus.REJECTED, saved.getStatus());
        assertTrue(saved.getFailureReason().contains("Processing error"));
    }
}
