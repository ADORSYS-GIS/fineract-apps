package com.adorsys.fineract.asset.service;

import com.adorsys.fineract.asset.client.FineractClient;
import com.adorsys.fineract.asset.config.AssetServiceConfig;
import com.adorsys.fineract.asset.config.ResolvedGlAccounts;
import com.adorsys.fineract.asset.dto.*;
import com.adorsys.fineract.asset.entity.Asset;
import com.adorsys.fineract.asset.entity.AssetPrice;
import com.adorsys.fineract.asset.exception.AssetException;
import com.adorsys.fineract.asset.repository.AssetPriceRepository;
import com.adorsys.fineract.asset.repository.AssetRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static com.adorsys.fineract.asset.testutil.TestDataFactory.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AssetProvisioningServiceTest {

    @Mock private AssetRepository assetRepository;
    @Mock private AssetPriceRepository assetPriceRepository;
    @Mock private FineractClient fineractClient;
    @Mock private AssetCatalogService assetCatalogService;
    @Mock private AssetServiceConfig assetServiceConfig;
    @Mock private ResolvedGlAccounts resolvedGlAccounts;

    @InjectMocks
    private AssetProvisioningService service;

    @Captor private ArgumentCaptor<Asset> assetCaptor;
    @Captor private ArgumentCaptor<AssetPrice> priceCaptor;

    @BeforeEach
    void setUp() {
        lenient().when(resolvedGlAccounts.getDigitalAssetInventoryId()).thenReturn(47L);
        lenient().when(resolvedGlAccounts.getCustomerDigitalAssetHoldingsId()).thenReturn(65L);
        lenient().when(resolvedGlAccounts.getTransfersInSuspenseId()).thenReturn(48L);
        lenient().when(resolvedGlAccounts.getIncomeFromInterestId()).thenReturn(87L);
        lenient().when(resolvedGlAccounts.getExpenseAccountId()).thenReturn(91L);
        lenient().when(resolvedGlAccounts.getAssetIssuancePaymentTypeId()).thenReturn(22L);
        lenient().when(assetServiceConfig.getSettlementCurrency()).thenReturn("XAF");
    }

    // -------------------------------------------------------------------------
    // createAsset tests
    // -------------------------------------------------------------------------

    @Test
    void createAsset_happyPath_savesAssetAndPrice() {
        CreateAssetRequest request = createAssetRequest();

        // No duplicate
        when(assetRepository.findBySymbol("TST")).thenReturn(Optional.empty());
        when(assetRepository.findByCurrencyCode("TST")).thenReturn(Optional.empty());

        // Look up client display name
        when(fineractClient.getClientDisplayName(TREASURY_CLIENT_ID)).thenReturn("Test Company");

        // Fineract: find XAF savings product and provision cash account
        when(assetServiceConfig.getSettlementCurrencyProductShortName()).thenReturn("VSAV");
        when(fineractClient.findSavingsProductByShortName("VSAV")).thenReturn(50);
        when(fineractClient.provisionSavingsAccount(eq(TREASURY_CLIENT_ID), eq(50), isNull(), isNull()))
                .thenReturn(300L);

        // Fineract: register currency, create product, provision account

        when(fineractClient.createSavingsProduct(anyString(), eq("TST"), eq("TST"), eq(0), eq(47L), eq(65L), eq(48L), eq(87L), eq(91L)))
                .thenReturn(10);
        when(fineractClient.provisionSavingsAccount(eq(TREASURY_CLIENT_ID), eq(10), eq(new BigDecimal("1000")), eq(22L)))
                .thenReturn(400L);

        // Return value for getAssetDetailAdmin
        AssetDetailResponse expected = mock(AssetDetailResponse.class);
        when(assetCatalogService.getAssetDetailAdmin(anyString())).thenReturn(expected);

        AssetDetailResponse result = service.createAsset(request);

        assertSame(expected, result);

        // Verify asset saved
        verify(assetRepository).save(assetCaptor.capture());
        Asset saved = assetCaptor.getValue();
        assertEquals("TST", saved.getSymbol());
        assertEquals(AssetStatus.PENDING, saved.getStatus());
        assertEquals(new BigDecimal("1000"), saved.getTotalSupply());
        assertEquals(BigDecimal.ZERO, saved.getCirculatingSupply());
        assertEquals(300L, saved.getTreasuryCashAccountId());
        assertEquals(400L, saved.getTreasuryAssetAccountId());
        assertEquals("Test Company", saved.getTreasuryClientName());

        // Verify price saved
        verify(assetPriceRepository).save(priceCaptor.capture());
        AssetPrice savedPrice = priceCaptor.getValue();
        assertEquals(new BigDecimal("100"), savedPrice.getCurrentPrice());
    }

    @Test
    void createAsset_duplicateSymbol_throws() {
        CreateAssetRequest request = createAssetRequest();
        when(assetRepository.findBySymbol("TST")).thenReturn(Optional.of(activeAsset()));

        AssetException ex = assertThrows(AssetException.class, () -> service.createAsset(request));
        assertTrue(ex.getMessage().contains("Symbol already exists"));
        verify(fineractClient, never()).getClientSavingsAccounts(anyLong());
    }

    @Test
    void createAsset_duplicateCurrencyCode_throws() {
        CreateAssetRequest request = createAssetRequest();
        when(assetRepository.findBySymbol("TST")).thenReturn(Optional.empty());
        when(assetRepository.findByCurrencyCode("TST")).thenReturn(Optional.of(activeAsset()));

        AssetException ex = assertThrows(AssetException.class, () -> service.createAsset(request));
        assertTrue(ex.getMessage().contains("Currency code already exists"));
    }

    @Test
    void createAsset_noSettlementProduct_throws() {
        CreateAssetRequest request = createAssetRequest();
        when(assetRepository.findBySymbol("TST")).thenReturn(Optional.empty());
        when(assetRepository.findByCurrencyCode("TST")).thenReturn(Optional.empty());

        // Settlement product not found
        when(assetServiceConfig.getSettlementCurrencyProductShortName()).thenReturn("VSAV");
        when(fineractClient.findSavingsProductByShortName("VSAV")).thenReturn(null);

        AssetException ex = assertThrows(AssetException.class, () -> service.createAsset(request));
        assertTrue(ex.getMessage().contains("Settlement currency savings product"));
    }

    @Test
    void createAsset_productCreationFails_noRollbackNeeded() {
        CreateAssetRequest request = createAssetRequest();
        when(assetRepository.findBySymbol("TST")).thenReturn(Optional.empty());
        when(assetRepository.findByCurrencyCode("TST")).thenReturn(Optional.empty());

        when(assetServiceConfig.getSettlementCurrencyProductShortName()).thenReturn("VSAV");
        when(fineractClient.findSavingsProductByShortName("VSAV")).thenReturn(50);
        when(fineractClient.provisionSavingsAccount(eq(TREASURY_CLIENT_ID), eq(50), isNull(), isNull()))
                .thenReturn(300L);

        when(fineractClient.createSavingsProduct(anyString(), anyString(), anyString(), anyInt(), anyLong(), anyLong(), anyLong(), anyLong(), anyLong()))
                .thenThrow(new RuntimeException("Connection timeout"));

        AssetException ex = assertThrows(AssetException.class, () -> service.createAsset(request));
        assertTrue(ex.getMessage().contains("Failed to provision asset"));
        verify(assetRepository, never()).save(any());
        // productId is null when createSavingsProduct fails, so no product rollback
        verify(fineractClient, never()).deleteSavingsProduct(anyInt());
        // Currency was registered before product creation, so it should be deregistered
        verify(fineractClient).deregisterCurrency("TST");
    }

    @Test
    void createAsset_accountProvisioningFails_rollsBackProductAndCurrency() {
        CreateAssetRequest request = createAssetRequest();
        when(assetRepository.findBySymbol("TST")).thenReturn(Optional.empty());
        when(assetRepository.findByCurrencyCode("TST")).thenReturn(Optional.empty());

        when(assetServiceConfig.getSettlementCurrencyProductShortName()).thenReturn("VSAV");
        when(fineractClient.findSavingsProductByShortName("VSAV")).thenReturn(50);
        when(fineractClient.provisionSavingsAccount(eq(TREASURY_CLIENT_ID), eq(50), isNull(), isNull()))
                .thenReturn(300L);

        when(fineractClient.createSavingsProduct(anyString(), anyString(), anyString(), anyInt(), anyLong(), anyLong(), anyLong(), anyLong(), anyLong()))
                .thenReturn(10);
        when(fineractClient.provisionSavingsAccount(eq(TREASURY_CLIENT_ID), eq(10), eq(new BigDecimal("1000")), eq(22L)))
                .thenThrow(new RuntimeException("Batch API timeout"));

        AssetException ex = assertThrows(AssetException.class, () -> service.createAsset(request));
        assertTrue(ex.getMessage().contains("Failed to provision asset"));
        verify(assetRepository, never()).save(any());
        // Both product and currency should be rolled back
        verify(fineractClient).deleteSavingsProduct(10);
        verify(fineractClient).deregisterCurrency("TST");
    }

    // -------------------------------------------------------------------------
    // updateAsset tests
    // -------------------------------------------------------------------------

    @Test
    void updateAsset_partialUpdate_appliesOnlyChangedFields() {
        Asset existing = activeAsset();
        when(assetRepository.findById(ASSET_ID)).thenReturn(Optional.of(existing));

        UpdateAssetRequest request = new UpdateAssetRequest(
                "New Name", null, null, null, null, null, null, null, null,
                null, null, null, null, // exposure limits
                null, null); // bond fields

        AssetDetailResponse expected = mock(AssetDetailResponse.class);
        when(assetCatalogService.getAssetDetailAdmin(ASSET_ID)).thenReturn(expected);

        service.updateAsset(ASSET_ID, request);

        verify(assetRepository).save(assetCaptor.capture());
        assertEquals("New Name", assetCaptor.getValue().getName());
        // Other fields unchanged — description was not set in request, so stays as-is
        assertEquals(existing.getDescription(), assetCaptor.getValue().getDescription());
    }

    @Test
    void updateAsset_notFound_throws() {
        when(assetRepository.findById("nonexistent")).thenReturn(Optional.empty());
        assertThrows(AssetException.class, () ->
                service.updateAsset("nonexistent", new UpdateAssetRequest(null, null, null, null, null, null, null, null, null, null, null, null, null, null, null)));
    }

    // -------------------------------------------------------------------------
    // activateAsset tests
    // -------------------------------------------------------------------------

    @Test
    void activateAsset_pendingToActive() {
        Asset pending = pendingAsset();
        when(assetRepository.findById(ASSET_ID)).thenReturn(Optional.of(pending));

        service.activateAsset(ASSET_ID);

        verify(assetRepository).save(assetCaptor.capture());
        assertEquals(AssetStatus.ACTIVE, assetCaptor.getValue().getStatus());
    }

    @Test
    void activateAsset_notPending_throws() {
        Asset active = activeAsset();
        when(assetRepository.findById(ASSET_ID)).thenReturn(Optional.of(active));

        AssetException ex = assertThrows(AssetException.class, () -> service.activateAsset(ASSET_ID));
        assertTrue(ex.getMessage().contains("must be PENDING"));
    }

    // -------------------------------------------------------------------------
    // haltAsset tests
    // -------------------------------------------------------------------------

    @Test
    void haltAsset_activeToHalted() {
        Asset active = activeAsset();
        when(assetRepository.findById(ASSET_ID)).thenReturn(Optional.of(active));

        service.haltAsset(ASSET_ID);

        verify(assetRepository).save(assetCaptor.capture());
        assertEquals(AssetStatus.HALTED, assetCaptor.getValue().getStatus());
    }

    @Test
    void haltAsset_notActive_throws() {
        Asset pending = pendingAsset();
        when(assetRepository.findById(ASSET_ID)).thenReturn(Optional.of(pending));

        AssetException ex = assertThrows(AssetException.class, () -> service.haltAsset(ASSET_ID));
        assertTrue(ex.getMessage().contains("must be ACTIVE"));
    }

    // -------------------------------------------------------------------------
    // mintSupply tests
    // -------------------------------------------------------------------------

    @Test
    void mintSupply_happyPath_updatesSupplyAndDeposits() {
        Asset active = activeAsset();
        when(assetRepository.findById(ASSET_ID)).thenReturn(Optional.of(active));


        MintSupplyRequest request = new MintSupplyRequest(new BigDecimal("500"));
        service.mintSupply(ASSET_ID, request);

        verify(fineractClient).depositToSavingsAccount(TREASURY_ASSET_ACCOUNT, new BigDecimal("500"), 22L);
        verify(assetRepository).save(assetCaptor.capture());
        assertEquals(new BigDecimal("1500"), assetCaptor.getValue().getTotalSupply());
    }

    // -------------------------------------------------------------------------
    // resumeAsset tests
    // -------------------------------------------------------------------------

    @Test
    void resumeAsset_haltedToActive() {
        Asset halted = haltedAsset();
        when(assetRepository.findById(ASSET_ID)).thenReturn(Optional.of(halted));

        service.resumeAsset(ASSET_ID);

        verify(assetRepository).save(assetCaptor.capture());
        assertEquals(AssetStatus.ACTIVE, assetCaptor.getValue().getStatus());
    }

    @Test
    void resumeAsset_notHalted_throws() {
        Asset active = activeAsset();
        when(assetRepository.findById(ASSET_ID)).thenReturn(Optional.of(active));

        AssetException ex = assertThrows(AssetException.class, () -> service.resumeAsset(ASSET_ID));
        assertTrue(ex.getMessage().contains("must be HALTED"));
    }

    // -------------------------------------------------------------------------
    // Bond validation tests
    // -------------------------------------------------------------------------

    @Test
    void createBondAsset_missingIssuer_throws() {
        CreateAssetRequest request = new CreateAssetRequest(
                "Bond", "BND", "BND", null, null, AssetCategory.BONDS,
                new BigDecimal("10000"), new BigDecimal("100"), 0,
                null, null, LocalDate.now().minusMonths(1), LocalDate.now().plusYears(1), null,
                TREASURY_CLIENT_ID,
                null, null, null, null, // exposure limits
                null, null, LocalDate.now().plusYears(1), new BigDecimal("5.0"), 6,
                LocalDate.now().plusMonths(6)
        );

        AssetException ex = assertThrows(AssetException.class, () -> service.createAsset(request));
        assertTrue(ex.getMessage().contains("Issuer is required"));
    }

    @Test
    void createBondAsset_invalidCouponFrequency_throws() {
        CreateAssetRequest request = new CreateAssetRequest(
                "Bond", "BND", "BND", null, null, AssetCategory.BONDS,
                new BigDecimal("10000"), new BigDecimal("100"), 0,
                null, null, LocalDate.now().minusMonths(1), LocalDate.now().plusYears(1), null,
                TREASURY_CLIENT_ID,
                null, null, null, null, // exposure limits
                "Issuer", null, LocalDate.now().plusYears(1), new BigDecimal("5.0"), 5,
                LocalDate.now().plusMonths(5)
        );

        AssetException ex = assertThrows(AssetException.class, () -> service.createAsset(request));
        assertTrue(ex.getMessage().contains("Coupon frequency must be"));
    }

    @Test
    void createAsset_subscriptionEndBeforeStart_throws() {
        CreateAssetRequest request = new CreateAssetRequest(
                "Token", "TKN", "TKN", null, null, AssetCategory.STOCKS,
                new BigDecimal("10000"), new BigDecimal("100"), 0,
                null, null, LocalDate.now().plusYears(1), LocalDate.now().minusDays(1), null,
                TREASURY_CLIENT_ID,
                null, null, null, null, // exposure limits
                null, null, null, null, null, null // bond fields
        );

        AssetException ex = assertThrows(AssetException.class, () -> service.createAsset(request));
        assertTrue(ex.getMessage().contains("Subscription end date must be on or after the start date"));
    }

    @Test
    void updateAsset_subscriptionEndBeforeStart_throws() {
        Asset existing = activeAsset();
        when(assetRepository.findById(ASSET_ID)).thenReturn(Optional.of(existing));

        UpdateAssetRequest request = new UpdateAssetRequest(
                null, null, null, null, null, null,
                LocalDate.now().plusYears(1), LocalDate.now().minusDays(1), null,
                null, null, null, null, // exposure limits
                null, null); // bond fields

        AssetException ex = assertThrows(AssetException.class, () -> service.updateAsset(ASSET_ID, request));
        assertTrue(ex.getMessage().contains("Subscription end date must be on or after the start date"));
    }

    @Test
    void createBondAsset_pastMaturityDate_throws() {
        CreateAssetRequest request = new CreateAssetRequest(
                "Bond", "BND", "BND", null, null, AssetCategory.BONDS,
                new BigDecimal("10000"), new BigDecimal("100"), 0,
                null, null, LocalDate.now().minusMonths(1), LocalDate.now().plusYears(1), null,
                TREASURY_CLIENT_ID,
                null, null, null, null, // exposure limits
                "Issuer", null, LocalDate.now().minusDays(1), new BigDecimal("5.0"), 6,
                LocalDate.now().plusMonths(6)
        );

        AssetException ex = assertThrows(AssetException.class, () -> service.createAsset(request));
        assertTrue(ex.getMessage().contains("Maturity date must be in the future"));
    }
}
