package com.adorsys.fineract.asset.service;

import com.adorsys.fineract.asset.dto.*;
import com.adorsys.fineract.asset.dto.AssetCategory;
import com.adorsys.fineract.asset.entity.Asset;
import com.adorsys.fineract.asset.exception.AssetException;
import com.adorsys.fineract.asset.entity.AssetPrice;
import com.adorsys.fineract.asset.entity.CategorySnapshot;
import com.adorsys.fineract.asset.entity.IncomeDistribution;
import com.adorsys.fineract.asset.entity.InterestPayment;
import com.adorsys.fineract.asset.entity.PortfolioSnapshot;
import com.adorsys.fineract.asset.entity.PurchaseLot;
import com.adorsys.fineract.asset.entity.ScheduledPayment;
import com.adorsys.fineract.asset.entity.UserPosition;
import com.adorsys.fineract.asset.repository.AssetPriceRepository;
import com.adorsys.fineract.asset.repository.AssetRepository;
import com.adorsys.fineract.asset.repository.CategorySnapshotRepository;
import com.adorsys.fineract.asset.dto.OrderStatus;
import com.adorsys.fineract.asset.repository.IncomeDistributionRepository;
import com.adorsys.fineract.asset.repository.InterestPaymentRepository;
import com.adorsys.fineract.asset.repository.OrderRepository;
import com.adorsys.fineract.asset.repository.PortfolioSnapshotRepository;
import com.adorsys.fineract.asset.repository.PurchaseLotRepository;
import com.adorsys.fineract.asset.repository.ScheduledPaymentRepository;
import com.adorsys.fineract.asset.repository.TaxTransactionRepository;
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
    private final AccruedInterestCalculator accruedInterestCalculator;
    private final PortfolioSnapshotRepository portfolioSnapshotRepository;
    private final CategorySnapshotRepository categorySnapshotRepository;
    private final OrderRepository orderRepository;
    private final InterestPaymentRepository interestPaymentRepository;
    private final IncomeDistributionRepository incomeDistributionRepository;
    private final ScheduledPaymentRepository scheduledPaymentRepository;
    private final TaxTransactionRepository taxTransactionRepository;
    private final TaxService taxService;
    private final com.adorsys.fineract.asset.repository.PrincipalRedemptionRepository principalRedemptionRepository;

    /**
     * Get full portfolio summary for a user including positions and holdings.
     */
    @Transactional(readOnly = true)
    public PortfolioSummaryResponse getPortfolio(Long userId) {
        List<UserPosition> positions = userPositionRepository.findByUserId(userId);

        if (positions.isEmpty()) {
            return new PortfolioSummaryResponse(BigDecimal.ZERO, BigDecimal.ZERO,
                    BigDecimal.ZERO, BigDecimal.ZERO,
                    BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO,
                    List.of(), List.of(), BigDecimal.ZERO, 0);
        }

        List<String> assetIds = positions.stream().map(UserPosition::getAssetId).toList();
        Map<String, Asset> assetMap = assetRepository.findAllById(assetIds)
                .stream().collect(Collectors.toMap(Asset::getId, Function.identity()));
        Map<String, AssetPrice> priceMap = assetPriceRepository.findAllByAssetIdIn(assetIds)
                .stream().collect(Collectors.toMap(AssetPrice::getAssetId, Function.identity()));

        BigDecimal totalValue = BigDecimal.ZERO;
        BigDecimal totalCostBasis = BigDecimal.ZERO;
        BigDecimal totalRealizedPnl = BigDecimal.ZERO;
        BigDecimal totalFeesPaid = BigDecimal.ZERO;
        BigDecimal totalTaxesPaid = BigDecimal.ZERO;
        List<PositionResponse> positionResponses = new ArrayList<>();

        for (UserPosition pos : positions) {
            Asset asset = assetMap.get(pos.getAssetId());
            AssetPrice price = priceMap.get(pos.getAssetId());
            BigDecimal marketPrice = price != null ? price.getAskPrice() : BigDecimal.ZERO;
            BigDecimal marketBidPrice = price != null ? price.getBidPrice() : null;
            BigDecimal marketValue = pos.getTotalUnits().multiply(marketPrice);
            BigDecimal unrealizedPnl = marketValue.subtract(pos.getTotalCostBasis());
            BigDecimal unrealizedPnlPercent = pos.getTotalCostBasis().compareTo(BigDecimal.ZERO) > 0
                    ? unrealizedPnl.divide(pos.getTotalCostBasis(), 4, RoundingMode.HALF_UP)
                            .multiply(new BigDecimal("100"))
                    : BigDecimal.ZERO;

            totalValue = totalValue.add(marketValue);
            totalCostBasis = totalCostBasis.add(pos.getTotalCostBasis());
            totalRealizedPnl = totalRealizedPnl.add(pos.getRealizedPnl() != null ? pos.getRealizedPnl() : BigDecimal.ZERO);
            totalFeesPaid = totalFeesPaid.add(pos.getTotalFeesPaid() != null ? pos.getTotalFeesPaid() : BigDecimal.ZERO);
            totalTaxesPaid = totalTaxesPaid.add(pos.getTotalTaxesPaid() != null ? pos.getTotalTaxesPaid() : BigDecimal.ZERO);

            BigDecimal faceValue = asset != null && asset.getEffectiveFaceValue() != null
                    ? asset.getEffectiveFaceValue() : marketPrice;
            BondBenefitProjection bondBenefit = asset != null
                    ? bondBenefitService.calculateForHolding(asset, pos.getTotalUnits(), marketPrice)
                    : null;
            IncomeBenefitProjection incomeBenefit = asset != null
                    ? incomeBenefitService.calculateForHolding(asset, pos.getTotalUnits(), faceValue)
                    : null;

            BigDecimal[] bondPricing = computeBondPricing(asset, price, pos.getTotalUnits());
            positionResponses.add(new PositionResponse(
                    pos.getAssetId(),
                    asset != null ? asset.getSymbol() : null,
                    asset != null ? asset.getName() : null,
                    pos.getTotalUnits(), pos.getAvgPurchasePrice(), marketPrice,
                    marketValue, pos.getTotalCostBasis(),
                    unrealizedPnl, unrealizedPnlPercent, pos.getRealizedPnl(),
                    marketBidPrice,
                    pos.getTotalFeesPaid() != null ? pos.getTotalFeesPaid() : BigDecimal.ZERO,
                    pos.getTotalTaxesPaid() != null ? pos.getTotalTaxesPaid() : BigDecimal.ZERO,
                    bondPricing[0], bondPricing[1], bondPricing[2], bondPricing[3], bondPricing[4],
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
        // Current yield = annual coupon income / cost basis. Unrealized P&L is excluded
        // as it is a valuation change, not income (adding it would misstate the yield).
        BigDecimal estimatedAnnualYieldPercent = totalCostBasis.compareTo(BigDecimal.ZERO) > 0
                ? projectedAnnualCouponIncome
                        .divide(totalCostBasis, 4, RoundingMode.HALF_UP)
                        .multiply(new BigDecimal("100"))
                : BigDecimal.ZERO;

        return new PortfolioSummaryResponse(
                totalValue, totalCostBasis, totalUnrealizedPnl, totalUnrealizedPnlPercent,
                totalRealizedPnl, totalFeesPaid, totalTaxesPaid,
                positionResponses, allocations, estimatedAnnualYieldPercent, categoryValues.size()
        );
    }

    /**
     * Get a single redemption-event detail for the authenticated user. Used by the
     * BTA maturity-redemption confirmation screen on mobile to display the four-line
     * tax breakdown (gross / capital gain / IRCM / net) without recomputing.
     *
     * <p>Throws {@link AssetException} when the redemption row does not exist, was
     * written for a different user, or did not complete successfully — failed
     * redemptions are not surfaced to end users; admins see them via the admin API.
     */
    @Transactional(readOnly = true)
    public RedemptionDetailResponse getRedemption(Long userId, Long redemptionId) {
        com.adorsys.fineract.asset.entity.PrincipalRedemption row = principalRedemptionRepository
                .findById(redemptionId)
                .orElseThrow(() -> new AssetException("Redemption not found: " + redemptionId));
        if (!row.getUserId().equals(userId)) {
            throw new AssetException("Redemption not found: " + redemptionId);
        }
        if (!"SUCCESS".equals(row.getStatus())) {
            throw new AssetException("Redemption not found: " + redemptionId);
        }
        Asset asset = assetRepository.findById(row.getAssetId()).orElse(null);
        BigDecimal gross = row.getGrossCashAmount() != null
                ? row.getGrossCashAmount()
                : row.getCashAmount(); // legacy rows pre-V3
        BigDecimal ircm = row.getIrcmWithheld() != null ? row.getIrcmWithheld() : BigDecimal.ZERO;
        BigDecimal capitalGain = row.getCapitalGain() != null ? row.getCapitalGain() : BigDecimal.ZERO;
        // Use the actual transferred amount as authoritative net rather than recomputing
        // gross − ircm. cash_amount is NOT NULL in the schema and is exactly what landed
        // in the holder's settlement account; this avoids a display/audit mismatch on
        // any row where one of grossCashAmount or ircmWithheld is null but cash_amount
        // is correct.
        BigDecimal net = row.getCashAmount();
        return new RedemptionDetailResponse(
                row.getId(),
                row.getAssetId(),
                asset != null ? asset.getSymbol() : null,
                asset != null ? asset.getName() : null,
                asset != null ? asset.getBondType() : null,
                asset != null ? asset.getIsinCode() : null,
                row.getUnits(),
                row.getFaceValue(),
                row.getAvgPurchasePrice(),
                gross,
                capitalGain,
                ircm,
                row.getIrcmRateApplied(),
                net,
                row.getRealizedPnl(),
                row.getRedemptionDate(),
                row.getRedeemedAt(),
                row.getStatus()
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
                .findByUserIdAndAssetIdAndStatusNotIn(userId, assetId, List.of(OrderStatus.CANCELLED),
                        PageRequest.of(0, 200, Sort.by(Sort.Direction.DESC, "createdAt")))
                .getContent()
                .stream()
                .map(o -> {
                    BigDecimal gross = o.getUnits() != null && o.getExecutionPrice() != null
                            ? o.getUnits().multiply(o.getExecutionPrice())
                            : null;
                    return new OrderResponse(
                            o.getId(), o.getAssetId(),
                            o.getAsset() != null ? o.getAsset().getSymbol() : null,
                            o.getSide(), o.getUnits(), o.getExecutionPrice(),
                            gross, o.getCashAmount(), o.getFee(), o.getSpreadAmount(), o.getStatus(), o.getCreatedAt(),
                            o.getRegistrationDutyAmount(), o.getCapitalGainsTaxAmount(),
                            o.getTvaAmount(), o.getAccruedInterestAmount()
                    );
                })
                .toList();

        if (pos == null) {
            return new PositionResponse(assetId, null, null,
                    BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO,
                    BigDecimal.ZERO, BigDecimal.ZERO,
                    BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO,
                    null, BigDecimal.ZERO, BigDecimal.ZERO,
                    null, null, null, null, null,
                    null, null,
                    orderHistory);
        }

        Asset asset = assetRepository.findById(assetId).orElse(null);
        AssetPrice price = assetPriceRepository.findById(assetId).orElse(null);
        BigDecimal marketPrice = price != null ? price.getAskPrice() : BigDecimal.ZERO;
        BigDecimal marketBidPrice = price != null ? price.getBidPrice() : null;
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

        BigDecimal[] bondPricing = computeBondPricing(asset, price, pos.getTotalUnits());
        return new PositionResponse(
                assetId,
                asset != null ? asset.getSymbol() : null,
                asset != null ? asset.getName() : null,
                pos.getTotalUnits(), pos.getAvgPurchasePrice(), marketPrice,
                marketValue, pos.getTotalCostBasis(),
                unrealizedPnl, unrealizedPnlPercent, pos.getRealizedPnl(),
                marketBidPrice,
                pos.getTotalFeesPaid() != null ? pos.getTotalFeesPaid() : BigDecimal.ZERO,
                pos.getTotalTaxesPaid() != null ? pos.getTotalTaxesPaid() : BigDecimal.ZERO,
                bondPricing[0], bondPricing[1], bondPricing[2], bondPricing[3], bondPricing[4],
                bondBenefit, incomeBenefit,
                orderHistory
        );
    }

    /**
     * Update position after a BUY trade. Recalculates WAP, creates a FIFO purchase lot,
     * and accumulates fees/taxes paid.
     *
     * @param feePaid  platform fee + TVA charged on this trade (null treated as zero)
     * @param taxPaid  registration duty + capital gains tax charged on this trade (null treated as zero)
     */
    @Transactional
    public void updatePositionAfterBuy(Long userId, String assetId, Long fineractAccountId,
                                        BigDecimal units, BigDecimal pricePerUnit,
                                        BigDecimal feePaid, BigDecimal taxPaid) {
        UserPosition pos = userPositionRepository.findByUserIdAndAssetId(userId, assetId)
                .orElse(UserPosition.builder()
                        .userId(userId)
                        .assetId(assetId)
                        .fineractSavingsAccountId(fineractAccountId)
                        .totalUnits(BigDecimal.ZERO)
                        .avgPurchasePrice(BigDecimal.ZERO)
                        .totalCostBasis(BigDecimal.ZERO)
                        .realizedPnl(BigDecimal.ZERO)
                        .totalFeesPaid(BigDecimal.ZERO)
                        .totalTaxesPaid(BigDecimal.ZERO)
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
        BigDecimal currentFees = pos.getTotalFeesPaid() != null ? pos.getTotalFeesPaid() : BigDecimal.ZERO;
        BigDecimal currentTaxes = pos.getTotalTaxesPaid() != null ? pos.getTotalTaxesPaid() : BigDecimal.ZERO;
        pos.setTotalFeesPaid(currentFees.add(feePaid != null ? feePaid : BigDecimal.ZERO));
        pos.setTotalTaxesPaid(currentTaxes.add(taxPaid != null ? taxPaid : BigDecimal.ZERO));
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
     * Update position after a SELL trade. Consumes lots FIFO for cost basis, calculates per-lot
     * realized P&L, and accumulates fees/taxes paid.
     *
     * @param feePaid  platform fee + TVA charged on this trade (null treated as zero)
     * @param taxPaid  registration duty + capital gains tax charged on this trade (null treated as zero)
     * @return realized P&L for this sell
     */
    @Transactional
    public BigDecimal updatePositionAfterSell(Long userId, String assetId, BigDecimal units,
                                               BigDecimal sellPricePerUnit,
                                               BigDecimal feePaid, BigDecimal taxPaid) {
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
        pos.setRealizedPnl(pos.getRealizedPnl() != null ? pos.getRealizedPnl().add(realizedPnl) : realizedPnl);
        BigDecimal currentFees = pos.getTotalFeesPaid() != null ? pos.getTotalFeesPaid() : BigDecimal.ZERO;
        BigDecimal currentTaxes = pos.getTotalTaxesPaid() != null ? pos.getTotalTaxesPaid() : BigDecimal.ZERO;
        pos.setTotalFeesPaid(currentFees.add(feePaid != null ? feePaid : BigDecimal.ZERO));
        pos.setTotalTaxesPaid(currentTaxes.add(taxPaid != null ? taxPaid : BigDecimal.ZERO));
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
     * Compute bond pricing fields for a position (accrued interest, clean/dirty prices, totals).
     * Returns a 5-element array: [accruedPerUnit, cleanPrice, dirtyPrice, totalAccrued, dirtyMarketValue].
     * All elements are null when the asset is not a bond (bondType == null).
     */
    private BigDecimal[] computeBondPricing(Asset asset, AssetPrice price, BigDecimal totalUnits) {
        if (asset == null || asset.getBondType() == null) {
            return new BigDecimal[]{null, null, null, null, null};
        }
        BigDecimal bidPrice = price != null ? price.getBidPrice() : null;
        BigDecimal cleanPrice = bidPrice != null ? bidPrice : BigDecimal.ZERO;
        BigDecimal accruedPerUnit = accruedInterestCalculator.calculate(asset, BigDecimal.ONE);
        BigDecimal dirtyPrice = cleanPrice.add(accruedPerUnit);
        BigDecimal totalAccrued = accruedPerUnit.multiply(totalUnits);
        BigDecimal dirtyMarketValue = dirtyPrice.multiply(totalUnits);
        return new BigDecimal[]{accruedPerUnit, cleanPrice, dirtyPrice, totalAccrued, dirtyMarketValue};
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

    /**
     * Returns a paginated list of past paid and future scheduled income events for a user.
     *
     * <p>PAID events are sourced from {@link InterestPayment} (bond coupons) and
     * {@link IncomeDistribution} (non-bond income) tables, both keyed by {@code userId}.
     * SCHEDULED events are derived from PENDING {@link ScheduledPayment} records on
     * assets where the user currently holds units.</p>
     *
     * <p>Gross/IRCM amounts for PAID events are reconstructed using the current IRCM rate
     * on the asset — this is a best-effort display approximation since the per-payment
     * IRCM breakdown is stored only in {@code TaxTransaction} (not per-user in either
     * payment table). The running summary uses actual IRCM totals from {@code TaxTransaction}.</p>
     *
     * @param userId Fineract client ID of the authenticated user
     * @param status filter: "PAID", "SCHEDULED", or "ALL" (default)
     * @param page   zero-based page index
     * @param size   page size (max items per response)
     */
    @Transactional(readOnly = true)
    public UserIncomeHistoryResponse getIncomeHistory(Long userId, String status, int page, int size) {
        List<UserIncomeHistoryResponse.UserIncomeEvent> events = new ArrayList<>();

        boolean includePaid = "ALL".equalsIgnoreCase(status) || "PAID".equalsIgnoreCase(status);
        boolean includeScheduled = "ALL".equalsIgnoreCase(status) || "SCHEDULED".equalsIgnoreCase(status);

        // ── 1. Collect PAID coupon events (InterestPayment) ─────────────────
        if (includePaid) {
            // Fetch all paid coupon records for the user (unfiltered — we paginate the merged list)
            List<InterestPayment> coupons = interestPaymentRepository
                    .findByUserIdOrderByPaidAtDesc(userId,
                            PageRequest.of(0, 1000, Sort.by(Sort.Direction.DESC, "paidAt")))
                    .getContent();

            Map<String, Asset> assetCache = new HashMap<>();
            for (InterestPayment payment : coupons) {
                if (!"SUCCESS".equals(payment.getStatus())) continue;
                Asset asset = assetCache.computeIfAbsent(payment.getAssetId(),
                        id -> assetRepository.findById(id).orElse(null));

                BigDecimal units = payment.getUnits();
                BigDecimal netTotal = payment.getCashAmount();
                // Reconstruct gross using current IRCM rate (best-effort for display)
                boolean exempt = asset == null || Boolean.TRUE.equals(asset.getIrcmExempt())
                        || Boolean.TRUE.equals(asset.getIsGovernmentBond());
                // Guard: deleted/orphaned asset → treat as exempt (ircmRate=0) to avoid NPE
                BigDecimal ircmRate = (asset != null && !exempt) ? taxService.getEffectiveIrcmRate(asset) : BigDecimal.ZERO;
                // gross = net / (1 - ircmRate), where ircmRate is a fraction (e.g. 0.055)
                BigDecimal grossTotal = ircmRate.compareTo(BigDecimal.ZERO) > 0
                        ? netTotal.divide(BigDecimal.ONE.subtract(ircmRate), 0, RoundingMode.HALF_UP)
                        : netTotal;
                BigDecimal ircmTotal = grossTotal.subtract(netTotal);

                BigDecimal grossPerUnit = units.compareTo(BigDecimal.ZERO) > 0
                        ? grossTotal.divide(units, 4, RoundingMode.HALF_UP) : BigDecimal.ZERO;
                BigDecimal ircmPerUnit = units.compareTo(BigDecimal.ZERO) > 0
                        ? ircmTotal.divide(units, 4, RoundingMode.HALF_UP) : BigDecimal.ZERO;
                BigDecimal netPerUnit = grossPerUnit.subtract(ircmPerUnit);

                events.add(new UserIncomeHistoryResponse.UserIncomeEvent(
                        payment.getAssetId(),
                        asset != null ? asset.getSymbol() : null,
                        asset != null ? asset.getName() : null,
                        "COUPON",
                        payment.getCouponDate(),
                        units,
                        grossPerUnit,
                        ircmPerUnit,
                        netPerUnit,
                        grossTotal,
                        ircmTotal,
                        netTotal,
                        exempt,
                        "PAID"
                ));
            }
        }

        // ── 2. Collect PAID income distribution events (IncomeDistribution) ─
        if (includePaid) {
            List<IncomeDistribution> distributions = incomeDistributionRepository
                    .findByUserIdOrderByPaidAtDesc(userId,
                            PageRequest.of(0, 1000, Sort.by(Sort.Direction.DESC, "paidAt")))
                    .getContent();

            Map<String, Asset> assetCache = new HashMap<>();
            for (IncomeDistribution dist : distributions) {
                if (!"SUCCESS".equals(dist.getStatus())) continue;
                Asset asset = assetCache.computeIfAbsent(dist.getAssetId(),
                        id -> assetRepository.findById(id).orElse(null));

                BigDecimal units = dist.getUnits();
                BigDecimal netTotal = dist.getCashAmount();
                boolean exempt = asset == null || Boolean.TRUE.equals(asset.getIrcmExempt())
                        || Boolean.TRUE.equals(asset.getIsGovernmentBond());
                // Guard: deleted/orphaned asset → treat as exempt (ircmRate=0) to avoid NPE
                BigDecimal ircmRate = (asset != null && !exempt) ? taxService.getEffectiveIrcmRate(asset) : BigDecimal.ZERO;
                BigDecimal grossTotal = ircmRate.compareTo(BigDecimal.ZERO) > 0
                        ? netTotal.divide(BigDecimal.ONE.subtract(ircmRate), 0, RoundingMode.HALF_UP)
                        : netTotal;
                BigDecimal ircmTotal = grossTotal.subtract(netTotal);

                BigDecimal grossPerUnit = units.compareTo(BigDecimal.ZERO) > 0
                        ? grossTotal.divide(units, 4, RoundingMode.HALF_UP) : BigDecimal.ZERO;
                BigDecimal ircmPerUnit = units.compareTo(BigDecimal.ZERO) > 0
                        ? ircmTotal.divide(units, 4, RoundingMode.HALF_UP) : BigDecimal.ZERO;
                BigDecimal netPerUnit = grossPerUnit.subtract(ircmPerUnit);

                events.add(new UserIncomeHistoryResponse.UserIncomeEvent(
                        dist.getAssetId(),
                        asset != null ? asset.getSymbol() : null,
                        asset != null ? asset.getName() : null,
                        dist.getIncomeType() != null ? dist.getIncomeType() : "INCOME",
                        dist.getDistributionDate(),
                        units,
                        grossPerUnit,
                        ircmPerUnit,
                        netPerUnit,
                        grossTotal,
                        ircmTotal,
                        netTotal,
                        exempt,
                        "PAID"
                ));
            }
        }

        // ── 3. Collect SCHEDULED future events (pending ScheduledPayments) ───
        if (includeScheduled) {
            // Find assets the user currently holds (with units > 0)
            List<UserPosition> positions = userPositionRepository.findByUserId(userId).stream()
                    .filter(p -> p.getTotalUnits().compareTo(BigDecimal.ZERO) > 0)
                    .toList();

            for (UserPosition pos : positions) {
                Asset asset = assetRepository.findById(pos.getAssetId()).orElse(null);
                if (asset == null) continue;

                // Query for all PENDING scheduled payments for this asset.
                // Note: findFiltered is a native query; Sort is not applied server-side here —
                // results are sorted client-side below when the unified event list is sorted.
                org.springframework.data.domain.Page<ScheduledPayment> pendingPage =
                        scheduledPaymentRepository.findFiltered("PENDING", pos.getAssetId(), null,
                                PageRequest.of(0, 50));

                boolean exempt = Boolean.TRUE.equals(asset.getIrcmExempt())
                        || Boolean.TRUE.equals(asset.getIsGovernmentBond());
                BigDecimal ircmRate = taxService.getEffectiveIrcmRate(asset);

                for (ScheduledPayment scheduled : pendingPage.getContent()) {
                    BigDecimal estimatedAmountPerUnit = scheduled.getEstimatedAmountPerUnit() != null
                            ? scheduled.getEstimatedAmountPerUnit() : BigDecimal.ZERO;

                    // estimatedAmountPerUnit from ScheduledPayment is the gross amount
                    BigDecimal grossTotal = estimatedAmountPerUnit.multiply(pos.getTotalUnits())
                            .setScale(0, RoundingMode.HALF_UP);
                    BigDecimal ircmTotal = taxService.calculateIrcm(asset, grossTotal);
                    BigDecimal netTotal = grossTotal.subtract(ircmTotal);

                    BigDecimal ircmPerUnit = pos.getTotalUnits().compareTo(BigDecimal.ZERO) > 0
                            ? ircmTotal.divide(pos.getTotalUnits(), 4, RoundingMode.HALF_UP)
                            : BigDecimal.ZERO;
                    BigDecimal netPerUnit = estimatedAmountPerUnit.subtract(ircmPerUnit);

                    String eventType = "COUPON".equals(scheduled.getPaymentType())
                            ? "COUPON" : "INCOME";

                    events.add(new UserIncomeHistoryResponse.UserIncomeEvent(
                            pos.getAssetId(),
                            asset.getSymbol(),
                            asset.getName(),
                            eventType,
                            scheduled.getScheduleDate(),
                            pos.getTotalUnits(),
                            estimatedAmountPerUnit,
                            ircmPerUnit,
                            netPerUnit,
                            grossTotal,
                            ircmTotal,
                            netTotal,
                            exempt,
                            "SCHEDULED"
                    ));
                }
            }
        }

        // ── 4. Sort: PAID events by paymentDate desc, then SCHEDULED by paymentDate asc ─
        events.sort(Comparator
                .comparing((UserIncomeHistoryResponse.UserIncomeEvent e) -> "PAID".equals(e.status()) ? 0 : 1)
                .thenComparing(e -> "PAID".equals(e.status())
                        ? e.paymentDate().toEpochDay() * -1
                        : e.paymentDate().toEpochDay()));

        // ── 5. Paginate the merged list ──────────────────────────────────────
        long totalElements = events.size();
        int fromIdx = Math.min(page * size, events.size());
        int toIdx = Math.min(fromIdx + size, events.size());
        List<UserIncomeHistoryResponse.UserIncomeEvent> pageContent = events.subList(fromIdx, toIdx);

        // ── 6. Compute summary from actual tax records (not page-limited) ────
        BigDecimal totalIrcmWithheld = taxTransactionRepository.sumIrcmByUser(userId);
        BigDecimal totalPaid = interestPaymentRepository.sumPaidByUser(userId)
                .add(incomeDistributionRepository.sumPaidByUser(userId));
        BigDecimal totalScheduled = events.stream()
                .filter(e -> "SCHEDULED".equals(e.status()))
                .map(UserIncomeHistoryResponse.UserIncomeEvent::totalNet)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        UserIncomeHistoryResponse.UserIncomeSummary summary =
                new UserIncomeHistoryResponse.UserIncomeSummary(totalPaid, totalScheduled, totalIrcmWithheld);

        return new UserIncomeHistoryResponse(pageContent, totalElements, summary);
    }
}
