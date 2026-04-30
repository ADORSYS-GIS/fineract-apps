package com.adorsys.fineract.asset.scheduler;

import com.adorsys.fineract.asset.client.FineractClient;
import com.adorsys.fineract.asset.entity.Asset;
import com.adorsys.fineract.asset.entity.LiquidityProvider;
import com.adorsys.fineract.asset.entity.UserPosition;
import com.adorsys.fineract.asset.event.TreasuryShortfallEvent;
import com.adorsys.fineract.asset.metrics.AssetMetrics;

import com.adorsys.fineract.asset.repository.AssetRepository;
import com.adorsys.fineract.asset.repository.LiquidityProviderRepository;
import com.adorsys.fineract.asset.repository.UserPositionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;

/**
 * Daily scheduler that proactively detects LP cash shortfalls before coupon/income payments.
 * Runs at 22:00 WAT (Africa/Douala) to give admins time to fund the LP cash account before
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
    private final LiquidityProviderRepository lpRepository;

    private static final int LOOKAHEAD_DAYS = 7;

    @Scheduled(cron = "0 0 22 * * *", zone = "Africa/Douala")
    @SchedulerLock(name = "treasury-shortfall-scheduler", lockAtMostFor = "PT15M", lockAtLeastFor = "PT5M")
    public void checkTreasuryShortfalls() {
        LocalDate horizon = LocalDate.now().plusDays(LOOKAHEAD_DAYS);

        try {
            checkBondShortfalls(horizon);
        } catch (Exception e) {
            log.error("Bond LP cash shortfall check failed: {}", e.getMessage(), e);
        }

        try {
            checkIncomeShortfalls(horizon);
        } catch (Exception e) {
            log.error("Income LP cash shortfall check failed: {}", e.getMessage(), e);
        }
    }

    private void checkBondShortfalls(LocalDate horizon) {
        List<Asset> upcomingBonds = assetRepository.findBondsWithUpcomingCoupons(horizon);

        if (upcomingBonds.isEmpty()) {
            log.debug("No bonds with upcoming coupon payments within {} days", LOOKAHEAD_DAYS);
            return;
        }

        log.info("Checking LP cash for {} bond(s) with coupons due within {} days", upcomingBonds.size(), LOOKAHEAD_DAYS);

        for (Asset bond : upcomingBonds) {
            try {
                checkBond(bond);
            } catch (Exception e) {
                log.error("Failed to check LP cash for bond {}: {}", bond.getSymbol(), e.getMessage());
            }
        }
    }

    private void checkIncomeShortfalls(LocalDate horizon) {
        List<Asset> upcomingAssets = assetRepository.findAssetsWithDueDistributions(horizon);

        if (upcomingAssets.isEmpty()) {
            log.debug("No non-bond assets with upcoming income distributions within {} days", LOOKAHEAD_DAYS);
            return;
        }

        log.info("Checking LP cash for {} non-bond asset(s) with income due within {} days",
                upcomingAssets.size(), LOOKAHEAD_DAYS);

        for (Asset asset : upcomingAssets) {
            try {
                checkIncomeAsset(asset);
            } catch (Exception e) {
                log.error("Failed to check LP cash for asset {}: {}", asset.getSymbol(), e.getMessage());
            }
        }
    }

    private void checkIncomeAsset(Asset asset) {
        List<UserPosition> holders = userPositionRepository.findHoldersByAssetId(
                asset.getId(), BigDecimal.ZERO);

        if (holders.isEmpty()) return;

        BigDecimal faceValue = asset.getEffectiveFaceValue() != null
                ? asset.getEffectiveFaceValue() : BigDecimal.ZERO;

        BigDecimal rate = asset.getIncomeRate();
        int frequencyMonths = asset.getDistributionFrequencyMonths();

        // Calculate total obligation: sum of (units * faceValue * rate/100 * freq/12) per holder
        BigDecimal totalObligation = BigDecimal.ZERO;
        for (UserPosition h : holders) {
            BigDecimal incomeAmount = h.getTotalUnits()
                    .multiply(faceValue)
                    .multiply(rate)
                    .divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(frequencyMonths))
                    .divide(BigDecimal.valueOf(12), 0, RoundingMode.HALF_UP);
            totalObligation = totalObligation.add(incomeAmount);
        }

        if (totalObligation.compareTo(BigDecimal.ZERO) <= 0) return;

        BigDecimal lpCashBalance;
        try {
            LiquidityProvider lp = asset.getLpClientId() != null
                    ? lpRepository.findById(asset.getLpClientId()).orElse(null) : null;
            if (lp == null || lp.getCashAccountId() == null) {
                log.warn("LP cash account not configured for asset {}", asset.getSymbol());
                return;
            }
            lpCashBalance = fineractClient.getAccountBalance(lp.getCashAccountId());
        } catch (Exception e) {
            log.warn("Could not fetch LP cash balance for asset {}: {}", asset.getSymbol(), e.getMessage());
            return;
        }

        BigDecimal shortfall = totalObligation.subtract(lpCashBalance);

        if (shortfall.compareTo(BigDecimal.ZERO) > 0) {
            log.warn("LP CASH SHORTFALL detected for asset {} ({}): lpCash={} XAF, obligation={} XAF, shortfall={} XAF, due={}",
                    asset.getSymbol(), asset.getIncomeType(), lpCashBalance, totalObligation, shortfall,
                    asset.getNextDistributionDate());

            assetMetrics.recordTreasuryShortfall(asset.getId(), shortfall.doubleValue());

            eventPublisher.publishEvent(new TreasuryShortfallEvent(
                    null, // broadcast to admins
                    asset.getId(), asset.getSymbol(),
                    lpCashBalance, totalObligation, shortfall,
                    asset.getNextDistributionDate()));
        } else {
            log.debug("Asset {} LP cash OK: balance={} XAF, obligation={} XAF",
                    asset.getSymbol(), lpCashBalance, totalObligation);
        }
    }

    private void checkBond(Asset bond) {
        List<UserPosition> holders = userPositionRepository.findHoldersByAssetId(
                bond.getId(), BigDecimal.ZERO);

        if (holders.isEmpty()) return;

        BigDecimal faceValue = bond.getEffectiveFaceValue() != null ? bond.getEffectiveFaceValue() : BigDecimal.ZERO;
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

        // Fetch LP cash balance
        BigDecimal lpCashBalance;
        try {
            LiquidityProvider lp = bond.getLpClientId() != null
                    ? lpRepository.findById(bond.getLpClientId()).orElse(null) : null;
            if (lp == null || lp.getCashAccountId() == null) {
                log.warn("LP cash account not configured for bond {}", bond.getSymbol());
                return;
            }
            lpCashBalance = fineractClient.getAccountBalance(lp.getCashAccountId());
        } catch (Exception e) {
            log.warn("Could not fetch LP cash balance for bond {}: {}", bond.getSymbol(), e.getMessage());
            return;
        }

        BigDecimal shortfall = totalObligation.subtract(lpCashBalance);

        if (shortfall.compareTo(BigDecimal.ZERO) > 0) {
            log.warn("LP CASH SHORTFALL detected for bond {}: lpCash={} XAF, obligation={} XAF, shortfall={} XAF, due={}",
                    bond.getSymbol(), lpCashBalance, totalObligation, shortfall, bond.getNextCouponDate());

            assetMetrics.recordTreasuryShortfall(bond.getId(), shortfall.doubleValue());

            eventPublisher.publishEvent(new TreasuryShortfallEvent(
                    null, // broadcast to admins
                    bond.getId(), bond.getSymbol(),
                    lpCashBalance, totalObligation, shortfall,
                    bond.getNextCouponDate()));
        } else {
            log.debug("Bond {} LP cash OK: balance={} XAF, obligation={} XAF",
                    bond.getSymbol(), lpCashBalance, totalObligation);
        }
    }
}
