package com.adorsys.fineract.asset.service;

import com.adorsys.fineract.asset.dto.*;
import com.adorsys.fineract.asset.entity.Asset;
import com.adorsys.fineract.asset.entity.AssetPrice;
import com.adorsys.fineract.asset.exception.AssetException;
import com.adorsys.fineract.asset.entity.TradeLog;
import com.adorsys.fineract.asset.repository.AssetPriceRepository;
import com.adorsys.fineract.asset.repository.AssetRepository;
import com.adorsys.fineract.asset.repository.TradeLogRepository;
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
import java.time.LocalDate;
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
    @Mock private TradeLogRepository tradeLogRepository;
    @Mock private com.adorsys.fineract.asset.storage.FileStorageService fileStorageService;
    @Mock private AccruedInterestCalculator accruedInterestCalculator;
    @Mock private TaxService taxService;

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
                .lpClientId(1L)
                .lpAssetAccountId(200L)
                .lpCashAccountId(300L)
                .fineractProductId(10)
                .createdAt(Instant.now())
                .build();
    }

    private AssetPrice buildAssetPrice(String assetId, BigDecimal price) {
        return AssetPrice.builder()
                .assetId(assetId)
                .askPrice(price)
                .bidPrice(price)
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
        assertEquals(0, new BigDecimal("500").compareTo(response.askPrice()));
        assertEquals(0, new BigDecimal("900").compareTo(response.availableSupply())); // 1000 - 100
        assertEquals(200L, response.lpAssetAccountId());
        assertEquals(300L, response.lpCashAccountId());
        assertEquals(10, response.fineractProductId());
        assertEquals("Test TST Token", response.fineractProductName());
        assertNull(response.lpClientName());

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
        assertEquals(0, new BigDecimal("100").compareTo(first.askPrice()));

        // Second asset has no price entry, so defaults to zero
        AssetResponse second = result.getContent().get(1);
        assertEquals("a2", second.id());
        assertEquals(0, BigDecimal.ZERO.compareTo(second.askPrice()));

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

    // -------------------------------------------------------------------------
    // currentYield computation tests
    // -------------------------------------------------------------------------

    @Test
    void getAssetDetailAdmin_bondAsset_returnsCurrentYield() {
        // Arrange: bond with issuerPrice=10000, interestRate=5.80, askPrice=11000
        Asset bond = buildAsset(ASSET_ID, "BND", AssetStatus.ACTIVE);
        bond.setCategory(AssetCategory.BONDS);
        bond.setIssuerPrice(new BigDecimal("10000"));
        bond.setInterestRate(new BigDecimal("5.80"));
        bond.setIssuerName("Test Issuer");
        bond.setCouponFrequencyMonths(6);
        bond.setMaturityDate(LocalDate.now().plusYears(5));
        bond.setNextCouponDate(LocalDate.now().plusMonths(6));

        AssetPrice price = buildAssetPrice(ASSET_ID, new BigDecimal("11000"));
        when(assetRepository.findById(ASSET_ID)).thenReturn(Optional.of(bond));
        when(assetPriceRepository.findById(ASSET_ID)).thenReturn(Optional.of(price));

        // Act
        AssetDetailResponse response = assetCatalogService.getAssetDetailAdmin(ASSET_ID);

        // Assert: currentYield = 10000 * 5.80 / 11000 = 5.27 (rounded to 2dp)
        assertNotNull(response.currentYield());
        assertEquals(0, new BigDecimal("5.27").compareTo(response.currentYield()));
        // interestRate should still be present (admin view shows both)
        assertEquals(0, new BigDecimal("5.80").compareTo(response.interestRate()));
    }

    @Test
    void getAssetDetailAdmin_nonBondAsset_currentYieldIsNull() {
        Asset stock = buildAsset(ASSET_ID, "STK", AssetStatus.ACTIVE);
        AssetPrice price = buildAssetPrice(ASSET_ID, new BigDecimal("500"));

        when(assetRepository.findById(ASSET_ID)).thenReturn(Optional.of(stock));
        when(assetPriceRepository.findById(ASSET_ID)).thenReturn(Optional.of(price));

        AssetDetailResponse response = assetCatalogService.getAssetDetailAdmin(ASSET_ID);

        assertNull(response.currentYield());
    }

    @Test
    void listAllAssets_bondAsset_includesCurrentYield() {
        Pageable pageable = PageRequest.of(0, 20);
        Asset bond = buildAsset("b1", "BND", AssetStatus.ACTIVE);
        bond.setCategory(AssetCategory.BONDS);
        bond.setIssuerPrice(new BigDecimal("10000"));
        bond.setInterestRate(new BigDecimal("5.80"));
        bond.setIssuerName("Test Issuer");
        bond.setCouponFrequencyMonths(6);

        Page<Asset> assetPage = new PageImpl<>(List.of(bond), pageable, 1);
        when(assetRepository.findAll(any(Pageable.class))).thenReturn(assetPage);
        when(assetPriceRepository.findAllByAssetIdIn(List.of("b1")))
                .thenReturn(List.of(buildAssetPrice("b1", new BigDecimal("10000"))));

        Page<AssetResponse> result = assetCatalogService.listAllAssets(pageable);

        AssetResponse resp = result.getContent().get(0);
        assertNotNull(resp.currentYield());
        // askPrice == issuerPrice → currentYield == interestRate
        assertEquals(0, new BigDecimal("5.80").compareTo(resp.currentYield()));
    }

    // -------------------------------------------------------------------------
    // getRecentTrades tests
    // -------------------------------------------------------------------------

    @Test
    void getRecentTrades_withTrades_returnsMappedDtos() {
        // Arrange
        TradeLog t1 = TradeLog.builder()
                .id("t1").orderId("o1").userId(1L).assetId(ASSET_ID)
                .side(TradeSide.BUY).units(new BigDecimal("10"))
                .pricePerUnit(new BigDecimal("500")).totalAmount(new BigDecimal("5000"))
                .fee(BigDecimal.ZERO).spreadAmount(BigDecimal.ZERO)
                .executedAt(Instant.now())
                .build();
        TradeLog t2 = TradeLog.builder()
                .id("t2").orderId("o2").userId(2L).assetId(ASSET_ID)
                .side(TradeSide.SELL).units(new BigDecimal("5"))
                .pricePerUnit(new BigDecimal("510")).totalAmount(new BigDecimal("2550"))
                .fee(BigDecimal.ZERO).spreadAmount(BigDecimal.ZERO)
                .executedAt(Instant.now().minusSeconds(60))
                .build();

        when(tradeLogRepository.findTop20ByAssetIdOrderByExecutedAtDesc(ASSET_ID))
                .thenReturn(List.of(t1, t2));

        // Act
        List<RecentTradeDto> result = assetCatalogService.getRecentTrades(ASSET_ID);

        // Assert
        assertEquals(2, result.size());

        RecentTradeDto first = result.get(0);
        assertEquals(0, new BigDecimal("500").compareTo(first.price()));
        assertEquals(0, new BigDecimal("10").compareTo(first.quantity()));
        assertEquals(TradeSide.BUY, first.side());
        assertNotNull(first.executedAt());

        RecentTradeDto second = result.get(1);
        assertEquals(0, new BigDecimal("510").compareTo(second.price()));
        assertEquals(TradeSide.SELL, second.side());

        verify(tradeLogRepository).findTop20ByAssetIdOrderByExecutedAtDesc(ASSET_ID);
    }

    @Test
    void getRecentTrades_noTrades_returnsEmptyList() {
        // Arrange
        when(tradeLogRepository.findTop20ByAssetIdOrderByExecutedAtDesc(ASSET_ID))
                .thenReturn(Collections.emptyList());

        // Act
        List<RecentTradeDto> result = assetCatalogService.getRecentTrades(ASSET_ID);

        // Assert
        assertNotNull(result);
        assertTrue(result.isEmpty());

        verify(tradeLogRepository).findTop20ByAssetIdOrderByExecutedAtDesc(ASSET_ID);
    }

    // -------------------------------------------------------------------------
    // getAssetDetail — server-computed BTA per-unit projection (F5).
    // The mobile asset-detail screen relies on these three fields; client-side
    // recomputation was removed so any regression here surfaces as a null UI
    // rather than wrong tax numbers.
    // -------------------------------------------------------------------------

    private Asset buildBtaAsset(BigDecimal faceValue, BigDecimal issuerPrice) {
        return Asset.builder()
                .id(ASSET_ID)
                .symbol("BTA_2Y_2027")
                .currencyCode("BTA")
                .name("BTA 2Y 2027")
                .category(AssetCategory.BONDS)
                .bondType(BondType.DISCOUNT)
                .status(AssetStatus.ACTIVE)
                .priceMode(PriceMode.MANUAL)
                .decimalPlaces(0)
                .totalSupply(new BigDecimal("1000"))
                .circulatingSupply(new BigDecimal("0"))
                .tradingFeePercent(new BigDecimal("0.003"))
                .faceValue(faceValue)
                .issuerPrice(issuerPrice)
                .issueDate(LocalDate.of(2025, 4, 15))
                .maturityDate(LocalDate.of(2027, 4, 15))
                .createdAt(Instant.now())
                .build();
    }

    @Test
    void getAssetDetail_btaWithGain_returnsServerProjection() {
        Asset bta = buildBtaAsset(new BigDecimal("10000"), new BigDecimal("9000"));
        AssetPrice price = new AssetPrice();
        price.setAssetId(ASSET_ID);
        price.setAskPrice(new BigDecimal("9268"));

        when(assetRepository.findById(ASSET_ID)).thenReturn(Optional.of(bta));
        when(assetPriceRepository.findById(ASSET_ID)).thenReturn(Optional.of(price));
        when(taxService.getEffectiveIrcmRate(any())).thenReturn(new BigDecimal("0.165"));

        AssetPublicDetailResponse result = assetCatalogService.getAssetDetail(ASSET_ID);

        // gross = max(10000 − 9268, 0) = 732
        assertEquals(0, result.btaGrossGainPerUnit().compareTo(new BigDecimal("732")));
        // ircm = round(732 × 0.165) = round(120.78) = 121
        assertEquals(0, result.btaIrcmPerUnit().compareTo(new BigDecimal("121")));
        // net = 732 − 121 = 611
        assertEquals(0, result.btaNetGainPerUnit().compareTo(new BigDecimal("611")));
        assertEquals(0, result.ircmRate().compareTo(new BigDecimal("0.165")));
    }

    @Test
    void getAssetDetail_btaIrcmExempt_grossAndNetEqual() {
        Asset bta = buildBtaAsset(new BigDecimal("10000"), new BigDecimal("9000"));
        AssetPrice price = new AssetPrice();
        price.setAssetId(ASSET_ID);
        price.setAskPrice(new BigDecimal("9500"));

        when(assetRepository.findById(ASSET_ID)).thenReturn(Optional.of(bta));
        when(assetPriceRepository.findById(ASSET_ID)).thenReturn(Optional.of(price));
        // Asset is IRCM-exempt — TaxService returns zero.
        when(taxService.getEffectiveIrcmRate(any())).thenReturn(BigDecimal.ZERO);

        AssetPublicDetailResponse result = assetCatalogService.getAssetDetail(ASSET_ID);

        // gross = 500, ircm = 0, net = 500
        assertEquals(0, result.btaGrossGainPerUnit().compareTo(new BigDecimal("500")));
        assertEquals(0, result.btaIrcmPerUnit().compareTo(BigDecimal.ZERO));
        assertEquals(0, result.btaNetGainPerUnit().compareTo(new BigDecimal("500")));
    }

    @Test
    void getAssetDetail_stalePriceAboveFaceValue_clampsGrossAtZero() {
        Asset bta = buildBtaAsset(new BigDecimal("10000"), new BigDecimal("9000"));
        AssetPrice price = new AssetPrice();
        price.setAssetId(ASSET_ID);
        // Stale ask above face value — clamp must prevent negative gross/IRCM.
        price.setAskPrice(new BigDecimal("10500"));

        when(assetRepository.findById(ASSET_ID)).thenReturn(Optional.of(bta));
        when(assetPriceRepository.findById(ASSET_ID)).thenReturn(Optional.of(price));
        when(taxService.getEffectiveIrcmRate(any())).thenReturn(new BigDecimal("0.165"));

        AssetPublicDetailResponse result = assetCatalogService.getAssetDetail(ASSET_ID);

        assertEquals(0, result.btaGrossGainPerUnit().compareTo(BigDecimal.ZERO));
        assertEquals(0, result.btaIrcmPerUnit().compareTo(BigDecimal.ZERO));
        assertEquals(0, result.btaNetGainPerUnit().compareTo(BigDecimal.ZERO));
    }

    @Test
    void getAssetDetail_otaCouponBond_btaProjectionFieldsAllNull() {
        Asset ota = Asset.builder()
                .id(ASSET_ID)
                .symbol("OTA_5Y_2030")
                .currencyCode("OTA")
                .name("OTA 5Y 2030")
                .category(AssetCategory.BONDS)
                .bondType(BondType.COUPON)
                .status(AssetStatus.ACTIVE)
                .priceMode(PriceMode.MANUAL)
                .decimalPlaces(0)
                .totalSupply(new BigDecimal("1000"))
                .circulatingSupply(BigDecimal.ZERO)
                .tradingFeePercent(new BigDecimal("0.003"))
                .faceValue(new BigDecimal("10000"))
                .interestRate(new BigDecimal("5.80"))
                .couponFrequencyMonths(6)
                .createdAt(Instant.now())
                .build();
        AssetPrice price = new AssetPrice();
        price.setAssetId(ASSET_ID);
        price.setAskPrice(new BigDecimal("9800"));

        when(assetRepository.findById(ASSET_ID)).thenReturn(Optional.of(ota));
        when(assetPriceRepository.findById(ASSET_ID)).thenReturn(Optional.of(price));
        when(taxService.getEffectiveIrcmRate(any())).thenReturn(new BigDecimal("0.055"));
        when(accruedInterestCalculator.calculate(any(), any())).thenReturn(BigDecimal.ZERO);

        AssetPublicDetailResponse result = assetCatalogService.getAssetDetail(ASSET_ID);

        // OTA: BTA projection fields are not applicable.
        assertNull(result.btaGrossGainPerUnit());
        assertNull(result.btaIrcmPerUnit());
        assertNull(result.btaNetGainPerUnit());
        // impliedRate (BTA-only) is also null for OTA.
        assertNull(result.impliedRate());
        // accruedInterestPerUnit is OTA-applicable.
        assertNotNull(result.accruedInterestPerUnit());
    }
}
