package com.adorsys.fineract.asset.scheduler;

import com.adorsys.fineract.asset.config.AssetServiceConfig;
import com.adorsys.fineract.asset.dto.OrderStatus;
import com.adorsys.fineract.asset.dto.TradeSide;
import com.adorsys.fineract.asset.entity.Order;
import com.adorsys.fineract.asset.event.OrderStatusChangedEvent;
import com.adorsys.fineract.asset.metrics.AssetMetrics;
import com.adorsys.fineract.asset.repository.OrderRepository;
import com.adorsys.fineract.asset.service.QuoteReservationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.List;

/**
 * Expires QUOTED orders that have passed their TTL. Releases soft-reserved
 * inventory and publishes status change events for SSE notification.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class QuoteExpiryScheduler {

    private final OrderRepository orderRepository;
    private final AssetServiceConfig config;
    private final ApplicationEventPublisher eventPublisher;
    private final AssetMetrics assetMetrics;
    private final QuoteReservationService quoteReservationService;

    @Scheduled(fixedRateString = "${asset-service.quote.expiry-cleanup-interval-ms:10000}")
    public void expireQuotes() {
        List<Order> expired = orderRepository.findByStatusAndQuoteExpiresAtBefore(
                OrderStatus.QUOTED, Instant.now());

        if (expired.isEmpty()) return;

        int count = 0;
        for (Order order : expired) {
            order.setStatus(OrderStatus.CANCELLED);
            order.setFailureReason("Quote expired after " + config.getQuote().getTtlSeconds() + " seconds");
            orderRepository.save(order);

            // Release soft reservation for BUY quotes
            if (order.getSide() == TradeSide.BUY) {
                quoteReservationService.release(order.getAssetId(), order.getId(), order.getUnits());
            }

            eventPublisher.publishEvent(new OrderStatusChangedEvent(
                    order.getId(), order.getUserId(), order.getAssetId(), null,
                    order.getSide(), OrderStatus.QUOTED, OrderStatus.CANCELLED,
                    order.getUnits(), order.getExecutionPrice(), order.getCashAmount(),
                    order.getFee(), "Quote expired", Instant.now()));
            count++;
        }

        log.info("Expired {} quote(s)", count);
        assetMetrics.recordQuotesExpired(count);
    }
}
