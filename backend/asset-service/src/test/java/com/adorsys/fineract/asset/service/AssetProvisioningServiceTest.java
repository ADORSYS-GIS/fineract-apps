package com.adorsys.fineract.asset.service;

import com.adorsys.fineract.asset.client.FineractClient;
import com.adorsys.fineract.asset.config.AssetServiceConfig;
import com.adorsys.fineract.asset.config.ResolvedGlAccounts;
import com.adorsys.fineract.asset.config.TaxConfig;
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
import org.mockito.Spy;
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

    @Spy private TaxConfig taxConfig = new TaxConfig();

    @Mock private AssetRepository assetRepository;
    @Mock private AssetPriceRepository assetPriceRepository;
    @Mock private com.adorsys.fineract.asset.repository.PriceHistoryRepository priceHistoryRepository;
    @Mock private com.adorsys.fineract.asset.repository.PurchaseLotRepository purchaseLotRepository;
    @Mock private com.adorsys.fineract.asset.repository.ScheduledPaymentRepository scheduledPaymentRepository;
    @Mock private FineractClient fineractClient;
    @Mock private AssetCatalogService assetCatalogService;
    @Mock private PricingService pricingService;
    @Mock private AssetServiceConfig assetServiceConfig;
    @Mock private ResolvedGlAccounts resolvedGlAccounts;
    @Mock private com.adorsys.fineract.asset.storage.FileStorageService fileStorageService;
    @Mock private CurrencyCodeGenerator currencyCodeGenerator;

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

        // Default: no orphaned Fineract resources
        lenient().when(fineractClient.findSavingsProductByShortName(anyString())).thenReturn(null);
        lenient().when(fineractClient.findSavingsProductByName(anyString())).thenReturn(null);
        lenient().when(fineractClient.getExistingCurrencies()).thenReturn(List.of());

        // Default: generator returns a code derived from the symbol (e.g. "TST" for symbol "TST")
        lenient().when(currencyCodeGenerator.generate(anyString(), any())).thenReturn("TST");
    }

    // -------------------------------------------------------------------------
    // createAsset tests
    // -------------------------------------------------------------------------

    @Test
    void createAsset_happyPath_savesAssetAndPrice() {
        CreateAssetRequest request = createAssetRequest();

        // No duplicate
        when(assetRepository.findBySymbol("TST")).thenReturn(Optional.empty());

        // Look up client display name
        when(fineractClient.getClientDisplayName(LP_CLIENT_ID)).thenReturn("Test Company");

        // Fineract: find LP savings products and provision accounts
        when(assetServiceConfig.getLpSettlementProductShortName()).thenReturn("LSAV");
        when(assetServiceConfig.getLpSpreadProductShortName()).thenReturn("LSPD");
        when(assetServiceConfig.getLpTaxProductShortName()).thenReturn("LTAX");
        when(fineractClient.findSavingsProductByShortName("LSAV")).thenReturn(50);
        when(fineractClient.findSavingsProductByShortName("LSPD")).thenReturn(51);
        when(fineractClient.findSavingsProductByShortName("LTAX")).thenReturn(52);
        when(fineractClient.provisionSavingsAccount(eq(LP_CLIENT_ID), eq(50), isNull(), isNull()))
                .thenReturn(300L);  // LP settlement (LSAV)
        when(fineractClient.provisionSavingsAccount(eq(LP_CLIENT_ID), eq(51), isNull(), isNull()))
                .thenReturn(350L);  // LP spread (LSPD)
        when(fineractClient.provisionSavingsAccount(eq(LP_CLIENT_ID), eq(52), isNull(), isNull()))
                .thenReturn(360L);  // LP tax (LTAX)

        // Fineract: register currency, create product, provision account
        when(fineractClient.createSavingsProduct(anyString(), eq("TST"), eq("TST"), eq(0), anyLong(), anyLong(), anyLong(), anyLong(), anyLong()))
                .thenReturn(10);
        when(fineractClient.provisionSavingsAccount(eq(LP_CLIENT_ID), eq(10), eq(new BigDecimal("1000")), anyLong()))
                .thenReturn(400L);

        // Return value for getAssetDetailAdmin
        AssetDetailResponse expected = stubDetailResponse();
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
        assertEquals(300L, saved.getLpCashAccountId());
        assertEquals(400L, saved.getLpAssetAccountId());
        assertEquals("Test Company", saved.getLpClientName());

        // Verify price saved (initialAskPrice from request = 110)
        verify(assetPriceRepository).save(priceCaptor.capture());
        AssetPrice savedPrice = priceCaptor.getValue();
        assertEquals(new BigDecimal("110"), savedPrice.getAskPrice());
    }

    @Test
    void createAsset_noAskBidProvided_autoDerivesFrom03PercentSpread() {
        // Request omits lpAskPrice and lpBidPrice — should auto-derive from issuerPrice ± 0.3%
        CreateAssetRequest request = new CreateAssetRequest(
                "Test Asset", "TST", "TST", "desc", null, AssetCategory.STOCKS,
                new BigDecimal("1000"), null, new BigDecimal("1000"), 0,  // issuerPrice, faceValue=null, totalSupply, decimalPlaces
                null, null,  // tradingFeePercent, spreadPercent (both default)
                null, null,  // lpAskPrice, lpBidPrice (omitted)
                LP_CLIENT_ID,
                null, null, null, null, null, null,         // exposure limits
                null, null, null,                           // bondType, dayCountConvention, issuerCountry
                null, null, null, null, null, null, null,   // issuerName, isinCode, maturityDate, issueDate, interestRate, couponFreq, nextCouponDate
                null, null, null, null,                     // income fields
                null, null, null, null, null, null, null, null, null, // tax config
                null, null);                                // tvaEnabled, tvaRate

        when(assetRepository.findBySymbol("TST")).thenReturn(Optional.empty());
        when(fineractClient.getClientDisplayName(LP_CLIENT_ID)).thenReturn("Test LP");
        when(assetServiceConfig.getLpSettlementProductShortName()).thenReturn("LSAV");
        when(assetServiceConfig.getLpSpreadProductShortName()).thenReturn("LSPD");
        when(assetServiceConfig.getLpTaxProductShortName()).thenReturn("LTAX");
        when(fineractClient.findSavingsProductByShortName("LSAV")).thenReturn(50);
        when(fineractClient.findSavingsProductByShortName("LSPD")).thenReturn(51);
        when(fineractClient.findSavingsProductByShortName("LTAX")).thenReturn(52);
        when(fineractClient.provisionSavingsAccount(eq(LP_CLIENT_ID), eq(50), isNull(), isNull())).thenReturn(300L);
        when(fineractClient.provisionSavingsAccount(eq(LP_CLIENT_ID), eq(51), isNull(), isNull())).thenReturn(350L);
        when(fineractClient.provisionSavingsAccount(eq(LP_CLIENT_ID), eq(52), isNull(), isNull())).thenReturn(360L);
        when(fineractClient.createSavingsProduct(anyString(), eq("TST"), eq("TST"), eq(0), anyLong(), anyLong(), anyLong(), anyLong(), anyLong())).thenReturn(10);
        when(fineractClient.provisionSavingsAccount(eq(LP_CLIENT_ID), eq(10), eq(new BigDecimal("1000")), anyLong())).thenReturn(400L);
        when(assetCatalogService.getAssetDetailAdmin(anyString())).thenReturn(stubDetailResponse());

        service.createAsset(request);

        // issuerPrice=1000, spread=0.003 → askPrice=1003, bidPrice=997
        verify(assetPriceRepository).save(priceCaptor.capture());
        AssetPrice savedPrice = priceCaptor.getValue();
        assertEquals(new BigDecimal("1003"), savedPrice.getAskPrice());
        assertEquals(new BigDecimal("997"), savedPrice.getBidPrice());

        // tradingFeePercent, tvaEnabled, registrationDutyEnabled should default correctly
        verify(assetRepository).save(assetCaptor.capture());
        Asset saved = assetCaptor.getValue();
        assertEquals(new BigDecimal("0.0030"), saved.getTradingFeePercent());
        assertFalse(saved.getTvaEnabled(), "TVA should be disabled by default");
        assertTrue(saved.getRegistrationDutyEnabled(), "Registration duty should be enabled by default");
    }

    @Test
    void createAsset_customSpreadPercent_derivesCorrectAskBid() {
        // spreadPercent=0.01 (1%), issuerPrice=1000 → askPrice=1010, bidPrice=990
        CreateAssetRequest request = new CreateAssetRequest(
                "Test Asset", "TST", "TST", "desc", null, AssetCategory.STOCKS,
                new BigDecimal("1000"), null, new BigDecimal("1000"), 0,  // issuerPrice, faceValue=null, totalSupply, decimalPlaces
                null, new BigDecimal("0.01"),  // tradingFeePercent=null, spreadPercent=1%
                null, null,  // lpAskPrice, lpBidPrice (omitted)
                LP_CLIENT_ID,
                null, null, null, null, null, null,         // exposure limits
                null, null, null,                           // bondType, dayCountConvention, issuerCountry
                null, null, null, null, null, null, null,   // issuerName, isinCode, maturityDate, issueDate, interestRate, couponFreq, nextCouponDate
                null, null, null, null,                     // income fields
                null, null, null, null, null, null, null, null, null, // tax config
                null, null);                                // tvaEnabled, tvaRate

        when(assetRepository.findBySymbol("TST")).thenReturn(Optional.empty());
        when(fineractClient.getClientDisplayName(LP_CLIENT_ID)).thenReturn("Test LP");
        when(assetServiceConfig.getLpSettlementProductShortName()).thenReturn("LSAV");
        when(assetServiceConfig.getLpSpreadProductShortName()).thenReturn("LSPD");
        when(assetServiceConfig.getLpTaxProductShortName()).thenReturn("LTAX");
        when(fineractClient.findSavingsProductByShortName("LSAV")).thenReturn(50);
        when(fineractClient.findSavingsProductByShortName("LSPD")).thenReturn(51);
        when(fineractClient.findSavingsProductByShortName("LTAX")).thenReturn(52);
        when(fineractClient.provisionSavingsAccount(eq(LP_CLIENT_ID), eq(50), isNull(), isNull())).thenReturn(300L);
        when(fineractClient.provisionSavingsAccount(eq(LP_CLIENT_ID), eq(51), isNull(), isNull())).thenReturn(350L);
        when(fineractClient.provisionSavingsAccount(eq(LP_CLIENT_ID), eq(52), isNull(), isNull())).thenReturn(360L);
        when(fineractClient.createSavingsProduct(anyString(), eq("TST"), eq("TST"), eq(0), anyLong(), anyLong(), anyLong(), anyLong(), anyLong())).thenReturn(10);
        when(fineractClient.provisionSavingsAccount(eq(LP_CLIENT_ID), eq(10), eq(new BigDecimal("1000")), anyLong())).thenReturn(400L);
        when(assetCatalogService.getAssetDetailAdmin(anyString())).thenReturn(stubDetailResponse());

        service.createAsset(request);

        verify(assetPriceRepository).save(priceCaptor.capture());
        AssetPrice savedPrice = priceCaptor.getValue();
        assertEquals(new BigDecimal("1010"), savedPrice.getAskPrice());
        assertEquals(new BigDecimal("990"), savedPrice.getBidPrice());
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
    void createAsset_askPriceBelowIssuerPrice_throwsBeforeFineractCalls() {
        // lpAskPrice=90 < issuerPrice=100 — should fail before any Fineract provisioning
        CreateAssetRequest request = new CreateAssetRequest(
                "Test Asset", "TST", "TST", "desc", null, AssetCategory.STOCKS,
                new BigDecimal("100"), null, new BigDecimal("1000"), 0,
                null, null,
                new BigDecimal("90"), new BigDecimal("85"),  // ask < issuerPrice
                LP_CLIENT_ID,
                null, null, null, null, null, null,
                null, null, null,
                null, null, null, null, null, null, null,
                null, null, null, null,
                null, null, null, null, null, null, null, null, null,
                null, null);

        when(assetRepository.findBySymbol("TST")).thenReturn(Optional.empty());

        AssetException ex = assertThrows(AssetException.class, () -> service.createAsset(request));
        assertTrue(ex.getMessage().contains("ask price"));
        assertTrue(ex.getMessage().contains("issuer price"));
        // No Fineract provisioning should have happened
        verify(fineractClient, never()).provisionSavingsAccount(any(), any(), any(), any());
    }

    @Test
    void createAsset_discountBondWithAskBelowIssuerPrice_throws() {
        // DISCOUNT bond with lpAskPrice < issuerPrice must still be rejected —
        // issuerPrice is the LP cost basis regardless of bond type.
        CreateAssetRequest request = new CreateAssetRequest(
                "Bond", "BTA", "BTA", null, null, AssetCategory.BONDS,
                new BigDecimal("950000"), null, new BigDecimal("100"), 0,
                null, null,
                new BigDecimal("940000"), new BigDecimal("930000"),  // ask < issuerPrice
                LP_CLIENT_ID,
                null, null, null, null,
                null, null,
                BondType.DISCOUNT, DayCountConvention.ACT_360, "CAMEROUN",
                "Republique du Cameroun", "CM1300001193", LocalDate.now().plusWeeks(52),
                null, null, null, null,
                null, null, null, null,
                null, null, null, null, null, null, null, null, null,
                null, null);

        when(assetRepository.findBySymbol("BTA")).thenReturn(Optional.empty());

        AssetException ex = assertThrows(AssetException.class, () -> service.createAsset(request));
        assertTrue(ex.getMessage().contains("ask price"));
        assertTrue(ex.getMessage().contains("issuer price"));
        verify(fineractClient, never()).provisionSavingsAccount(any(), any(), any(), any());
    }

    @Test
    void createAsset_discountBondWithAskEqualToIssuerPrice_passesAskCheck() {
        // Zero-spread (ask == issuerPrice) is a valid admin choice and must not be blocked.
        // The test verifies that NO ask-price validation exception is thrown — any other
        // exception (e.g. from downstream provisioning) is acceptable.
        CreateAssetRequest request = new CreateAssetRequest(
                "Bond", "BTA", "BTA", null, null, AssetCategory.BONDS,
                new BigDecimal("950000"), new BigDecimal("1000000"), new BigDecimal("100"), 0,
                null, null,
                new BigDecimal("950000"), new BigDecimal("940000"),  // ask == issuerPrice (zero spread)
                LP_CLIENT_ID,
                null, null, null, null,
                null, null,
                BondType.DISCOUNT, DayCountConvention.ACT_360, "CAMEROUN",
                "Republique du Cameroun", "CM1300001193", LocalDate.now().plusWeeks(52),
                null, null, null, null,
                null, null, null, null,
                null, null, null, null, null, null, null, null, null,
                null, null);

        when(assetRepository.findBySymbol("BTA")).thenReturn(Optional.empty());

        try {
            service.createAsset(request);
        } catch (AssetException e) {
            assertFalse(e.getMessage().contains("ask price"),
                    "Ask-price check must not fire when ask == issuerPrice, but got: " + e.getMessage());
        }
    }

    @Test
    void createAsset_nonBondWithBondType_throws() {
        // A STOCKS request with bondType=DISCOUNT must be rejected; bondType is only valid for BONDS.
        CreateAssetRequest request = new CreateAssetRequest(
                "Test Asset", "TST", "TST", "desc", null, AssetCategory.STOCKS,
                new BigDecimal("100"), null, new BigDecimal("1000"), 0,
                null, null,
                new BigDecimal("110"), new BigDecimal("90"),
                LP_CLIENT_ID,
                null, null, null, null, null, null,
                BondType.DISCOUNT, null, null,
                null, null, null, null, null, null, null,
                null, null, null, null,
                null, null, null, null, null, null, null, null, null,
                null, null);

        when(assetRepository.findBySymbol("TST")).thenReturn(Optional.empty());

        AssetException ex = assertThrows(AssetException.class, () -> service.createAsset(request));
        assertTrue(ex.getMessage().contains("bondType is only valid for BONDS assets"));
        verify(fineractClient, never()).provisionSavingsAccount(any(), any(), any(), any());
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
    void createAsset_generatorReturnsAlternativeCode_usedForProductAndCurrency() {
        // Simulate collision avoidance: generator returns "TSTA" instead of "TST"
        when(currencyCodeGenerator.generate(anyString(), any())).thenReturn("TSTA");
        CreateAssetRequest request = createAssetRequest();
        when(assetRepository.findBySymbol("TST")).thenReturn(Optional.empty());
        when(fineractClient.getClientDisplayName(LP_CLIENT_ID)).thenReturn("Test LP");
        when(assetServiceConfig.getLpSettlementProductShortName()).thenReturn("LSAV");
        when(assetServiceConfig.getLpSpreadProductShortName()).thenReturn("LSPD");
        when(assetServiceConfig.getLpTaxProductShortName()).thenReturn("LTAX");
        when(fineractClient.findSavingsProductByShortName("LSAV")).thenReturn(50);
        when(fineractClient.findSavingsProductByShortName("LSPD")).thenReturn(51);
        when(fineractClient.findSavingsProductByShortName("LTAX")).thenReturn(52);
        when(fineractClient.provisionSavingsAccount(eq(LP_CLIENT_ID), eq(50), isNull(), isNull())).thenReturn(300L);
        when(fineractClient.provisionSavingsAccount(eq(LP_CLIENT_ID), eq(51), isNull(), isNull())).thenReturn(350L);
        when(fineractClient.provisionSavingsAccount(eq(LP_CLIENT_ID), eq(52), isNull(), isNull())).thenReturn(360L);
        when(fineractClient.createSavingsProduct(anyString(), eq("TSTA"), eq("TSTA"), anyInt(), anyLong(), anyLong(), anyLong(), anyLong(), anyLong())).thenReturn(10);
        when(fineractClient.provisionSavingsAccount(eq(LP_CLIENT_ID), eq(10), any(), anyLong())).thenReturn(400L);
        when(assetCatalogService.getAssetDetailAdmin(anyString())).thenReturn(stubDetailResponse());

        service.createAsset(request);

        // The alternative code "TSTA" must be used when registering the currency
        verify(fineractClient).registerCurrencies(argThat(list -> list.contains("TSTA")));
        verify(assetRepository).save(assetCaptor.capture());
        assertEquals("TSTA", assetCaptor.getValue().getCurrencyCode());
    }

    @Test
    void createAsset_noSettlementProduct_throws() {
        CreateAssetRequest request = createAssetRequest();
        when(assetRepository.findBySymbol("TST")).thenReturn(Optional.empty());

        // LP settlement product not found
        when(assetServiceConfig.getLpSettlementProductShortName()).thenReturn("LSAV");
        when(fineractClient.findSavingsProductByShortName("LSAV")).thenReturn(null);

        AssetException ex = assertThrows(AssetException.class, () -> service.createAsset(request));
        assertTrue(ex.getMessage().contains("LP settlement savings product"));
    }

    @Test
    void createAsset_productCreationFails_noRollbackNeeded() {
        CreateAssetRequest request = createAssetRequest();
        when(assetRepository.findBySymbol("TST")).thenReturn(Optional.empty());

        when(assetServiceConfig.getLpSettlementProductShortName()).thenReturn("LSAV");
        when(assetServiceConfig.getLpSpreadProductShortName()).thenReturn("LSPD");
        when(assetServiceConfig.getLpTaxProductShortName()).thenReturn("LTAX");
        when(fineractClient.findSavingsProductByShortName("LSAV")).thenReturn(50);
        when(fineractClient.findSavingsProductByShortName("LSPD")).thenReturn(51);
        when(fineractClient.findSavingsProductByShortName("LTAX")).thenReturn(52);
        when(fineractClient.provisionSavingsAccount(eq(LP_CLIENT_ID), eq(50), isNull(), isNull()))
                .thenReturn(300L);
        when(fineractClient.provisionSavingsAccount(eq(LP_CLIENT_ID), eq(51), isNull(), isNull()))
                .thenReturn(350L);
        when(fineractClient.provisionSavingsAccount(eq(LP_CLIENT_ID), eq(52), isNull(), isNull()))
                .thenReturn(360L);

        when(fineractClient.createSavingsProduct(anyString(), anyString(), anyString(), anyInt(), anyLong(), anyLong(), anyLong(), anyLong(), anyLong()))
                .thenThrow(new RuntimeException("Connection timeout"));

        AssetException ex = assertThrows(AssetException.class, () -> service.createAsset(request));
        assertTrue(ex.getMessage().contains("Failed to provision asset"));
        verify(assetRepository, never()).save(any());
        verify(fineractClient, never()).deleteSavingsProduct(anyInt());
        verify(fineractClient).deregisterCurrency("TST");
    }

    @Test
    void createAsset_accountProvisioningFails_rollsBackProductAndCurrency() {
        CreateAssetRequest request = createAssetRequest();
        when(assetRepository.findBySymbol("TST")).thenReturn(Optional.empty());

        when(assetServiceConfig.getLpSettlementProductShortName()).thenReturn("LSAV");
        when(assetServiceConfig.getLpSpreadProductShortName()).thenReturn("LSPD");
        when(assetServiceConfig.getLpTaxProductShortName()).thenReturn("LTAX");
        when(fineractClient.findSavingsProductByShortName("LSAV")).thenReturn(50);
        when(fineractClient.findSavingsProductByShortName("LSPD")).thenReturn(51);
        when(fineractClient.findSavingsProductByShortName("LTAX")).thenReturn(52);
        when(fineractClient.provisionSavingsAccount(eq(LP_CLIENT_ID), eq(50), isNull(), isNull()))
                .thenReturn(300L);
        when(fineractClient.provisionSavingsAccount(eq(LP_CLIENT_ID), eq(51), isNull(), isNull()))
                .thenReturn(350L);
        when(fineractClient.provisionSavingsAccount(eq(LP_CLIENT_ID), eq(52), isNull(), isNull()))
                .thenReturn(360L);

        when(fineractClient.createSavingsProduct(anyString(), anyString(), anyString(), anyInt(), anyLong(), anyLong(), anyLong(), anyLong(), anyLong()))
                .thenReturn(10);
        when(fineractClient.provisionSavingsAccount(eq(LP_CLIENT_ID), eq(10), eq(new BigDecimal("1000")), anyLong()))
                .thenThrow(new RuntimeException("Batch API timeout"));

        AssetException ex = assertThrows(AssetException.class, () -> service.createAsset(request));
        assertTrue(ex.getMessage().contains("Failed to provision asset"));
        verify(assetRepository, never()).save(any());
        // Both product and currency should be rolled back
        verify(fineractClient).deleteSavingsProduct(10);
        verify(fineractClient).deregisterCurrency("TST");
    }

    @Test
    void createAsset_orphanFoundByShortName_adoptedSkipsProductCreation() {
        // Simulate a previously orphaned Fineract product detected via shortName (effectiveCurrencyCode).
        // The service should adopt it instead of creating a new one.
        CreateAssetRequest request = createAssetRequest();
        when(assetRepository.findBySymbol("TST")).thenReturn(Optional.empty());
        when(fineractClient.findSavingsProductByShortName("TST")).thenReturn(77);  // orphan found by shortName
        when(assetRepository.existsByFineractProductId(77)).thenReturn(false);     // no local asset for it

        when(fineractClient.getClientDisplayName(LP_CLIENT_ID)).thenReturn("Test LP");
        when(assetServiceConfig.getLpSettlementProductShortName()).thenReturn("LSAV");
        when(assetServiceConfig.getLpSpreadProductShortName()).thenReturn("LSPD");
        when(assetServiceConfig.getLpTaxProductShortName()).thenReturn("LTAX");
        when(fineractClient.findSavingsProductByShortName("LSAV")).thenReturn(50);
        when(fineractClient.findSavingsProductByShortName("LSPD")).thenReturn(51);
        when(fineractClient.findSavingsProductByShortName("LTAX")).thenReturn(52);
        when(fineractClient.provisionSavingsAccount(eq(LP_CLIENT_ID), eq(50), isNull(), isNull())).thenReturn(300L);
        when(fineractClient.provisionSavingsAccount(eq(LP_CLIENT_ID), eq(51), isNull(), isNull())).thenReturn(350L);
        when(fineractClient.provisionSavingsAccount(eq(LP_CLIENT_ID), eq(52), isNull(), isNull())).thenReturn(360L);
        when(fineractClient.provisionSavingsAccount(eq(LP_CLIENT_ID), eq(77), eq(new BigDecimal("1000")), anyLong()))
                .thenReturn(400L);
        when(assetCatalogService.getAssetDetailAdmin(anyString())).thenReturn(stubDetailResponse());

        service.createAsset(request);

        // Must NOT create a new savings product — the orphan is reused
        verify(fineractClient, never()).createSavingsProduct(any(), any(), any(), anyInt(), any(), any(), any(), any(), any());
        verify(assetRepository).save(assetCaptor.capture());
        assertEquals(77, assetCaptor.getValue().getFineractProductId());
    }

    @Test
    void createAsset_orphanFoundByName_adoptedSkipsProductCreation() {
        // Simulate orphan detection via product name fallback (shortName check returned null).
        CreateAssetRequest request = createAssetRequest();
        when(assetRepository.findBySymbol("TST")).thenReturn(Optional.empty());
        // shortName check returns null, but name check finds the orphan
        when(fineractClient.findSavingsProductByName("Test Asset Token")).thenReturn(88);
        when(assetRepository.existsByFineractProductId(88)).thenReturn(false);

        when(fineractClient.getClientDisplayName(LP_CLIENT_ID)).thenReturn("Test LP");
        when(assetServiceConfig.getLpSettlementProductShortName()).thenReturn("LSAV");
        when(assetServiceConfig.getLpSpreadProductShortName()).thenReturn("LSPD");
        when(assetServiceConfig.getLpTaxProductShortName()).thenReturn("LTAX");
        when(fineractClient.findSavingsProductByShortName("LSAV")).thenReturn(50);
        when(fineractClient.findSavingsProductByShortName("LSPD")).thenReturn(51);
        when(fineractClient.findSavingsProductByShortName("LTAX")).thenReturn(52);
        when(fineractClient.provisionSavingsAccount(eq(LP_CLIENT_ID), eq(50), isNull(), isNull())).thenReturn(300L);
        when(fineractClient.provisionSavingsAccount(eq(LP_CLIENT_ID), eq(51), isNull(), isNull())).thenReturn(350L);
        when(fineractClient.provisionSavingsAccount(eq(LP_CLIENT_ID), eq(52), isNull(), isNull())).thenReturn(360L);
        when(fineractClient.provisionSavingsAccount(eq(LP_CLIENT_ID), eq(88), eq(new BigDecimal("1000")), anyLong()))
                .thenReturn(400L);
        when(assetCatalogService.getAssetDetailAdmin(anyString())).thenReturn(stubDetailResponse());

        service.createAsset(request);

        verify(fineractClient, never()).createSavingsProduct(any(), any(), any(), anyInt(), any(), any(), any(), any(), any());
        verify(assetRepository).save(assetCaptor.capture());
        assertEquals(88, assetCaptor.getValue().getFineractProductId());
    }

    // -------------------------------------------------------------------------
    // updateAsset tests
    // -------------------------------------------------------------------------

    @Test
    void updateAsset_partialUpdate_appliesOnlyChangedFields() {
        Asset existing = activeAsset();
        when(assetRepository.findById(ASSET_ID)).thenReturn(Optional.of(existing));

        UpdateAssetRequest request = new UpdateAssetRequest(
                "New Name", null, null, null, null, null, null,
                null, null, null, null, // exposure limits (maxPosition, maxOrder, dailyLimit, lockup)
                null, null, // min order size/cash
                null, null, null, null, // income distribution
                null, null, null, // bond fields (interestRate, maturityDate, nextCouponDate)
                null, null, null, null, null, null, null, null, null, // tax config
                null, null, // tvaEnabled, tvaRate
                null, null, null, null, null, null, // PENDING-only: issuerPrice, faceValue, totalSupply, issuerName, isinCode, couponFrequencyMonths
                null, null, null); // PENDING-only: bondType, dayCountConvention, issuerCountry

        AssetDetailResponse expected = stubDetailResponse();
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
                service.updateAsset("nonexistent", new UpdateAssetRequest(null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null)));
    }

    @Test
    void updateAsset_pendingAsset_appliesCoreFields() {
        Asset pending = pendingAsset();
        when(assetRepository.findById(ASSET_ID)).thenReturn(Optional.of(pending));

        UpdateAssetRequest request = new UpdateAssetRequest(
                null, null, null, null, null, null, null,
                null, null, null, null, null, null,
                null, null, null, null,
                null, null, null,
                null, null, null, null, null, null, null, null, null, // tax config
                null, null, // tvaEnabled, tvaRate
                new BigDecimal("6000"), null, new BigDecimal("2000"), "New Issuer", "SN0000038741", 6, // PENDING-only: issuerPrice, faceValue, totalSupply, issuerName, isinCode, couponFrequencyMonths
                null, null, null); // bondType, dayCountConvention, issuerCountry


        AssetDetailResponse expected = stubDetailResponse();
        when(assetCatalogService.getAssetDetailAdmin(ASSET_ID)).thenReturn(expected);

        service.updateAsset(ASSET_ID, request);

        verify(assetRepository).save(assetCaptor.capture());
        Asset saved = assetCaptor.getValue();
        assertEquals(new BigDecimal("6000"), saved.getIssuerPrice());
        assertEquals(new BigDecimal("6000"), saved.getManualPrice());
        assertEquals(new BigDecimal("2000"), saved.getTotalSupply());
        assertEquals("New Issuer", saved.getIssuerName());
        assertEquals("SN0000038741", saved.getIsinCode());
        assertEquals(6, saved.getCouponFrequencyMonths());
    }

    @Test
    void updateAsset_activeAsset_rejectsCoreFields() {
        Asset active = activeAsset();
        when(assetRepository.findById(ASSET_ID)).thenReturn(Optional.of(active));

        UpdateAssetRequest request = new UpdateAssetRequest(
                null, null, null, null, null, null, null,
                null, null, null, null, null, null,
                null, null, null, null,
                null, null, null,
                null, null, null, null, null, null, null, null, null, // tax config
                null, null, // tvaEnabled, tvaRate
                new BigDecimal("6000"), null, null, null, null, null, // PENDING-only: issuerPrice, faceValue, totalSupply..
                null, null, null); // bondType, dayCountConvention, issuerCountry

        AssetException ex = assertThrows(AssetException.class, () -> service.updateAsset(ASSET_ID, request));
        assertTrue(ex.getMessage().contains("PENDING"));
    }

    @Test
    void updateAsset_pendingAsset_totalSupplyIncrease_depositsToLpAccount() {
        Asset pending = pendingAsset();
        pending.setTotalSupply(new BigDecimal("1000"));
        when(assetRepository.findById(ASSET_ID)).thenReturn(Optional.of(pending));
        when(resolvedGlAccounts.getAssetIssuancePaymentTypeId()).thenReturn(22L);

        UpdateAssetRequest request = new UpdateAssetRequest(
                null, null, null, null, null, null, null,
                null, null, null, null, null, null,
                null, null, null, null,
                null, null, null,
                null, null, null, null, null, null, null, null, null, // tax config
                null, null, // tvaEnabled, tvaRate
                null, null, new BigDecimal("1500"), null, null, null, // PENDING-only
                null, null, null); // bondType, dayCountConvention, issuerCountry

        AssetDetailResponse expected = stubDetailResponse();
        when(assetCatalogService.getAssetDetailAdmin(ASSET_ID)).thenReturn(expected);

        service.updateAsset(ASSET_ID, request);

        verify(fineractClient).depositToSavingsAccount(eq(LP_ASSET_ACCOUNT), eq(new BigDecimal("500")), eq(22L));
    }

    @Test
    void updateAsset_pendingAsset_totalSupplyDecrease_withdrawsFromLpAccount() {
        Asset pending = pendingAsset();
        pending.setTotalSupply(new BigDecimal("1000"));
        when(assetRepository.findById(ASSET_ID)).thenReturn(Optional.of(pending));

        UpdateAssetRequest request = new UpdateAssetRequest(
                null, null, null, null, null, null, null,
                null, null, null, null, null, null,
                null, null, null, null,
                null, null, null,
                null, null, null, null, null, null, null, null, null, // tax
                null, null, // tvaEnabled, tvaRate
                null, null, new BigDecimal("800"), null, null, null, // PENDING-only
                null, null, null); // bondType, dayCountConvention, issuerCountry

        AssetDetailResponse expected = stubDetailResponse();
        when(assetCatalogService.getAssetDetailAdmin(ASSET_ID)).thenReturn(expected);

        service.updateAsset(ASSET_ID, request);

        verify(fineractClient).withdrawFromSavingsAccount(eq(LP_ASSET_ACCOUNT), eq(new BigDecimal("200")), anyString());
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

        verify(fineractClient).depositToSavingsAccount(LP_ASSET_ACCOUNT, new BigDecimal("500"), 22L);
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
                new BigDecimal("10000"), null, new BigDecimal("100"), 0,
                null, null, new BigDecimal("11000"), new BigDecimal("9500"),
                LP_CLIENT_ID,
                null, null, null, null, // exposure limits
                null, null, // min order size/cash
                BondType.COUPON, DayCountConvention.ACT_365, null, // bondType, dayCountConvention, issuerCountry
                null, null, LocalDate.now().plusYears(1), null, new BigDecimal("5.0"), 6,
                LocalDate.now().plusMonths(6),
                null, null, null, null, // income fields
                null, null, null, null, null, null, null, null, null, // tax config
                false, null); // tvaEnabled, tvaRate


        AssetException ex = assertThrows(AssetException.class, () -> service.createAsset(request));
        assertTrue(ex.getMessage().contains("Issuer name is required"));
    }

    @Test
    void createBondAsset_invalidCouponFrequency_throws() {
        CreateAssetRequest request = new CreateAssetRequest(
                "Bond", "BND", "BND", null, null, AssetCategory.BONDS,
                new BigDecimal("10000"), null, new BigDecimal("100"), 0,
                null, null, new BigDecimal("11000"), new BigDecimal("9500"),
                LP_CLIENT_ID,
                null, null, null, null, // exposure limits
                null, null, // min order size/cash
                BondType.COUPON, DayCountConvention.ACT_365, null, // bondType, dayCountConvention, issuerCountry
                "Issuer", null, LocalDate.now().plusYears(1), null, new BigDecimal("5.0"), 5,
                LocalDate.now().plusMonths(5),
                null, null, null, null, // income fields
                null, null, null, null, null, null, null, null, null, // tax config
                false, null); // tvaEnabled, tvaRate


        AssetException ex = assertThrows(AssetException.class, () -> service.createAsset(request));
        assertTrue(ex.getMessage().contains("Coupon frequency must be"));
    }

    // -------------------------------------------------------------------------
    // deletePendingAsset tests
    // -------------------------------------------------------------------------

    @Test
    void deletePendingAsset_happyPath_deletesAllData() {
        Asset pending = pendingAsset();
        when(assetRepository.findById(ASSET_ID)).thenReturn(Optional.of(pending));
        when(fineractClient.getAccountBalance(LP_ASSET_ACCOUNT)).thenReturn(new BigDecimal("1000"));

        service.deletePendingAsset(ASSET_ID);

        // Verify Fineract cleanup
        verify(fineractClient).withdrawFromSavingsAccount(
                eq(LP_ASSET_ACCOUNT), eq(new BigDecimal("1000")), anyString());
        verify(fineractClient).closeSavingsAccount(eq(LP_ASSET_ACCOUNT), anyString());
        verify(fineractClient).closeSavingsAccount(eq(LP_CASH_ACCOUNT), anyString());
        verify(fineractClient).deleteSavingsProduct(pending.getFineractProductId());
        verify(fineractClient).deregisterCurrency("TST");

        // Verify local data deleted
        verify(scheduledPaymentRepository).deleteByAssetId(ASSET_ID);
        verify(priceHistoryRepository).deleteByAssetId(ASSET_ID);
        verify(assetPriceRepository).deleteByAssetId(ASSET_ID);
        verify(assetRepository).delete(pending);
    }

    @Test
    void deletePendingAsset_notPending_throws() {
        Asset active = activeAsset();
        when(assetRepository.findById(ASSET_ID)).thenReturn(Optional.of(active));

        AssetException ex = assertThrows(AssetException.class,
                () -> service.deletePendingAsset(ASSET_ID));
        assertTrue(ex.getMessage().contains("Only PENDING"));
        verify(assetRepository, never()).delete(any());
    }

    @Test
    void deletePendingAsset_notFound_throws() {
        when(assetRepository.findById("nonexistent")).thenReturn(Optional.empty());

        AssetException ex = assertThrows(AssetException.class,
                () -> service.deletePendingAsset("nonexistent"));
        assertTrue(ex.getMessage().contains("Asset not found"));
    }

    @Test
    void deletePendingAsset_fineractCleanupFails_stillDeletesLocal() {
        Asset pending = pendingAsset();
        when(assetRepository.findById(ASSET_ID)).thenReturn(Optional.of(pending));
        when(fineractClient.getAccountBalance(LP_ASSET_ACCOUNT))
                .thenThrow(new RuntimeException("Connection timeout"));

        service.deletePendingAsset(ASSET_ID);

        // Local deletes should still happen despite Fineract failure
        verify(scheduledPaymentRepository).deleteByAssetId(ASSET_ID);
        verify(priceHistoryRepository).deleteByAssetId(ASSET_ID);
        verify(assetPriceRepository).deleteByAssetId(ASSET_ID);
        verify(assetRepository).delete(pending);
    }

    // -------------------------------------------------------------------------
    // Bond validation tests
    // -------------------------------------------------------------------------

    @Test
    void createBondAsset_pastMaturityDate_throws() {
        CreateAssetRequest request = new CreateAssetRequest(
                "Bond", "BND", "BND", null, null, AssetCategory.BONDS,
                new BigDecimal("10000"), null, new BigDecimal("100"), 0,
                null, null, new BigDecimal("11000"), new BigDecimal("9500"),
                LP_CLIENT_ID,
                null, null, null, null, // exposure limits
                null, null, // min order size/cash
                BondType.COUPON, DayCountConvention.ACT_365, null, // bondType, dayCountConvention, issuerCountry
                "Issuer", null, LocalDate.now().minusDays(1), null, new BigDecimal("5.0"), 6,
                LocalDate.now().plusMonths(6),
                null, null, null, null, // income fields
                null, null, null, null, null, null, null, null, null, // tax config
                false, null); // tvaEnabled, tvaRate


        AssetException ex = assertThrows(AssetException.class, () -> service.createAsset(request));
        assertTrue(ex.getMessage().contains("Maturity date must be in the future"));
    }

    /** Returns a minimal real AssetDetailResponse (record is final, cannot be mocked). */
    private static AssetDetailResponse stubDetailResponse() {
        return new AssetDetailResponse(
            "stub-id", null, null, null, null, null,    // id..imageUrl
            null, null, null,                            // category, status, priceMode
            null, null, null, null, null,                // OHLC + change
            null, null, null,                            // supply
            null, null,                                  // tradingFeePercent, decimalPlaces
            null, null, null,                            // issuerName, issuerPrice, faceValue
            null, null, null, null, null, null,          // LP accounts + productId
            null, null, null, null,                      // lpClientName, fineractProductName, margins
            null, null,                                  // createdAt, updatedAt
            null, null, null,                            // bondType, dayCountConvention, issuerCountry
            null, null, null, null, null, null, null, null, null, // bond fields (isinCode, maturityDate, issueDate, interestRate, currentYield, couponFrequencyMonths, nextCouponDate, residualDays, couponAmountPerUnit)
            null, null,                                  // bidPrice, askPrice
            null, null, null, null, null, null,          // exposure limits
            null, null, null, null,                      // income fields
            null, null,                                  // delisting
            null, null, null, null, null, null, null, null, null, // tax config
            null, null,                                  // tvaEnabled, tvaRate
            null                                         // currentMarketData
        );
    }
}
