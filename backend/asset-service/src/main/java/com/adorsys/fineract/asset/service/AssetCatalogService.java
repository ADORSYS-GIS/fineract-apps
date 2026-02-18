package com.adorsys.fineract.asset.service;

import com.adorsys.fineract.asset.dto.*;
import com.adorsys.fineract.asset.entity.Asset;
import com.adorsys.fineract.asset.entity.AssetPrice;
import com.adorsys.fineract.asset.exception.AssetException;
import com.adorsys.fineract.asset.repository.AssetPriceRepository;
import com.adorsys.fineract.asset.repository.AssetRepository;
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

        BigDecimal currentPrice = price != null ? price.getCurrentPrice() : BigDecimal.ZERO;
        BigDecimal available = asset.getTotalSupply().subtract(asset.getCirculatingSupply());

        return new AssetPublicDetailResponse(
                asset.getId(), asset.getName(), asset.getSymbol(), asset.getCurrencyCode(),
                asset.getDescription(), asset.getImageUrl(), asset.getCategory(), asset.getStatus(),
                asset.getPriceMode(), currentPrice,
                price != null ? price.getChange24hPercent() : null,
                price != null ? price.getDayOpen() : null,
                price != null ? price.getDayHigh() : null,
                price != null ? price.getDayLow() : null,
                price != null ? price.getDayClose() : null,
                asset.getTotalSupply(), asset.getCirculatingSupply(),
                available, asset.getTradingFeePercent(), asset.getSpreadPercent(),
                asset.getDecimalPlaces(),
                asset.getSubscriptionStartDate(), asset.getSubscriptionEndDate(),
                asset.getCapitalOpenedPercent(),
                asset.getCreatedAt(), asset.getUpdatedAt(),
                asset.getIssuer(), asset.getIsinCode(), asset.getMaturityDate(),
                asset.getInterestRate(), asset.getCouponFrequencyMonths(),
                asset.getNextCouponDate(),
                computeResidualDays(asset.getMaturityDate()),
                isSubscriptionClosed(asset.getSubscriptionEndDate())
        );
    }

    /**
     * Get full asset detail by ID including Fineract IDs (admin only).
     */
    @Transactional(readOnly = true)
    public AssetDetailResponse getAssetDetailAdmin(String assetId) {
        Asset asset = assetRepository.findById(assetId)
                .orElseThrow(() -> new AssetException("Asset not found: " + assetId));

        AssetPrice price = assetPriceRepository.findById(assetId).orElse(null);

        BigDecimal currentPrice = price != null ? price.getCurrentPrice() : BigDecimal.ZERO;
        BigDecimal available = asset.getTotalSupply().subtract(asset.getCirculatingSupply());

        return new AssetDetailResponse(
                asset.getId(), asset.getName(), asset.getSymbol(), asset.getCurrencyCode(),
                asset.getDescription(), asset.getImageUrl(), asset.getCategory(), asset.getStatus(),
                asset.getPriceMode(), currentPrice,
                price != null ? price.getChange24hPercent() : null,
                price != null ? price.getDayOpen() : null,
                price != null ? price.getDayHigh() : null,
                price != null ? price.getDayLow() : null,
                price != null ? price.getDayClose() : null,
                asset.getTotalSupply(), asset.getCirculatingSupply(),
                available, asset.getTradingFeePercent(), asset.getSpreadPercent(),
                asset.getDecimalPlaces(),
                asset.getSubscriptionStartDate(), asset.getSubscriptionEndDate(),
                asset.getCapitalOpenedPercent(),
                asset.getTreasuryClientId(), asset.getTreasuryAssetAccountId(),
                asset.getTreasuryCashAccountId(), asset.getFineractProductId(),
                asset.getTreasuryClientName(), asset.getName() + " Token",
                asset.getCreatedAt(), asset.getUpdatedAt(),
                asset.getIssuer(), asset.getIsinCode(), asset.getMaturityDate(),
                asset.getInterestRate(), asset.getCouponFrequencyMonths(),
                asset.getNextCouponDate(),
                computeResidualDays(asset.getMaturityDate()),
                isSubscriptionClosed(asset.getSubscriptionEndDate())
        );
    }

    /**
     * Discover pending/upcoming assets.
     */
    @Transactional(readOnly = true)
    public Page<DiscoverAssetResponse> discoverAssets(Pageable pageable) {
        Page<Asset> assets = assetRepository.findByStatus(AssetStatus.PENDING, withIdTiebreaker(pageable));

        return assets.map(a -> {
            long daysUntilSubscription = 0;
            if (a.getSubscriptionStartDate() != null && a.getSubscriptionStartDate().isAfter(LocalDate.now())) {
                daysUntilSubscription = ChronoUnit.DAYS.between(LocalDate.now(), a.getSubscriptionStartDate());
            }
            return new DiscoverAssetResponse(
                    a.getId(), a.getName(), a.getSymbol(), a.getImageUrl(),
                    a.getCategory(), a.getStatus(), a.getSubscriptionStartDate(), daysUntilSubscription
            );
        });
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
     * Ensures pagination stability by adding ID as a tiebreaker sort.
     */
    private Pageable withIdTiebreaker(Pageable pageable) {
        Sort sort = pageable.getSort().and(Sort.by("id"));
        return PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), sort);
    }

    private AssetResponse toAssetResponse(Asset a, AssetPrice price) {
        BigDecimal currentPrice = price != null ? price.getCurrentPrice() : BigDecimal.ZERO;
        BigDecimal change = price != null ? price.getChange24hPercent() : null;
        BigDecimal available = a.getTotalSupply().subtract(a.getCirculatingSupply());

        return new AssetResponse(
                a.getId(), a.getName(), a.getSymbol(), a.getImageUrl(),
                a.getCategory(), a.getStatus(), currentPrice, change,
                available, a.getTotalSupply(),
                a.getSubscriptionStartDate(), a.getSubscriptionEndDate(),
                a.getCapitalOpenedPercent(),
                a.getIssuer(), a.getIsinCode(), a.getMaturityDate(),
                a.getInterestRate(),
                computeResidualDays(a.getMaturityDate()),
                isSubscriptionClosed(a.getSubscriptionEndDate())
        );
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
     * Checks whether the subscription period has ended.
     *
     * @param subscriptionEndDate the subscription deadline
     * @return true if ended, false if still open
     */
    private Boolean isSubscriptionClosed(LocalDate subscriptionEndDate) {
        if (subscriptionEndDate == null) return null;
        return !subscriptionEndDate.isAfter(LocalDate.now());
    }
}
