package com.adorsys.fineract.asset.service;

import com.adorsys.fineract.asset.dto.FavoriteResponse;
import com.adorsys.fineract.asset.entity.Asset;
import com.adorsys.fineract.asset.entity.AssetPrice;
import com.adorsys.fineract.asset.entity.UserFavorite;
import com.adorsys.fineract.asset.exception.AssetException;
import com.adorsys.fineract.asset.repository.AssetPriceRepository;
import com.adorsys.fineract.asset.repository.AssetRepository;
import com.adorsys.fineract.asset.repository.UserFavoriteRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * Service for user favorites/watchlist management.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class FavoriteService {

    private final UserFavoriteRepository userFavoriteRepository;
    private final AssetRepository assetRepository;
    private final AssetPriceRepository assetPriceRepository;

    /**
     * Get user's watchlist with current prices.
     */
    @Transactional(readOnly = true)
    public List<FavoriteResponse> getFavorites(Long userId) {
        List<UserFavorite> favorites = userFavoriteRepository.findByUserId(userId);
        List<String> assetIds = favorites.stream().map(UserFavorite::getAssetId).toList();

        Map<String, Asset> assetMap = assetRepository.findAllById(assetIds)
                .stream().collect(Collectors.toMap(Asset::getId, Function.identity()));
        Map<String, AssetPrice> priceMap = assetPriceRepository.findAllByAssetIdIn(assetIds)
                .stream().collect(Collectors.toMap(AssetPrice::getAssetId, Function.identity()));

        return favorites.stream().map(f -> {
            Asset asset = assetMap.get(f.getAssetId());
            AssetPrice price = priceMap.get(f.getAssetId());
            return new FavoriteResponse(
                    f.getAssetId(),
                    asset != null ? asset.getSymbol() : null,
                    asset != null ? asset.getName() : null,
                    price != null ? price.getCurrentPrice() : BigDecimal.ZERO,
                    price != null ? price.getChange24hPercent() : null
            );
        }).toList();
    }

    /**
     * Add an asset to user's watchlist.
     */
    @Transactional
    public void addFavorite(Long userId, String assetId) {
        if (!assetRepository.existsById(assetId)) {
            throw new AssetException("Asset not found: " + assetId);
        }

        if (userFavoriteRepository.existsByUserIdAndAssetId(userId, assetId)) {
            return; // Already favorited
        }

        UserFavorite favorite = UserFavorite.builder()
                .userId(userId)
                .assetId(assetId)
                .build();

        userFavoriteRepository.save(favorite);
        log.info("Added favorite: userId={}, assetId={}", userId, assetId);
    }

    /**
     * Remove an asset from user's watchlist.
     */
    @Transactional
    public void removeFavorite(Long userId, String assetId) {
        userFavoriteRepository.deleteByUserIdAndAssetId(userId, assetId);
        log.info("Removed favorite: userId={}, assetId={}", userId, assetId);
    }
}
