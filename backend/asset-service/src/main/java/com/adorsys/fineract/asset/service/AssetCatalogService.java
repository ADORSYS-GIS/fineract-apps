package com.adorsys.fineract.asset.service;

import com.adorsys.fineract.asset.dto.*;
import com.adorsys.fineract.asset.entity.Asset;
import com.adorsys.fineract.asset.entity.AssetPrice;
import com.adorsys.fineract.asset.exception.AssetException;
import com.adorsys.fineract.asset.repository.AssetPriceRepository;
import com.adorsys.fineract.asset.repository.AssetRepository;
import com.adorsys.fineract.asset.repository.TradeLogRepository;
import com.adorsys.fineract.asset.storage.FileStorageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * Service for asset catalog browsing, search, and discovery.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AssetCatalogService {

    private final AssetRepository assetRepository;
    private final AssetPriceRepository assetPriceRepository;
    private final TradeLogRepository tradeLogRepository;
    private final FileStorageService fileStorageService;
    private final AccruedInterestCalculator accruedInterestCalculator;
    private final TaxService taxService;

    /**
     * List active assets with optional category filter and search.
     */
    @Transactional(readOnly = true)
    public Page<AssetResponse> listAssets(AssetCategory category, String search, Pageable pageable) {
        Pageable stable = withIdTiebreaker(pageable);
        Page<Asset> assets;

        if (search != null && !search.isBlank() && category != null) {
            assets = assetRepository.searchByStatusCategoryAndNameOrSymbol(AssetStatus.ACTIVE, category, search, stable);
        } else if (search != null && !search.isBlank()) {
            assets = assetRepository.searchByStatusAndNameOrSymbol(AssetStatus.ACTIVE, search, stable);
        } else if (category != null) {
            assets = assetRepository.findByStatusAndCategory(AssetStatus.ACTIVE, category, stable);
        } else {
            assets = assetRepository.findByStatus(AssetStatus.ACTIVE, stable);
        }

        List<String> assetIds = assets.getContent().stream().map(Asset::getId).toList();
        Map<String, AssetPrice> priceMap = assetPriceRepository.findAllByAssetIdIn(assetIds)
                .stream().collect(Collectors.toMap(AssetPrice::getAssetId, Function.identity()));

        return assets.map(a -> toAssetResponse(a, priceMap.get(a.getId())));
    }

    /**
     * Get public asset detail by ID (omits internal Fineract IDs).
     */
    @Transactional(readOnly = true)
    public AssetPublicDetailResponse getAssetDetail(String assetId) {
        Asset asset = assetRepository.findById(assetId)
                .orElseThrow(() -> new AssetException("Asset not found: " + assetId));

        AssetPrice price = assetPriceRepository.findById(assetId).orElse(null);

        BigDecimal available = asset.getTotalSupply().subtract(asset.getCirculatingSupply());
        BigDecimal couponAmountPerUnit = computeCouponAmountPerUnit(asset);
        BigDecimal askPrice = price != null ? price.getAskPrice() : null;
        BigDecimal currentYield = computeCurrentYield(asset, askPrice);
        BigDecimal ircmRate = taxService.getEffectiveIrcmRate(asset);
        BigDecimal impliedRate = computeBtaImpliedRate(asset);
        BigDecimal accruedInterestPerUnit = computeAccruedInterestPerUnit(asset);

        return new AssetPublicDetailResponse(
                asset.getId(), asset.getName(), asset.getSymbol(), asset.getCurrencyCode(),
                asset.getDescription(), resolveImageUrl(asset.getImageUrl()), asset.getCategory(), asset.getStatus(),
                asset.getPriceMode(),
                price != null ? price.getChange24hPercent() : null,
                price != null ? price.getDayOpen() : null,
                price != null ? price.getDayHigh() : null,
                price != null ? price.getDayLow() : null,
                price != null ? price.getDayClose() : null,
                asset.getTotalSupply(), asset.getCirculatingSupply(),
                available, asset.getTradingFeePercent(),
                asset.getDecimalPlaces(),
                asset.getCreatedAt(), asset.getUpdatedAt(),
                asset.getIssuerName(), asset.getIssuerPrice(), asset.getFaceValue(), asset.getLpClientName(),
                asset.getBondType(), asset.getDayCountConvention(), asset.getIssuerCountry(),
                asset.getIsinCode(), asset.getMaturityDate(), asset.getIssueDate(),
                asset.getInterestRate(), currentYield, asset.getCouponFrequencyMonths(),
                asset.getNextCouponDate(),
                computeResidualDays(asset.getMaturityDate()),
                couponAmountPerUnit,
                ircmRate,
                impliedRate,
                accruedInterestPerUnit,
                price != null ? price.getBidPrice() : null,
                price != null ? price.getAskPrice() : null,
                asset.getMaxPositionPercent(), asset.getMaxOrderSize(),
                asset.getDailyTradeLimitXaf(),
                asset.getMinOrderSize(), asset.getMinOrderCashAmount(),
                asset.getLockupDays(),
                asset.getIncomeType(), asset.getIncomeRate(),
                asset.getDistributionFrequencyMonths(), asset.getNextDistributionDate()
        );
    }

    /**
     * BTA implied annual yield: {@code (faceValue / issuerPrice - 1) × (360 / originalTotalDays)}.
     * Mirrors the formula in {@link com.adorsys.fineract.asset.scheduler.BtaPriceAccretionScheduler}
     * so the frontend can display the issuance discount yield without recomputing it.
     */
    private BigDecimal computeBtaImpliedRate(Asset asset) {
        if (asset.getBondType() != BondType.DISCOUNT) return null;
        BigDecimal face = asset.getFaceValue();
        BigDecimal issuer = asset.getIssuerPrice();
        if (face == null || issuer == null || issuer.signum() == 0) return null;
        if (asset.getIssueDate() == null || asset.getMaturityDate() == null) return null;
        long totalDays = ChronoUnit.DAYS.between(asset.getIssueDate(), asset.getMaturityDate());
        if (totalDays <= 0) return null;
        BigDecimal discount = face.divide(issuer, 10, java.math.RoundingMode.HALF_UP)
                .subtract(BigDecimal.ONE);
        return discount.multiply(new BigDecimal(360))
                .divide(new BigDecimal(totalDays), 6, java.math.RoundingMode.HALF_UP);
    }

    /**
     * Per-unit accrued interest for OTA (coupon) bonds. Returns null for DISCOUNT bonds
     * and non-bond assets. Delegates to {@link AccruedInterestCalculator} with units = 1.
     */
    private BigDecimal computeAccruedInterestPerUnit(Asset asset) {
        if (asset.getCategory() != AssetCategory.BONDS) return null;
        if (asset.getBondType() != BondType.COUPON) return null;
        return accruedInterestCalculator.calculate(asset, BigDecimal.ONE);
    }

    /**
     * Get full asset detail by ID including Fineract IDs (admin only).
     */
    @Transactional(readOnly = true)
    public AssetDetailResponse getAssetDetailAdmin(String assetId) {
        Asset asset = assetRepository.findById(assetId)
                .orElseThrow(() -> new AssetException("Asset not found: " + assetId));

        AssetPrice price = assetPriceRepository.findById(assetId).orElse(null);

        BigDecimal available = asset.getTotalSupply().subtract(asset.getCirculatingSupply());

        // Compute LP margin metrics
        BigDecimal askPrice = price != null ? price.getAskPrice() : null;
        BigDecimal issuerPrice = asset.getIssuerPrice();
        BigDecimal lpMarginPerUnit = computeLpMarginPerUnit(askPrice, issuerPrice);
        BigDecimal lpMarginPercent = computeLpMarginPercent(lpMarginPerUnit, issuerPrice);
        BigDecimal couponAmountPerUnit = computeCouponAmountPerUnit(asset);
        BigDecimal currentYield = computeCurrentYield(asset, askPrice);

        CurrentMarketData currentMarketData = buildCurrentMarketData(asset, price, currentYield);

        return new AssetDetailResponse(
                asset.getId(), asset.getName(), asset.getSymbol(), asset.getCurrencyCode(),
                asset.getDescription(), resolveImageUrl(asset.getImageUrl()), asset.getCategory(), asset.getStatus(),
                asset.getPriceMode(),
                price != null ? price.getChange24hPercent() : null,
                price != null ? price.getDayOpen() : null,
                price != null ? price.getDayHigh() : null,
                price != null ? price.getDayLow() : null,
                price != null ? price.getDayClose() : null,
                asset.getTotalSupply(), asset.getCirculatingSupply(),
                available, asset.getTradingFeePercent(),
                asset.getDecimalPlaces(),
                asset.getIssuerName(), asset.getIssuerPrice(), asset.getFaceValue(),
                asset.getLpClientId(), asset.getLpAssetAccountId(),
                asset.getLpCashAccountId(), asset.getLpSpreadAccountId(), asset.getLpTaxAccountId(),
                asset.getFineractProductId(),
                asset.getLpClientName(), asset.getName() + " Token",
                lpMarginPerUnit, lpMarginPercent,
                asset.getCreatedAt(), asset.getUpdatedAt(),
                asset.getBondType(), asset.getDayCountConvention(), asset.getIssuerCountry(),
                asset.getIsinCode(), asset.getMaturityDate(), asset.getIssueDate(),
                asset.getInterestRate(), currentYield, asset.getCouponFrequencyMonths(),
                asset.getNextCouponDate(),
                computeResidualDays(asset.getMaturityDate()),
                couponAmountPerUnit,
                price != null ? price.getBidPrice() : null,
                price != null ? price.getAskPrice() : null,
                asset.getMaxPositionPercent(), asset.getMaxOrderSize(),
                asset.getDailyTradeLimitXaf(),
                asset.getMinOrderSize(), asset.getMinOrderCashAmount(),
                asset.getLockupDays(),
                asset.getIncomeType(), asset.getIncomeRate(),
                asset.getDistributionFrequencyMonths(), asset.getNextDistributionDate(),
                asset.getDelistingDate(), asset.getDelistingRedemptionPrice(),
                asset.getRegistrationDutyEnabled(), asset.getRegistrationDutyRate(),
                asset.getIrcmEnabled(), asset.getIrcmRateOverride(), asset.getIrcmExempt(),
                asset.getCapitalGainsTaxEnabled(), asset.getCapitalGainsRate(),
                asset.getIsBvmacListed(), asset.getIsGovernmentBond(),
                asset.getTvaEnabled(), asset.getTvaRate(),
                currentMarketData
        );
    }

    /**
     * Discover pending/upcoming assets.
     */
    @Transactional(readOnly = true)
    public Page<DiscoverAssetResponse> discoverAssets(Pageable pageable) {
        Page<Asset> assets = assetRepository.findByStatus(AssetStatus.PENDING, withIdTiebreaker(pageable));

        return assets.map(a -> new DiscoverAssetResponse(
                    a.getId(), a.getName(), a.getSymbol(), resolveImageUrl(a.getImageUrl()),
                    a.getCategory(), a.getStatus()
        ));
    }

    /**
     * List all assets for admin (all statuses), paginated.
     */
    @Transactional(readOnly = true)
    public Page<AssetResponse> listAllAssets(Pageable pageable) {
        Page<Asset> assets = assetRepository.findAll(withIdTiebreaker(pageable));
        List<String> assetIds = assets.getContent().stream().map(Asset::getId).toList();
        Map<String, AssetPrice> priceMap = assetPriceRepository.findAllByAssetIdIn(assetIds)
                .stream().collect(Collectors.toMap(AssetPrice::getAssetId, Function.identity()));

        return assets.map(a -> toAssetResponse(a, priceMap.get(a.getId())));
    }

    /**
     * Get the most recent executed trades for an asset (public, anonymous feed).
     */
    @Transactional(readOnly = true)
    public List<RecentTradeDto> getRecentTrades(String assetId) {
        return tradeLogRepository.findTop20ByAssetIdOrderByExecutedAtDesc(assetId)
                .stream()
                .map(t -> new RecentTradeDto(t.getPricePerUnit(), t.getUnits(), t.getSide(), t.getExecutedAt()))
                .toList();
    }

    /**
     * Ensures pagination stability by adding ID as a tiebreaker sort.
     */
    private Pageable withIdTiebreaker(Pageable pageable) {
        Sort sort = pageable.getSort().and(Sort.by("id"));
        return PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), sort);
    }

    private AssetResponse toAssetResponse(Asset a, AssetPrice price) {
        BigDecimal askPrice = price != null ? price.getAskPrice() : BigDecimal.ZERO;
        BigDecimal change = price != null ? price.getChange24hPercent() : null;
        BigDecimal available = a.getTotalSupply().subtract(a.getCirculatingSupply());
        BigDecimal couponAmountPerUnit = computeCouponAmountPerUnit(a);
        BigDecimal currentYield = computeCurrentYield(a, askPrice);

        return new AssetResponse(
                a.getId(), a.getName(), a.getSymbol(), resolveImageUrl(a.getImageUrl()),
                a.getCategory(), a.getStatus(), askPrice, change,
                available, a.getTotalSupply(),
                a.getIssuerName(), a.getLpClientName(), couponAmountPerUnit,
                a.getBondType(),
                a.getIsinCode(), a.getMaturityDate(), a.getIssueDate(),
                a.getInterestRate(), currentYield,
                computeResidualDays(a.getMaturityDate())
        );
    }

    /**
     * Compute the current yield for bond assets.
     * COUPON bonds: issuerPrice * interestRate / askPrice (current yield from coupons).
     * DISCOUNT bonds: (faceValue/askPrice - 1) * (dayCountBasis/daysToMaturity) * 100.
     * Returns null for non-bond assets or when askPrice is zero/null.
     */
    private BigDecimal computeCurrentYield(Asset asset, BigDecimal askPrice) {
        if (asset.getCategory() != AssetCategory.BONDS) return null;
        BigDecimal faceValue = asset.getEffectiveFaceValue();
        if (faceValue == null || askPrice == null
                || askPrice.compareTo(BigDecimal.ZERO) == 0) return null;

        if (asset.getBondType() == BondType.DISCOUNT) {
            // BTA yield: (faceValue/askPrice - 1) * (basis/daysToMaturity) * 100
            Long residualDays = computeResidualDays(asset.getMaturityDate());
            if (residualDays == null || residualDays <= 0) return null;
            int basis = asset.getDayCountConvention() != null ? asset.getDayCountConvention().getBasis() : 360;
            return faceValue
                    .divide(askPrice, 8, java.math.RoundingMode.HALF_UP)
                    .subtract(BigDecimal.ONE)
                    .multiply(BigDecimal.valueOf(basis))
                    .divide(BigDecimal.valueOf(residualDays), 4, java.math.RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    .setScale(2, java.math.RoundingMode.HALF_UP);
        }

        // COUPON bond: current yield = faceValue * rate / askPrice
        BigDecimal rate = asset.getInterestRate();
        if (rate == null) return null;
        return faceValue
                .multiply(rate)
                .divide(askPrice, 2, java.math.RoundingMode.HALF_UP);
    }

    /**
     * Compute LP margin per unit: askPrice - issuerPrice.
     */
    private BigDecimal computeLpMarginPerUnit(BigDecimal askPrice, BigDecimal issuerPrice) {
        if (askPrice == null || issuerPrice == null) return null;
        return askPrice.subtract(issuerPrice);
    }

    /**
     * Compute LP margin as a percentage of issuer price.
     */
    private BigDecimal computeLpMarginPercent(BigDecimal lpMarginPerUnit, BigDecimal issuerPrice) {
        if (lpMarginPerUnit == null || issuerPrice == null
                || issuerPrice.compareTo(BigDecimal.ZERO) == 0) return null;
        return lpMarginPerUnit
                .divide(issuerPrice, 6, java.math.RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100))
                .setScale(2, java.math.RoundingMode.HALF_UP);
    }

    /**
     * Compute coupon amount per unit per period for bond assets.
     * Formula: issuerPrice * (interestRate / 100) * (couponFrequencyMonths / 12)
     * Returns null for non-bond assets or assets with incomplete config.
     */
    private BigDecimal computeCouponAmountPerUnit(Asset asset) {
        if (asset.getCategory() != AssetCategory.BONDS) return null;
        // DISCOUNT bonds (BTA) have no coupons
        if (asset.getBondType() == BondType.DISCOUNT) return null;
        BigDecimal faceValue = asset.getEffectiveFaceValue();
        BigDecimal rate = asset.getInterestRate();
        Integer freqMonths = asset.getCouponFrequencyMonths();
        if (faceValue == null || rate == null || freqMonths == null) return null;
        return faceValue
                .multiply(rate)
                .divide(BigDecimal.valueOf(100), 4, java.math.RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(freqMonths))
                .divide(BigDecimal.valueOf(12), 0, java.math.RoundingMode.HALF_UP);
    }

    /**
     * Computes the number of days remaining until the given maturity date.
     *
     * @param maturityDate the bond's maturity date, or null for non-bond assets
     * @return days until maturity, or null if no maturity date is set
     */
    private Long computeResidualDays(LocalDate maturityDate) {
        if (maturityDate == null) return null;
        long days = ChronoUnit.DAYS.between(LocalDate.now(), maturityDate);
        return Math.max(0, days);
    }

    /**
     * Resolves an imageUrl field to a full public URL.
     * Storage keys (not starting with http) are resolved via FileStorageService.
     * Legacy full URLs and nulls are returned as-is.
     */
    String resolveImageUrl(String imageUrl) {
        if (imageUrl == null || imageUrl.isBlank()) return null;
        if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) return imageUrl;
        return fileStorageService.getPublicUrl(imageUrl);
    }

    /**
     * Build {@link CurrentMarketData} for bond assets. Returns null for non-bond assets.
     *
     * <p>For DISCOUNT (BTA) bonds: accruedInterest = 0, cleanPrice = bidPrice, dirtyPrice = bidPrice.
     * For COUPON (OTA) bonds: accruedInterest is calculated via {@link AccruedInterestCalculator}
     * and dirtyPrice = cleanPrice + accruedInterest.</p>
     */
    private CurrentMarketData buildCurrentMarketData(Asset asset, AssetPrice price, BigDecimal currentYield) {
        if (asset.getBondType() == null) return null;

        BigDecimal bidPrice = price != null ? price.getBidPrice() : null;
        BigDecimal cleanPrice = bidPrice != null ? bidPrice : BigDecimal.ZERO;

        BigDecimal accruedInterest;
        if (asset.getBondType() == BondType.DISCOUNT) {
            accruedInterest = BigDecimal.ZERO;
        } else {
            accruedInterest = accruedInterestCalculator.calculate(asset, BigDecimal.ONE);
        }

        BigDecimal dirtyPrice = cleanPrice.add(accruedInterest);

        return new CurrentMarketData(cleanPrice, accruedInterest, dirtyPrice, currentYield, LocalDate.now());
    }
}
