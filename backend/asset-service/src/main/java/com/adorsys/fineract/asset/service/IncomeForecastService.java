package com.adorsys.fineract.asset.service;

import com.adorsys.fineract.asset.client.FineractClient;
import com.adorsys.fineract.asset.dto.IncomeForecastResponse;
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
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class IncomeForecastService {

    private final AssetRepository assetRepository;
    private final AssetPriceRepository assetPriceRepository;
    private final UserPositionRepository userPositionRepository;
    private final FineractClient fineractClient;

    public IncomeForecastResponse getForecast(String assetId) {
        Asset asset = assetRepository.findById(assetId)
                .orElseThrow(() -> new IllegalArgumentException("Asset not found: " + assetId));

        if (asset.getIncomeType() == null || asset.getIncomeRate() == null
                || asset.getDistributionFrequencyMonths() == null) {
            throw new IllegalArgumentException(
                    "Asset " + assetId + " has no income distribution configured");
        }

        List<UserPosition> holders = userPositionRepository.findHoldersByAssetId(
                assetId, BigDecimal.ZERO);
        BigDecimal totalUnits = holders.stream()
                .map(UserPosition::getTotalUnits)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal currentPrice = assetPriceRepository.findById(assetId)
                .map(p -> p.getCurrentPrice())
                .orElse(BigDecimal.ZERO);

        BigDecimal rate = asset.getIncomeRate();
        int frequencyMonths = asset.getDistributionFrequencyMonths();

        // incomePerPeriod = totalUnits * currentPrice * (rate/100) * (frequencyMonths/12)
        BigDecimal incomePerPeriod = totalUnits
                .multiply(currentPrice)
                .multiply(rate)
                .divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(frequencyMonths))
                .divide(BigDecimal.valueOf(12), 0, RoundingMode.HALF_UP);

        BigDecimal treasuryBalance = BigDecimal.ZERO;
        try {
            treasuryBalance = fineractClient.getAccountBalance(asset.getTreasuryCashAccountId());
        } catch (Exception e) {
            log.warn("Could not fetch treasury balance for asset {}: {}", asset.getSymbol(), e.getMessage());
        }

        BigDecimal shortfall = incomePerPeriod.subtract(treasuryBalance);
        int periodsCovered = incomePerPeriod.compareTo(BigDecimal.ZERO) > 0
                ? treasuryBalance.divide(incomePerPeriod, 0, RoundingMode.DOWN).intValue()
                : 0;

        return new IncomeForecastResponse(
                asset.getId(),
                asset.getSymbol(),
                asset.getIncomeType(),
                rate,
                frequencyMonths,
                asset.getNextDistributionDate(),
                totalUnits,
                currentPrice,
                incomePerPeriod,
                treasuryBalance,
                shortfall,
                periodsCovered
        );
    }
}
