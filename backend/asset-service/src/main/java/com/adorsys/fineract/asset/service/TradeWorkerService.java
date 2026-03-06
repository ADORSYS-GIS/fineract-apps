package com.adorsys.fineract.asset.service;

import com.adorsys.fineract.asset.dto.OrderStatus;
import com.adorsys.fineract.asset.entity.Order;
import com.adorsys.fineract.asset.event.OrderStatusChangedEvent;
import com.adorsys.fineract.asset.metrics.AssetMetrics;
import com.adorsys.fineract.asset.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Background worker that picks up PENDING orders and executes them asynchronously.
 * <p>
 * Dual mechanism:
 * <ul>
 *   <li><b>Event-driven:</b> Listens for {@link OrderStatusChangedEvent} where newStatus == PENDING
 *       and immediately attempts execution.</li>
 *   <li><b>Polling fallback:</b> Runs every 5 seconds to pick up PENDING orders missed by events
 *       (e.g., after crash recovery, or orders promoted by QueuedOrderScheduler).</li>
 * </ul>
 * <p>
 * Worker idempotency is ensured by Redis trade locks and status re-check inside the lock.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class TradeWorkerService {

    private final OrderRepository orderRepository;
    private final TradingService tradingService;
    private final AssetMetrics assetMetrics;

    /**
     * Event-driven path: immediately attempt execution when an order transitions to PENDING.
     */
    @Async
    @EventListener
    public void onOrderConfirmed(OrderStatusChangedEvent event) {
        if (event.newStatus() != OrderStatus.PENDING) return;
        executeOrder(event.orderId());
    }

    /**
     * Polling fallback: pick up any PENDING orders not yet handled by the event path.
     * Runs every 5 seconds, processes up to 10 orders per cycle.
     */
    @Scheduled(fixedRate = 5000)
    public void pollPendingOrders() {
        List<Order> pending = orderRepository.findByStatusForExecution(
                OrderStatus.PENDING, PageRequest.of(0, 10));
        if (pending.isEmpty()) return;

        log.debug("Worker polling: found {} PENDING order(s)", pending.size());
        for (Order order : pending) {
            executeOrder(order.getId());
        }
    }

    private void executeOrder(String orderId) {
        try {
            tradingService.executeOrderAsync(orderId);
        } catch (Exception e) {
            log.error("Worker failed to execute order {}: {}", orderId, e.getMessage());
            assetMetrics.recordTradeFailure();
        }
    }
}
