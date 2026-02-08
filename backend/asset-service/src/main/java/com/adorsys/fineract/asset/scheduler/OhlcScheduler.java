package com.adorsys.fineract.asset.scheduler;

import com.adorsys.fineract.asset.service.MarketHoursService;
import com.adorsys.fineract.asset.service.PricingService;
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

    @Scheduled(fixedRate = 60000)
    public void checkMarketTransition() {
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
    }
}
