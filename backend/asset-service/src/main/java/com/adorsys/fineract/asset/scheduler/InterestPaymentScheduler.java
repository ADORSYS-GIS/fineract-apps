package com.adorsys.fineract.asset.scheduler;

import com.adorsys.fineract.asset.entity.Asset;
import com.adorsys.fineract.asset.event.AdminAlertEvent;
import com.adorsys.fineract.asset.repository.AssetRepository;
import com.adorsys.fineract.asset.service.ScheduledPaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
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
    private final ApplicationEventPublisher eventPublisher;

    @Scheduled(cron = "0 15 0 * * *", zone = "Africa/Douala")
    public void processCouponPayments() {
        try {
            LocalDate today = LocalDate.now();
            List<Asset> dueBonds = assetRepository.findBondsWithDueCoupons(today);

            if (dueBonds.isEmpty()) {
                log.debug("No coupon payments due today ({})", today);
                return;
            }

            log.info("Creating pending coupon schedules for {} bond(s) on {}", dueBonds.size(), today);
            int failed = 0;

            for (Asset bond : dueBonds) {
                try {
                    createPendingAndAdvance(bond);
                } catch (Exception e) {
                    failed++;
                    log.error("Failed to create coupon schedule for bond {}: {}",
                            bond.getId(), e.getMessage(), e);
                }
            }

            if (failed > 0) {
                eventPublisher.publishEvent(new AdminAlertEvent(
                        "SCHEDULER_FAILURE", "Interest payment scheduler partial failure",
                        String.format("%d of %d coupon schedules failed", failed, dueBonds.size()),
                        null, "SCHEDULER"));
            }
        } catch (Exception e) {
            log.error("Interest payment scheduler failed: {}", e.getMessage(), e);
            eventPublisher.publishEvent(new AdminAlertEvent(
                    "SCHEDULER_FAILURE", "Interest payment scheduler failed",
                    e.getMessage(), null, "SCHEDULER"));
        }
    }

    @Transactional
    public void createPendingAndAdvance(Asset bond) {
        LocalDate couponDate = bond.getNextCouponDate();
        scheduledPaymentService.createPendingSchedule(bond, "COUPON", couponDate);

        // Always advance the coupon date — whether a new schedule was created or
        // one already exists (idempotent skip). This prevents the coupon date from
        // getting permanently stuck if the first createPendingSchedule call succeeds
        // but advanceCouponDate fails, since subsequent runs would see "already exists"
        // and never advance.
        advanceCouponDate(bond);
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

        try {
            assetRepository.save(bond);
        } catch (ObjectOptimisticLockingFailureException e) {
            // Another scheduler instance already advanced this bond's coupon date.
            // Log and skip — the date is already correct.
            log.warn("Optimistic lock conflict advancing coupon date for bond {} ({}): {}",
                    bond.getId(), bond.getSymbol(), e.getMessage());
        }
    }
}
