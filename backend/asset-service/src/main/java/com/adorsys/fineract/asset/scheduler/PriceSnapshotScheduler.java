package com.adorsys.fineract.asset.scheduler;

import com.adorsys.fineract.asset.event.AdminAlertEvent;
import com.adorsys.fineract.asset.service.PricingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * Hourly price snapshot scheduler.
 * Captures current prices into price_history table for charting.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class PriceSnapshotScheduler {

    private final PricingService pricingService;
    private final ApplicationEventPublisher eventPublisher;

    @Scheduled(cron = "${asset-service.pricing.snapshot-cron:0 0 * * * *}")
    @SchedulerLock(name = "price-snapshot-scheduler", lockAtMostFor = "PT50M", lockAtLeastFor = "PT5M")
    public void snapshotPrices() {
        try {
            log.info("Running hourly price snapshot");
            pricingService.snapshotPrices();
        } catch (Exception e) {
            log.error("Hourly price snapshot failed: {}", e.getMessage(), e);
            eventPublisher.publishEvent(new AdminAlertEvent(
                    "SCHEDULER_FAILURE", "Price snapshot scheduler failed",
                    e.getMessage(), null, "SCHEDULER"));
        }
    }
}
