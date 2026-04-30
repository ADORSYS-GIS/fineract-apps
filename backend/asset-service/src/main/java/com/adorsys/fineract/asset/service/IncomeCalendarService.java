package com.adorsys.fineract.asset.service;

import com.adorsys.fineract.asset.dto.AssetCategory;
import com.adorsys.fineract.asset.dto.BondType;
import com.adorsys.fineract.asset.dto.IncomeCalendarResponse;
import com.adorsys.fineract.asset.dto.IncomeCalendarResponse.*;
import com.adorsys.fineract.asset.entity.Asset;
import com.adorsys.fineract.asset.entity.UserPosition;
import com.adorsys.fineract.asset.repository.AssetPriceRepository;
import com.adorsys.fineract.asset.repository.AssetRepository;
import com.adorsys.fineract.asset.repository.UserPositionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class IncomeCalendarService {

    private final UserPositionRepository userPositionRepository;
    private final AssetRepository assetRepository;
    private final AssetPriceRepository assetPriceRepository;
    private final TaxService taxService;

    public IncomeCalendarResponse getCalendar(Long userId, int months) {
        List<UserPosition> positions = userPositionRepository.findByUserId(userId).stream()
                .filter(p -> p.getTotalUnits().compareTo(BigDecimal.ZERO) > 0)
                .toList();

        if (positions.isEmpty()) {
            return new IncomeCalendarResponse(List.of(), List.of(), BigDecimal.ZERO, Map.of(), BigDecimal.ZERO);
        }

        LocalDate horizon = LocalDate.now().plusMonths(months);
        List<IncomeEvent> allEvents = new ArrayList<>();

        for (UserPosition pos : positions) {
            Asset asset = assetRepository.findById(pos.getAssetId()).orElse(null);
            if (asset == null) continue;

            if (asset.getCategory() == AssetCategory.BONDS) {
                allEvents.addAll(projectBondEvents(asset, pos, horizon));
            } else if (asset.getIncomeType() != null && asset.getIncomeRate() != null
                    && asset.getDistributionFrequencyMonths() != null) {
                allEvents.addAll(projectIncomeEvents(asset, pos, horizon));
            }
        }

        allEvents.sort(Comparator.comparing(IncomeEvent::paymentDate));

        BigDecimal totalExpected = allEvents.stream()
                .map(IncomeEvent::expectedAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalNet = allEvents.stream()
                .map(e -> e.netAmount() != null ? e.netAmount() : e.expectedAmount())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, BigDecimal> byType = allEvents.stream()
                .collect(Collectors.groupingBy(
                        IncomeEvent::incomeType,
                        Collectors.reducing(BigDecimal.ZERO, IncomeEvent::expectedAmount, BigDecimal::add)));

        List<MonthlyAggregate> monthlyTotals = buildMonthlyAggregates(allEvents);

        return new IncomeCalendarResponse(allEvents, monthlyTotals, totalExpected, byType, totalNet);
    }

    /**
     * Build an IncomeEvent with the per-unit / IRCM / net fields populated from the
     * authoritative TaxService rate. Use this rather than the IncomeEvent constructor
     * directly so frontend recomputation never drifts from the actual withholding logic.
     *
     * @param applyIrcm pass false for PRINCIPAL_REDEMPTION events — IRCM on the principal
     *                  is handled by the redemption flow (capital-gains / IRCM tax decision
     *                  is separate from ordinary income), and the principal itself is not
     *                  taxed as income.
     */
    private IncomeEvent buildEvent(Asset asset, String incomeType, LocalDate paymentDate,
                                    BigDecimal totalUnits, BigDecimal expectedAmount,
                                    BigDecimal rateApplied, boolean applyIrcm) {
        BigDecimal grossPerUnit = (totalUnits != null && totalUnits.signum() > 0)
                ? expectedAmount.divide(totalUnits, 6, RoundingMode.HALF_UP)
                : null;

        BigDecimal ircmRate = applyIrcm ? taxService.getEffectiveIrcmRate(asset) : BigDecimal.ZERO;
        BigDecimal ircmPerUnit = (grossPerUnit != null)
                ? grossPerUnit.multiply(ircmRate).setScale(6, RoundingMode.HALF_UP)
                : null;
        BigDecimal netPerUnit = (grossPerUnit != null && ircmPerUnit != null)
                ? grossPerUnit.subtract(ircmPerUnit)
                : null;
        BigDecimal netAmount = (netPerUnit != null && totalUnits != null)
                ? netPerUnit.multiply(totalUnits).setScale(0, RoundingMode.HALF_UP)
                : expectedAmount;

        return new IncomeEvent(
                asset.getId(), asset.getSymbol(), asset.getName(),
                incomeType, paymentDate, expectedAmount,
                totalUnits, rateApplied,
                grossPerUnit, ircmPerUnit, netPerUnit, netAmount);
    }

    private List<IncomeEvent> projectBondEvents(Asset bond, UserPosition pos, LocalDate horizon) {
        List<IncomeEvent> events = new ArrayList<>();

        BigDecimal faceValue = bond.getEffectiveFaceValue();
        if (faceValue == null) return events;

        LocalDate maturity = bond.getMaturityDate();

        // DISCOUNT (BTA) bonds: only maturity redemption, no coupon events
        if (bond.getBondType() != BondType.DISCOUNT) {
            BigDecimal rate = bond.getInterestRate();
            Integer freqMonths = bond.getCouponFrequencyMonths();

            if (rate != null && freqMonths != null) {
                BigDecimal couponAmount = computeAmount(pos.getTotalUnits(), faceValue, rate, freqMonths);

                LocalDate cursor = bond.getNextCouponDate();
                LocalDate limit = maturity != null && maturity.isBefore(horizon) ? maturity : horizon;

                if (cursor != null) {
                    while (!cursor.isAfter(limit)) {
                        if (!cursor.isBefore(LocalDate.now())) {
                            events.add(buildEvent(bond, "COUPON", cursor, pos.getTotalUnits(),
                                    couponAmount, rate, true));
                        }
                        cursor = cursor.plusMonths(freqMonths);
                    }
                }
            }
        }

        // Add principal redemption at maturity if within horizon. IRCM is NOT applied
        // to the principal payback itself — any capital-gain tax on a BTA at maturity
        // is handled separately (see PrincipalRedemptionService) and the OTA principal
        // is simply face value returned at par.
        if (maturity != null && !maturity.isAfter(horizon) && !maturity.isBefore(LocalDate.now())) {
            BigDecimal principal = pos.getTotalUnits().multiply(faceValue)
                    .setScale(0, RoundingMode.HALF_UP);
            events.add(buildEvent(bond, "PRINCIPAL_REDEMPTION", maturity,
                    pos.getTotalUnits(), principal, null, false));
        }

        return events;
    }

    private List<IncomeEvent> projectIncomeEvents(Asset asset, UserPosition pos, LocalDate horizon) {
        List<IncomeEvent> events = new ArrayList<>();

        BigDecimal faceValue = asset.getEffectiveFaceValue();
        if (faceValue == null) {
            faceValue = assetPriceRepository.findById(asset.getId())
                    .map(p -> p.getAskPrice() != null ? p.getAskPrice() : BigDecimal.ZERO)
                    .orElse(BigDecimal.ZERO);
        }

        BigDecimal rate = asset.getIncomeRate();
        int freqMonths = asset.getDistributionFrequencyMonths();
        BigDecimal amount = computeAmount(pos.getTotalUnits(), faceValue, rate, freqMonths);

        LocalDate cursor = asset.getNextDistributionDate();
        if (cursor == null) return events;

        while (!cursor.isAfter(horizon)) {
            if (!cursor.isBefore(LocalDate.now())) {
                events.add(buildEvent(asset, asset.getIncomeType(), cursor,
                        pos.getTotalUnits(), amount, rate, true));
            }
            cursor = cursor.plusMonths(freqMonths);
        }

        return events;
    }

    /**
     * Formula: units * price * (rate / 100) * (freqMonths / 12)
     */
    private BigDecimal computeAmount(BigDecimal units, BigDecimal price,
                                      BigDecimal rate, int freqMonths) {
        return units
                .multiply(price)
                .multiply(rate)
                .divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(freqMonths))
                .divide(BigDecimal.valueOf(12), 0, RoundingMode.HALF_UP);
    }

    private List<MonthlyAggregate> buildMonthlyAggregates(List<IncomeEvent> events) {
        Map<YearMonth, List<IncomeEvent>> byMonth = events.stream()
                .collect(Collectors.groupingBy(e -> YearMonth.from(e.paymentDate())));

        return byMonth.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .map(entry -> new MonthlyAggregate(
                        entry.getKey().toString(),
                        entry.getValue().stream()
                                .map(IncomeEvent::expectedAmount)
                                .reduce(BigDecimal.ZERO, BigDecimal::add),
                        entry.getValue().size()))
                .toList();
    }
}
