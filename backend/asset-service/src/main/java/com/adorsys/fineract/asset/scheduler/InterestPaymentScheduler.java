package com.adorsys.fineract.asset.scheduler;

import com.adorsys.fineract.asset.entity.Asset;
import com.adorsys.fineract.asset.repository.AssetRepository;
import com.adorsys.fineract.asset.service.ScheduledPaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/**
 * Daily scheduler that creates PENDING scheduled payment records for bond coupon payments.
 * <p>
 * For each ACTIVE/MATURED bond whose {@code nextCouponDate} has arrived:
 * <ol>
 *   <li>Create a PENDING scheduled_payments record with rate-based estimates</li>
 *   <li>Advance {@code nextCouponDate} by {@code couponFrequencyMonths}</li>
 * </ol>
 * Actual payment execution requires admin confirmation via the scheduled-payments API.
 * <p>
 * Runs at 00:15 WAT (Africa/Douala) every day, after the MaturityScheduler (00:05).
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class InterestPaymentScheduler {

    private final AssetRepository assetRepository;
    private final ScheduledPaymentService scheduledPaymentService;

    @Scheduled(cron = "0 15 0 * * *", zone = "Africa/Douala")
    public void processCouponPayments() {
        LocalDate today = LocalDate.now();
        List<Asset> dueBonds = assetRepository.findBondsWithDueCoupons(today);

        if (dueBonds.isEmpty()) {
            log.debug("No coupon payments due today ({})", today);
            return;
        }

        log.info("Creating pending coupon schedules for {} bond(s) on {}", dueBonds.size(), today);

        for (Asset bond : dueBonds) {
            try {
                createPendingAndAdvance(bond);
            } catch (Exception e) {
                log.error("Failed to create coupon schedule for bond {}: {}",
                        bond.getId(), e.getMessage(), e);
            }
        }
    }

    @Transactional
    public void createPendingAndAdvance(Asset bond) {
        LocalDate couponDate = bond.getNextCouponDate();
        boolean created = scheduledPaymentService.createPendingSchedule(bond, "COUPON", couponDate);

        if (created) {
            advanceCouponDate(bond);
        }
    }

    private void advanceCouponDate(Asset bond) {
        LocalDate nextDate = bond.getNextCouponDate()
                .plusMonths(bond.getCouponFrequencyMonths());

        if (bond.getMaturityDate() != null && nextDate.isAfter(bond.getMaturityDate())) {
            bond.setNextCouponDate(null);
            log.info("Bond {} has no more coupon dates after maturity {}", bond.getSymbol(), bond.getMaturityDate());
        } else {
            bond.setNextCouponDate(nextDate);
            log.info("Bond {} next coupon date advanced to {}", bond.getSymbol(), nextDate);
        }

        assetRepository.save(bond);
    }
}
