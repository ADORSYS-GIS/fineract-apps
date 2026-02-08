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
import org.springframework.data.domain.Pageable;
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
        Page<Asset> assets;

        if (search != null && !search.isBlank() && category != null) {
            assets = assetRepository.searchByStatusCategoryAndNameOrSymbol(AssetStatus.ACTIVE, category, search, pageable);
        } else if (search != null && !search.isBlank()) {
            assets = assetRepository.searchByStatusAndNameOrSymbol(AssetStatus.ACTIVE, search, pageable);
        } else if (category != null) {
            assets = assetRepository.findByStatusAndCategory(AssetStatus.ACTIVE, category, pageable);
        } else {
            assets = assetRepository.findByStatus(AssetStatus.ACTIVE, pageable);
        }

        List<String> assetIds = assets.getContent().stream().map(Asset::getId).toList();
        Map<String, AssetPrice> priceMap = assetPriceRepository.findAllByAssetIdIn(assetIds)
                .stream().collect(Collectors.toMap(AssetPrice::getAssetId, Function.identity()));

        return assets.map(a -> toAssetResponse(a, priceMap.get(a.getId())));
    }

    /**
     * Get full asset detail by ID.
     */
    @Transactional(readOnly = true)
    public AssetDetailResponse getAssetDetail(String assetId) {
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
                asset.getAnnualYield(), asset.getTotalSupply(), asset.getCirculatingSupply(),
                available, asset.getTradingFeePercent(), asset.getSpreadPercent(),
                asset.getDecimalPlaces(), asset.getExpectedLaunchDate(),
                asset.getTreasuryClientId(), asset.getTreasuryAssetAccountId(),
                asset.getTreasuryCashAccountId(), asset.getFineractProductId(),
                asset.getCreatedAt(), asset.getUpdatedAt()
        );
    }

    /**
     * Discover pending/upcoming assets.
     */
    @Transactional(readOnly = true)
    public Page<DiscoverAssetResponse> discoverAssets(Pageable pageable) {
        Page<Asset> assets = assetRepository.findByStatus(AssetStatus.PENDING, pageable);

        return assets.map(a -> {
            long daysUntilLaunch = 0;
            if (a.getExpectedLaunchDate() != null && a.getExpectedLaunchDate().isAfter(LocalDate.now())) {
                daysUntilLaunch = ChronoUnit.DAYS.between(LocalDate.now(), a.getExpectedLaunchDate());
            }
            return new DiscoverAssetResponse(
                    a.getId(), a.getName(), a.getSymbol(), a.getImageUrl(),
                    a.getCategory(), a.getStatus(), a.getExpectedLaunchDate(), daysUntilLaunch
            );
        });
    }

    /**
     * List all assets for admin (all statuses).
     */
    @Transactional(readOnly = true)
    public List<AssetResponse> listAllAssets() {
        List<Asset> assets = assetRepository.findAll();
        List<String> assetIds = assets.stream().map(Asset::getId).toList();
        Map<String, AssetPrice> priceMap = assetPriceRepository.findAllByAssetIdIn(assetIds)
                .stream().collect(Collectors.toMap(AssetPrice::getAssetId, Function.identity()));

        return assets.stream().map(a -> toAssetResponse(a, priceMap.get(a.getId()))).toList();
    }

    private AssetResponse toAssetResponse(Asset a, AssetPrice price) {
        BigDecimal currentPrice = price != null ? price.getCurrentPrice() : BigDecimal.ZERO;
        BigDecimal change = price != null ? price.getChange24hPercent() : null;
        BigDecimal available = a.getTotalSupply().subtract(a.getCirculatingSupply());

        return new AssetResponse(
                a.getId(), a.getName(), a.getSymbol(), a.getImageUrl(),
                a.getCategory(), a.getStatus(), currentPrice, change,
                a.getAnnualYield(), available, a.getTotalSupply()
        );
    }
}
