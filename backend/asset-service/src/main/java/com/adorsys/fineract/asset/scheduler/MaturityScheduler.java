package com.adorsys.fineract.asset.scheduler;

import com.adorsys.fineract.asset.dto.AssetStatus;
import com.adorsys.fineract.asset.entity.Asset;
import com.adorsys.fineract.asset.metrics.AssetMetrics;
import com.adorsys.fineract.asset.repository.AssetRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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

    @Scheduled(cron = "0 5 0 * * *", zone = "Africa/Douala")
    @Transactional
    public void matureBonds() {
        LocalDate today = LocalDate.now();
        List<Asset> maturedBonds = assetRepository.findByStatusAndMaturityDateLessThanEqual(
                AssetStatus.ACTIVE, today);

        if (maturedBonds.isEmpty()) {
            log.debug("No bonds to mature today ({})", today);
            return;
        }

        for (Asset bond : maturedBonds) {
            bond.setStatus(AssetStatus.MATURED);
            assetMetrics.incrementBondMatured();
            log.info("Bond matured: id={}, symbol={}, maturityDate={}",
                    bond.getId(), bond.getSymbol(), bond.getMaturityDate());
        }

        assetRepository.saveAll(maturedBonds);
        log.info("Matured {} bond(s) on {}", maturedBonds.size(), today);
    }
}
