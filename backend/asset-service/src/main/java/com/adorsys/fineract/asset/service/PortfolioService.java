package com.adorsys.fineract.asset.service;

import com.adorsys.fineract.asset.dto.*;
import com.adorsys.fineract.asset.dto.AssetCategory;
import com.adorsys.fineract.asset.entity.Asset;
import com.adorsys.fineract.asset.entity.AssetPrice;
import com.adorsys.fineract.asset.entity.PortfolioSnapshot;
import com.adorsys.fineract.asset.entity.UserPosition;
import com.adorsys.fineract.asset.repository.AssetPriceRepository;
import com.adorsys.fineract.asset.repository.AssetRepository;
import com.adorsys.fineract.asset.repository.PortfolioSnapshotRepository;
import com.adorsys.fineract.asset.repository.UserPositionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.time.LocalDate;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * Service for portfolio tracking, WAP calculation, and P&L.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class PortfolioService {

    private final UserPositionRepository userPositionRepository;
    private final AssetRepository assetRepository;
    private final AssetPriceRepository assetPriceRepository;
    private final BondBenefitService bondBenefitService;
    private final PortfolioSnapshotRepository portfolioSnapshotRepository;

    /**
     * Get full portfolio summary for a user including positions and holdings.
     */
    @Transactional(readOnly = true)
    public PortfolioSummaryResponse getPortfolio(Long userId) {
        List<UserPosition> positions = userPositionRepository.findByUserId(userId);

        if (positions.isEmpty()) {
            return new PortfolioSummaryResponse(BigDecimal.ZERO, BigDecimal.ZERO,
                    BigDecimal.ZERO, BigDecimal.ZERO, List.of(),
                    List.of(), BigDecimal.ZERO, 0);
        }

        List<String> assetIds = positions.stream().map(UserPosition::getAssetId).toList();
        Map<String, Asset> assetMap = assetRepository.findAllById(assetIds)
                .stream().collect(Collectors.toMap(Asset::getId, Function.identity()));
        Map<String, AssetPrice> priceMap = assetPriceRepository.findAllByAssetIdIn(assetIds)
                .stream().collect(Collectors.toMap(AssetPrice::getAssetId, Function.identity()));

        BigDecimal totalValue = BigDecimal.ZERO;
        BigDecimal totalCostBasis = BigDecimal.ZERO;
        List<PositionResponse> positionResponses = new ArrayList<>();

        for (UserPosition pos : positions) {
            Asset asset = assetMap.get(pos.getAssetId());
            AssetPrice price = priceMap.get(pos.getAssetId());
            BigDecimal currentPrice = price != null ? price.getCurrentPrice() : BigDecimal.ZERO;
            BigDecimal marketValue = pos.getTotalUnits().multiply(currentPrice);
            BigDecimal unrealizedPnl = marketValue.subtract(pos.getTotalCostBasis());
            BigDecimal unrealizedPnlPercent = pos.getTotalCostBasis().compareTo(BigDecimal.ZERO) > 0
                    ? unrealizedPnl.divide(pos.getTotalCostBasis(), 4, RoundingMode.HALF_UP)
                            .multiply(new BigDecimal("100"))
                    : BigDecimal.ZERO;

            totalValue = totalValue.add(marketValue);
            totalCostBasis = totalCostBasis.add(pos.getTotalCostBasis());

            BondBenefitProjection bondBenefit = asset != null
                    ? bondBenefitService.calculateForHolding(asset, pos.getTotalUnits(), currentPrice)
                    : null;

            positionResponses.add(new PositionResponse(
                    pos.getAssetId(),
                    asset != null ? asset.getSymbol() : null,
                    asset != null ? asset.getName() : null,
                    pos.getTotalUnits(), pos.getAvgPurchasePrice(), currentPrice,
                    marketValue, pos.getTotalCostBasis(),
                    unrealizedPnl, unrealizedPnlPercent, pos.getRealizedPnl(),
                    bondBenefit
            ));
        }

        BigDecimal totalUnrealizedPnl = totalValue.subtract(totalCostBasis);
        BigDecimal totalUnrealizedPnlPercent = totalCostBasis.compareTo(BigDecimal.ZERO) > 0
                ? totalUnrealizedPnl.divide(totalCostBasis, 4, RoundingMode.HALF_UP)
                        .multiply(new BigDecimal("100"))
                : BigDecimal.ZERO;

        // --- Category allocation ---
        Map<String, BigDecimal> categoryValues = new LinkedHashMap<>();
        for (UserPosition pos : positions) {
            Asset asset = assetMap.get(pos.getAssetId());
            String category = asset != null ? asset.getCategory().name() : "UNKNOWN";
            AssetPrice price = priceMap.get(pos.getAssetId());
            BigDecimal currentPrice = price != null ? price.getCurrentPrice() : BigDecimal.ZERO;
            BigDecimal marketValue = pos.getTotalUnits().multiply(currentPrice);
            categoryValues.merge(category, marketValue, BigDecimal::add);
        }
        List<CategoryAllocationResponse> allocations = new ArrayList<>();
        for (Map.Entry<String, BigDecimal> entry : categoryValues.entrySet()) {
            BigDecimal pct = totalValue.compareTo(BigDecimal.ZERO) > 0
                    ? entry.getValue().divide(totalValue, 4, RoundingMode.HALF_UP)
                            .multiply(new BigDecimal("100"))
                    : BigDecimal.ZERO;
            allocations.add(new CategoryAllocationResponse(entry.getKey(), entry.getValue(), pct));
        }

        // --- Estimated annual yield (total return) ---
        BigDecimal projectedAnnualCouponIncome = BigDecimal.ZERO;
        for (UserPosition pos : positions) {
            Asset asset = assetMap.get(pos.getAssetId());
            if (asset != null && asset.getCategory() == AssetCategory.BONDS
                    && asset.getInterestRate() != null && asset.getCouponFrequencyMonths() != null
                    && asset.getManualPrice() != null) {
                BigDecimal couponPerPeriod = pos.getTotalUnits()
                        .multiply(asset.getManualPrice())
                        .multiply(asset.getInterestRate())
                        .divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP)
                        .multiply(BigDecimal.valueOf(asset.getCouponFrequencyMonths()))
                        .divide(BigDecimal.valueOf(12), 0, RoundingMode.HALF_UP);
                BigDecimal annualCoupon = couponPerPeriod
                        .multiply(BigDecimal.valueOf(12))
                        .divide(BigDecimal.valueOf(asset.getCouponFrequencyMonths()), 0, RoundingMode.HALF_UP);
                projectedAnnualCouponIncome = projectedAnnualCouponIncome.add(annualCoupon);
            }
        }
        BigDecimal estimatedAnnualYieldPercent = totalCostBasis.compareTo(BigDecimal.ZERO) > 0
                ? projectedAnnualCouponIncome.add(totalUnrealizedPnl)
                        .divide(totalCostBasis, 4, RoundingMode.HALF_UP)
                        .multiply(new BigDecimal("100"))
                : BigDecimal.ZERO;

        return new PortfolioSummaryResponse(
                totalValue, totalCostBasis, totalUnrealizedPnl, totalUnrealizedPnlPercent,
                positionResponses, allocations, estimatedAnnualYieldPercent, categoryValues.size()
        );
    }

    /**
     * Get single position detail for a user + asset.
     */
    @Transactional(readOnly = true)
    public PositionResponse getPosition(Long userId, String assetId) {
        UserPosition pos = userPositionRepository.findByUserIdAndAssetId(userId, assetId)
                .orElse(null);

        if (pos == null) {
            return new PositionResponse(assetId, null, null,
                    BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO,
                    BigDecimal.ZERO, BigDecimal.ZERO,
                    BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO, null);
        }

        Asset asset = assetRepository.findById(assetId).orElse(null);
        AssetPrice price = assetPriceRepository.findById(assetId).orElse(null);
        BigDecimal currentPrice = price != null ? price.getCurrentPrice() : BigDecimal.ZERO;
        BigDecimal marketValue = pos.getTotalUnits().multiply(currentPrice);
        BigDecimal unrealizedPnl = marketValue.subtract(pos.getTotalCostBasis());
        BigDecimal unrealizedPnlPercent = pos.getTotalCostBasis().compareTo(BigDecimal.ZERO) > 0
                ? unrealizedPnl.divide(pos.getTotalCostBasis(), 4, RoundingMode.HALF_UP)
                        .multiply(new BigDecimal("100"))
                : BigDecimal.ZERO;

        BondBenefitProjection bondBenefit = asset != null
                ? bondBenefitService.calculateForHolding(asset, pos.getTotalUnits(), currentPrice)
                : null;

        return new PositionResponse(
                assetId,
                asset != null ? asset.getSymbol() : null,
                asset != null ? asset.getName() : null,
                pos.getTotalUnits(), pos.getAvgPurchasePrice(), currentPrice,
                marketValue, pos.getTotalCostBasis(),
                unrealizedPnl, unrealizedPnlPercent, pos.getRealizedPnl(),
                bondBenefit
        );
    }

    /**
     * Update position after a BUY trade. Recalculates WAP.
     */
    @Transactional
    public void updatePositionAfterBuy(Long userId, String assetId, Long fineractAccountId,
                                        BigDecimal units, BigDecimal pricePerUnit) {
        UserPosition pos = userPositionRepository.findByUserIdAndAssetId(userId, assetId)
                .orElse(UserPosition.builder()
                        .userId(userId)
                        .assetId(assetId)
                        .fineractSavingsAccountId(fineractAccountId)
                        .totalUnits(BigDecimal.ZERO)
                        .avgPurchasePrice(BigDecimal.ZERO)
                        .totalCostBasis(BigDecimal.ZERO)
                        .realizedPnl(BigDecimal.ZERO)
                        .build());

        BigDecimal newCost = units.multiply(pricePerUnit);
        BigDecimal newTotalCost = pos.getTotalCostBasis().add(newCost);
        BigDecimal newTotalUnits = pos.getTotalUnits().add(units);

        BigDecimal newAvgPrice = newTotalUnits.compareTo(BigDecimal.ZERO) > 0
                ? newTotalCost.divide(newTotalUnits, 4, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        pos.setTotalUnits(newTotalUnits);
        pos.setTotalCostBasis(newTotalCost);
        pos.setAvgPurchasePrice(newAvgPrice);
        pos.setFineractSavingsAccountId(fineractAccountId);
        pos.setLastTradeAt(Instant.now());

        userPositionRepository.save(pos);
        log.info("Updated position after BUY: userId={}, assetId={}, units={}, avgPrice={}",
                userId, assetId, newTotalUnits, newAvgPrice);
    }

    /**
     * Update position after a SELL trade. Calculates realized P&L.
     */
    @Transactional
    public BigDecimal updatePositionAfterSell(Long userId, String assetId, BigDecimal units,
                                               BigDecimal sellPricePerUnit) {
        UserPosition pos = userPositionRepository.findByUserIdAndAssetId(userId, assetId)
                .orElseThrow(() -> new RuntimeException("No position found for sell: userId=" + userId + ", assetId=" + assetId));

        // Calculate realized P&L: (sellPrice - avgPurchasePrice) * units
        BigDecimal realizedPnl = sellPricePerUnit.subtract(pos.getAvgPurchasePrice()).multiply(units);

        BigDecimal newTotalUnits = pos.getTotalUnits().subtract(units);
        // Cost basis decreases proportionally
        BigDecimal costPerUnit = pos.getAvgPurchasePrice();
        BigDecimal costReduction = costPerUnit.multiply(units);
        BigDecimal newTotalCost = pos.getTotalCostBasis().subtract(costReduction);

        if (newTotalUnits.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalStateException(
                    "Sell would result in negative units (" + newTotalUnits + ") for userId=" + userId + ", assetId=" + assetId);
        }
        pos.setTotalUnits(newTotalUnits);
        pos.setTotalCostBasis(newTotalCost.compareTo(BigDecimal.ZERO) < 0 ? BigDecimal.ZERO : newTotalCost);
        pos.setRealizedPnl(pos.getRealizedPnl().add(realizedPnl));
        pos.setLastTradeAt(Instant.now());
        // Average price stays the same on sell

        userPositionRepository.save(pos);
        log.info("Updated position after SELL: userId={}, assetId={}, soldUnits={}, realizedPnl={}",
                userId, assetId, units, realizedPnl);
        return realizedPnl;
    }

    /**
     * Get portfolio value history for charting.
     *
     * @param userId Fineract user/client ID
     * @param period one of "1M", "3M", "6M", "1Y"
     */
    @Transactional(readOnly = true)
    public PortfolioHistoryResponse getPortfolioHistory(Long userId, String period) {
        LocalDate fromDate = switch (period) {
            case "3M" -> LocalDate.now().minusMonths(3);
            case "6M" -> LocalDate.now().minusMonths(6);
            case "1Y" -> LocalDate.now().minusYears(1);
            default -> LocalDate.now().minusMonths(1); // "1M" or fallback
        };

        List<PortfolioSnapshot> snapshots = portfolioSnapshotRepository
                .findByUserIdAndSnapshotDateGreaterThanEqualOrderBySnapshotDateAsc(userId, fromDate);

        List<PortfolioSnapshotDto> dtos = snapshots.stream()
                .map(s -> new PortfolioSnapshotDto(
                        s.getSnapshotDate(), s.getTotalValue(),
                        s.getTotalCostBasis(), s.getUnrealizedPnl(),
                        s.getPositionCount()))
                .toList();

        return new PortfolioHistoryResponse(period, dtos);
    }
}
