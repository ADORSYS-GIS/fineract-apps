package com.adorsys.fineract.asset.scheduler;

import com.adorsys.fineract.asset.client.FineractClient;
import com.adorsys.fineract.asset.config.AssetServiceConfig;
import com.adorsys.fineract.asset.dto.AssetStatus;
import com.adorsys.fineract.asset.entity.Asset;
import com.adorsys.fineract.asset.entity.InterestPayment;
import com.adorsys.fineract.asset.entity.UserPosition;
import com.adorsys.fineract.asset.metrics.AssetMetrics;
import com.adorsys.fineract.asset.repository.AssetRepository;
import com.adorsys.fineract.asset.repository.InterestPaymentRepository;
import com.adorsys.fineract.asset.repository.UserPositionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;

/**
 * Daily scheduler that processes coupon (interest) payments for bond assets.
 * <p>
 * For each ACTIVE bond whose {@code nextCouponDate} has arrived:
 * <ol>
 *   <li>Find all holders with positive units</li>
 *   <li>Calculate coupon amount per holder:
 *       {@code cashAmount = units * faceValue * (annualRate / 100) * (periodMonths / 12)}</li>
 *   <li>Transfer settlement currency from the bond's treasury cash account to the holder's cash account</li>
 *   <li>Record an {@link InterestPayment} audit entry (SUCCESS or FAILED)</li>
 *   <li>Advance {@code nextCouponDate} by {@code couponFrequencyMonths}</li>
 * </ol>
 * Individual payment failures do not block other holders or bonds.
 * <p>
 * Runs at 00:15 WAT (Africa/Douala) every day, after the MaturityScheduler (00:05).
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class InterestPaymentScheduler {

    private final AssetRepository assetRepository;
    private final UserPositionRepository userPositionRepository;
    private final InterestPaymentRepository interestPaymentRepository;
    private final FineractClient fineractClient;
    private final AssetServiceConfig assetServiceConfig;
    private final AssetMetrics assetMetrics;

    @Scheduled(cron = "0 15 0 * * *", zone = "Africa/Douala")
    public void processCouponPayments() {
        LocalDate today = LocalDate.now();
        List<Asset> dueBonds = assetRepository.findByStatusAndNextCouponDateLessThanEqual(
                AssetStatus.ACTIVE, today);

        if (dueBonds.isEmpty()) {
            log.debug("No coupon payments due today ({})", today);
            return;
        }

        log.info("Processing coupon payments for {} bond(s) on {}", dueBonds.size(), today);

        for (Asset bond : dueBonds) {
            try {
                processBondCoupon(bond, today);
            } catch (Exception e) {
                log.error("Failed to process coupons for bond {}: {}", bond.getId(), e.getMessage(), e);
            }
        }
    }

    /**
     * Process coupon payments for a single bond.
     */
    @Transactional
    public void processBondCoupon(Asset bond, LocalDate today) {
        List<UserPosition> holders = userPositionRepository.findHoldersByAssetId(
                bond.getId(), BigDecimal.ZERO);

        if (holders.isEmpty()) {
            log.info("No holders for bond {} — skipping coupon, advancing date", bond.getId());
            advanceCouponDate(bond);
            return;
        }

        BigDecimal faceValue = bond.getManualPrice();
        BigDecimal annualRate = bond.getInterestRate();
        int periodMonths = bond.getCouponFrequencyMonths();
        LocalDate couponDate = bond.getNextCouponDate();

        log.info("Paying coupon for bond {}: {} holders, rate={}%, period={}m, faceValue={}",
                bond.getSymbol(), holders.size(), annualRate, periodMonths, faceValue);

        for (UserPosition holder : holders) {
            payHolder(bond, holder, faceValue, annualRate, periodMonths, couponDate);
        }

        advanceCouponDate(bond);
    }

    /**
     * Pay a single holder their coupon amount in settlement currency.
     * Failures are logged and recorded but do not propagate.
     */
    private void payHolder(Asset bond, UserPosition holder,
                           BigDecimal faceValue, BigDecimal annualRate,
                           int periodMonths, LocalDate couponDate) {
        // couponAmount = units * faceValue * (annualRate / 100) * (periodMonths / 12)
        BigDecimal cashAmount = holder.getTotalUnits()
                .multiply(faceValue)
                .multiply(annualRate)
                .divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(periodMonths))
                .divide(BigDecimal.valueOf(12), 0, RoundingMode.HALF_UP);

        if (cashAmount.compareTo(BigDecimal.ZERO) <= 0) {
            return;
        }

        String currency = assetServiceConfig.getSettlementCurrency();
        InterestPayment.InterestPaymentBuilder record = InterestPayment.builder()
                .assetId(bond.getId())
                .userId(holder.getUserId())
                .units(holder.getTotalUnits())
                .faceValue(faceValue)
                .annualRate(annualRate)
                .periodMonths(periodMonths)
                .cashAmount(cashAmount)
                .couponDate(couponDate);

        try {
            // Find the user's settlement currency savings account
            Long userCashAccountId = fineractClient.findClientSavingsAccountByCurrency(
                    holder.getUserId(), currency);
            if (userCashAccountId == null) {
                throw new RuntimeException("No active " + currency + " account for user " + holder.getUserId());
            }

            // Transfer from treasury cash account to user's cash account
            String description = String.format("Coupon payment: %s %s%% (%dm)",
                    bond.getSymbol(), annualRate, periodMonths);
            Long transferId = fineractClient.createAccountTransfer(
                    bond.getTreasuryCashAccountId(), userCashAccountId,
                    cashAmount, description);

            record.fineractTransferId(transferId).status("SUCCESS");
            assetMetrics.recordCouponPaid(cashAmount.doubleValue());

            log.debug("Coupon paid: bond={}, user={}, amount={} {}, transferId={}",
                    bond.getSymbol(), holder.getUserId(), cashAmount, currency, transferId);

        } catch (Exception e) {
            record.status("FAILED").failureReason(truncate(e.getMessage(), 500));
            assetMetrics.recordCouponFailed();
            log.error("Coupon payment failed: bond={}, user={}, amount={} {}, error={}",
                    bond.getSymbol(), holder.getUserId(), cashAmount, currency, e.getMessage());
        }

        interestPaymentRepository.save(record.build());
    }

    /**
     * Advance the bond's next coupon date by the coupon frequency.
     * If the new date would exceed the maturity date, set nextCouponDate to null
     * (no more coupons after maturity).
     */
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

    private static String truncate(String s, int maxLen) {
        return s != null && s.length() > maxLen ? s.substring(0, maxLen) : s;
    }
}
