package com.adorsys.fineract.asset.scheduler;

import com.adorsys.fineract.asset.service.ReconciliationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * Daily scheduler that runs automated reconciliation between asset service DB and Fineract.
 * Runs at 01:30 WAT (Africa/Douala) when trading activity is minimal.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class ReconciliationScheduler {

    private final ReconciliationService reconciliationService;

    @Scheduled(cron = "0 30 1 * * *", zone = "Africa/Douala")
    public void runReconciliation() {
        try {
            log.info("Starting daily reconciliation...");
            int discrepancies = reconciliationService.runDailyReconciliation();
            log.info("Daily reconciliation complete: {} discrepancies found", discrepancies);
        } catch (Exception e) {
            log.error("Daily reconciliation failed: {}", e.getMessage(), e);
        }
    }
}
