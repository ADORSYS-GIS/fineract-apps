package com.adorsys.fineract.asset.scheduler;

import com.adorsys.fineract.asset.entity.Asset;
import com.adorsys.fineract.asset.repository.AssetRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

/**
 * Advances a bond's {@code nextCouponDate} in an isolated {@code REQUIRES_NEW} transaction.
 *
 * <p>Using {@code REQUIRES_NEW} prevents an {@link ObjectOptimisticLockingFailureException}
 * from poisoning the outer {@code createPendingAndAdvance} transaction. If two scheduler
 * instances race, the losing instance's date-advance transaction rolls back on its own
 * without rolling back the already-committed {@code createPendingSchedule} work.</p>
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class CouponDateAdvancer {

    private final AssetRepository assetRepository;

    /**
     * Advances the bond's next coupon date by its configured frequency.
     * Sets {@code nextCouponDate} to {@code null} once maturity is passed.
     *
     * <p>Runs in its own transaction ({@code REQUIRES_NEW}). An optimistic lock
     * conflict is caught and logged — another instance already performed the advance.</p>
     */
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void advance(Asset bond) {
        LocalDate currentDate = bond.getNextCouponDate();
        if (currentDate == null) {
            log.debug("Bond {} has no next coupon date to advance", bond.getSymbol());
            return;
        }

        LocalDate nextDate = currentDate.plusMonths(bond.getCouponFrequencyMonths());

        if (bond.getMaturityDate() != null && nextDate.isAfter(bond.getMaturityDate())) {
            bond.setNextCouponDate(null);
            log.info("Bond {} ({}) has no more coupon dates after maturity {}",
                    bond.getSymbol(), bond.getId(), bond.getMaturityDate());
        } else {
            bond.setNextCouponDate(nextDate);
        }

        try {
            assetRepository.save(bond);
            log.info("Bond {} next coupon date advanced to {}", bond.getSymbol(), bond.getNextCouponDate());
        } catch (ObjectOptimisticLockingFailureException e) {
            // Another scheduler instance already advanced this bond's coupon date.
            // Safe to swallow — REQUIRES_NEW rolls back independently, outer transaction is unaffected.
            log.warn("Optimistic lock conflict advancing coupon date for bond {} ({}): "
                    + "another instance already advanced it", bond.getSymbol(), bond.getId());
        }
    }
}
