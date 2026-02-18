package com.adorsys.fineract.asset.service;

import com.adorsys.fineract.asset.dto.*;
import com.adorsys.fineract.asset.entity.Asset;
import com.adorsys.fineract.asset.entity.AssetPrice;
import com.adorsys.fineract.asset.exception.AssetException;
import com.adorsys.fineract.asset.repository.AssetPriceRepository;
import com.adorsys.fineract.asset.repository.AssetRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AssetCatalogServiceTest {

    @Mock private AssetRepository assetRepository;
    @Mock private AssetPriceRepository assetPriceRepository;

    @InjectMocks
    private AssetCatalogService assetCatalogService;

    private static final String ASSET_ID = "asset-001";

    private Asset buildAsset(String id, String symbol, AssetStatus status) {
        return Asset.builder()
                .id(id)
                .symbol(symbol)
                .currencyCode(symbol)
                .name("Test " + symbol)
                .category(AssetCategory.STOCKS)
                .status(status)
                .priceMode(PriceMode.MANUAL)
                .decimalPlaces(0)
                .totalSupply(new BigDecimal("1000"))
                .circulatingSupply(new BigDecimal("100"))
                .tradingFeePercent(new BigDecimal("0.005"))
                .spreadPercent(new BigDecimal("0.01"))
                .treasuryClientId(1L)
                .treasuryAssetAccountId(200L)
                .treasuryCashAccountId(300L)
                .fineractProductId(10)
                .createdAt(Instant.now())
                .build();
    }

    private AssetPrice buildAssetPrice(String assetId, BigDecimal price) {
        return AssetPrice.builder()
                .assetId(assetId)
                .currentPrice(price)
                .change24hPercent(new BigDecimal("2.5"))
                .updatedAt(Instant.now())
                .build();
    }

    // -------------------------------------------------------------------------
    // getAssetDetailAdmin tests
    // -------------------------------------------------------------------------

    @Test
    void getAssetDetailAdmin_existingAsset_returnsDetail() {
        // Arrange
        Asset asset = buildAsset(ASSET_ID, "TST", AssetStatus.ACTIVE);
        AssetPrice price = buildAssetPrice(ASSET_ID, new BigDecimal("500"));

        when(assetRepository.findById(ASSET_ID)).thenReturn(Optional.of(asset));
        when(assetPriceRepository.findById(ASSET_ID)).thenReturn(Optional.of(price));

        // Act
        AssetDetailResponse response = assetCatalogService.getAssetDetailAdmin(ASSET_ID);

        // Assert
        assertNotNull(response);
        assertEquals(ASSET_ID, response.id());
        assertEquals("TST", response.symbol());
        assertEquals(AssetStatus.ACTIVE, response.status());
        assertEquals(0, new BigDecimal("500").compareTo(response.currentPrice()));
        assertEquals(0, new BigDecimal("900").compareTo(response.availableSupply())); // 1000 - 100
        assertEquals(200L, response.treasuryAssetAccountId());
        assertEquals(300L, response.treasuryCashAccountId());
        assertEquals(10, response.fineractProductId());
        assertEquals("Test TST Token", response.fineractProductName());
        assertNull(response.treasuryClientName());

        verify(assetRepository).findById(ASSET_ID);
        verify(assetPriceRepository).findById(ASSET_ID);
    }

    @Test
    void getAssetDetailAdmin_nonExistentAsset_throwsAssetException() {
        // Arrange
        when(assetRepository.findById("missing-id")).thenReturn(Optional.empty());

        // Act & Assert
        AssetException ex = assertThrows(AssetException.class,
                () -> assetCatalogService.getAssetDetailAdmin("missing-id"));
        assertTrue(ex.getMessage().contains("Asset not found"));

        verify(assetRepository).findById("missing-id");
        verifyNoInteractions(assetPriceRepository);
    }

    // -------------------------------------------------------------------------
    // listAllAssets tests
    // -------------------------------------------------------------------------

    @Test
    void listAllAssets_returnsPaginatedResults() {
        // Arrange
        Pageable pageable = PageRequest.of(0, 20);
        Asset asset1 = buildAsset("a1", "AAA", AssetStatus.ACTIVE);
        Asset asset2 = buildAsset("a2", "BBB", AssetStatus.PENDING);
        Page<Asset> assetPage = new PageImpl<>(List.of(asset1, asset2), pageable, 2);

        when(assetRepository.findAll(any(Pageable.class))).thenReturn(assetPage);
        when(assetPriceRepository.findAllByAssetIdIn(List.of("a1", "a2")))
                .thenReturn(List.of(buildAssetPrice("a1", new BigDecimal("100"))));

        // Act
        Page<AssetResponse> result = assetCatalogService.listAllAssets(pageable);

        // Assert
        assertNotNull(result);
        assertEquals(2, result.getTotalElements());
        assertEquals(2, result.getContent().size());

        // First asset has a price from the price map
        AssetResponse first = result.getContent().get(0);
        assertEquals("a1", first.id());
        assertEquals(0, new BigDecimal("100").compareTo(first.currentPrice()));

        // Second asset has no price entry, so defaults to zero
        AssetResponse second = result.getContent().get(1);
        assertEquals("a2", second.id());
        assertEquals(0, BigDecimal.ZERO.compareTo(second.currentPrice()));

        verify(assetRepository).findAll(any(Pageable.class));
    }

    // -------------------------------------------------------------------------
    // listAssets (active only) tests
    // -------------------------------------------------------------------------

    @Test
    void listAssets_noFilters_returnsOnlyActiveAssets() {
        // Arrange
        Pageable pageable = PageRequest.of(0, 10);
        Asset activeAsset = buildAsset("a1", "ACT", AssetStatus.ACTIVE);
        Page<Asset> assetPage = new PageImpl<>(List.of(activeAsset), pageable, 1);

        when(assetRepository.findByStatus(eq(AssetStatus.ACTIVE), any(Pageable.class))).thenReturn(assetPage);
        when(assetPriceRepository.findAllByAssetIdIn(List.of("a1")))
                .thenReturn(Collections.emptyList());

        // Act
        Page<AssetResponse> result = assetCatalogService.listAssets(null, null, pageable);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals("a1", result.getContent().get(0).id());
        assertEquals(AssetStatus.ACTIVE, result.getContent().get(0).status());

        // Verify the correct repository method was called (status = ACTIVE)
        verify(assetRepository).findByStatus(eq(AssetStatus.ACTIVE), any(Pageable.class));
        verify(assetRepository, never()).findAll(any(Pageable.class));
    }
}
