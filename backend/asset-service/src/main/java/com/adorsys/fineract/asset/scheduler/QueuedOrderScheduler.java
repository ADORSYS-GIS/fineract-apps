package com.adorsys.fineract.asset.scheduler;

import com.adorsys.fineract.asset.config.AssetServiceConfig;
import com.adorsys.fineract.asset.dto.CurrentPriceResponse;
import com.adorsys.fineract.asset.dto.OrderStatus;
import com.adorsys.fineract.asset.dto.TradeSide;
import com.adorsys.fineract.asset.entity.Order;
import com.adorsys.fineract.asset.repository.OrderRepository;
import com.adorsys.fineract.asset.service.PricingService;
import com.adorsys.fineract.asset.service.TradingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

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

    @Scheduled(cron = "0 1 8 * * MON-FRI", zone = "Africa/Douala")
    public void processQueuedOrders() {
        List<Order> queuedOrders = orderRepository.findByStatusOrderByCreatedAtAsc(OrderStatus.QUEUED);

        if (queuedOrders.isEmpty()) {
            log.debug("No queued orders to process at market open.");
            return;
        }

        log.info("Processing {} queued order(s) at market open", queuedOrders.size());
        int processed = 0, rejected = 0;

        for (Order order : queuedOrders) {
            try {
                if (isPriceStale(order)) {
                    rejectQueuedOrder(order, "Price moved beyond stale threshold since order was queued");
                    rejected++;
                } else {
                    // Mark as PENDING for normal processing by the trading engine
                    order.setStatus(OrderStatus.PENDING);
                    orderRepository.save(order);
                    processed++;
                    log.info("Queued order {} promoted to PENDING for execution", order.getId());
                }
            } catch (Exception e) {
                log.error("Failed to process queued order {}: {}", order.getId(), e.getMessage(), e);
                rejectQueuedOrder(order, "Processing error: " + e.getMessage());
                rejected++;
            }
        }

        log.info("Queued order processing complete: {} promoted, {} rejected", processed, rejected);
    }

    private boolean isPriceStale(Order order) {
        if (order.getQueuedPrice() == null || order.getQueuedPrice().compareTo(BigDecimal.ZERO) == 0) {
            return false; // No queued price to compare against
        }

        CurrentPriceResponse currentPriceData = pricingService.getCurrentPrice(order.getAssetId());
        BigDecimal currentPrice = (order.getSide() == TradeSide.BUY)
                ? (currentPriceData.askPrice() != null ? currentPriceData.askPrice() : currentPriceData.currentPrice())
                : (currentPriceData.bidPrice() != null ? currentPriceData.bidPrice() : currentPriceData.currentPrice());

        BigDecimal priceChange = currentPrice.subtract(order.getQueuedPrice()).abs()
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
