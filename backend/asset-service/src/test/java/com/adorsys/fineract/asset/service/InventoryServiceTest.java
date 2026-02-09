package com.adorsys.fineract.asset.service;

import com.adorsys.fineract.asset.dto.AssetCategory;
import com.adorsys.fineract.asset.dto.AssetStatus;
import com.adorsys.fineract.asset.dto.InventoryResponse;
import com.adorsys.fineract.asset.dto.PriceMode;
import com.adorsys.fineract.asset.entity.Asset;
import com.adorsys.fineract.asset.entity.AssetPrice;
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

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class InventoryServiceTest {

    @Mock private AssetRepository assetRepository;
    @Mock private AssetPriceRepository assetPriceRepository;

    @InjectMocks
    private InventoryService inventoryService;

    private Asset buildAsset(String id, String symbol, BigDecimal totalSupply, BigDecimal circulatingSupply) {
        return Asset.builder()
                .id(id)
                .symbol(symbol)
                .currencyCode(symbol)
                .name("Test " + symbol)
                .category(AssetCategory.STOCKS)
                .status(AssetStatus.ACTIVE)
                .priceMode(PriceMode.MANUAL)
                .decimalPlaces(0)
                .totalSupply(totalSupply)
                .circulatingSupply(circulatingSupply)
                .tradingFeePercent(new BigDecimal("0.005"))
                .spreadPercent(new BigDecimal("0.01"))
                .treasuryClientId(1L)
                .treasuryAssetAccountId(200L)
                .treasuryCashAccountId(300L)
                .fineractProductId(10)
                .createdAt(Instant.now())
                .build();
    }

    // -------------------------------------------------------------------------
    // getInventory tests
    // -------------------------------------------------------------------------

    @Test
    void getInventory_returnsAllAssetsWithSupplyStats() {
        // Arrange
        Pageable pageable = PageRequest.of(0, 20);
        Asset asset1 = buildAsset("a1", "TST", new BigDecimal("1000"), new BigDecimal("400"));
        Asset asset2 = buildAsset("a2", "GLD", new BigDecimal("500"), new BigDecimal("100"));
        Page<Asset> assetPage = new PageImpl<>(List.of(asset1, asset2), pageable, 2);

        AssetPrice price1 = AssetPrice.builder()
                .assetId("a1").currentPrice(new BigDecimal("200")).updatedAt(Instant.now()).build();
        AssetPrice price2 = AssetPrice.builder()
                .assetId("a2").currentPrice(new BigDecimal("5000")).updatedAt(Instant.now()).build();

        when(assetRepository.findAll(pageable)).thenReturn(assetPage);
        when(assetPriceRepository.findAllByAssetIdIn(List.of("a1", "a2")))
                .thenReturn(List.of(price1, price2));

        // Act
        Page<InventoryResponse> result = inventoryService.getInventory(pageable);

        // Assert
        assertNotNull(result);
        assertEquals(2, result.getTotalElements());

        // Asset 1: totalSupply=1000, circulating=400, available=600, price=200, tvl=400*200=80000
        InventoryResponse inv1 = result.getContent().get(0);
        assertEquals("a1", inv1.assetId());
        assertEquals("TST", inv1.symbol());
        assertEquals(0, new BigDecimal("1000").compareTo(inv1.totalSupply()));
        assertEquals(0, new BigDecimal("400").compareTo(inv1.circulatingSupply()));
        assertEquals(0, new BigDecimal("600").compareTo(inv1.availableSupply()));
        assertEquals(0, new BigDecimal("200").compareTo(inv1.currentPrice()));
        assertEquals(0, new BigDecimal("80000").compareTo(inv1.totalValueLocked()));

        // Asset 2: totalSupply=500, circulating=100, available=400, price=5000, tvl=100*5000=500000
        InventoryResponse inv2 = result.getContent().get(1);
        assertEquals("a2", inv2.assetId());
        assertEquals(0, new BigDecimal("400").compareTo(inv2.availableSupply()));
        assertEquals(0, new BigDecimal("500000").compareTo(inv2.totalValueLocked()));

        verify(assetRepository).findAll(pageable);
        verify(assetPriceRepository).findAllByAssetIdIn(List.of("a1", "a2"));
    }

    @Test
    void getInventory_emptyRepository_returnsEmptyPage() {
        // Arrange
        Pageable pageable = PageRequest.of(0, 20);
        Page<Asset> emptyPage = new PageImpl<>(Collections.emptyList(), pageable, 0);

        when(assetRepository.findAll(pageable)).thenReturn(emptyPage);
        when(assetPriceRepository.findAllByAssetIdIn(Collections.emptyList()))
                .thenReturn(Collections.emptyList());

        // Act
        Page<InventoryResponse> result = inventoryService.getInventory(pageable);

        // Assert
        assertNotNull(result);
        assertEquals(0, result.getTotalElements());
        assertTrue(result.getContent().isEmpty());

        verify(assetRepository).findAll(pageable);
    }
}
