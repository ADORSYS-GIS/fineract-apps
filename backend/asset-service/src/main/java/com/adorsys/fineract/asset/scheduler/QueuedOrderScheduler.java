package com.adorsys.fineract.asset.scheduler;

import com.adorsys.fineract.asset.config.AssetServiceConfig;
import com.adorsys.fineract.asset.dto.PriceResponse;
import com.adorsys.fineract.asset.dto.OrderStatus;
import com.adorsys.fineract.asset.dto.TradeSide;
import com.adorsys.fineract.asset.entity.Order;
import com.adorsys.fineract.asset.event.AdminAlertEvent;
import com.adorsys.fineract.asset.repository.OrderRepository;
import com.adorsys.fineract.asset.service.PricingService;
import com.adorsys.fineract.asset.service.TradingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import org.springframework.data.domain.PageRequest;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

/**
 * Processes QUEUED orders at market open. Rejects orders where the price
 * has moved beyond the configured stale price threshold since queue time.
 * Runs 1 minute after market open (08:01 WAT, Mon-Fri).
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class QueuedOrderScheduler {

    private final OrderRepository orderRepository;
    private final PricingService pricingService;
    private final AssetServiceConfig config;
    private final ApplicationEventPublisher eventPublisher;

    @Scheduled(cron = "0 1 8 * * MON-FRI", zone = "Africa/Douala")
    public void processQueuedOrders() {
        try {
            List<Order> queuedOrders = orderRepository.findByStatusOrderByCreatedAtAsc(
                    OrderStatus.QUEUED, PageRequest.of(0, 500));

            if (queuedOrders.isEmpty()) {
                log.debug("No queued orders to process at market open.");
                return;
            }

            log.info("Processing {} queued order(s) at market open", queuedOrders.size());
            int processed = 0, rejected = 0, failed = 0;

            for (Order order : queuedOrders) {
                try {
                    if (isPriceStale(order)) {
                        rejectQueuedOrder(order, "Price moved beyond stale threshold since order was queued");
                        rejected++;
                    } else {
                        order.setStatus(OrderStatus.PENDING);
                        orderRepository.save(order);
                        processed++;
                        log.info("Queued order {} promoted to PENDING for execution", order.getId());
                    }
                } catch (Exception e) {
                    failed++;
                    log.error("Failed to process queued order {}: {}", order.getId(), e.getMessage(), e);
                    rejectQueuedOrder(order, "Processing error: " + e.getMessage());
                }
            }

            log.info("Queued order processing complete: {} promoted, {} rejected", processed, rejected);

            if (failed > 0) {
                eventPublisher.publishEvent(new AdminAlertEvent(
                        "SCHEDULER_FAILURE", "Queued order scheduler partial failure",
                        String.format("%d of %d queued orders failed to process", failed, queuedOrders.size()),
                        null, "SCHEDULER"));
            }
        } catch (Exception e) {
            log.error("Queued order scheduler failed: {}", e.getMessage(), e);
            eventPublisher.publishEvent(new AdminAlertEvent(
                    "SCHEDULER_FAILURE", "Queued order scheduler failed",
                    e.getMessage(), null, "SCHEDULER"));
        }
    }

    private boolean isPriceStale(Order order) {
        if (order.getQueuedPrice() == null || order.getQueuedPrice().compareTo(BigDecimal.ZERO) == 0) {
            return false; // No queued price to compare against
        }

        PriceResponse priceData = pricingService.getPrice(order.getAssetId());
        BigDecimal executionPrice = (order.getSide() == TradeSide.BUY)
                ? priceData.askPrice()
                : priceData.bidPrice();

        BigDecimal priceChange = executionPrice.subtract(order.getQueuedPrice()).abs()
                .divide(order.getQueuedPrice(), 6, RoundingMode.HALF_UP)
                .multiply(new BigDecimal("100"));

        BigDecimal threshold = config.getQueuedOrders().getStalePriceThresholdPercent();
        return priceChange.compareTo(threshold) > 0;
    }

    private void rejectQueuedOrder(Order order, String reason) {
        order.setStatus(OrderStatus.REJECTED);
        order.setFailureReason(reason);
        orderRepository.save(order);
        log.info("Rejected queued order {}: {}", order.getId(), reason);
    }
}
