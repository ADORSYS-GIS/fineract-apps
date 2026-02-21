package com.adorsys.fineract.asset.scheduler;

import com.adorsys.fineract.asset.client.FineractClient;
import com.adorsys.fineract.asset.entity.Asset;
import com.adorsys.fineract.asset.entity.UserPosition;
import com.adorsys.fineract.asset.event.TreasuryShortfallEvent;
import com.adorsys.fineract.asset.metrics.AssetMetrics;
import com.adorsys.fineract.asset.repository.AssetRepository;
import com.adorsys.fineract.asset.repository.UserPositionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;

/**
 * Daily scheduler that proactively detects treasury shortfalls before coupon/income payments.
 * Runs at 22:00 WAT (Africa/Douala) to give admins time to fund the treasury before
 * the next morning's payment schedulers (00:15-00:45).
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class TreasuryShortfallScheduler {

    private final AssetRepository assetRepository;
    private final UserPositionRepository userPositionRepository;
    private final FineractClient fineractClient;
    private final ApplicationEventPublisher eventPublisher;
    private final AssetMetrics assetMetrics;

    private static final int LOOKAHEAD_DAYS = 7;

    @Scheduled(cron = "0 0 22 * * *", zone = "Africa/Douala")
    public void checkTreasuryShortfalls() {
        LocalDate horizon = LocalDate.now().plusDays(LOOKAHEAD_DAYS);

        try {
            checkBondShortfalls(horizon);
        } catch (Exception e) {
            log.error("Treasury shortfall check failed: {}", e.getMessage(), e);
        }
    }

    private void checkBondShortfalls(LocalDate horizon) {
        List<Asset> upcomingBonds = assetRepository.findBondsWithUpcomingCoupons(horizon);

        if (upcomingBonds.isEmpty()) {
            log.debug("No bonds with upcoming coupon payments within {} days", LOOKAHEAD_DAYS);
            return;
        }

        log.info("Checking treasury for {} bond(s) with coupons due within {} days", upcomingBonds.size(), LOOKAHEAD_DAYS);

        for (Asset bond : upcomingBonds) {
            try {
                checkBond(bond);
            } catch (Exception e) {
                log.error("Failed to check treasury for bond {}: {}", bond.getSymbol(), e.getMessage());
            }
        }
    }

    private void checkBond(Asset bond) {
        List<UserPosition> holders = userPositionRepository.findHoldersByAssetId(
                bond.getId(), BigDecimal.ZERO);

        if (holders.isEmpty()) return;

        BigDecimal faceValue = bond.getManualPrice() != null ? bond.getManualPrice() : BigDecimal.ZERO;
        BigDecimal rate = bond.getInterestRate();
        int periodMonths = bond.getCouponFrequencyMonths();

        // Calculate total obligation for the next coupon payment
        BigDecimal totalObligation = BigDecimal.ZERO;
        for (UserPosition h : holders) {
            BigDecimal couponAmount = h.getTotalUnits()
                    .multiply(faceValue)
                    .multiply(rate)
                    .divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(periodMonths))
                    .divide(BigDecimal.valueOf(12), 0, RoundingMode.HALF_UP);
            totalObligation = totalObligation.add(couponAmount);
        }

        if (totalObligation.compareTo(BigDecimal.ZERO) <= 0) return;

        // Fetch treasury balance
        BigDecimal treasuryBalance;
        try {
            treasuryBalance = fineractClient.getAccountBalance(bond.getTreasuryCashAccountId());
        } catch (Exception e) {
            log.warn("Could not fetch treasury balance for bond {}: {}", bond.getSymbol(), e.getMessage());
            return;
        }

        BigDecimal shortfall = totalObligation.subtract(treasuryBalance);

        if (shortfall.compareTo(BigDecimal.ZERO) > 0) {
            log.warn("TREASURY SHORTFALL detected for bond {}: treasury={} XAF, obligation={} XAF, shortfall={} XAF, due={}",
                    bond.getSymbol(), treasuryBalance, totalObligation, shortfall, bond.getNextCouponDate());

            assetMetrics.recordTreasuryShortfall(bond.getId(), shortfall.doubleValue());

            eventPublisher.publishEvent(new TreasuryShortfallEvent(
                    null, // broadcast to admins
                    bond.getId(), bond.getSymbol(),
                    treasuryBalance, totalObligation, shortfall,
                    bond.getNextCouponDate()));
        } else {
            log.debug("Bond {} treasury OK: balance={} XAF, obligation={} XAF",
                    bond.getSymbol(), treasuryBalance, totalObligation);
        }
    }
}
