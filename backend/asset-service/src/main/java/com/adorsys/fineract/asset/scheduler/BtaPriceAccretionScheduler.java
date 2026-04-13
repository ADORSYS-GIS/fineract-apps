package com.adorsys.fineract.asset.scheduler;

import com.adorsys.fineract.asset.entity.Asset;
import com.adorsys.fineract.asset.entity.AssetPrice;
import com.adorsys.fineract.asset.event.AdminAlertEvent;
import com.adorsys.fineract.asset.repository.AssetPriceRepository;
import com.adorsys.fineract.asset.repository.AssetRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.scheduling.annotation.Scheduled;
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.List;

/**
 * Daily scheduler that updates BTA (discount bond) trading prices to reflect
 * their theoretical accreted value as maturity approaches.
 *
 * <p>BTA bonds are zero-coupon discount instruments: bought below face value and
 * redeemed at full face value at maturity. Their fair value increases every day
 * as the remaining discount shrinks. Without this scheduler, the trading price
 * would remain stale at the original issuer price, causing incorrect portfolio
 * valuations and yield calculations.
 *
 * <p>Formula (ACT/360 day count):
 * <pre>
 *   originalTotalDays = maturityDate - createdAt (approx. issue date)
 *   impliedRate       = (faceValue / issuerPrice - 1) × (360 / originalTotalDays)
 *   theoreticalPrice  = faceValue / (1 + impliedRate × daysToMaturity / 360)
 * </pre>
 * This is equivalent to: {@code faceValue / (1 + r × T_remaining / 360)}
 * where r is the implied discount rate derived at issuance.
 *
 * <p>The bid price is updated by maintaining the proportional spread ratio from
 * the current ask price (same behaviour as admin {@code set-price} endpoint).
 *
 * <p>Runs at 00:20 WAT daily — after {@link MaturityScheduler} (00:05) which
 * marks bonds as MATURED, and before {@link AccruedInterestScheduler} (00:30).
 * Matured bonds are excluded by the repository query.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class BtaPriceAccretionScheduler {

    private final AssetRepository assetRepository;
    private final AssetPriceRepository assetPriceRepository;
    private final ApplicationEventPublisher eventPublisher;

    @Scheduled(cron = "0 20 0 * * *", zone = "Africa/Douala")
    @SchedulerLock(name = "bta-price-accretion-scheduler", lockAtMostFor = "PT15M", lockAtLeastFor = "PT5M")
    @Transactional
    public void accreteBtaPrices() {
        LocalDate today = LocalDate.now();
        List<Asset> discountBonds = assetRepository.findActiveDiscountBondsNotMatured(today);

        if (discountBonds.isEmpty()) {
            log.debug("No active BTA discount bonds to accrete on {}", today);
            return;
        }

        log.info("Running BTA price accretion for {} discount bond(s) on {}", discountBonds.size(), today);
        int updated = 0;
        int failed = 0;

        for (Asset bond : discountBonds) {
            try {
                if (accreteBond(bond, today)) {
                    updated++;
                }
            } catch (Exception e) {
                failed++;
                log.error("BTA price accretion failed for bond {}: {}", bond.getId(), e.getMessage(), e);
            }
        }

        log.info("BTA price accretion complete: {} updated, {} failed", updated, failed);

        if (failed > 0) {
            eventPublisher.publishEvent(new AdminAlertEvent(
                    "SCHEDULER_FAILURE", "BTA price accretion partial failure",
                    String.format("%d of %d bonds failed", failed, discountBonds.size()),
                    null, "SCHEDULER"));
        }
    }

    /**
     * Computes and applies the theoretical accreted price for one BTA bond.
     *
     * @return {@code true} if the price was updated, {@code false} if skipped.
     */
    boolean accreteBond(Asset bond, LocalDate today) {
        AssetPrice price = assetPriceRepository.findById(bond.getId()).orElse(null);
        if (price == null) {
            log.warn("No AssetPrice record for BTA bond {}, skipping", bond.getId());
            return false;
        }

        BigDecimal faceValue = bond.getEffectiveFaceValue();
        BigDecimal issuerPrice = bond.getIssuerPrice();

        if (faceValue == null || issuerPrice == null
                || issuerPrice.compareTo(BigDecimal.ZERO) <= 0
                || faceValue.compareTo(issuerPrice) <= 0) {
            log.warn("BTA bond {} has invalid faceValue ({}) or issuerPrice ({}), skipping",
                    bond.getId(), faceValue, issuerPrice);
            return false;
        }

        long daysToMaturity = ChronoUnit.DAYS.between(today, bond.getMaturityDate());
        if (daysToMaturity <= 0) {
            // MaturityScheduler should have already transitioned this bond; skip
            return false;
        }

        // Original total days from issue date to maturity.
        // Prefer the explicit issueDate field (admin-provided auction date);
        // fall back to createdAt as a proxy for bonds created before the field existed.
        LocalDate issueDate = bond.getIssueDate() != null
                ? bond.getIssueDate()
                : bond.getCreatedAt().atZone(ZoneId.of("Africa/Douala")).toLocalDate();
        long originalTotalDays = ChronoUnit.DAYS.between(issueDate, bond.getMaturityDate());
        if (originalTotalDays <= 0) {
            log.warn("BTA bond {} has zero or negative originalTotalDays ({}), skipping",
                    bond.getId(), originalTotalDays);
            return false;
        }

        // impliedRate = (faceValue / issuerPrice - 1) × (360 / originalTotalDays)
        BigDecimal discount = faceValue.divide(issuerPrice, 8, RoundingMode.HALF_UP)
                .subtract(BigDecimal.ONE);
        BigDecimal impliedRate = discount.multiply(new BigDecimal("360"))
                .divide(BigDecimal.valueOf(originalTotalDays), 8, RoundingMode.HALF_UP);

        // theoreticalPrice = faceValue / (1 + impliedRate × daysToMaturity / 360)
        BigDecimal denominator = BigDecimal.ONE.add(
                impliedRate.multiply(BigDecimal.valueOf(daysToMaturity))
                        .divide(new BigDecimal("360"), 8, RoundingMode.HALF_UP));
        BigDecimal theoreticalPrice = faceValue.divide(denominator, 0, RoundingMode.HALF_UP);

        BigDecimal currentAsk = price.getAskPrice();
        if (currentAsk != null && theoreticalPrice.compareTo(currentAsk) == 0) {
            // No change — skip the write
            return false;
        }

        // Maintain spread ratio on bid
        BigDecimal newBidPrice;
        BigDecimal currentBid = price.getBidPrice();
        if (currentAsk != null && currentAsk.compareTo(BigDecimal.ZERO) > 0
                && currentBid != null && currentBid.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal bidRatio = currentBid.divide(currentAsk, 6, RoundingMode.HALF_UP);
            newBidPrice = theoreticalPrice.multiply(bidRatio).setScale(0, RoundingMode.HALF_UP);
        } else {
            newBidPrice = theoreticalPrice;
        }
        // Guard: bid must always be strictly less than ask
        if (newBidPrice.compareTo(theoreticalPrice) >= 0) {
            newBidPrice = theoreticalPrice.subtract(BigDecimal.ONE);
        }

        log.debug("BTA bond {} ({}): ask {} -> {} (daysToMaturity={})",
                bond.getId(), bond.getSymbol(), currentAsk, theoreticalPrice, daysToMaturity);

        price.setAskPrice(theoreticalPrice);
        price.setBidPrice(newBidPrice);
        // Update day high/low as appropriate
        if (price.getDayHigh() == null || theoreticalPrice.compareTo(price.getDayHigh()) > 0) {
            price.setDayHigh(theoreticalPrice);
        }
        if (price.getDayLow() == null || theoreticalPrice.compareTo(price.getDayLow()) < 0) {
            price.setDayLow(theoreticalPrice);
        }
        assetPriceRepository.save(price);
        return true;
    }
}
