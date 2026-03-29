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

    // GL code -> Fineract database ID mapping (SYSCOHADA-aligned)
    private static final Map<String, Long> GL_CODE_TO_ID = Map.ofEntries(
            // Client
            Map.entry("502", 1502L),    // fundSource (Azamra Cash Register)
            Map.entry("4101", 4101L),   // savingsControl (Client Savings Control)
            Map.entry("4102", 4102L),   // customerDigitalAssetHoldings
            // LP
            Map.entry("4011", 4011L),   // lpSettlementControl
            Map.entry("4012", 4012L),   // lpSpreadPayable
            Map.entry("4013", 4013L),   // lpTaxWithholding
            Map.entry("5011", 5011L),   // lpFundSource (UBA Bank Trust)
            // Trust
            Map.entry("5001", 5001L),   // mtnMoMo
            Map.entry("5002", 5002L),   // orangeMoney
            Map.entry("5012", 5012L),   // afrilandBank
            // Inventory & suspense
            Map.entry("301", 1301L),    // digitalAssetInventory
            Map.entry("4501", 4501L),   // transfersInSuspense
            // Income
            Map.entry("701", 1701L),    // platformFeeIncome + incomeFromInterest + feeIncome
            Map.entry("702", 1702L),    // spreadIncome
            // Expense
            Map.entry("601", 1601L),    // expenseAccount
            Map.entry("608", 1608L),    // taxExpenseRegDuty + taxExpenseCapGains + taxExpenseIrcm + taxExpenseTva
            // Equity
            Map.entry("103", 1103L),    // assetEquity
            // Platform
            Map.entry("4201", 4201L),   // platformFeePayable
            // Tax payable
            Map.entry("5031", 5031L)    // taxPayableFundSource
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

        // Client
        assertEquals(1502L, resolvedGlAccounts.getFundSourceId());
        assertEquals(4101L, resolvedGlAccounts.getSavingsControlId());
        assertEquals(4102L, resolvedGlAccounts.getCustomerDigitalAssetHoldingsId());
        // LP
        assertEquals(4011L, resolvedGlAccounts.getLpSettlementControlId());
        assertEquals(4012L, resolvedGlAccounts.getLpSpreadPayableId());
        assertEquals(4013L, resolvedGlAccounts.getLpTaxWithholdingId());
        assertEquals(5011L, resolvedGlAccounts.getLpFundSourceId());
        // Trust
        assertEquals(5001L, resolvedGlAccounts.getMtnMoMoId());
        assertEquals(5002L, resolvedGlAccounts.getOrangeMoneyId());
        assertEquals(5011L, resolvedGlAccounts.getUbaBankId());
        assertEquals(5012L, resolvedGlAccounts.getAfrilandBankId());
        // Inventory & suspense
        assertEquals(1301L, resolvedGlAccounts.getDigitalAssetInventoryId());
        assertEquals(4501L, resolvedGlAccounts.getTransfersInSuspenseId());
        // Income
        assertEquals(1701L, resolvedGlAccounts.getPlatformFeeIncomeId());
        assertEquals(1702L, resolvedGlAccounts.getSpreadIncomeId());
        assertEquals(1701L, resolvedGlAccounts.getIncomeFromInterestId());
        assertEquals(1701L, resolvedGlAccounts.getFeeIncomeId());
        // Expense
        assertEquals(1601L, resolvedGlAccounts.getExpenseAccountId());
        assertEquals(1608L, resolvedGlAccounts.getTaxExpenseRegDutyId());
        assertEquals(1608L, resolvedGlAccounts.getTaxExpenseCapGainsId());
        assertEquals(1608L, resolvedGlAccounts.getTaxExpenseIrcmId());
        assertEquals(1608L, resolvedGlAccounts.getTaxExpenseTvaId());
        // Equity
        assertEquals(1103L, resolvedGlAccounts.getAssetEquityId());
        // Tax payable
        assertEquals(5031L, resolvedGlAccounts.getTaxPayableFundSourceId());
    }

    @Test
    void run_allGlAccountsPresent_resolvesNew6GlAccounts() {
        setupSuccessfulResolution();

        resolver.run(null);

        // Verify the LP-specific GL accounts
        assertNotNull(resolvedGlAccounts.getLpSettlementControlId(), "lpSettlementControl (GL 4011) should be resolved");
        assertEquals(4011L, resolvedGlAccounts.getLpSettlementControlId());

        assertNotNull(resolvedGlAccounts.getLpSpreadPayableId(), "lpSpreadPayable (GL 4012) should be resolved");
        assertEquals(4012L, resolvedGlAccounts.getLpSpreadPayableId());

        assertNotNull(resolvedGlAccounts.getLpTaxWithholdingId(), "lpTaxWithholding (GL 4013) should be resolved");
        assertEquals(4013L, resolvedGlAccounts.getLpTaxWithholdingId());

        assertNotNull(resolvedGlAccounts.getLpFundSourceId(), "lpFundSource (GL 5011) should be resolved");
        assertEquals(5011L, resolvedGlAccounts.getLpFundSourceId());

        assertNotNull(resolvedGlAccounts.getTaxPayableFundSourceId(), "taxPayableFundSource (GL 5031) should be resolved");
        assertEquals(5031L, resolvedGlAccounts.getTaxPayableFundSourceId());

        assertNotNull(resolvedGlAccounts.getTaxExpenseTvaId(), "taxExpenseTva (GL 608) should be resolved");
        assertEquals(1608L, resolvedGlAccounts.getTaxExpenseTvaId());
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
        incompleteGlCodes.remove("4011"); // Remove lpSettlementControl

        when(fineractClient.lookupGlAccounts()).thenReturn(incompleteGlCodes);

        IllegalStateException ex = assertThrows(IllegalStateException.class,
                () -> resolver.run(null));

        assertTrue(ex.getMessage().contains("GL account with code '4011' not found"),
                "Error should mention missing GL code 4011");
    }

    @Test
    void run_missingTaxExpenseGlCode_throwsIllegalStateException() {
        Map<String, Long> incompleteGlCodes = new HashMap<>(GL_CODE_TO_ID);
        incompleteGlCodes.remove("5031"); // Remove taxPayableFundSource

        when(fineractClient.lookupGlAccounts()).thenReturn(incompleteGlCodes);

        IllegalStateException ex = assertThrows(IllegalStateException.class,
                () -> resolver.run(null));

        assertTrue(ex.getMessage().contains("GL account with code '5031' not found"),
                "Error should mention missing GL code 5031");
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
        assertEquals(804L, resolvedTaxAccounts.getTvaAccountId());
    }

    @Test
    void run_clearingAccountPresent_resolvesByExternalId() {
        setupSuccessfulResolution();

        resolver.run(null);

        assertEquals(901L, resolvedGlAccounts.getClearingAccountId());
    }

    @Test
    void run_taxAccountMissing_throwsIllegalStateException() {
        when(fineractClient.lookupGlAccounts()).thenReturn(new HashMap<>(GL_CODE_TO_ID));
        when(fineractClient.lookupPaymentTypes()).thenReturn(PAYMENT_TYPE_NAME_TO_ID);
        when(fineractClient.findSavingsAccountByExternalId("PLATFORM-FEE-COLLECT")).thenReturn(900L);
        when(fineractClient.findSavingsAccountByExternalId("PLATFORM-CLEARING")).thenReturn(901L);
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
        when(fineractClient.findSavingsAccountByExternalId("PLATFORM-CLEARING")).thenReturn(901L);
        when(fineractClient.findSavingsAccountByExternalId("TAX-REG-DUTY")).thenReturn(801L);
        when(fineractClient.findSavingsAccountByExternalId("TAX-IRCM")).thenReturn(802L);
        when(fineractClient.findSavingsAccountByExternalId("TAX-CAP-GAINS")).thenReturn(803L);
        when(fineractClient.findSavingsAccountByExternalId("TAX-TVA")).thenReturn(804L);

        // Should succeed on retry (may be slow due to Thread.sleep in retry logic)
        assertDoesNotThrow(() -> resolver.run(null));

        // lookupGlAccounts called twice (first fails, second succeeds)
        verify(fineractClient, times(2)).lookupGlAccounts();
        assertEquals(1502L, resolvedGlAccounts.getFundSourceId());
    }

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    private void setupSuccessfulResolution() {
        when(fineractClient.lookupGlAccounts()).thenReturn(new HashMap<>(GL_CODE_TO_ID));
        when(fineractClient.lookupPaymentTypes()).thenReturn(PAYMENT_TYPE_NAME_TO_ID);
        when(fineractClient.findSavingsAccountByExternalId("PLATFORM-FEE-COLLECT")).thenReturn(900L);
        when(fineractClient.findSavingsAccountByExternalId("PLATFORM-CLEARING")).thenReturn(901L);
        when(fineractClient.findSavingsAccountByExternalId("TAX-REG-DUTY")).thenReturn(801L);
        when(fineractClient.findSavingsAccountByExternalId("TAX-IRCM")).thenReturn(802L);
        when(fineractClient.findSavingsAccountByExternalId("TAX-CAP-GAINS")).thenReturn(803L);
        when(fineractClient.findSavingsAccountByExternalId("TAX-TVA")).thenReturn(804L);
    }
}
