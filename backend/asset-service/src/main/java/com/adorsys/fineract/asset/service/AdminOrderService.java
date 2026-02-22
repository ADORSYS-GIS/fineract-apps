package com.adorsys.fineract.asset.service;

import com.adorsys.fineract.asset.dto.*;
import com.adorsys.fineract.asset.entity.Order;
import com.adorsys.fineract.asset.exception.AssetNotFoundException;
import com.adorsys.fineract.asset.metrics.AssetMetrics;
import com.adorsys.fineract.asset.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Set;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminOrderService {

    private static final Set<OrderStatus> RESOLVABLE_STATUSES = Set.of(
            OrderStatus.NEEDS_RECONCILIATION, OrderStatus.FAILED);

    private static final List<OrderStatus> DEFAULT_FILTER_STATUSES = List.of(
            OrderStatus.NEEDS_RECONCILIATION, OrderStatus.FAILED, OrderStatus.MANUALLY_CLOSED);

    private final OrderRepository orderRepository;
    private final AssetMetrics assetMetrics;

    @Transactional(readOnly = true)
    public Page<AdminOrderResponse> getResolvableOrders(Pageable pageable) {
        return orderRepository
                .findByStatusIn(List.of(OrderStatus.NEEDS_RECONCILIATION, OrderStatus.FAILED), pageable)
                .map(this::toAdminOrderResponse);
    }

    @Transactional(readOnly = true)
    public Page<AdminOrderResponse> getFilteredOrders(OrderStatus status, String assetId,
                                                       String search, Instant fromDate,
                                                       Instant toDate, Pageable pageable) {
        String statusStr = status != null ? status.name() : null;
        return orderRepository.findFiltered(statusStr, assetId, search, fromDate, toDate, pageable)
                .map(this::toAdminOrderResponse);
    }

    @Transactional(readOnly = true)
    public OrderDetailResponse getOrderDetail(String orderId) {
        Order order = orderRepository.findWithAssetById(orderId)
                .orElseThrow(() -> new AssetNotFoundException("Order not found: " + orderId));
        return toOrderDetailResponse(order);
    }

    @Transactional(readOnly = true)
    public List<AssetOptionResponse> getOrderAssetOptions() {
        return orderRepository.findDistinctAssetOptionsByStatusIn(List.of(OrderStatus.values()))
                .stream()
                .map(row -> new AssetOptionResponse((String) row[0], (String) row[1], (String) row[2]))
                .toList();
    }

    @Transactional(readOnly = true)
    public OrderSummaryResponse getOrderSummary() {
        long needsReconciliation = orderRepository.countByStatus(OrderStatus.NEEDS_RECONCILIATION);
        long failed = orderRepository.countByStatus(OrderStatus.FAILED);
        long manuallyClosed = orderRepository.countByStatus(OrderStatus.MANUALLY_CLOSED);
        return new OrderSummaryResponse(needsReconciliation, failed, manuallyClosed);
    }

    @Transactional
    public AdminOrderResponse resolveOrder(String orderId, String resolution, String adminUsername) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new AssetNotFoundException("Order not found: " + orderId));

        if (!RESOLVABLE_STATUSES.contains(order.getStatus())) {
            throw new IllegalStateException(
                    "Order " + orderId + " has status " + order.getStatus()
                    + " which cannot be resolved. Only NEEDS_RECONCILIATION and FAILED orders can be resolved.");
        }

        String previousReason = order.getFailureReason();
        String updatedReason = previousReason != null
                ? previousReason + " | Resolution: " + resolution
                : "Resolution: " + resolution;

        order.setStatus(OrderStatus.MANUALLY_CLOSED);
        order.setFailureReason(updatedReason);
        order.setResolvedBy(adminUsername);
        order.setResolvedAt(Instant.now());

        Order saved = orderRepository.save(order);
        assetMetrics.recordOrderResolved();

        log.info("Order {} resolved by admin {}. Previous status: {}, resolution: {}",
                orderId, adminUsername, order.getStatus(), resolution);

        return toAdminOrderResponse(saved);
    }

    private AdminOrderResponse toAdminOrderResponse(Order order) {
        String symbol = order.getAsset() != null ? order.getAsset().getSymbol() : null;
        return new AdminOrderResponse(
                order.getId(),
                order.getAssetId(),
                symbol,
                order.getSide(),
                order.getUnits(),
                order.getExecutionPrice(),
                order.getCashAmount(),
                order.getFee(),
                order.getSpreadAmount(),
                order.getStatus(),
                order.getFailureReason(),
                order.getUserExternalId(),
                order.getUserId(),
                order.getResolvedBy(),
                order.getResolvedAt(),
                order.getCreatedAt(),
                order.getUpdatedAt()
        );
    }

    private OrderDetailResponse toOrderDetailResponse(Order order) {
        String symbol = order.getAsset() != null ? order.getAsset().getSymbol() : null;
        String assetName = order.getAsset() != null ? order.getAsset().getName() : null;
        return new OrderDetailResponse(
                order.getId(),
                order.getAssetId(),
                symbol,
                assetName,
                order.getSide(),
                order.getUnits(),
                order.getExecutionPrice(),
                order.getCashAmount(),
                order.getFee(),
                order.getSpreadAmount(),
                order.getStatus(),
                order.getFailureReason(),
                order.getUserExternalId(),
                order.getUserId(),
                order.getIdempotencyKey(),
                order.getFineractBatchId(),
                order.getVersion(),
                order.getResolvedBy(),
                order.getResolvedAt(),
                order.getCreatedAt(),
                order.getUpdatedAt()
        );
    }
}
