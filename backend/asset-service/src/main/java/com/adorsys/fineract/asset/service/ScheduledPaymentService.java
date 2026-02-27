package com.adorsys.fineract.asset.service;

import com.adorsys.fineract.asset.client.FineractClient;
import com.adorsys.fineract.asset.config.AssetServiceConfig;
import com.adorsys.fineract.asset.dto.*;
import com.adorsys.fineract.asset.entity.*;
import com.adorsys.fineract.asset.event.CouponPaidEvent;
import com.adorsys.fineract.asset.event.IncomePaidEvent;
import com.adorsys.fineract.asset.metrics.AssetMetrics;
import com.adorsys.fineract.asset.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.ZoneId;
import java.util.List;

/**
 * Manages scheduled payment lifecycle: create pending → confirm (execute) or cancel.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ScheduledPaymentService {

    private final ScheduledPaymentRepository scheduledPaymentRepository;
    private final AssetRepository assetRepository;
    private final AssetPriceRepository assetPriceRepository;
    private final UserPositionRepository userPositionRepository;
    private final InterestPaymentRepository interestPaymentRepository;
    private final IncomeDistributionRepository incomeDistributionRepository;
    private final FineractClient fineractClient;
    private final AssetServiceConfig assetServiceConfig;
    private final AssetMetrics assetMetrics;
    private final ApplicationEventPublisher eventPublisher;

    // ── Create pending schedule ─────────────────────────────────────────────

    /**
     * Called by schedulers when a payment date is due.
     * Creates a PENDING record with rate-based estimates.
     * Returns true if a new schedule was created, false if one already exists.
     */
    @Transactional
    public boolean createPendingSchedule(Asset asset, String paymentType, LocalDate scheduleDate) {
        // Idempotent: skip if a schedule already exists for this asset+type+date (any status)
        if (scheduledPaymentRepository.existsByAssetIdAndPaymentTypeAndScheduleDate(
                asset.getId(), paymentType, scheduleDate)) {
            log.debug("Schedule already exists for {} {} on {}", asset.getSymbol(), paymentType, scheduleDate);
            return false;
        }

        List<UserPosition> holders = userPositionRepository.findHoldersByAssetId(
                asset.getId(), BigDecimal.ZERO);

        BigDecimal estimatedRate;
        BigDecimal estimatedAmountPerUnit;
        BigDecimal estimatedTotal = BigDecimal.ZERO;

        if ("COUPON".equals(paymentType)) {
            estimatedRate = asset.getInterestRate();
            BigDecimal faceValue = asset.getManualPrice();
            if (faceValue == null) {
                faceValue = assetPriceRepository.findById(asset.getId())
                        .map(p -> p.getCurrentPrice())
                        .orElse(BigDecimal.ZERO);
            }
            int periodMonths = asset.getCouponFrequencyMonths();
            estimatedAmountPerUnit = faceValue
                    .multiply(estimatedRate)
                    .divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(periodMonths))
                    .divide(BigDecimal.valueOf(12), 4, RoundingMode.HALF_UP);
            for (UserPosition h : holders) {
                estimatedTotal = estimatedTotal.add(
                        h.getTotalUnits().multiply(estimatedAmountPerUnit)
                                .setScale(0, RoundingMode.HALF_UP));
            }
        } else {
            estimatedRate = asset.getIncomeRate();
            BigDecimal currentPrice = assetPriceRepository.findById(asset.getId())
                    .map(p -> p.getCurrentPrice())
                    .orElse(BigDecimal.ZERO);
            int frequencyMonths = asset.getDistributionFrequencyMonths();
            estimatedAmountPerUnit = currentPrice
                    .multiply(estimatedRate)
                    .divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(frequencyMonths))
                    .divide(BigDecimal.valueOf(12), 4, RoundingMode.HALF_UP);
            for (UserPosition h : holders) {
                estimatedTotal = estimatedTotal.add(
                        h.getTotalUnits().multiply(estimatedAmountPerUnit)
                                .setScale(0, RoundingMode.HALF_UP));
            }
        }

        ScheduledPayment schedule = ScheduledPayment.builder()
                .assetId(asset.getId())
                .paymentType(paymentType)
                .scheduleDate(scheduleDate)
                .estimatedRate(estimatedRate)
                .estimatedAmountPerUnit(estimatedAmountPerUnit)
                .estimatedTotal(estimatedTotal)
                .holderCount(holders.size())
                .build();

        scheduledPaymentRepository.save(schedule);

        log.info("Created PENDING {} schedule for {} on {}: {} holders, est. total={}",
                paymentType, asset.getSymbol(), scheduleDate, holders.size(), estimatedTotal);
        return true;
    }

    // ── Confirm (execute payment) ───────────────────────────────────────────

    @Transactional
    public ScheduledPaymentResponse confirmPayment(Long scheduleId, BigDecimal amountPerUnit, String adminUsername) {
        ScheduledPayment schedule = scheduledPaymentRepository.findWithAssetById(scheduleId)
                .orElseThrow(() -> new IllegalArgumentException("Scheduled payment not found: " + scheduleId));

        if (!"PENDING".equals(schedule.getStatus())) {
            throw new IllegalStateException("Cannot confirm schedule in status: " + schedule.getStatus());
        }

        Asset asset = assetRepository.findById(schedule.getAssetId())
                .orElseThrow(() -> new IllegalArgumentException("Asset not found: " + schedule.getAssetId()));

        List<UserPosition> holders = userPositionRepository.findHoldersByAssetId(
                asset.getId(), BigDecimal.ZERO);

        BigDecimal actualAmountPerUnit;
        if ("COUPON".equals(schedule.getPaymentType())) {
            // Bonds: always rate-based, ignore amountPerUnit override
            actualAmountPerUnit = schedule.getEstimatedAmountPerUnit();
        } else if (amountPerUnit != null && amountPerUnit.compareTo(BigDecimal.ZERO) > 0) {
            // Income: admin override
            actualAmountPerUnit = amountPerUnit;
        } else {
            // Income: fall back to rate-based estimate
            actualAmountPerUnit = schedule.getEstimatedAmountPerUnit();
        }

        // Pre-flight: check treasury balance covers total payout
        BigDecimal totalRequired = BigDecimal.ZERO;
        for (UserPosition h : holders) {
            totalRequired = totalRequired.add(
                    h.getTotalUnits().multiply(actualAmountPerUnit)
                            .setScale(0, RoundingMode.HALF_UP));
        }

        BigDecimal treasuryBalance = fineractClient.getAccountBalance(asset.getTreasuryCashAccountId());
        if (treasuryBalance.compareTo(totalRequired) < 0) {
            throw new IllegalStateException(String.format(
                    "Insufficient treasury balance: %s available, %s required for %d holders",
                    treasuryBalance.toPlainString(), totalRequired.toPlainString(), holders.size()));
        }

        int successCount = 0;
        int failCount = 0;
        BigDecimal totalPaid = BigDecimal.ZERO;

        for (UserPosition holder : holders) {
            BigDecimal cashAmount = holder.getTotalUnits()
                    .multiply(actualAmountPerUnit)
                    .setScale(0, RoundingMode.HALF_UP);

            if (cashAmount.compareTo(BigDecimal.ZERO) <= 0) continue;

            boolean success;
            if ("COUPON".equals(schedule.getPaymentType())) {
                success = payCouponHolder(asset, holder, cashAmount, schedule.getScheduleDate());
            } else {
                success = payIncomeHolder(asset, holder, cashAmount,
                        asset.getIncomeRate(), schedule.getScheduleDate());
            }

            if (success) {
                successCount++;
                totalPaid = totalPaid.add(cashAmount);
            } else {
                failCount++;
            }
        }

        // Update schedule record
        schedule.setStatus("CONFIRMED");
        schedule.setActualAmountPerUnit(actualAmountPerUnit);
        schedule.setConfirmedBy(adminUsername);
        schedule.setConfirmedAt(Instant.now());
        schedule.setHoldersPaid(successCount);
        schedule.setHoldersFailed(failCount);
        schedule.setTotalAmountPaid(totalPaid);
        schedule.setExecutedAt(Instant.now());
        scheduledPaymentRepository.save(schedule);

        log.info("Confirmed {} schedule #{} for {}: {} paid, {} failed, total={}",
                schedule.getPaymentType(), scheduleId, asset.getSymbol(),
                successCount, failCount, totalPaid);

        return toResponse(schedule, asset);
    }

    // ── Cancel ──────────────────────────────────────────────────────────────

    @Transactional
    public ScheduledPaymentResponse cancelPayment(Long scheduleId, String reason, String adminUsername) {
        ScheduledPayment schedule = scheduledPaymentRepository.findWithAssetById(scheduleId)
                .orElseThrow(() -> new IllegalArgumentException("Scheduled payment not found: " + scheduleId));

        if (!"PENDING".equals(schedule.getStatus())) {
            throw new IllegalStateException("Cannot cancel schedule in status: " + schedule.getStatus());
        }

        schedule.setStatus("CANCELLED");
        schedule.setCancelledBy(adminUsername);
        schedule.setCancelledAt(Instant.now());
        schedule.setCancelReason(reason);
        scheduledPaymentRepository.save(schedule);

        Asset asset = schedule.getAsset();
        log.info("Cancelled {} schedule #{} for {}: reason={}",
                schedule.getPaymentType(), scheduleId,
                asset != null ? asset.getSymbol() : schedule.getAssetId(), reason);

        return toResponse(schedule, asset);
    }

    // ── List / Detail ───────────────────────────────────────────────────────

    public Page<ScheduledPaymentResponse> listSchedules(String status, String assetId,
                                                         String paymentType, Pageable pageable) {
        return scheduledPaymentRepository.findFiltered(status, assetId, paymentType, pageable)
                .map(sp -> {
                    Asset asset = assetRepository.findById(sp.getAssetId()).orElse(null);
                    return toResponse(sp, asset);
                });
    }

    public ScheduledPaymentDetailResponse getScheduleDetail(Long scheduleId) {
        ScheduledPayment schedule = scheduledPaymentRepository.findWithAssetById(scheduleId)
                .orElseThrow(() -> new IllegalArgumentException("Scheduled payment not found: " + scheduleId));

        Asset asset = schedule.getAsset();
        if (asset == null) {
            asset = assetRepository.findById(schedule.getAssetId()).orElse(null);
        }

        List<UserPosition> holders = userPositionRepository.findHoldersByAssetId(
                schedule.getAssetId(), BigDecimal.ZERO);

        BigDecimal amountPerUnit = schedule.getActualAmountPerUnit() != null
                ? schedule.getActualAmountPerUnit()
                : schedule.getEstimatedAmountPerUnit();

        List<ScheduledPaymentDetailResponse.HolderBreakdown> breakdowns = holders.stream()
                .map(h -> new ScheduledPaymentDetailResponse.HolderBreakdown(
                        h.getUserId(),
                        h.getTotalUnits(),
                        h.getTotalUnits().multiply(amountPerUnit).setScale(0, RoundingMode.HALF_UP)))
                .toList();

        BigDecimal treasuryBalance = null;
        if (asset != null && asset.getTreasuryCashAccountId() != null) {
            try {
                treasuryBalance = fineractClient.getAccountBalance(asset.getTreasuryCashAccountId());
            } catch (Exception e) {
                log.debug("Could not fetch treasury balance for {}: {}", asset.getSymbol(), e.getMessage());
            }
        }

        return new ScheduledPaymentDetailResponse(
                schedule.getId(),
                schedule.getAssetId(),
                asset != null ? asset.getSymbol() : null,
                asset != null ? asset.getName() : null,
                schedule.getPaymentType(),
                schedule.getScheduleDate(),
                schedule.getStatus(),
                schedule.getEstimatedRate(),
                schedule.getEstimatedAmountPerUnit(),
                schedule.getEstimatedTotal(),
                schedule.getHolderCount(),
                schedule.getActualAmountPerUnit(),
                schedule.getConfirmedBy(),
                schedule.getConfirmedAt(),
                schedule.getCancelledBy(),
                schedule.getCancelledAt(),
                schedule.getCancelReason(),
                schedule.getHoldersPaid(),
                schedule.getHoldersFailed(),
                schedule.getTotalAmountPaid(),
                schedule.getExecutedAt(),
                schedule.getCreatedAt(),
                treasuryBalance,
                breakdowns
        );
    }

    public ScheduledPaymentSummaryResponse getSummary() {
        long pending = scheduledPaymentRepository.countByStatus("PENDING");
        Instant startOfMonth = YearMonth.now().atDay(1)
                .atStartOfDay(ZoneId.of("Africa/Douala")).toInstant();
        long confirmedThisMonth = scheduledPaymentRepository
                .countByStatusAndConfirmedAtGreaterThanEqual("CONFIRMED", startOfMonth);
        BigDecimal totalPaidThisMonth = scheduledPaymentRepository.sumPaidSince(startOfMonth);
        return new ScheduledPaymentSummaryResponse(pending, confirmedThisMonth, totalPaidThisMonth);
    }

    // ── Payment results & summary ──────────────────────────────────────────

    /**
     * Returns paginated individual payment records (coupon or income) produced by
     * a confirmed scheduled payment.
     */
    @Transactional(readOnly = true)
    public Page<PaymentResultResponse> getPaymentResults(Long scheduleId, Pageable pageable) {
        ScheduledPayment schedule = scheduledPaymentRepository.findById(scheduleId)
                .orElseThrow(() -> new IllegalArgumentException("Scheduled payment not found: " + scheduleId));

        if ("COUPON".equals(schedule.getPaymentType())) {
            return interestPaymentRepository
                    .findByAssetIdAndCouponDateOrderByPaidAtDesc(
                            schedule.getAssetId(), schedule.getScheduleDate(), pageable)
                    .map(ip -> PaymentResultResponse.fromCoupon(
                            ip.getId(), ip.getUserId(), ip.getUnits(), ip.getCashAmount(),
                            ip.getStatus(), ip.getFailureReason(), ip.getPaidAt(),
                            ip.getFaceValue(), ip.getAnnualRate(), ip.getPeriodMonths()));
        } else {
            return incomeDistributionRepository
                    .findByAssetIdAndDistributionDateOrderByPaidAtDesc(
                            schedule.getAssetId(), schedule.getScheduleDate(), pageable)
                    .map(id -> PaymentResultResponse.fromIncome(
                            id.getId(), id.getUserId(), id.getUnits(), id.getCashAmount(),
                            id.getStatus(), id.getFailureReason(), id.getPaidAt(),
                            id.getIncomeType(), id.getRateApplied()));
        }
    }

    /**
     * Returns a compact summary of payment history for an asset (coupon or income).
     */
    @Transactional(readOnly = true)
    public PaymentSummaryResponse getPaymentSummary(String assetId, String paymentType) {
        LocalDate nextScheduledDate = scheduledPaymentRepository
                .findFirstByAssetIdAndPaymentTypeAndStatusOrderByScheduleDateAsc(
                        assetId, paymentType, "PENDING")
                .map(ScheduledPayment::getScheduleDate)
                .orElse(null);

        if ("COUPON".equals(paymentType)) {
            var lastPayment = interestPaymentRepository
                    .findFirstByAssetIdAndStatusOrderByPaidAtDesc(assetId, "SUCCESS")
                    .orElse(null);
            return new PaymentSummaryResponse(
                    lastPayment != null ? lastPayment.getCouponDate() : null,
                    lastPayment != null ? lastPayment.getCashAmount() : null,
                    lastPayment != null ? lastPayment.getPaidAt() : null,
                    nextScheduledDate,
                    interestPaymentRepository.sumPaidByAsset(assetId),
                    interestPaymentRepository.countFailedByAsset(assetId),
                    interestPaymentRepository.countByAssetId(assetId));
        } else {
            var lastPayment = incomeDistributionRepository
                    .findFirstByAssetIdAndStatusOrderByPaidAtDesc(assetId, "SUCCESS")
                    .orElse(null);
            return new PaymentSummaryResponse(
                    lastPayment != null ? lastPayment.getDistributionDate() : null,
                    lastPayment != null ? lastPayment.getCashAmount() : null,
                    lastPayment != null ? lastPayment.getPaidAt() : null,
                    nextScheduledDate,
                    incomeDistributionRepository.sumPaidByAsset(assetId),
                    incomeDistributionRepository.countFailedByAsset(assetId),
                    incomeDistributionRepository.countByAssetId(assetId));
        }
    }

    // ── Private: pay individual holders ─────────────────────────────────────

    private boolean payCouponHolder(Asset bond, UserPosition holder,
                                     BigDecimal cashAmount, LocalDate couponDate) {
        String currency = assetServiceConfig.getSettlementCurrency();
        InterestPayment.InterestPaymentBuilder record = InterestPayment.builder()
                .assetId(bond.getId())
                .userId(holder.getUserId())
                .units(holder.getTotalUnits())
                .faceValue(bond.getManualPrice())
                .annualRate(bond.getInterestRate())
                .periodMonths(bond.getCouponFrequencyMonths())
                .cashAmount(cashAmount)
                .couponDate(couponDate);

        try {
            Long userCashAccountId = fineractClient.findClientSavingsAccountByCurrency(
                    holder.getUserId(), currency);
            if (userCashAccountId == null) {
                throw new RuntimeException("No active " + currency + " account for user " + holder.getUserId());
            }

            String description = String.format("Coupon payment: %s %s%% (%dm)",
                    bond.getSymbol(), bond.getInterestRate(), bond.getCouponFrequencyMonths());
            Long transferId = fineractClient.createAccountTransfer(
                    bond.getTreasuryCashAccountId(), userCashAccountId, cashAmount, description);

            record.fineractTransferId(transferId).status("SUCCESS");
            assetMetrics.recordCouponPaid(cashAmount.doubleValue());

            eventPublisher.publishEvent(new CouponPaidEvent(
                    holder.getUserId(), bond.getId(), bond.getSymbol(),
                    cashAmount, bond.getInterestRate(), couponDate));

            interestPaymentRepository.save(record.build());
            return true;

        } catch (Exception e) {
            record.status("FAILED").failureReason(truncate(e.getMessage(), 500));
            assetMetrics.recordCouponFailed();
            log.error("Coupon payment failed: bond={}, user={}, amount={} {}, error={}",
                    bond.getSymbol(), holder.getUserId(), cashAmount, currency, e.getMessage());
            interestPaymentRepository.save(record.build());
            return false;
        }
    }

    private boolean payIncomeHolder(Asset asset, UserPosition holder,
                                     BigDecimal cashAmount, BigDecimal rateApplied,
                                     LocalDate distributionDate) {
        String currency = assetServiceConfig.getSettlementCurrency();
        String incomeType = asset.getIncomeType();
        IncomeDistribution.IncomeDistributionBuilder record = IncomeDistribution.builder()
                .assetId(asset.getId())
                .userId(holder.getUserId())
                .incomeType(incomeType)
                .units(holder.getTotalUnits())
                .rateApplied(rateApplied)
                .cashAmount(cashAmount)
                .distributionDate(distributionDate);

        try {
            Long userCashAccountId = fineractClient.findClientSavingsAccountByCurrency(
                    holder.getUserId(), currency);
            if (userCashAccountId == null) {
                throw new RuntimeException("No active " + currency + " account for user " + holder.getUserId());
            }

            String description = String.format("%s payment: %s", incomeType, asset.getSymbol());
            Long transferId = fineractClient.createAccountTransfer(
                    asset.getTreasuryCashAccountId(), userCashAccountId, cashAmount, description);

            record.fineractTransferId(transferId).status("SUCCESS");
            assetMetrics.recordIncomeDistributed(asset.getId(), incomeType, cashAmount.doubleValue());

            eventPublisher.publishEvent(new IncomePaidEvent(
                    holder.getUserId(), asset.getId(), asset.getSymbol(),
                    incomeType, cashAmount, distributionDate));

            incomeDistributionRepository.save(record.build());
            return true;

        } catch (Exception e) {
            record.status("FAILED").failureReason(truncate(e.getMessage(), 500));
            assetMetrics.recordIncomeDistributionFailed(asset.getId(), incomeType);
            log.error("{} payment failed: asset={}, user={}, amount={} {}, error={}",
                    incomeType, asset.getSymbol(), holder.getUserId(), cashAmount, currency, e.getMessage());
            incomeDistributionRepository.save(record.build());
            return false;
        }
    }

    // ── Mapping ─────────────────────────────────────────────────────────────

    private ScheduledPaymentResponse toResponse(ScheduledPayment sp, Asset asset) {
        BigDecimal treasuryBalance = null;
        if (asset != null && asset.getTreasuryCashAccountId() != null) {
            try {
                treasuryBalance = fineractClient.getAccountBalance(asset.getTreasuryCashAccountId());
            } catch (Exception e) {
                log.debug("Could not fetch treasury balance for {}: {}", asset.getSymbol(), e.getMessage());
            }
        }
        return new ScheduledPaymentResponse(
                sp.getId(),
                sp.getAssetId(),
                asset != null ? asset.getSymbol() : null,
                asset != null ? asset.getName() : null,
                sp.getPaymentType(),
                sp.getScheduleDate(),
                sp.getStatus(),
                sp.getEstimatedRate(),
                sp.getEstimatedAmountPerUnit(),
                sp.getEstimatedTotal(),
                sp.getHolderCount(),
                sp.getActualAmountPerUnit(),
                sp.getConfirmedBy(),
                sp.getConfirmedAt(),
                sp.getCancelledBy(),
                sp.getCancelledAt(),
                sp.getCancelReason(),
                sp.getHoldersPaid(),
                sp.getHoldersFailed(),
                sp.getTotalAmountPaid(),
                sp.getExecutedAt(),
                sp.getCreatedAt(),
                treasuryBalance
        );
    }

    private static String truncate(String s, int maxLen) {
        return s != null && s.length() > maxLen ? s.substring(0, maxLen) : s;
    }
}
