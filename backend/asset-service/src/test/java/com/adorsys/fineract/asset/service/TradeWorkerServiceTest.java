package com.adorsys.fineract.asset.service;

import com.adorsys.fineract.asset.dto.OrderStatus;
import com.adorsys.fineract.asset.dto.TradeSide;
import com.adorsys.fineract.asset.entity.Order;
import com.adorsys.fineract.asset.event.OrderStatusChangedEvent;
import com.adorsys.fineract.asset.metrics.AssetMetrics;
import com.adorsys.fineract.asset.repository.OrderRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageRequest;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TradeWorkerServiceTest {

    @Mock private OrderRepository orderRepository;
    @Mock private TradingService tradingService;
    @Mock private AssetMetrics assetMetrics;

    @InjectMocks
    private TradeWorkerService tradeWorkerService;

    @Test
    void onOrderConfirmed_pendingStatus_executesOrder() {
        OrderStatusChangedEvent event = new OrderStatusChangedEvent(
                "order-001", 42L, "asset-001", "TST", TradeSide.BUY,
                OrderStatus.QUOTED, OrderStatus.PENDING,
                new BigDecimal("10"), new BigDecimal("100"), new BigDecimal("1000"),
                new BigDecimal("5"), null, Instant.now());

        tradeWorkerService.onOrderConfirmed(event);

        verify(tradingService).executeOrderAsync("order-001");
    }

    @Test
    void onOrderConfirmed_nonPendingStatus_ignored() {
        OrderStatusChangedEvent event = new OrderStatusChangedEvent(
                "order-001", 42L, "asset-001", "TST", TradeSide.BUY,
                null, OrderStatus.QUOTED,
                new BigDecimal("10"), new BigDecimal("100"), new BigDecimal("1000"),
                new BigDecimal("5"), null, Instant.now());

        tradeWorkerService.onOrderConfirmed(event);

        verifyNoInteractions(tradingService);
    }

    @Test
    void pollPendingOrders_noOrders_doesNothing() {
        when(orderRepository.findByStatusForExecution(eq(OrderStatus.PENDING), any(PageRequest.class)))
                .thenReturn(List.of());

        tradeWorkerService.pollPendingOrders();

        verifyNoInteractions(tradingService);
    }

    @Test
    void pollPendingOrders_foundOrders_executesEach() {
        Order order1 = Order.builder().id("order-001").status(OrderStatus.PENDING).build();
        Order order2 = Order.builder().id("order-002").status(OrderStatus.PENDING).build();
        when(orderRepository.findByStatusForExecution(eq(OrderStatus.PENDING), any(PageRequest.class)))
                .thenReturn(List.of(order1, order2));

        tradeWorkerService.pollPendingOrders();

        verify(tradingService).executeOrderAsync("order-001");
        verify(tradingService).executeOrderAsync("order-002");
    }

    @Test
    void executeOrder_throwsException_recordsFailure() {
        Order order = Order.builder().id("order-001").status(OrderStatus.PENDING).build();
        when(orderRepository.findByStatusForExecution(eq(OrderStatus.PENDING), any(PageRequest.class)))
                .thenReturn(List.of(order));
        doThrow(new RuntimeException("Fineract timeout"))
                .when(tradingService).executeOrderAsync("order-001");

        tradeWorkerService.pollPendingOrders();

        verify(assetMetrics).recordTradeFailure();
    }
}
