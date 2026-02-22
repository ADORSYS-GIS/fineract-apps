package com.adorsys.fineract.asset.service;

import com.adorsys.fineract.asset.dto.FavoriteResponse;
import com.adorsys.fineract.asset.entity.Asset;
import com.adorsys.fineract.asset.entity.AssetPrice;
import com.adorsys.fineract.asset.entity.UserFavorite;
import com.adorsys.fineract.asset.exception.AssetException;
import com.adorsys.fineract.asset.repository.AssetPriceRepository;
import com.adorsys.fineract.asset.repository.AssetRepository;
import com.adorsys.fineract.asset.repository.UserFavoriteRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Collections;
import java.util.List;

import static com.adorsys.fineract.asset.testutil.TestDataFactory.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FavoriteServiceTest {

    @Mock private UserFavoriteRepository userFavoriteRepository;
    @Mock private AssetRepository assetRepository;
    @Mock private AssetPriceRepository assetPriceRepository;

    @InjectMocks
    private FavoriteService favoriteService;

    // -------------------------------------------------------------------------
    // getFavorites tests
    // -------------------------------------------------------------------------

    @Test
    void getFavorites_withPrices_returnsEnrichedList() {
        UserFavorite fav = UserFavorite.builder()
                .userId(USER_ID)
                .assetId(ASSET_ID)
                .createdAt(Instant.now())
                .build();
        Asset asset = activeAsset();
        AssetPrice price = assetPrice(ASSET_ID, new BigDecimal("100"));

        when(userFavoriteRepository.findByUserId(USER_ID)).thenReturn(List.of(fav));
        when(assetRepository.findAllById(List.of(ASSET_ID))).thenReturn(List.of(asset));
        when(assetPriceRepository.findAllByAssetIdIn(List.of(ASSET_ID))).thenReturn(List.of(price));

        List<FavoriteResponse> result = favoriteService.getFavorites(USER_ID);

        assertEquals(1, result.size());
        assertEquals(ASSET_ID, result.get(0).assetId());
        assertEquals("TST", result.get(0).symbol());
        assertEquals("Test Asset", result.get(0).name());
        assertEquals(new BigDecimal("100"), result.get(0).currentPrice());
    }

    @Test
    void getFavorites_emptyList_returnsEmpty() {
        when(userFavoriteRepository.findByUserId(USER_ID)).thenReturn(Collections.emptyList());

        List<FavoriteResponse> result = favoriteService.getFavorites(USER_ID);

        assertTrue(result.isEmpty());
    }

    // -------------------------------------------------------------------------
    // addFavorite tests
    // -------------------------------------------------------------------------

    @Test
    void addFavorite_newFavorite_saves() {
        when(assetRepository.existsById(ASSET_ID)).thenReturn(true);
        when(userFavoriteRepository.existsByUserIdAndAssetId(USER_ID, ASSET_ID)).thenReturn(false);

        favoriteService.addFavorite(USER_ID, ASSET_ID);

        verify(userFavoriteRepository).save(argThat(f ->
                f.getUserId().equals(USER_ID) && f.getAssetId().equals(ASSET_ID)));
    }

    @Test
    void addFavorite_alreadyExists_noop() {
        when(assetRepository.existsById(ASSET_ID)).thenReturn(true);
        when(userFavoriteRepository.existsByUserIdAndAssetId(USER_ID, ASSET_ID)).thenReturn(true);

        favoriteService.addFavorite(USER_ID, ASSET_ID);

        verify(userFavoriteRepository, never()).save(any());
    }

    @Test
    void addFavorite_assetNotFound_throws() {
        when(assetRepository.existsById("nonexistent")).thenReturn(false);

        assertThrows(AssetException.class,
                () -> favoriteService.addFavorite(USER_ID, "nonexistent"));
        verify(userFavoriteRepository, never()).save(any());
    }

    // -------------------------------------------------------------------------
    // removeFavorite tests
    // -------------------------------------------------------------------------

    @Test
    void removeFavorite_delegatesToRepository() {
        favoriteService.removeFavorite(USER_ID, ASSET_ID);

        verify(userFavoriteRepository).deleteByUserIdAndAssetId(USER_ID, ASSET_ID);
    }
}
