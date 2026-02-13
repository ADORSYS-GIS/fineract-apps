package com.adorsys.fineract.asset.scheduler;

import com.adorsys.fineract.asset.service.MarketHoursService;
import com.adorsys.fineract.asset.service.PricingService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * OHLC scheduler that resets at market open and closes at market close.
 * Runs every minute to check market state transitions.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class OhlcScheduler {

    private final PricingService pricingService;
    private final MarketHoursService marketHoursService;

    private boolean wasOpen = false;

    /**
     * Initialize wasOpen from actual market state on startup to prevent
     * a false open-transition (and OHLC wipe) if the pod restarts mid-day.
     */
    @PostConstruct
    void initMarketState() {
        wasOpen = marketHoursService.isMarketOpen();
        log.info("OHLC scheduler initialized: market is currently {}", wasOpen ? "OPEN" : "CLOSED");
    }

    @Scheduled(fixedRate = 60000)
    public void checkMarketTransition() {
        try {
            boolean isNowOpen = marketHoursService.isMarketOpen();

            if (!wasOpen && isNowOpen) {
                // Market just opened
                log.info("Market opened - resetting daily OHLC");
                pricingService.resetDailyOhlc();
            } else if (wasOpen && !isNowOpen) {
                // Market just closed
                log.info("Market closed - closing daily OHLC");
                pricingService.closeDailyOhlc();
            }

            wasOpen = isNowOpen;
        } catch (Exception e) {
            log.error("OHLC market transition check failed: {}", e.getMessage(), e);
        }
    }
}
