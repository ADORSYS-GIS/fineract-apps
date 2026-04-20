package com.adorsys.fineract.asset.service;

import com.adorsys.fineract.asset.config.AssetServiceConfig;
import com.adorsys.fineract.asset.config.ResolvedTaxAccounts;
import com.adorsys.fineract.asset.config.TaxConfig;
import com.adorsys.fineract.asset.dto.AssetCategory;
import com.adorsys.fineract.asset.dto.TaxBreakdown;
import com.adorsys.fineract.asset.entity.Asset;
import com.adorsys.fineract.asset.entity.TaxTransaction;
import com.adorsys.fineract.asset.repository.TaxTransactionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;

import static com.adorsys.fineract.asset.testutil.TestDataFactory.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TaxServiceTest {

    @Spy
    private TaxConfig taxConfig = new TaxConfig();

    @Spy
    private AssetServiceConfig assetServiceConfig = new AssetServiceConfig();

    @Mock
    private ResolvedTaxAccounts resolvedTaxAccounts;

    @Mock
    private TaxTransactionRepository taxTransactionRepository;

    @InjectMocks
    private TaxService taxService;

    // ── Registration Duty ──────────────────────────────────────────

    @Nested
    class RegistrationDutyTests {

        @Test
        void calculateRegistrationDuty_defaultRate() {
            Asset asset = activeAsset();
            asset.setRegistrationDutyEnabled(true);
            // no rate override → uses default 0.02

            BigDecimal duty = taxService.calculateRegistrationDuty(asset, new BigDecimal("100000"));

            assertEquals(new BigDecimal("2000"), duty);
        }

        @Test
        void calculateRegistrationDuty_customRate() {
            Asset asset = activeAsset();
            asset.setRegistrationDutyEnabled(true);
            asset.setRegistrationDutyRate(new BigDecimal("0.03"));

            BigDecimal duty = taxService.calculateRegistrationDuty(asset, new BigDecimal("100000"));

            assertEquals(new BigDecimal("3000"), duty);
        }

        @Test
        void calculateRegistrationDuty_disabled() {
            Asset asset = activeAsset();
            asset.setRegistrationDutyEnabled(false);

            BigDecimal duty = taxService.calculateRegistrationDuty(asset, new BigDecimal("100000"));

            assertEquals(BigDecimal.ZERO, duty);
        }

        @Test
        void getRegistrationDutyRate_disabled_returnsZero() {
            Asset asset = activeAsset();
            asset.setRegistrationDutyEnabled(false);

            assertEquals(BigDecimal.ZERO, taxService.getRegistrationDutyRate(asset));
        }

        @Test
        void getRegistrationDutyRate_noOverride_returnsDefault() {
            Asset asset = activeAsset();
            asset.setRegistrationDutyEnabled(true);
            asset.setRegistrationDutyRate(null);

            assertEquals(new BigDecimal("0.02"), taxService.getRegistrationDutyRate(asset));
        }
    }

    // ── IRCM ──────────────────────────────────────────────────────

    @Nested
    class IrcmTests {

        @Test
        void getEffectiveIrcmRate_disabled_returnsZero() {
            Asset asset = activeAsset();
            asset.setIrcmEnabled(false);

            assertEquals(BigDecimal.ZERO, taxService.getEffectiveIrcmRate(asset));
        }

        @Test
        void getEffectiveIrcmRate_governmentBond_exempt() {
            Asset asset = activeBondAsset();
            asset.setIrcmEnabled(true);
            asset.setIsGovernmentBond(true);

            assertEquals(BigDecimal.ZERO, taxService.getEffectiveIrcmRate(asset));
        }

        @Test
        void getEffectiveIrcmRate_ircmExempt_returnsZero() {
            Asset asset = activeAsset();
            asset.setIrcmEnabled(true);
            asset.setIrcmExempt(true);

            assertEquals(BigDecimal.ZERO, taxService.getEffectiveIrcmRate(asset));
        }

        @Test
        void getEffectiveIrcmRate_overrideSet_usesOverride() {
            Asset asset = activeAsset();
            asset.setIrcmEnabled(true);
            asset.setIrcmRateOverride(new BigDecimal("0.08"));

            assertEquals(new BigDecimal("0.08"), taxService.getEffectiveIrcmRate(asset));
        }

        @Test
        void getEffectiveIrcmRate_bondMatureFiveYears_returns5_5percent() {
            Asset asset = activeBondAsset();
            asset.setIrcmEnabled(true);
            // maturityDate is already +5 years from now in activeBondAsset()

            assertEquals(new BigDecimal("0.055"), taxService.getEffectiveIrcmRate(asset));
        }

        @Test
        void getEffectiveIrcmRate_bvmacListed_returns11percent() {
            Asset asset = activeAsset();
            asset.setIrcmEnabled(true);
            asset.setIsBvmacListed(true);

            assertEquals(new BigDecimal("0.11"), taxService.getEffectiveIrcmRate(asset));
        }

        @Test
        void getEffectiveIrcmRate_defaultDividend_returns16_5percent() {
            Asset asset = activeAsset();
            asset.setIrcmEnabled(true);
            // no special flags → default dividend rate

            assertEquals(new BigDecimal("0.165"), taxService.getEffectiveIrcmRate(asset));
        }

        @Test
        void calculateIrcm_appliesRate() {
            Asset asset = activeAsset();
            asset.setIrcmEnabled(true);
            // default 16.5%

            BigDecimal ircm = taxService.calculateIrcm(asset, new BigDecimal("100000"));

            assertEquals(new BigDecimal("16500"), ircm);
        }

        @Test
        void calculateIrcm_governmentBond_zero() {
            Asset asset = activeBondAsset();
            asset.setIrcmEnabled(true);
            asset.setIsGovernmentBond(true);

            BigDecimal ircm = taxService.calculateIrcm(asset, new BigDecimal("100000"));

            assertEquals(BigDecimal.ZERO, ircm);
        }

        @Test
        void getEffectiveIrcmRate_bvmacListedBond_getsDefaultNotBvmacRate() {
            // BVMAC rate (11%) is for equities, not bonds. Bonds with < 5yr maturity get default 16.5%
            Asset asset = activeBondAsset();
            asset.setIrcmEnabled(true);
            asset.setIsBvmacListed(true);
            asset.setMaturityDate(LocalDate.now().plusYears(2)); // < 5yr

            assertEquals(new BigDecimal("0.165"), taxService.getEffectiveIrcmRate(asset));
        }

        @Test
        void ircmPriority_overrideBeatsMaturity() {
            Asset asset = activeBondAsset();
            asset.setIrcmEnabled(true);
            asset.setIrcmRateOverride(new BigDecimal("0.08"));
            // Even though it's a bond with 5yr maturity, override takes precedence

            assertEquals(new BigDecimal("0.08"), taxService.getEffectiveIrcmRate(asset));
        }

        @Test
        void ircmPriority_govtBondBeatsOverride() {
            Asset asset = activeBondAsset();
            asset.setIrcmEnabled(true);
            asset.setIsGovernmentBond(true);
            asset.setIrcmRateOverride(new BigDecimal("0.08"));
            // Govt bond exemption takes precedence over override

            assertEquals(BigDecimal.ZERO, taxService.getEffectiveIrcmRate(asset));
        }
    }

    // ── Capital Gains Tax ────────────────────────────────────────────

    @Nested
    class CapitalGainsTaxTests {

        @BeforeEach
        void setUp() {
            lenient().when(taxTransactionRepository.sumCapitalGainsByUserAndYear(anyLong(), anyInt()))
                    .thenReturn(BigDecimal.ZERO);
        }

        @Test
        void calculateCapitalGainsTax_disabled_returnsZero() {
            Asset asset = activeAsset();
            asset.setCapitalGainsTaxEnabled(false);

            BigDecimal tax = taxService.calculateCapitalGainsTax(asset, USER_ID, new BigDecimal("100000"));

            assertEquals(BigDecimal.ZERO, tax);
        }

        @Test
        void calculateCapitalGainsTax_noProfit_returnsZero() {
            Asset asset = activeAsset();
            asset.setCapitalGainsTaxEnabled(true);

            BigDecimal tax = taxService.calculateCapitalGainsTax(asset, USER_ID, new BigDecimal("-5000"));

            assertEquals(BigDecimal.ZERO, tax);
        }

        @Test
        void calculateCapitalGainsTax_zeroProfit_returnsZero() {
            Asset asset = activeAsset();
            asset.setCapitalGainsTaxEnabled(true);

            BigDecimal tax = taxService.calculateCapitalGainsTax(asset, USER_ID, BigDecimal.ZERO);

            assertEquals(BigDecimal.ZERO, tax);
        }

        @Test
        void calculateCapitalGainsTax_belowExemptionThreshold_returnsZero() {
            Asset asset = activeAsset();
            asset.setCapitalGainsTaxEnabled(true);
            // cumulative = 0, gain = 300,000 → total = 300,000 < 500,000 threshold

            BigDecimal tax = taxService.calculateCapitalGainsTax(asset, USER_ID, new BigDecimal("300000"));

            assertEquals(BigDecimal.ZERO, tax);
        }

        @Test
        void calculateCapitalGainsTax_exceedsExemption_taxesExcess() {
            Asset asset = activeAsset();
            asset.setCapitalGainsTaxEnabled(true);
            // cumulative = 0, gain = 700,000 → exceeds 500,000 by 200,000
            // tax = 200,000 * 0.165 = 33,000

            BigDecimal tax = taxService.calculateCapitalGainsTax(asset, USER_ID, new BigDecimal("700000"));

            assertEquals(new BigDecimal("33000"), tax);
        }

        @Test
        void calculateCapitalGainsTax_priorGainsExceedThreshold_taxesFullGain() {
            Asset asset = activeAsset();
            asset.setCapitalGainsTaxEnabled(true);
            // Prior cumulative gains already exceed threshold
            when(taxTransactionRepository.sumCapitalGainsByUserAndYear(eq(USER_ID), anyInt()))
                    .thenReturn(new BigDecimal("600000"));

            // New gain of 100,000 is fully taxable
            BigDecimal tax = taxService.calculateCapitalGainsTax(asset, USER_ID, new BigDecimal("100000"));

            assertEquals(new BigDecimal("16500"), tax); // 100,000 * 0.165
        }

        @Test
        void calculateCapitalGainsTax_partialExemption() {
            Asset asset = activeAsset();
            asset.setCapitalGainsTaxEnabled(true);
            // Prior cumulative gains = 400,000. New gain = 200,000.
            // Total = 600,000 → exceeds 500,000 by 100,000
            // Taxable = 100,000 (the portion above threshold)
            when(taxTransactionRepository.sumCapitalGainsByUserAndYear(eq(USER_ID), anyInt()))
                    .thenReturn(new BigDecimal("400000"));

            BigDecimal tax = taxService.calculateCapitalGainsTax(asset, USER_ID, new BigDecimal("200000"));

            assertEquals(new BigDecimal("16500"), tax); // 100,000 * 0.165
        }

        @Test
        void calculateCapitalGainsTax_customRate() {
            Asset asset = activeAsset();
            asset.setCapitalGainsTaxEnabled(true);
            asset.setCapitalGainsRate(new BigDecimal("0.10"));
            // cumulative = 600K (above threshold), gain = 100K → fully taxable

            when(taxTransactionRepository.sumCapitalGainsByUserAndYear(eq(USER_ID), anyInt()))
                    .thenReturn(new BigDecimal("600000"));

            BigDecimal tax = taxService.calculateCapitalGainsTax(asset, USER_ID, new BigDecimal("100000"));

            assertEquals(new BigDecimal("10000"), tax); // 100,000 * 0.10
        }

        @Test
        void calculateCapitalGainsTax_exactThreshold_returnsZero() {
            Asset asset = activeAsset();
            asset.setCapitalGainsTaxEnabled(true);
            // cumulative = 0, gain = exactly 500,000 → at threshold, exempt

            BigDecimal tax = taxService.calculateCapitalGainsTax(asset, USER_ID, new BigDecimal("500000"));

            assertEquals(BigDecimal.ZERO, tax);
        }
    }

    // ── Tax Breakdown ────────────────────────────────────────────────

    @Nested
    class TaxBreakdownTests {

        @BeforeEach
        void setUp() {
            lenient().when(taxTransactionRepository.sumCapitalGainsByUserAndYear(anyLong(), anyInt()))
                    .thenReturn(BigDecimal.ZERO);
        }

        @Test
        void buildTaxBreakdown_buyOrder_noCapitalGains() {
            Asset asset = activeAsset();
            asset.setRegistrationDutyEnabled(true);
            asset.setCapitalGainsTaxEnabled(true);
            // tvaEnabled is false by default — test focuses on reg duty + capital gains only

            // fee = grossAmount × 0.003 = 100000 × 0.003 = 300
            TaxBreakdown breakdown = taxService.buildTaxBreakdown(
                    asset, USER_ID, new BigDecimal("100000"), new BigDecimal("300"), BigDecimal.ZERO, false);

            assertEquals(new BigDecimal("0.02"), breakdown.registrationDutyRate());
            assertEquals(new BigDecimal("2000"), breakdown.registrationDutyAmount());
            assertEquals(BigDecimal.ZERO, breakdown.capitalGainsRate());
            assertEquals(BigDecimal.ZERO, breakdown.capitalGainsTaxAmount());
            assertEquals(new BigDecimal("2000"), breakdown.totalTaxAmount());
            assertFalse(breakdown.capitalGainsExemptionApplied());
        }

        @Test
        void buildTaxBreakdown_sellOrder_withCapitalGains() {
            Asset asset = activeAsset();
            asset.setRegistrationDutyEnabled(true);
            asset.setCapitalGainsTaxEnabled(true);
            // tvaEnabled is false by default — test focuses on reg duty + capital gains only
            // Gain of 700K exceeds 500K threshold → taxes 200K * 0.165 = 33K
            when(taxTransactionRepository.sumCapitalGainsByUserAndYear(eq(USER_ID), anyInt()))
                    .thenReturn(BigDecimal.ZERO);

            TaxBreakdown breakdown = taxService.buildTaxBreakdown(
                    asset, USER_ID, new BigDecimal("100000"), new BigDecimal("300"), new BigDecimal("700000"), true);

            assertEquals(new BigDecimal("2000"), breakdown.registrationDutyAmount());
            assertEquals(new BigDecimal("33000"), breakdown.capitalGainsTaxAmount());
            assertEquals(new BigDecimal("35000"), breakdown.totalTaxAmount());
            assertFalse(breakdown.capitalGainsExemptionApplied());
        }

        @Test
        void buildTaxBreakdown_sellOrder_exemptCapitalGains() {
            Asset asset = activeAsset();
            asset.setRegistrationDutyEnabled(true);
            asset.setCapitalGainsTaxEnabled(true);
            // tvaEnabled is false by default — test focuses on reg duty + capital gains only
            // Gain of 200K < 500K threshold → exempt

            // fee = 50000 × 0.003 = 150
            TaxBreakdown breakdown = taxService.buildTaxBreakdown(
                    asset, USER_ID, new BigDecimal("50000"), new BigDecimal("150"), new BigDecimal("200000"), true);

            assertEquals(new BigDecimal("1000"), breakdown.registrationDutyAmount());
            assertEquals(BigDecimal.ZERO, breakdown.capitalGainsTaxAmount());
            assertEquals(new BigDecimal("1000"), breakdown.totalTaxAmount());
            assertTrue(breakdown.capitalGainsExemptionApplied());
        }

        @Test
        void buildTaxBreakdown_tvaOnFeeNotGross() {
            // TVA should be calculated on the fee, not the gross trade amount
            Asset asset = activeAsset();
            asset.setRegistrationDutyEnabled(false);
            asset.setTvaEnabled(true);

            // gross = 100,000 XAF, fee = 300 XAF (0.3%)
            // TVA = 300 × 0.1925 = 57.75 → rounded to 58
            TaxBreakdown breakdown = taxService.buildTaxBreakdown(
                    asset, USER_ID, new BigDecimal("100000"), new BigDecimal("300"), BigDecimal.ZERO, false);

            assertEquals(new BigDecimal("58"), breakdown.tvaAmount());
            assertEquals(new BigDecimal("58"), breakdown.totalTaxAmount());
        }
    }

    // ── Record Tax Transaction ───────────────────────────────────────

    @Nested
    class RecordTaxTransactionTests {

        @Test
        void recordTaxTransaction_savesWithCorrectFields() {
            when(taxTransactionRepository.save(any(TaxTransaction.class)))
                    .thenAnswer(inv -> inv.getArgument(0));

            TaxTransaction tx = taxService.recordTaxTransaction(
                    "order-123", null, USER_ID, ASSET_ID,
                    "REGISTRATION_DUTY", new BigDecimal("100000"),
                    new BigDecimal("0.02"), new BigDecimal("2000"), 999L);

            ArgumentCaptor<TaxTransaction> captor = ArgumentCaptor.forClass(TaxTransaction.class);
            verify(taxTransactionRepository).save(captor.capture());

            TaxTransaction saved = captor.getValue();
            assertEquals("order-123", saved.getOrderId());
            assertEquals(USER_ID, saved.getUserId());
            assertEquals(ASSET_ID, saved.getAssetId());
            assertEquals("REGISTRATION_DUTY", saved.getTaxType());
            assertEquals(new BigDecimal("100000"), saved.getTaxableAmount());
            assertEquals(new BigDecimal("0.02"), saved.getTaxRate());
            assertEquals(new BigDecimal("2000"), saved.getTaxAmount());
            assertEquals(999L, saved.getFineractTransferId());
            assertEquals(LocalDate.now().getYear(), saved.getFiscalYear());
        }
    }

    // ── Account ID Resolution ────────────────────────────────────────

    @Nested
    class AccountResolutionTests {

        @Test
        void getRegistrationDutyAccountId_delegatesToResolved() {
            when(resolvedTaxAccounts.getRegistrationDutyAccountId()).thenReturn(100L);
            assertEquals(100L, taxService.getRegistrationDutyAccountId());
        }

        @Test
        void getIrcmAccountId_delegatesToResolved() {
            when(resolvedTaxAccounts.getIrcmAccountId()).thenReturn(200L);
            assertEquals(200L, taxService.getIrcmAccountId());
        }

        @Test
        void getCapitalGainsAccountId_delegatesToResolved() {
            when(resolvedTaxAccounts.getCapitalGainsAccountId()).thenReturn(300L);
            assertEquals(300L, taxService.getCapitalGainsAccountId());
        }
    }

    // -------------------------------------------------------------------------
    // TVA (VAT) Calculation
    // -------------------------------------------------------------------------

    @Nested
    class TvaCalculation {

        @Test
        void calculateTva_enabled_usesDefaultRate() {
            Asset asset = Asset.builder().tvaEnabled(true).build();
            BigDecimal result = taxService.calculateTva(asset, new BigDecimal("10000"));
            // Default rate = 0.1925, so 10000 * 0.1925 = 1925
            assertEquals(new BigDecimal("1925"), result);
        }

        @Test
        void calculateTva_disabled_returnsZero() {
            Asset asset = Asset.builder().tvaEnabled(false).build();
            BigDecimal result = taxService.calculateTva(asset, new BigDecimal("10000"));
            assertEquals(BigDecimal.ZERO, result);
        }

        @Test
        void calculateTva_nullEnabled_returnsZero() {
            // tvaEnabled null (set explicitly via setter) is treated defensively as disabled
            Asset asset = Asset.builder().tvaEnabled(true).build();
            asset.setTvaEnabled(null);
            BigDecimal result = taxService.calculateTva(asset, new BigDecimal("10000"));
            assertEquals(BigDecimal.ZERO, result);
        }

        @Test
        void calculateTva_customRate_usesAssetRate() {
            Asset asset = Asset.builder()
                    .tvaEnabled(true)
                    .tvaRate(new BigDecimal("0.10"))
                    .build();
            BigDecimal result = taxService.calculateTva(asset, new BigDecimal("10000"));
            // Custom rate = 0.10, so 10000 * 0.10 = 1000
            assertEquals(new BigDecimal("1000"), result);
        }

        @Test
        void getTvaRate_enabled_returnsDefaultRate() {
            Asset asset = Asset.builder().tvaEnabled(true).build();
            assertEquals(new BigDecimal("0.1925"), taxService.getTvaRate(asset));
        }

        @Test
        void getTvaRate_disabled_returnsZero() {
            Asset asset = Asset.builder().tvaEnabled(false).build();
            assertEquals(BigDecimal.ZERO, taxService.getTvaRate(asset));
        }

        @Test
        void getTvaAccountId_delegatesToResolvedAccounts() {
            when(resolvedTaxAccounts.getTvaAccountId()).thenReturn(400L);
            assertEquals(400L, taxService.getTvaAccountId());
        }
    }
}
