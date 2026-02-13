package com.adorsys.fineract.asset.scheduler;

import com.adorsys.fineract.asset.config.AssetServiceConfig;
import com.adorsys.fineract.asset.dto.OrderStatus;
import com.adorsys.fineract.asset.entity.Order;
import com.adorsys.fineract.asset.metrics.AssetMetrics;
import com.adorsys.fineract.asset.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

/**
 * Cleans up stale PENDING orders that were never completed,
 * and flags stuck EXECUTING orders for manual reconciliation.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class StaleOrderCleanupScheduler {

    private final OrderRepository orderRepository;
    private final AssetServiceConfig config;
    private final AssetMetrics assetMetrics;

    @Scheduled(fixedRate = 300000) // Every 5 minutes
    public void cleanupStaleOrders() {
        try {
            int minutes = config.getOrders().getStaleCleanupMinutes();
            Instant cutoff = Instant.now().minus(minutes, ChronoUnit.MINUTES);

            List<Order> stalePending = orderRepository.findByStatusAndCreatedAtBefore(OrderStatus.PENDING, cutoff);
            for (Order order : stalePending) {
                order.setStatus(OrderStatus.FAILED);
                order.setFailureReason("Order timed out after " + minutes + " minutes");
            }

            List<Order> stuckExecuting = orderRepository.findByStatusAndCreatedAtBefore(OrderStatus.EXECUTING, cutoff);
            for (Order order : stuckExecuting) {
                log.warn("RECONCILIATION NEEDED: Order {} has been EXECUTING for over {} minutes. "
                        + "assetId={}, userId={}, side={}, amount={}. "
                        + "Verify Fineract batch transfer status before resolving.",
                        order.getId(), minutes, order.getAssetId(),
                        order.getUserId(), order.getSide(), order.getCashAmount());
                order.setStatus(OrderStatus.NEEDS_RECONCILIATION);
                order.setFailureReason("Order stuck in EXECUTING for over " + minutes + " minutes. "
                        + "Requires manual verification against Fineract batch transfer logs.");
                assetMetrics.recordReconciliationNeeded();
            }

            if (!stalePending.isEmpty()) {
                orderRepository.saveAll(stalePending);
            }
            if (!stuckExecuting.isEmpty()) {
                orderRepository.saveAll(stuckExecuting);
            }

            int total = stalePending.size() + stuckExecuting.size();
            if (total > 0) {
                log.info("Cleaned up stale orders: {} PENDING (failed), {} EXECUTING (needs reconciliation)",
                        stalePending.size(), stuckExecuting.size());
            }
        } catch (Exception e) {
            log.error("Stale order cleanup failed: {}", e.getMessage(), e);
        }
    }
}
