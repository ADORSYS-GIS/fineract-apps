package com.adorsys.fineract.asset.service;

import com.adorsys.fineract.asset.dto.AssetCategory;
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

    public IncomeCalendarResponse getCalendar(Long userId, int months) {
        List<UserPosition> positions = userPositionRepository.findByUserId(userId).stream()
                .filter(p -> p.getTotalUnits().compareTo(BigDecimal.ZERO) > 0)
                .toList();

        if (positions.isEmpty()) {
            return new IncomeCalendarResponse(List.of(), List.of(), BigDecimal.ZERO, Map.of());
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

        Map<String, BigDecimal> byType = allEvents.stream()
                .collect(Collectors.groupingBy(
                        IncomeEvent::incomeType,
                        Collectors.reducing(BigDecimal.ZERO, IncomeEvent::expectedAmount, BigDecimal::add)));

        List<MonthlyAggregate> monthlyTotals = buildMonthlyAggregates(allEvents);

        return new IncomeCalendarResponse(allEvents, monthlyTotals, totalExpected, byType);
    }

    private List<IncomeEvent> projectBondEvents(Asset bond, UserPosition pos, LocalDate horizon) {
        List<IncomeEvent> events = new ArrayList<>();

        BigDecimal faceValue = bond.getManualPrice();
        BigDecimal rate = bond.getInterestRate();
        Integer freqMonths = bond.getCouponFrequencyMonths();

        if (faceValue == null || rate == null || freqMonths == null) return events;

        BigDecimal couponAmount = computeAmount(pos.getTotalUnits(), faceValue, rate, freqMonths);

        LocalDate cursor = bond.getNextCouponDate();
        LocalDate maturity = bond.getMaturityDate();
        LocalDate limit = maturity != null && maturity.isBefore(horizon) ? maturity : horizon;

        if (cursor != null) {
            while (!cursor.isAfter(limit)) {
                if (!cursor.isBefore(LocalDate.now())) {
                    events.add(new IncomeEvent(
                            bond.getId(), bond.getSymbol(), bond.getName(),
                            "COUPON", cursor, couponAmount,
                            pos.getTotalUnits(), rate));
                }
                cursor = cursor.plusMonths(freqMonths);
            }
        }

        // Add principal redemption at maturity if within horizon
        if (maturity != null && !maturity.isAfter(horizon) && !maturity.isBefore(LocalDate.now())) {
            BigDecimal principal = pos.getTotalUnits().multiply(faceValue)
                    .setScale(0, RoundingMode.HALF_UP);
            events.add(new IncomeEvent(
                    bond.getId(), bond.getSymbol(), bond.getName(),
                    "PRINCIPAL_REDEMPTION", maturity, principal,
                    pos.getTotalUnits(), BigDecimal.ZERO));
        }

        return events;
    }

    private List<IncomeEvent> projectIncomeEvents(Asset asset, UserPosition pos, LocalDate horizon) {
        List<IncomeEvent> events = new ArrayList<>();

        BigDecimal currentPrice = assetPriceRepository.findById(asset.getId())
                .map(p -> p.getCurrentPrice())
                .orElse(BigDecimal.ZERO);

        BigDecimal rate = asset.getIncomeRate();
        int freqMonths = asset.getDistributionFrequencyMonths();
        BigDecimal amount = computeAmount(pos.getTotalUnits(), currentPrice, rate, freqMonths);

        LocalDate cursor = asset.getNextDistributionDate();
        if (cursor == null) return events;

        while (!cursor.isAfter(horizon)) {
            if (!cursor.isBefore(LocalDate.now())) {
                events.add(new IncomeEvent(
                        asset.getId(), asset.getSymbol(), asset.getName(),
                        asset.getIncomeType(), cursor, amount,
                        pos.getTotalUnits(), rate));
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
