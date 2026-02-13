package com.adorsys.fineract.asset.service;

import com.adorsys.fineract.asset.dto.AdminOrderResponse;
import com.adorsys.fineract.asset.dto.OrderStatus;
import com.adorsys.fineract.asset.dto.OrderSummaryResponse;
import com.adorsys.fineract.asset.dto.TradeSide;
import com.adorsys.fineract.asset.entity.Asset;
import com.adorsys.fineract.asset.entity.Order;
import com.adorsys.fineract.asset.exception.AssetNotFoundException;
import com.adorsys.fineract.asset.metrics.AssetMetrics;
import com.adorsys.fineract.asset.repository.OrderRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdminOrderServiceTest {

    @Mock private OrderRepository orderRepository;
    @Mock private AssetMetrics assetMetrics;

    @InjectMocks
    private AdminOrderService adminOrderService;

    @Test
    void getResolvableOrders_returnsPaginatedResults() {
        Order order = buildOrder("o1", OrderStatus.NEEDS_RECONCILIATION);
        Pageable pageable = PageRequest.of(0, 20);
        when(orderRepository.findByStatusIn(anyList(), eq(pageable)))
                .thenReturn(new PageImpl<>(List.of(order)));

        Page<AdminOrderResponse> result = adminOrderService.getResolvableOrders(pageable);

        assertEquals(1, result.getTotalElements());
        assertEquals("o1", result.getContent().get(0).orderId());
        assertEquals(OrderStatus.NEEDS_RECONCILIATION, result.getContent().get(0).status());
    }

    @Test
    void getOrderSummary_returnsCountsByStatus() {
        when(orderRepository.countByStatus(OrderStatus.NEEDS_RECONCILIATION)).thenReturn(3L);
        when(orderRepository.countByStatus(OrderStatus.FAILED)).thenReturn(5L);
        when(orderRepository.countByStatus(OrderStatus.MANUALLY_CLOSED)).thenReturn(2L);

        OrderSummaryResponse summary = adminOrderService.getOrderSummary();

        assertEquals(3, summary.needsReconciliation());
        assertEquals(5, summary.failed());
        assertEquals(2, summary.manuallyClosed());
    }

    @Test
    void resolveOrder_happyPath_setsManuallyClosedAndRecordsMetric() {
        Order order = buildOrder("o1", OrderStatus.NEEDS_RECONCILIATION);
        order.setFailureReason("Stuck in EXECUTING for 30 minutes");
        when(orderRepository.findById("o1")).thenReturn(Optional.of(order));
        when(orderRepository.save(any(Order.class))).thenAnswer(inv -> inv.getArgument(0));

        AdminOrderResponse response = adminOrderService.resolveOrder("o1", "Verified in Fineract, transfer completed", "admin1");

        assertEquals(OrderStatus.MANUALLY_CLOSED, response.status());
        assertEquals("admin1", response.resolvedBy());
        assertNotNull(response.resolvedAt());
        assertTrue(response.failureReason().contains("Verified in Fineract, transfer completed"));
        assertTrue(response.failureReason().contains("Stuck in EXECUTING"));
        verify(assetMetrics).recordOrderResolved();
    }

    @Test
    void resolveOrder_failedOrder_succeeds() {
        Order order = buildOrder("o2", OrderStatus.FAILED);
        order.setFailureReason("Insufficient funds");
        when(orderRepository.findById("o2")).thenReturn(Optional.of(order));
        when(orderRepository.save(any(Order.class))).thenAnswer(inv -> inv.getArgument(0));

        AdminOrderResponse response = adminOrderService.resolveOrder("o2", "User refunded manually", "admin2");

        assertEquals(OrderStatus.MANUALLY_CLOSED, response.status());
        assertEquals("admin2", response.resolvedBy());
        verify(assetMetrics).recordOrderResolved();
    }

    @Test
    void resolveOrder_nonResolvableStatus_throwsException() {
        Order order = buildOrder("o3", OrderStatus.FILLED);
        when(orderRepository.findById("o3")).thenReturn(Optional.of(order));

        assertThrows(IllegalStateException.class,
                () -> adminOrderService.resolveOrder("o3", "test", "admin"));
        verify(assetMetrics, never()).recordOrderResolved();
    }

    @Test
    void resolveOrder_pendingOrder_throwsException() {
        Order order = buildOrder("o4", OrderStatus.PENDING);
        when(orderRepository.findById("o4")).thenReturn(Optional.of(order));

        IllegalStateException ex = assertThrows(IllegalStateException.class,
                () -> adminOrderService.resolveOrder("o4", "test", "admin"));
        assertTrue(ex.getMessage().contains("PENDING"));
        assertTrue(ex.getMessage().contains("cannot be resolved"));
    }

    @Test
    void resolveOrder_notFound_throwsAssetNotFoundException() {
        when(orderRepository.findById("missing")).thenReturn(Optional.empty());

        assertThrows(AssetNotFoundException.class,
                () -> adminOrderService.resolveOrder("missing", "test", "admin"));
    }

    @Test
    void resolveOrder_noExistingFailureReason_setsResolutionOnly() {
        Order order = buildOrder("o5", OrderStatus.FAILED);
        order.setFailureReason(null);
        when(orderRepository.findById("o5")).thenReturn(Optional.of(order));
        when(orderRepository.save(any(Order.class))).thenAnswer(inv -> inv.getArgument(0));

        AdminOrderResponse response = adminOrderService.resolveOrder("o5", "Cleaned up", "admin");

        assertEquals("Resolution: Cleaned up", response.failureReason());
    }

    private Order buildOrder(String id, OrderStatus status) {
        Asset asset = Asset.builder().id("asset1").symbol("TST").name("Test Asset").build();
        return Order.builder()
                .id(id)
                .userId(100L)
                .userExternalId("user-ext-1")
                .assetId("asset1")
                .asset(asset)
                .side(TradeSide.BUY)
                .cashAmount(new BigDecimal("10000"))
                .status(status)
                .createdAt(Instant.now())
                .version(0L)
                .build();
    }
}
