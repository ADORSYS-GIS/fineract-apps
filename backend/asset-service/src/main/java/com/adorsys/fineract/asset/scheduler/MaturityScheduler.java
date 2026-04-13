package com.adorsys.fineract.asset.scheduler;

import com.adorsys.fineract.asset.dto.AssetStatus;
import com.adorsys.fineract.asset.entity.Asset;
import com.adorsys.fineract.asset.event.AdminAlertEvent;
import com.adorsys.fineract.asset.metrics.AssetMetrics;
import com.adorsys.fineract.asset.repository.AssetRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/**
 * Daily scheduler that transitions ACTIVE bonds to MATURED status
 * when their maturity date has passed.
 * <p>
 * Runs at 00:05 WAT (Africa/Douala) every day. Idempotent — a bond that is
 * already MATURED will not be selected by the query.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class MaturityScheduler {

    private final AssetRepository assetRepository;
    private final AssetMetrics assetMetrics;
    private final ApplicationEventPublisher eventPublisher;

    @Scheduled(cron = "0 5 0 * * *", zone = "Africa/Douala")
    @SchedulerLock(name = "maturity-scheduler", lockAtMostFor = "PT10M", lockAtLeastFor = "PT1M")
    public void matureBonds() {
        runMaturityCycle(LocalDate.now());
    }

    /** Processes bond maturities for the given date. Exposed for testing without Shedlock. */
    @Transactional
    public void runMaturityCycle(LocalDate date) {
        try {
            List<Asset> maturedBonds = assetRepository.findByStatusAndMaturityDateLessThanEqual(
                    AssetStatus.ACTIVE, date);

            if (maturedBonds.isEmpty()) {
                log.debug("No bonds to mature today ({})", date);
                return;
            }

            for (Asset bond : maturedBonds) {
                bond.setStatus(AssetStatus.MATURED);
                assetMetrics.incrementBondMatured();
                log.info("Bond matured: id={}, symbol={}, maturityDate={}",
                        bond.getId(), bond.getSymbol(), bond.getMaturityDate());
            }

            assetRepository.saveAll(maturedBonds);
            log.info("Matured {} bond(s) on {}", maturedBonds.size(), date);
        } catch (Exception e) {
            log.error("Maturity scheduler failed: {}", e.getMessage(), e);
            eventPublisher.publishEvent(new AdminAlertEvent(
                    "SCHEDULER_FAILURE", "Maturity scheduler failed",
                    e.getMessage(), null, "SCHEDULER"));
        }
    }
}
