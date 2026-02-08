package com.adorsys.fineract.asset.scheduler;

import com.adorsys.fineract.asset.config.AssetServiceConfig;
import com.adorsys.fineract.asset.dto.OrderStatus;
import com.adorsys.fineract.asset.entity.Order;
import com.adorsys.fineract.asset.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

/**
 * Cleans up stale PENDING orders that were never completed.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class StaleOrderCleanupScheduler {

    private final OrderRepository orderRepository;
    private final AssetServiceConfig config;

    @Scheduled(fixedRate = 300000) // Every 5 minutes
    public void cleanupStaleOrders() {
        int minutes = config.getOrders().getStaleCleanupMinutes();
        Instant cutoff = Instant.now().minus(minutes, ChronoUnit.MINUTES);

        List<Order> staleOrders = orderRepository.findByStatusAndCreatedAtBefore(OrderStatus.PENDING, cutoff);

        for (Order order : staleOrders) {
            order.setStatus(OrderStatus.FAILED);
            order.setFailureReason("Order timed out after " + minutes + " minutes");
            orderRepository.save(order);
        }

        if (!staleOrders.isEmpty()) {
            log.info("Cleaned up {} stale PENDING orders", staleOrders.size());
        }
    }
}
