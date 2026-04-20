package com.adorsys.fineract.asset.service;

import com.adorsys.fineract.asset.client.FineractClient;
import com.adorsys.fineract.asset.client.FineractClient.BatchJournalEntryOp;
import com.adorsys.fineract.asset.client.FineractClient.BatchOperation;
import com.adorsys.fineract.asset.client.FineractClient.BatchTransferOp;
import com.adorsys.fineract.asset.config.AssetServiceConfig;
import com.adorsys.fineract.asset.config.ResolvedGlAccounts;
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
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

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
    private final TaxService taxService;
    private final ResolvedGlAccounts resolvedGlAccounts;

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
            if (estimatedRate == null || estimatedRate.compareTo(BigDecimal.ZERO) <= 0) {
                log.error("Bond {} has no positive interest rate — cannot create coupon schedule for {}",
                        asset.getId(), scheduleDate);
                return false;
            }
            BigDecimal faceValue = asset.getEffectiveFaceValue();
            if (faceValue == null) {
                faceValue = BigDecimal.ZERO;
            }
            // OTA coupon: use ACT/365 (actual days in period), not months/12 approximation.
            // lastCouponDate = scheduleDate - couponFrequencyMonths
            DayCountConvention convention = asset.getDayCountConvention() != null
                    ? asset.getDayCountConvention() : DayCountConvention.ACT_365;
            LocalDate lastCouponDate = scheduleDate.minusMonths(asset.getCouponFrequencyMonths());
            long actualDays = convention.daysBetween(lastCouponDate, scheduleDate);
            estimatedAmountPerUnit = faceValue
                    .multiply(estimatedRate)
                    .divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(actualDays))
                    .divide(BigDecimal.valueOf(convention.getBasis()), 4, RoundingMode.HALF_UP);
            for (UserPosition h : holders) {
                estimatedTotal = estimatedTotal.add(
                        h.getTotalUnits().multiply(estimatedAmountPerUnit)
                                .setScale(0, RoundingMode.HALF_UP));
            }
        } else {
            estimatedRate = asset.getIncomeRate();
            BigDecimal faceValue = asset.getEffectiveFaceValue() != null
                    ? asset.getEffectiveFaceValue() : BigDecimal.ZERO;
            int frequencyMonths = asset.getDistributionFrequencyMonths();
            estimatedAmountPerUnit = faceValue
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

        // Pre-flight: check LP cash balance covers total payout
        BigDecimal totalRequired = BigDecimal.ZERO;
        for (UserPosition h : holders) {
            totalRequired = totalRequired.add(
                    h.getTotalUnits().multiply(actualAmountPerUnit)
                            .setScale(0, RoundingMode.HALF_UP));
        }

        // Warn if actual total deviates more than 5% from the estimate (e.g. holder count changed)
        if (schedule.getEstimatedTotal() != null
                && schedule.getEstimatedTotal().compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal deviation = totalRequired.subtract(schedule.getEstimatedTotal())
                    .abs()
                    .divide(schedule.getEstimatedTotal(), 4, RoundingMode.HALF_UP);
            if (deviation.compareTo(new BigDecimal("0.05")) > 0) {
                log.warn("Scheduled payment #{} actual total {} deviates {}% from estimate {}. "
                        + "Holder count may have changed since scheduling.",
                        scheduleId, totalRequired,
                        deviation.multiply(new BigDecimal("100")).setScale(1, RoundingMode.HALF_UP),
                        schedule.getEstimatedTotal());
            }
        }

        BigDecimal lpCashBalance = fineractClient.getAccountBalance(asset.getLpCashAccountId());
        if (lpCashBalance.compareTo(totalRequired) < 0) {
            throw new IllegalStateException(String.format(
                    "Insufficient LP cash balance: %s available, %s required for %d holders",
                    lpCashBalance.toPlainString(), totalRequired.toPlainString(), holders.size()));
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
        schedule.setStatus(failCount > 0 ? "PARTIAL" : "CONFIRMED");
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

        BigDecimal lpCashBalance = null;
        if (asset != null && asset.getLpCashAccountId() != null) {
            try {
                lpCashBalance = fineractClient.getAccountBalance(asset.getLpCashAccountId());
            } catch (Exception e) {
                log.debug("Could not fetch LP cash balance for {}: {}", asset.getSymbol(), e.getMessage());
            }
        }

        // IRCM fields for COUPON payments
        BigDecimal grossAmountPerUnit = null;
        BigDecimal ircmWithheldPerUnit = null;
        BigDecimal netAmountPerUnit = null;
        BigDecimal ircmRateValue = null;
        boolean ircmExempt = false;
        BigDecimal totalIrcmWithheld = null;

        if ("COUPON".equals(schedule.getPaymentType()) && asset != null) {
            ircmExempt = Boolean.TRUE.equals(asset.getIrcmExempt())
                    || Boolean.TRUE.equals(asset.getIsGovernmentBond());
            ircmRateValue = taxService.getEffectiveIrcmRate(asset);

            BigDecimal faceValue = asset.getEffectiveFaceValue();
            BigDecimal rate = asset.getInterestRate();
            int periodMonths = asset.getCouponFrequencyMonths() != null ? asset.getCouponFrequencyMonths() : 0;

            if (faceValue != null && rate != null && periodMonths > 0) {
                // Use ACT/365 actual days to match createPendingSchedule calculation
                DayCountConvention convention = asset.getDayCountConvention() != null
                        ? asset.getDayCountConvention() : DayCountConvention.ACT_365;
                LocalDate scheduleDate = schedule.getScheduleDate();
                LocalDate lastCouponDate = scheduleDate.minusMonths(periodMonths);
                long actualDays = convention.daysBetween(lastCouponDate, scheduleDate);
                grossAmountPerUnit = faceValue
                        .multiply(rate)
                        .divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP)
                        .multiply(BigDecimal.valueOf(actualDays))
                        .divide(BigDecimal.valueOf(convention.getBasis()), 4, RoundingMode.HALF_UP);
                // Use consistent scale (0dp) for per-unit amounts to reconcile with total
                ircmWithheldPerUnit = ircmExempt
                        ? BigDecimal.ZERO
                        : grossAmountPerUnit.multiply(ircmRateValue).setScale(0, RoundingMode.HALF_UP);
                netAmountPerUnit = grossAmountPerUnit.setScale(0, RoundingMode.HALF_UP)
                        .subtract(ircmWithheldPerUnit);
            }

            // Total IRCM withheld = sum of per-holder IRCM (only available post-execution)
            if (schedule.getTotalAmountPaid() != null && grossAmountPerUnit != null
                    && !ircmExempt && ircmRateValue.compareTo(BigDecimal.ZERO) > 0) {
                // Estimate: totalIrcmWithheld = totalPaid / netAmountPerUnit * ircmWithheldPerUnit
                // More precisely: reconstruct from actual per-unit amounts
                BigDecimal totalGross = BigDecimal.ZERO;
                for (UserPosition h : holders) {
                    totalGross = totalGross.add(
                            h.getTotalUnits().multiply(grossAmountPerUnit).setScale(0, RoundingMode.HALF_UP));
                }
                totalIrcmWithheld = totalGross.multiply(ircmRateValue).setScale(0, RoundingMode.HALF_UP);
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
                lpCashBalance,
                grossAmountPerUnit,
                ircmWithheldPerUnit,
                netAmountPerUnit,
                ircmRateValue,
                ircmExempt,
                totalIrcmWithheld,
                breakdowns
        );
    }

    public ScheduledPaymentSummaryResponse getSummary() {
        long pending = scheduledPaymentRepository.countByStatus("PENDING");
        Instant startOfMonth = YearMonth.now().atDay(1)
                .atStartOfDay(ZoneId.of(assetServiceConfig.getMarketHours().getTimezone())).toInstant();
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
            // Load asset to compute IRCM breakdown per holder
            Asset asset = assetRepository.findById(schedule.getAssetId()).orElse(null);
            BigDecimal ircmRate = asset != null ? taxService.getEffectiveIrcmRate(asset) : BigDecimal.ZERO;
            boolean exempt = asset != null && (Boolean.TRUE.equals(asset.getIrcmExempt())
                    || Boolean.TRUE.equals(asset.getIsGovernmentBond()));

            return interestPaymentRepository
                    .findByAssetIdAndCouponDateOrderByPaidAtDesc(
                            schedule.getAssetId(), schedule.getScheduleDate(), pageable)
                    .map(ip -> {
                        // Use stored grossAmountPerUnit (ACT-day snapshot) when available.
                        // Fall back to months/12 approximation for legacy records without the field.
                        BigDecimal grossPerUnit;
                        if (ip.getGrossAmountPerUnit() != null) {
                            grossPerUnit = ip.getGrossAmountPerUnit();
                        } else if (ip.getFaceValue() != null && ip.getAnnualRate() != null
                                && ip.getPeriodMonths() != null) {
                            grossPerUnit = ip.getFaceValue()
                                    .multiply(ip.getAnnualRate())
                                    .divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP)
                                    .multiply(BigDecimal.valueOf(ip.getPeriodMonths()))
                                    .divide(BigDecimal.valueOf(12), 4, RoundingMode.HALF_UP);
                        } else {
                            grossPerUnit = null;
                        }
                        BigDecimal gross = grossPerUnit != null
                                ? grossPerUnit.multiply(ip.getUnits()).setScale(0, RoundingMode.HALF_UP)
                                : null;
                        BigDecimal ircmWithheld = (gross != null && !exempt)
                                ? gross.multiply(ircmRate).setScale(0, RoundingMode.HALF_UP)
                                : (gross != null ? BigDecimal.ZERO : null);
                        BigDecimal net = (gross != null && ircmWithheld != null)
                                ? gross.subtract(ircmWithheld) : null;
                        return PaymentResultResponse.fromCoupon(
                                ip.getId(), ip.getUserId(), ip.getUnits(), ip.getCashAmount(),
                                ip.getStatus(), ip.getFailureReason(), ip.getPaidAt(),
                                ip.getFaceValue(), ip.getAnnualRate(), ip.getPeriodMonths(),
                                gross, ircmWithheld, net);
                    });
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
        // Idempotency: skip if this holder was already paid successfully for this coupon date.
        // Protects against double-payment on admin retry or partial re-execution.
        if (interestPaymentRepository.existsByAssetIdAndCouponDateAndUserIdAndStatus(
                bond.getId(), couponDate, holder.getUserId(), "SUCCESS")) {
            log.debug("Skipping already-paid coupon: bond={}, user={}, date={}",
                    bond.getSymbol(), holder.getUserId(), couponDate);
            return true;
        }

        String currency = assetServiceConfig.getSettlementCurrency();

        // IRCM withholding tax calculation
        BigDecimal ircmRate = taxService.getEffectiveIrcmRate(bond);
        BigDecimal ircmAmount = taxService.calculateIrcm(bond, cashAmount);
        BigDecimal netPayment = cashAmount.subtract(ircmAmount);

        // Gross amount per unit before IRCM — snapshot for accurate breakdown display
        BigDecimal grossAmountPerUnit = holder.getTotalUnits().compareTo(BigDecimal.ZERO) > 0
                ? cashAmount.divide(holder.getTotalUnits(), 4, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        InterestPayment.InterestPaymentBuilder record = InterestPayment.builder()
                .assetId(bond.getId())
                .userId(holder.getUserId())
                .units(holder.getTotalUnits())
                .faceValue(bond.getEffectiveFaceValue())
                .annualRate(bond.getInterestRate())
                .periodMonths(bond.getCouponFrequencyMonths())
                .cashAmount(netPayment)
                .grossAmountPerUnit(grossAmountPerUnit)
                .couponDate(couponDate);

        try {
            Long userCashAccountId = fineractClient.findClientSavingsAccountByCurrency(
                    holder.getUserId(), currency);
            if (userCashAccountId == null) {
                throw new RuntimeException("No active " + currency + " account for user " + holder.getUserId());
            }

            // Build atomic batch: net payment + IRCM transfer
            String description = String.format("Coupon payment: %s %s%% (%dm) [net after IRCM]",
                    bond.getSymbol(), bond.getInterestRate(), bond.getCouponFrequencyMonths());

            List<BatchOperation> ops = new ArrayList<>();
            ops.add(new BatchTransferOp(bond.getLpCashAccountId(), userCashAccountId, netPayment, description));

            if (ircmAmount.compareTo(BigDecimal.ZERO) > 0) {
                String ircmDesc = String.format("IRCM withholding: %s coupon (%s%%)",
                        bond.getSymbol(), ircmRate.multiply(new BigDecimal("100")));
                ops.add(new BatchTransferOp(bond.getLpCashAccountId(), taxService.getIrcmAccountId(), ircmAmount, ircmDesc));
                // GL entry: debit tax expense (608), credit IRCM withholding payable (4013)
                ops.add(new BatchJournalEntryOp(
                        resolvedGlAccounts.getTaxExpenseIrcmId(),
                        resolvedGlAccounts.getLpTaxWithholdingId(),
                        ircmAmount, "XAF",
                        String.format("IRCM tax expense: %s coupon", bond.getSymbol())));
            }

            List<Map<String, Object>> results = fineractClient.executeAtomicBatch(ops);

            // Extract transferId from first batch response (net payment)
            Long transferId = results.isEmpty() ? null :
                    ((Number) results.get(0).getOrDefault("resourceId", 0L)).longValue();

            if (ircmAmount.compareTo(BigDecimal.ZERO) > 0) {
                taxService.recordTaxTransaction(null, null, holder.getUserId(), bond.getId(),
                        "IRCM", cashAmount, ircmRate, ircmAmount, null);
                log.debug("IRCM withheld: bond={}, user={}, gross={}, ircm={}, net={}",
                        bond.getSymbol(), holder.getUserId(), cashAmount, ircmAmount, netPayment);
            }

            record.fineractTransferId(transferId).status("SUCCESS");
            assetMetrics.recordCouponPaid(netPayment.doubleValue());

            eventPublisher.publishEvent(new CouponPaidEvent(
                    holder.getUserId(), bond.getId(), bond.getSymbol(),
                    netPayment, bond.getInterestRate(), couponDate));

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
        // Idempotency: skip if this holder was already paid successfully for this distribution date.
        if (incomeDistributionRepository.existsByAssetIdAndDistributionDateAndUserIdAndStatus(
                asset.getId(), distributionDate, holder.getUserId(), "SUCCESS")) {
            log.debug("Skipping already-paid income: asset={}, user={}, date={}",
                    asset.getSymbol(), holder.getUserId(), distributionDate);
            return true;
        }

        String currency = assetServiceConfig.getSettlementCurrency();
        String incomeType = asset.getIncomeType();

        // IRCM withholding tax calculation
        BigDecimal ircmRate = taxService.getEffectiveIrcmRate(asset);
        BigDecimal ircmAmount = taxService.calculateIrcm(asset, cashAmount);
        BigDecimal netPayment = cashAmount.subtract(ircmAmount);

        IncomeDistribution.IncomeDistributionBuilder record = IncomeDistribution.builder()
                .assetId(asset.getId())
                .userId(holder.getUserId())
                .incomeType(incomeType)
                .units(holder.getTotalUnits())
                .rateApplied(rateApplied)
                .cashAmount(netPayment)
                .distributionDate(distributionDate);

        try {
            Long userCashAccountId = fineractClient.findClientSavingsAccountByCurrency(
                    holder.getUserId(), currency);
            if (userCashAccountId == null) {
                throw new RuntimeException("No active " + currency + " account for user " + holder.getUserId());
            }

            // Build atomic batch: net payment + IRCM transfer
            String description = String.format("%s payment: %s [net after IRCM]", incomeType, asset.getSymbol());

            List<BatchOperation> ops = new ArrayList<>();
            ops.add(new BatchTransferOp(asset.getLpCashAccountId(), userCashAccountId, netPayment, description));

            if (ircmAmount.compareTo(BigDecimal.ZERO) > 0) {
                String ircmDesc = String.format("IRCM withholding: %s %s (%s%%)",
                        asset.getSymbol(), incomeType, ircmRate.multiply(new BigDecimal("100")));
                ops.add(new BatchTransferOp(asset.getLpCashAccountId(), taxService.getIrcmAccountId(), ircmAmount, ircmDesc));
                // GL entry: debit tax expense (608), credit IRCM withholding payable (4013)
                ops.add(new BatchJournalEntryOp(
                        resolvedGlAccounts.getTaxExpenseIrcmId(),
                        resolvedGlAccounts.getLpTaxWithholdingId(),
                        ircmAmount, "XAF",
                        String.format("IRCM tax expense: %s %s", asset.getSymbol(), incomeType)));
            }

            List<Map<String, Object>> results = fineractClient.executeAtomicBatch(ops);

            // Extract transferId from first batch response (net payment)
            Long transferId = results.isEmpty() ? null :
                    ((Number) results.get(0).getOrDefault("resourceId", 0L)).longValue();

            if (ircmAmount.compareTo(BigDecimal.ZERO) > 0) {
                taxService.recordTaxTransaction(null, null, holder.getUserId(), asset.getId(),
                        "IRCM", cashAmount, ircmRate, ircmAmount, null);
                log.debug("IRCM withheld: asset={}, user={}, gross={}, ircm={}, net={}",
                        asset.getSymbol(), holder.getUserId(), cashAmount, ircmAmount, netPayment);
            }

            record.fineractTransferId(transferId).status("SUCCESS");
            assetMetrics.recordIncomeDistributed(asset.getId(), incomeType, netPayment.doubleValue());

            eventPublisher.publishEvent(new IncomePaidEvent(
                    holder.getUserId(), asset.getId(), asset.getSymbol(),
                    incomeType, netPayment, distributionDate));

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
        BigDecimal lpCashBalance = null;
        if (asset != null && asset.getLpCashAccountId() != null) {
            try {
                lpCashBalance = fineractClient.getAccountBalance(asset.getLpCashAccountId());
            } catch (Exception e) {
                log.debug("Could not fetch LP cash balance for {}: {}", asset.getSymbol(), e.getMessage());
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
                lpCashBalance
        );
    }

    private static String truncate(String s, int maxLen) {
        return s != null && s.length() > maxLen ? s.substring(0, maxLen) : s;
    }
}
