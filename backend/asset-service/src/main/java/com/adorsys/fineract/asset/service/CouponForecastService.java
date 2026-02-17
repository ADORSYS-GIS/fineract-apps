package com.adorsys.fineract.asset.service;

import com.adorsys.fineract.asset.client.FineractClient;
import com.adorsys.fineract.asset.dto.CouponForecastResponse;
import com.adorsys.fineract.asset.entity.Asset;
import com.adorsys.fineract.asset.entity.UserPosition;
import com.adorsys.fineract.asset.repository.AssetRepository;
import com.adorsys.fineract.asset.repository.UserPositionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class CouponForecastService {

    private final AssetRepository assetRepository;
    private final UserPositionRepository userPositionRepository;
    private final FineractClient fineractClient;

    public CouponForecastResponse getForecast(String assetId) {
        Asset bond = assetRepository.findById(assetId)
                .orElseThrow(() -> new IllegalArgumentException("Asset not found: " + assetId));

        if (bond.getInterestRate() == null || bond.getCouponFrequencyMonths() == null) {
            throw new IllegalArgumentException("Asset " + assetId + " is not a bond (no interest rate or coupon frequency)");
        }

        List<UserPosition> holders = userPositionRepository.findHoldersByAssetId(
                assetId, BigDecimal.ZERO);
        BigDecimal totalUnits = holders.stream()
                .map(UserPosition::getTotalUnits)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal faceValue = bond.getManualPrice() != null ? bond.getManualPrice() : BigDecimal.ZERO;
        BigDecimal rate = bond.getInterestRate();
        int periodMonths = bond.getCouponFrequencyMonths();

        // couponPerPeriod = totalUnits * faceValue * (rate/100) * (periodMonths/12)
        BigDecimal couponPerPeriod = totalUnits
                .multiply(faceValue)
                .multiply(rate)
                .divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(periodMonths))
                .divide(BigDecimal.valueOf(12), 0, RoundingMode.HALF_UP);

        int remainingPeriods = countRemainingPeriods(
                bond.getNextCouponDate(), bond.getMaturityDate(), periodMonths);

        BigDecimal totalCouponObligation = couponPerPeriod.multiply(BigDecimal.valueOf(remainingPeriods));
        BigDecimal principalAtMaturity = totalUnits.multiply(faceValue)
                .setScale(0, RoundingMode.HALF_UP);
        BigDecimal totalObligation = totalCouponObligation.add(principalAtMaturity);

        BigDecimal treasuryBalance = BigDecimal.ZERO;
        try {
            treasuryBalance = fineractClient.getAccountBalance(bond.getTreasuryCashAccountId());
        } catch (Exception e) {
            log.warn("Could not fetch treasury balance for bond {}: {}", bond.getSymbol(), e.getMessage());
        }

        // Allocate treasury balance proportionally among sibling bonds sharing the same treasury account
        List<Asset> siblingBonds = assetRepository
                .findByTreasuryCashAccountIdAndInterestRateIsNotNull(bond.getTreasuryCashAccountId());
        BigDecimal allocatedBalance = treasuryBalance;
        if (siblingBonds.size() > 1 && totalObligation.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal totalSiblingObligation = BigDecimal.ZERO;
            for (Asset sibling : siblingBonds) {
                BigDecimal sibObligation = calculateTotalObligation(sibling);
                totalSiblingObligation = totalSiblingObligation.add(sibObligation);
            }
            if (totalSiblingObligation.compareTo(BigDecimal.ZERO) > 0) {
                allocatedBalance = treasuryBalance
                        .multiply(totalObligation)
                        .divide(totalSiblingObligation, 0, RoundingMode.HALF_UP);
            }
        }

        BigDecimal shortfall = totalObligation.subtract(allocatedBalance);
        int couponsCovered = couponPerPeriod.compareTo(BigDecimal.ZERO) > 0
                ? allocatedBalance.divide(couponPerPeriod, 0, RoundingMode.DOWN).intValue()
                : 0;

        return new CouponForecastResponse(
                bond.getId(),
                bond.getSymbol(),
                rate,
                periodMonths,
                bond.getMaturityDate(),
                bond.getNextCouponDate(),
                totalUnits,
                faceValue,
                couponPerPeriod,
                remainingPeriods,
                totalCouponObligation,
                principalAtMaturity,
                totalObligation,
                treasuryBalance,
                allocatedBalance,
                siblingBonds.size(),
                shortfall,
                couponsCovered
        );
    }

    private BigDecimal calculateTotalObligation(Asset sibling) {
        BigDecimal sibUnits = userPositionRepository.findHoldersByAssetId(sibling.getId(), BigDecimal.ZERO)
                .stream().map(UserPosition::getTotalUnits).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal sibFace = sibling.getManualPrice() != null ? sibling.getManualPrice() : BigDecimal.ZERO;
        BigDecimal sibRate = sibling.getInterestRate();
        int sibPeriodMonths = sibling.getCouponFrequencyMonths();

        BigDecimal sibCouponPerPeriod = sibUnits.multiply(sibFace).multiply(sibRate)
                .divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(sibPeriodMonths))
                .divide(BigDecimal.valueOf(12), 0, RoundingMode.HALF_UP);

        int sibRemainingPeriods = countRemainingPeriods(
                sibling.getNextCouponDate(), sibling.getMaturityDate(), sibPeriodMonths);

        BigDecimal sibCouponObligation = sibCouponPerPeriod.multiply(BigDecimal.valueOf(sibRemainingPeriods));
        BigDecimal sibPrincipal = sibUnits.multiply(sibFace).setScale(0, RoundingMode.HALF_UP);
        return sibCouponObligation.add(sibPrincipal);
    }

    private int countRemainingPeriods(LocalDate nextCouponDate, LocalDate maturityDate, int periodMonths) {
        if (nextCouponDate == null || maturityDate == null || periodMonths <= 0) {
            return 0;
        }
        int count = 0;
        LocalDate date = nextCouponDate;
        while (!date.isAfter(maturityDate)) {
            count++;
            date = date.plusMonths(periodMonths);
        }
        return count;
    }
}
