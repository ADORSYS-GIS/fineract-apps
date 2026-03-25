package com.adorsys.fineract.asset.client;

import com.adorsys.fineract.asset.config.AssetServiceConfig;
import com.adorsys.fineract.asset.config.ResolvedGlAccounts;
import com.adorsys.fineract.asset.config.ResolvedTaxAccounts;
import com.adorsys.fineract.asset.config.TaxConfig;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class GlAccountResolverTest {

    @Mock private FineractClient fineractClient;
    @Mock private AssetServiceConfig assetServiceConfig;

    // Real POJOs - not mocked - since they are simple data holders
    private ResolvedGlAccounts resolvedGlAccounts;
    private ResolvedTaxAccounts resolvedTaxAccounts;
    private TaxConfig taxConfig;

    private GlAccountResolver resolver;

    // GL code -> Fineract database ID mapping
    private static final Map<String, Long> GL_CODE_TO_ID = Map.ofEntries(
            Map.entry("42", 1042L),
            Map.entry("47", 1047L),
            Map.entry("48", 1048L),
            Map.entry("65", 1065L),
            Map.entry("73", 1073L),
            Map.entry("87", 1087L),
            Map.entry("88", 1088L),
            Map.entry("89", 1089L),
            Map.entry("91", 1091L),
            Map.entry("92", 1092L),
            Map.entry("93", 1093L),
            Map.entry("94", 1094L)
    );

    private static final Map<String, Long> PAYMENT_TYPE_NAME_TO_ID = Map.of(
            "Asset Issuance", 20L
    );

    @BeforeEach
    void setUp() {
        resolvedGlAccounts = new ResolvedGlAccounts();
        resolvedTaxAccounts = new ResolvedTaxAccounts();
        taxConfig = new TaxConfig();

        resolver = new GlAccountResolver(
                fineractClient, assetServiceConfig, resolvedGlAccounts, taxConfig, resolvedTaxAccounts);
        resolver.initialDelayMs = 0; // fast retries in tests

        // Default GL accounts config
        AssetServiceConfig.GlAccounts glConfig = new AssetServiceConfig.GlAccounts();
        lenient().when(assetServiceConfig.getGlAccounts()).thenReturn(glConfig);

        // Default accounting config
        AssetServiceConfig.Accounting accounting = new AssetServiceConfig.Accounting();
        lenient().when(assetServiceConfig.getAccounting()).thenReturn(accounting);
    }

    // -------------------------------------------------------------------------
    // Happy path: all GL accounts resolved
    // -------------------------------------------------------------------------

    @Test
    void run_allGlAccountsPresent_resolvesAll13Accounts() {
        setupSuccessfulResolution();

        resolver.run(null);

        assertEquals(1042L, resolvedGlAccounts.getFundSourceId());
        assertEquals(1047L, resolvedGlAccounts.getDigitalAssetInventoryId());
        assertEquals(1048L, resolvedGlAccounts.getTransfersInSuspenseId());
        assertEquals(1065L, resolvedGlAccounts.getCustomerDigitalAssetHoldingsId());
        assertEquals(1073L, resolvedGlAccounts.getAssetEquityId());
        assertEquals(1087L, resolvedGlAccounts.getIncomeFromInterestId());
        assertEquals(1088L, resolvedGlAccounts.getPlatformFeeIncomeId());
        assertEquals(1089L, resolvedGlAccounts.getSpreadIncomeId());
        assertEquals(1091L, resolvedGlAccounts.getExpenseAccountId());
        assertEquals(1092L, resolvedGlAccounts.getTaxExpenseRegDutyId());
        assertEquals(1093L, resolvedGlAccounts.getTaxExpenseCapGainsId());
        assertEquals(1094L, resolvedGlAccounts.getTaxExpenseIrcmId());
    }

    @Test
    void run_allGlAccountsPresent_resolvesNew6GlAccounts() {
        setupSuccessfulResolution();

        resolver.run(null);

        // Verify the 6 new GL accounts specifically
        assertNotNull(resolvedGlAccounts.getAssetEquityId(), "assetEquity (GL 73) should be resolved");
        assertEquals(1073L, resolvedGlAccounts.getAssetEquityId());

        assertNotNull(resolvedGlAccounts.getPlatformFeeIncomeId(), "platformFeeIncome (GL 88) should be resolved");
        assertEquals(1088L, resolvedGlAccounts.getPlatformFeeIncomeId());

        assertNotNull(resolvedGlAccounts.getSpreadIncomeId(), "spreadIncome (GL 89) should be resolved");
        assertEquals(1089L, resolvedGlAccounts.getSpreadIncomeId());

        assertNotNull(resolvedGlAccounts.getTaxExpenseRegDutyId(), "taxExpenseRegDuty (GL 92) should be resolved");
        assertEquals(1092L, resolvedGlAccounts.getTaxExpenseRegDutyId());

        assertNotNull(resolvedGlAccounts.getTaxExpenseCapGainsId(), "taxExpenseCapGains (GL 93) should be resolved");
        assertEquals(1093L, resolvedGlAccounts.getTaxExpenseCapGainsId());

        assertNotNull(resolvedGlAccounts.getTaxExpenseIrcmId(), "taxExpenseIrcm (GL 94) should be resolved");
        assertEquals(1094L, resolvedGlAccounts.getTaxExpenseIrcmId());
    }

    // -------------------------------------------------------------------------
    // Payment type resolution
    // -------------------------------------------------------------------------

    @Test
    void run_paymentTypePresent_resolvesPaymentTypeByName() {
        setupSuccessfulResolution();

        resolver.run(null);

        assertEquals(20L, resolvedGlAccounts.getAssetIssuancePaymentTypeId());
    }

    @Test
    void run_paymentTypeMissing_throwsIllegalStateException() {
        when(fineractClient.lookupGlAccounts()).thenReturn(new HashMap<>(GL_CODE_TO_ID));
        when(fineractClient.lookupPaymentTypes()).thenReturn(Map.of()); // empty - no payment types

        IllegalStateException ex = assertThrows(IllegalStateException.class,
                () -> resolver.run(null));

        assertTrue(ex.getMessage().contains("Payment type with name"));
        assertTrue(ex.getMessage().contains("Asset Issuance"));
    }

    // -------------------------------------------------------------------------
    // Missing GL code
    // -------------------------------------------------------------------------

    @Test
    void run_missingGlCode_throwsIllegalStateException() {
        Map<String, Long> incompleteGlCodes = new HashMap<>(GL_CODE_TO_ID);
        incompleteGlCodes.remove("88"); // Remove platformFeeIncome

        when(fineractClient.lookupGlAccounts()).thenReturn(incompleteGlCodes);

        IllegalStateException ex = assertThrows(IllegalStateException.class,
                () -> resolver.run(null));

        assertTrue(ex.getMessage().contains("GL account with code '88' not found"),
                "Error should mention missing GL code 88");
    }

    @Test
    void run_missingTaxExpenseGlCode_throwsIllegalStateException() {
        Map<String, Long> incompleteGlCodes = new HashMap<>(GL_CODE_TO_ID);
        incompleteGlCodes.remove("92"); // Remove taxExpenseRegDuty

        when(fineractClient.lookupGlAccounts()).thenReturn(incompleteGlCodes);

        IllegalStateException ex = assertThrows(IllegalStateException.class,
                () -> resolver.run(null));

        assertTrue(ex.getMessage().contains("GL account with code '92' not found"),
                "Error should mention missing GL code 92");
    }

    // -------------------------------------------------------------------------
    // Tax accounts resolved by external ID
    // -------------------------------------------------------------------------

    @Test
    void run_taxAccountsPresent_resolvesByExternalId() {
        setupSuccessfulResolution();

        resolver.run(null);

        assertEquals(801L, resolvedTaxAccounts.getRegistrationDutyAccountId());
        assertEquals(802L, resolvedTaxAccounts.getIrcmAccountId());
        assertEquals(803L, resolvedTaxAccounts.getCapitalGainsAccountId());
    }

    @Test
    void run_taxAccountMissing_throwsIllegalStateException() {
        when(fineractClient.lookupGlAccounts()).thenReturn(new HashMap<>(GL_CODE_TO_ID));
        when(fineractClient.lookupPaymentTypes()).thenReturn(PAYMENT_TYPE_NAME_TO_ID);
        when(fineractClient.findSavingsAccountByExternalId("PLATFORM-FEE-COLLECT")).thenReturn(900L);
        when(fineractClient.findSavingsAccountByExternalId("TAX-REG-DUTY")).thenReturn(null); // missing

        IllegalStateException ex = assertThrows(IllegalStateException.class,
                () -> resolver.run(null));

        assertTrue(ex.getMessage().contains("Tax collection savings account"),
                "Error should mention tax collection account");
        assertTrue(ex.getMessage().contains("TAX-REG-DUTY"),
                "Error should mention the external ID");
    }

    // -------------------------------------------------------------------------
    // Fee collection account resolved by external ID
    // -------------------------------------------------------------------------

    @Test
    void run_feeCollectionAccountPresent_resolvesByExternalId() {
        setupSuccessfulResolution();

        resolver.run(null);

        assertEquals(900L, resolvedGlAccounts.getFeeCollectionAccountId());
    }

    @Test
    void run_feeCollectionAccountMissing_throwsIllegalStateException() {
        when(fineractClient.lookupGlAccounts()).thenReturn(new HashMap<>(GL_CODE_TO_ID));
        when(fineractClient.lookupPaymentTypes()).thenReturn(PAYMENT_TYPE_NAME_TO_ID);
        when(fineractClient.findSavingsAccountByExternalId("PLATFORM-FEE-COLLECT")).thenReturn(null);

        IllegalStateException ex = assertThrows(IllegalStateException.class,
                () -> resolver.run(null));

        assertTrue(ex.getMessage().contains("Fee collection savings account"),
                "Error should mention fee collection account");
    }

    // -------------------------------------------------------------------------
    // Retry behavior
    // -------------------------------------------------------------------------

    @Test
    void run_fineractUnavailableThenRecovers_retriesSuccessfully() {
        // First call fails, second succeeds
        when(fineractClient.lookupGlAccounts())
                .thenThrow(new RuntimeException("Connection refused"))
                .thenReturn(new HashMap<>(GL_CODE_TO_ID));
        when(fineractClient.lookupPaymentTypes()).thenReturn(PAYMENT_TYPE_NAME_TO_ID);
        when(fineractClient.findSavingsAccountByExternalId("PLATFORM-FEE-COLLECT")).thenReturn(900L);
        when(fineractClient.findSavingsAccountByExternalId("TAX-REG-DUTY")).thenReturn(801L);
        when(fineractClient.findSavingsAccountByExternalId("TAX-IRCM")).thenReturn(802L);
        when(fineractClient.findSavingsAccountByExternalId("TAX-CAP-GAINS")).thenReturn(803L);

        // Should succeed on retry (may be slow due to Thread.sleep in retry logic)
        assertDoesNotThrow(() -> resolver.run(null));

        // lookupGlAccounts called twice (first fails, second succeeds)
        verify(fineractClient, times(2)).lookupGlAccounts();
        assertEquals(1042L, resolvedGlAccounts.getFundSourceId());
    }

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    private void setupSuccessfulResolution() {
        when(fineractClient.lookupGlAccounts()).thenReturn(new HashMap<>(GL_CODE_TO_ID));
        when(fineractClient.lookupPaymentTypes()).thenReturn(PAYMENT_TYPE_NAME_TO_ID);
        when(fineractClient.findSavingsAccountByExternalId("PLATFORM-FEE-COLLECT")).thenReturn(900L);
        when(fineractClient.findSavingsAccountByExternalId("TAX-REG-DUTY")).thenReturn(801L);
        when(fineractClient.findSavingsAccountByExternalId("TAX-IRCM")).thenReturn(802L);
        when(fineractClient.findSavingsAccountByExternalId("TAX-CAP-GAINS")).thenReturn(803L);
    }
}
