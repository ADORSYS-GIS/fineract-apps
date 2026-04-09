package com.adorsys.fineract.asset.service;

import com.adorsys.fineract.asset.dto.*;
import com.adorsys.fineract.asset.dto.AssetCategory;
import com.adorsys.fineract.asset.entity.Asset;
import com.adorsys.fineract.asset.entity.AssetPrice;
import com.adorsys.fineract.asset.entity.PortfolioSnapshot;
import com.adorsys.fineract.asset.entity.PurchaseLot;
import com.adorsys.fineract.asset.entity.UserPosition;
import com.adorsys.fineract.asset.entity.CategorySnapshot;
import com.adorsys.fineract.asset.repository.AssetPriceRepository;
import com.adorsys.fineract.asset.repository.AssetRepository;
import com.adorsys.fineract.asset.repository.CategorySnapshotRepository;
import com.adorsys.fineract.asset.repository.OrderRepository;
import com.adorsys.fineract.asset.repository.PortfolioSnapshotRepository;
import com.adorsys.fineract.asset.repository.PurchaseLotRepository;
import com.adorsys.fineract.asset.repository.UserPositionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
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
    private final PurchaseLotRepository purchaseLotRepository;
    private final BondBenefitService bondBenefitService;
    private final IncomeBenefitService incomeBenefitService;
    private final PortfolioSnapshotRepository portfolioSnapshotRepository;
    private final CategorySnapshotRepository categorySnapshotRepository;
    private final OrderRepository orderRepository;

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
            BigDecimal marketPrice = price != null ? price.getAskPrice() : BigDecimal.ZERO;
            BigDecimal marketValue = pos.getTotalUnits().multiply(marketPrice);
            BigDecimal unrealizedPnl = marketValue.subtract(pos.getTotalCostBasis());
            BigDecimal unrealizedPnlPercent = pos.getTotalCostBasis().compareTo(BigDecimal.ZERO) > 0
                    ? unrealizedPnl.divide(pos.getTotalCostBasis(), 4, RoundingMode.HALF_UP)
                            .multiply(new BigDecimal("100"))
                    : BigDecimal.ZERO;

            totalValue = totalValue.add(marketValue);
            totalCostBasis = totalCostBasis.add(pos.getTotalCostBasis());

            BigDecimal faceValue = asset != null && asset.getEffectiveFaceValue() != null
                    ? asset.getEffectiveFaceValue() : marketPrice;
            BondBenefitProjection bondBenefit = asset != null
                    ? bondBenefitService.calculateForHolding(asset, pos.getTotalUnits(), marketPrice)
                    : null;
            IncomeBenefitProjection incomeBenefit = asset != null
                    ? incomeBenefitService.calculateForHolding(asset, pos.getTotalUnits(), faceValue)
                    : null;

            positionResponses.add(new PositionResponse(
                    pos.getAssetId(),
                    asset != null ? asset.getSymbol() : null,
                    asset != null ? asset.getName() : null,
                    pos.getTotalUnits(), pos.getAvgPurchasePrice(), marketPrice,
                    marketValue, pos.getTotalCostBasis(),
                    unrealizedPnl, unrealizedPnlPercent, pos.getRealizedPnl(),
                    bondBenefit, incomeBenefit,
                    List.of()
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
            String category = asset != null && asset.getCategory() != null ? asset.getCategory().name() : "UNKNOWN";
            AssetPrice price = priceMap.get(pos.getAssetId());
            BigDecimal marketPrice = price != null ? price.getAskPrice() : BigDecimal.ZERO;
            BigDecimal catMarketValue = pos.getTotalUnits().multiply(marketPrice);
            categoryValues.merge(category, catMarketValue, BigDecimal::add);
        }
        // --- Sparkline data from pre-computed category snapshots (last 30 days) ---
        Map<String, List<SparklinePointDto>> sparklineMap = buildSparklineMap(userId);

        List<CategoryAllocationResponse> allocations = new ArrayList<>();
        for (Map.Entry<String, BigDecimal> entry : categoryValues.entrySet()) {
            BigDecimal pct = totalValue.compareTo(BigDecimal.ZERO) > 0
                    ? entry.getValue().divide(totalValue, 4, RoundingMode.HALF_UP)
                            .multiply(new BigDecimal("100"))
                    : BigDecimal.ZERO;
            List<SparklinePointDto> sparkline = sparklineMap.getOrDefault(entry.getKey(), List.of());
            allocations.add(new CategoryAllocationResponse(entry.getKey(), entry.getValue(), pct, sparkline));
        }

        // --- Estimated annual yield (total return) ---
        BigDecimal projectedAnnualCouponIncome = BigDecimal.ZERO;
        for (UserPosition pos : positions) {
            Asset asset = assetMap.get(pos.getAssetId());
            if (asset != null && asset.getCategory() == AssetCategory.BONDS
                    && asset.getInterestRate() != null && asset.getCouponFrequencyMonths() != null
                    && asset.getEffectiveFaceValue() != null) {
                BigDecimal couponPerPeriod = pos.getTotalUnits()
                        .multiply(asset.getEffectiveFaceValue())
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

        List<OrderResponse> orderHistory = orderRepository
                .findByUserIdAndAssetId(userId, assetId,
                        PageRequest.of(0, 200, Sort.by(Sort.Direction.DESC, "createdAt")))
                .getContent()
                .stream()
                .map(o -> new OrderResponse(
                        o.getId(), o.getAssetId(),
                        o.getAsset() != null ? o.getAsset().getSymbol() : null,
                        o.getSide(), o.getUnits(), o.getExecutionPrice(),
                        o.getCashAmount(), o.getFee(), o.getSpreadAmount(), o.getStatus(), o.getCreatedAt(),
                        o.getRegistrationDutyAmount(), o.getCapitalGainsTaxAmount(),
                        o.getTvaAmount(), o.getAccruedInterestAmount()
                ))
                .toList();

        if (pos == null) {
            return new PositionResponse(assetId, null, null,
                    BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO,
                    BigDecimal.ZERO, BigDecimal.ZERO,
                    BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO, null, null,
                    orderHistory);
        }

        Asset asset = assetRepository.findById(assetId).orElse(null);
        AssetPrice price = assetPriceRepository.findById(assetId).orElse(null);
        BigDecimal marketPrice = price != null ? price.getAskPrice() : BigDecimal.ZERO;
        BigDecimal marketValue = pos.getTotalUnits().multiply(marketPrice);
        BigDecimal unrealizedPnl = marketValue.subtract(pos.getTotalCostBasis());
        BigDecimal unrealizedPnlPercent = pos.getTotalCostBasis().compareTo(BigDecimal.ZERO) > 0
                ? unrealizedPnl.divide(pos.getTotalCostBasis(), 4, RoundingMode.HALF_UP)
                        .multiply(new BigDecimal("100"))
                : BigDecimal.ZERO;

        BigDecimal faceValue = asset != null && asset.getEffectiveFaceValue() != null
                ? asset.getEffectiveFaceValue() : marketPrice;
        BondBenefitProjection bondBenefit = asset != null
                ? bondBenefitService.calculateForHolding(asset, pos.getTotalUnits(), marketPrice)
                : null;
        IncomeBenefitProjection incomeBenefit = asset != null
                ? incomeBenefitService.calculateForHolding(asset, pos.getTotalUnits(), faceValue)
                : null;

        return new PositionResponse(
                assetId,
                asset != null ? asset.getSymbol() : null,
                asset != null ? asset.getName() : null,
                pos.getTotalUnits(), pos.getAvgPurchasePrice(), marketPrice,
                marketValue, pos.getTotalCostBasis(),
                unrealizedPnl, unrealizedPnlPercent, pos.getRealizedPnl(),
                bondBenefit, incomeBenefit,
                orderHistory
        );
    }

    /**
     * Update position after a BUY trade. Recalculates WAP and creates a FIFO purchase lot.
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

        // Set first purchase date only on initial buy (lock-up enforcement)
        if (pos.getFirstPurchaseDate() == null) {
            pos.setFirstPurchaseDate(Instant.now());
        }

        userPositionRepository.save(pos);

        // Create FIFO purchase lot with per-lot lockup
        Asset asset = assetRepository.findById(assetId).orElse(null);
        Instant lockupExpiresAt = null;
        if (asset != null && asset.getLockupDays() != null && asset.getLockupDays() > 0) {
            lockupExpiresAt = Instant.now().plus(java.time.Duration.ofDays(asset.getLockupDays()));
        }

        PurchaseLot lot = PurchaseLot.builder()
                .userId(userId)
                .assetId(assetId)
                .units(units)
                .remainingUnits(units)
                .purchasePrice(pricePerUnit)
                .purchasedAt(Instant.now())
                .lockupExpiresAt(lockupExpiresAt)
                .build();
        purchaseLotRepository.save(lot);

        log.info("Updated position after BUY: userId={}, assetId={}, units={}, avgPrice={}, lotId={}",
                userId, assetId, newTotalUnits, newAvgPrice, lot.getId());
    }

    /**
     * Update position after a SELL trade. Consumes lots FIFO for cost basis, calculates per-lot realized P&L.
     * Falls back to WAP-based P&L if no lots exist (legacy positions).
     */
    @Transactional
    public BigDecimal updatePositionAfterSell(Long userId, String assetId, BigDecimal units,
                                               BigDecimal sellPricePerUnit) {
        UserPosition pos = userPositionRepository.findByUserIdAndAssetId(userId, assetId)
                .orElseThrow(() -> new RuntimeException("No position found for sell: userId=" + userId + ", assetId=" + assetId));

        BigDecimal newTotalUnits = pos.getTotalUnits().subtract(units);
        if (newTotalUnits.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalStateException(
                    "Sell would result in negative units (" + newTotalUnits + ") for userId=" + userId + ", assetId=" + assetId);
        }

        // FIFO lot consumption for per-lot realized P&L
        BigDecimal realizedPnl = consumeLotsAndCalculatePnl(userId, assetId, units, sellPricePerUnit, pos);

        // Recalculate avgPurchasePrice and costBasis from remaining lots
        List<PurchaseLot> remainingLots = purchaseLotRepository
                .findByUserIdAndAssetIdAndRemainingUnitsGreaterThanOrderByPurchasedAtAsc(userId, assetId, BigDecimal.ZERO);
        if (!remainingLots.isEmpty()) {
            BigDecimal totalRemainingCost = BigDecimal.ZERO;
            BigDecimal totalRemainingUnits = BigDecimal.ZERO;
            for (PurchaseLot lot : remainingLots) {
                totalRemainingCost = totalRemainingCost.add(
                        lot.getRemainingUnits().multiply(lot.getPurchasePrice()));
                totalRemainingUnits = totalRemainingUnits.add(lot.getRemainingUnits());
            }
            BigDecimal newAvgPrice = totalRemainingUnits.compareTo(BigDecimal.ZERO) > 0
                    ? totalRemainingCost.divide(totalRemainingUnits, 4, RoundingMode.HALF_UP)
                    : BigDecimal.ZERO;
            pos.setAvgPurchasePrice(newAvgPrice);
            pos.setTotalCostBasis(totalRemainingCost.setScale(0, RoundingMode.HALF_UP));
        } else {
            // No remaining lots — fallback proportional cost reduction
            BigDecimal costReduction = pos.getAvgPurchasePrice().multiply(units);
            BigDecimal newTotalCost = pos.getTotalCostBasis().subtract(costReduction);
            pos.setTotalCostBasis(newTotalCost.compareTo(BigDecimal.ZERO) < 0 ? BigDecimal.ZERO : newTotalCost);
        }

        pos.setTotalUnits(newTotalUnits);
        pos.setRealizedPnl(pos.getRealizedPnl().add(realizedPnl));
        pos.setLastTradeAt(Instant.now());

        userPositionRepository.save(pos);
        log.info("Updated position after SELL: userId={}, assetId={}, soldUnits={}, realizedPnl={}",
                userId, assetId, units, realizedPnl);
        return realizedPnl;
    }

    /**
     * Consume purchase lots in FIFO order and calculate per-lot realized P&L.
     * Falls back to WAP-based P&L if no lots exist.
     */
    private BigDecimal consumeLotsAndCalculatePnl(Long userId, String assetId,
                                                    BigDecimal sellUnits, BigDecimal sellPricePerUnit,
                                                    UserPosition pos) {
        List<PurchaseLot> lots = purchaseLotRepository
                .findByUserIdAndAssetIdAndRemainingUnitsGreaterThanOrderByPurchasedAtAsc(userId, assetId, BigDecimal.ZERO);

        if (lots.isEmpty()) {
            // Legacy position without lots — use WAP
            return sellPricePerUnit.subtract(pos.getAvgPurchasePrice()).multiply(sellUnits);
        }

        BigDecimal remainingToSell = sellUnits;
        BigDecimal totalPnl = BigDecimal.ZERO;

        for (PurchaseLot lot : lots) {
            if (remainingToSell.compareTo(BigDecimal.ZERO) <= 0) break;

            BigDecimal consumable = lot.getRemainingUnits().min(remainingToSell);
            BigDecimal lotPnl = sellPricePerUnit.subtract(lot.getPurchasePrice()).multiply(consumable);
            totalPnl = totalPnl.add(lotPnl);

            lot.setRemainingUnits(lot.getRemainingUnits().subtract(consumable));
            purchaseLotRepository.save(lot);

            remainingToSell = remainingToSell.subtract(consumable);
        }

        // Safety: if lots didn't cover all units, use WAP for remainder
        if (remainingToSell.compareTo(BigDecimal.ZERO) > 0) {
            log.warn("FIFO lots did not cover full sell: userId={}, assetId={}, unmatched={}",
                    userId, assetId, remainingToSell);
            totalPnl = totalPnl.add(
                    sellPricePerUnit.subtract(pos.getAvgPurchasePrice()).multiply(remainingToSell));
        }

        return totalPnl;
    }

    /**
     * Build sparkline data from pre-computed category snapshots (last 30 days).
     * Returns a map of category name → list of (date, value) points, downsampled to ~20 points.
     */
    private Map<String, List<SparklinePointDto>> buildSparklineMap(Long userId) {
        LocalDate fromDate = LocalDate.now().minusDays(30);
        List<CategorySnapshot> snapshots = categorySnapshotRepository
                .findByUserIdAndSnapshotDateGreaterThanEqualOrderBySnapshotDateAsc(userId, fromDate);

        if (snapshots.isEmpty()) {
            return Map.of();
        }

        // Group by category
        Map<String, List<SparklinePointDto>> result = new LinkedHashMap<>();
        Map<String, List<CategorySnapshot>> byCategory = snapshots.stream()
                .collect(Collectors.groupingBy(CategorySnapshot::getCategory, LinkedHashMap::new, Collectors.toList()));

        for (Map.Entry<String, List<CategorySnapshot>> entry : byCategory.entrySet()) {
            List<CategorySnapshot> catSnapshots = entry.getValue();
            List<SparklinePointDto> points = catSnapshots.stream()
                    .map(s -> new SparklinePointDto(s.getSnapshotDate(), s.getTotalValue()))
                    .toList();

            // Downsample to ~20 points if needed
            if (points.size() > 20) {
                points = downsample(points, 20);
            }
            result.put(entry.getKey(), points);
        }

        return result;
    }

    /**
     * Downsample a list of sparkline points to the target count by evenly spacing selections.
     */
    private List<SparklinePointDto> downsample(List<SparklinePointDto> points, int target) {
        if (points.size() <= target) return points;
        List<SparklinePointDto> result = new ArrayList<>(target);
        double step = (double) (points.size() - 1) / (target - 1);
        for (int i = 0; i < target; i++) {
            int idx = (int) Math.round(i * step);
            result.add(points.get(idx));
        }
        return result;
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
