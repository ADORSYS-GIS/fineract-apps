package com.adorsys.fineract.asset.service;

import com.adorsys.fineract.asset.client.FineractClient;
import com.adorsys.fineract.asset.config.AssetServiceConfig;
import com.adorsys.fineract.asset.config.ResolvedGlAccounts;
import com.adorsys.fineract.asset.dto.AccountingReportResponse;
import com.adorsys.fineract.asset.dto.TrialBalanceResponse;
import com.adorsys.fineract.asset.repository.TaxTransactionRepository;
import com.adorsys.fineract.asset.repository.TradeLogRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AccountingReportServiceTest {

    @Mock private FineractClient fineractClient;
    @Mock private ResolvedGlAccounts resolvedGlAccounts;
    @Mock private AssetServiceConfig assetServiceConfig;
    @Mock private TradeLogRepository tradeLogRepository;
    @Mock private TaxTransactionRepository taxTransactionRepository;

    @InjectMocks
    private AccountingReportService accountingReportService;

    private static final Long FUND_SOURCE_GL_ID = 1042L;
    private static final Long DIGITAL_ASSET_INV_GL_ID = 1047L;
    private static final Long PLATFORM_FEE_INCOME_GL_ID = 1088L;
    private static final Long SPREAD_INCOME_GL_ID = 1089L;
    private static final Long TAX_EXPENSE_REG_DUTY_GL_ID = 1092L;
    private static final Long TAX_EXPENSE_CGT_GL_ID = 1093L;
    private static final Long TAX_EXPENSE_IRCM_GL_ID = 1094L;

    @BeforeEach
    void setUp() {
        lenient().when(assetServiceConfig.getSettlementCurrency()).thenReturn("XAF");

        // Setup GL accounts config (used by buildGlAccountMap and getFeeAndTaxSummary)
        AssetServiceConfig.GlAccounts glConfig = new AssetServiceConfig.GlAccounts();
        lenient().when(assetServiceConfig.getGlAccounts()).thenReturn(glConfig);

        // Default: no spread trades (overridden in specific tests)
        lenient().when(tradeLogRepository.countBySpreadGreaterThanAndDateRange(any(), any())).thenReturn(0);

        // Setup resolved GL accounts
        lenient().when(resolvedGlAccounts.getFundSourceId()).thenReturn(FUND_SOURCE_GL_ID);
        lenient().when(resolvedGlAccounts.getDigitalAssetInventoryId()).thenReturn(DIGITAL_ASSET_INV_GL_ID);
        lenient().when(resolvedGlAccounts.getTransfersInSuspenseId()).thenReturn(1048L);
        lenient().when(resolvedGlAccounts.getCustomerDigitalAssetHoldingsId()).thenReturn(1065L);
        lenient().when(resolvedGlAccounts.getAssetEquityId()).thenReturn(1073L);
        lenient().when(resolvedGlAccounts.getIncomeFromInterestId()).thenReturn(1087L);
        lenient().when(resolvedGlAccounts.getPlatformFeeIncomeId()).thenReturn(PLATFORM_FEE_INCOME_GL_ID);
        lenient().when(resolvedGlAccounts.getSpreadIncomeId()).thenReturn(SPREAD_INCOME_GL_ID);
        lenient().when(resolvedGlAccounts.getExpenseAccountId()).thenReturn(1091L);
        lenient().when(resolvedGlAccounts.getTaxExpenseRegDutyId()).thenReturn(TAX_EXPENSE_REG_DUTY_GL_ID);
        lenient().when(resolvedGlAccounts.getTaxExpenseCapGainsId()).thenReturn(TAX_EXPENSE_CGT_GL_ID);
        lenient().when(resolvedGlAccounts.getTaxExpenseIrcmId()).thenReturn(TAX_EXPENSE_IRCM_GL_ID);
    }

    // -------------------------------------------------------------------------
    // getTrialBalance tests
    // -------------------------------------------------------------------------

    @Test
    void getTrialBalance_withNonZeroEntries_returnsEntriesForAccountsWithActivity() {
        // Fund Source has activity (debits and credits)
        Map<String, Object> fundSourceResponse = Map.of("pageItems", List.of(
                journalEntry("DEBIT", "5000", "XAF"),
                journalEntry("CREDIT", "3000", "XAF")
        ));
        when(fineractClient.getJournalEntries(eq(FUND_SOURCE_GL_ID), eq("XAF"), isNull(), isNull(), eq(0), eq(500)))
                .thenReturn(fundSourceResponse);

        // Platform Fee Income has activity (credits only)
        Map<String, Object> feeIncomeResponse = Map.of("pageItems", List.of(
                journalEntry("CREDIT", "1500", "XAF")
        ));
        when(fineractClient.getJournalEntries(eq(PLATFORM_FEE_INCOME_GL_ID), eq("XAF"), isNull(), isNull(), eq(0), eq(500)))
                .thenReturn(feeIncomeResponse);

        // All other accounts return empty
        when(fineractClient.getJournalEntries(
                longThat(id -> id != FUND_SOURCE_GL_ID && id != PLATFORM_FEE_INCOME_GL_ID),
                eq("XAF"), isNull(), isNull(), eq(0), eq(500)))
                .thenReturn(Map.of("pageItems", List.of()));

        TrialBalanceResponse result = accountingReportService.getTrialBalance(null, null, null);

        assertNotNull(result);
        assertEquals("XAF", result.currencyCode());
        assertEquals(2, result.entries().size());

        // Fund Source entry
        TrialBalanceResponse.TrialBalanceEntry fundEntry = result.entries().stream()
                .filter(e -> e.glCode().equals("42")).findFirst().orElseThrow();
        assertEquals(new BigDecimal("5000"), fundEntry.debitAmount());
        assertEquals(new BigDecimal("3000"), fundEntry.creditAmount());
        assertEquals(new BigDecimal("2000"), fundEntry.balance());

        // Platform Fee Income entry
        TrialBalanceResponse.TrialBalanceEntry feeEntry = result.entries().stream()
                .filter(e -> e.glCode().equals("88")).findFirst().orElseThrow();
        assertEquals(BigDecimal.ZERO, feeEntry.debitAmount());
        assertEquals(new BigDecimal("1500"), feeEntry.creditAmount());
    }

    @Test
    void getTrialBalance_filtersByCurrency_excludesMismatchedEntries() {
        // Response contains entries with mixed currencies
        Map<String, Object> response = Map.of("pageItems", List.of(
                journalEntry("DEBIT", "1000", "XAF"),
                journalEntry("CREDIT", "500", "USD"),   // different currency - should be skipped
                journalEntry("CREDIT", "200", "XAF")
        ));
        when(fineractClient.getJournalEntries(eq(FUND_SOURCE_GL_ID), eq("XAF"), isNull(), isNull(), eq(0), eq(500)))
                .thenReturn(response);

        // Other accounts return empty
        when(fineractClient.getJournalEntries(
                longThat(id -> id != FUND_SOURCE_GL_ID), eq("XAF"), isNull(), isNull(), eq(0), eq(500)))
                .thenReturn(Map.of("pageItems", List.of()));

        TrialBalanceResponse result = accountingReportService.getTrialBalance("XAF", null, null);

        TrialBalanceResponse.TrialBalanceEntry entry = result.entries().stream()
                .filter(e -> e.glCode().equals("42")).findFirst().orElseThrow();

        // Only XAF entries should be counted: debit=1000, credit=200
        assertEquals(new BigDecimal("1000"), entry.debitAmount());
        assertEquals(new BigDecimal("200"), entry.creditAmount());
    }

    @Test
    void getTrialBalance_calculatesCorrectTotals_sumsAllEntries() {
        // Fund Source: debit=5000, credit=2000
        when(fineractClient.getJournalEntries(eq(FUND_SOURCE_GL_ID), eq("XAF"), isNull(), isNull(), eq(0), eq(500)))
                .thenReturn(Map.of("pageItems", List.of(
                        journalEntry("DEBIT", "5000", "XAF"),
                        journalEntry("CREDIT", "2000", "XAF"))));

        // Tax Expense Reg Duty: debit=300, credit=0
        when(fineractClient.getJournalEntries(eq(TAX_EXPENSE_REG_DUTY_GL_ID), eq("XAF"), isNull(), isNull(), eq(0), eq(500)))
                .thenReturn(Map.of("pageItems", List.of(
                        journalEntry("DEBIT", "300", "XAF"))));

        // Other accounts empty
        when(fineractClient.getJournalEntries(
                longThat(id -> id != FUND_SOURCE_GL_ID && id != TAX_EXPENSE_REG_DUTY_GL_ID),
                eq("XAF"), isNull(), isNull(), eq(0), eq(500)))
                .thenReturn(Map.of("pageItems", List.of()));

        TrialBalanceResponse result = accountingReportService.getTrialBalance("XAF", null, null);

        assertEquals(new BigDecimal("5300"), result.totalDebits());
        assertEquals(new BigDecimal("2000"), result.totalCredits());
    }

    @Test
    void getTrialBalance_noActivity_returnsEmptyEntries() {
        when(fineractClient.getJournalEntries(anyLong(), eq("XAF"), isNull(), isNull(), eq(0), eq(500)))
                .thenReturn(Map.of("pageItems", List.of()));

        TrialBalanceResponse result = accountingReportService.getTrialBalance("XAF", null, null);

        assertTrue(result.entries().isEmpty());
        assertEquals(BigDecimal.ZERO, result.totalDebits());
        assertEquals(BigDecimal.ZERO, result.totalCredits());
    }

    // -------------------------------------------------------------------------
    // getFeeAndTaxSummary tests
    // -------------------------------------------------------------------------

    @Test
    void getFeeAndTaxSummary_withFees_aggregatesFromTradeLogs() {
        when(tradeLogRepository.sumFeesByDateRange(any(), any())).thenReturn(new BigDecimal("15000"));
        when(tradeLogRepository.countByFeeGreaterThanAndDateRange(any(), any())).thenReturn(25);
        when(tradeLogRepository.sumSpreadByDateRange(any(), any())).thenReturn(BigDecimal.ZERO);
        when(taxTransactionRepository.sumByTaxTypeAndDateRange(any(), any())).thenReturn(List.of());

        AccountingReportResponse result = accountingReportService.getFeeAndTaxSummary("XAF", null, null);

        assertNotNull(result);
        assertEquals("FEE_AND_TAX_SUMMARY", result.reportType());
        assertEquals(1, result.entries().size());

        AccountingReportResponse.ReportEntry feeEntry = result.entries().get(0);
        assertEquals("INCOME", feeEntry.category());
        assertEquals("88", feeEntry.glCode());
        assertEquals(new BigDecimal("15000"), feeEntry.amount());
        assertEquals(25, feeEntry.transactionCount());
    }

    @Test
    void getFeeAndTaxSummary_withTaxes_aggregatesByTaxType() {
        when(tradeLogRepository.sumFeesByDateRange(any(), any())).thenReturn(BigDecimal.ZERO);
        when(tradeLogRepository.countByFeeGreaterThanAndDateRange(any(), any())).thenReturn(0);
        when(tradeLogRepository.sumSpreadByDateRange(any(), any())).thenReturn(BigDecimal.ZERO);

        List<Object[]> taxSummary = List.of(
                new Object[]{"REGISTRATION_DUTY", new BigDecimal("5000"), 10},
                new Object[]{"CAPITAL_GAINS", new BigDecimal("8000"), 5},
                new Object[]{"IRCM", new BigDecimal("3000"), 7}
        );
        when(taxTransactionRepository.sumByTaxTypeAndDateRange(any(), any())).thenReturn(taxSummary);

        AccountingReportResponse result = accountingReportService.getFeeAndTaxSummary("XAF", null, null);

        assertEquals(3, result.entries().size());

        // Registration duty
        AccountingReportResponse.ReportEntry regDuty = result.entries().stream()
                .filter(e -> e.glCode().equals("92")).findFirst().orElseThrow();
        assertEquals("EXPENSE", regDuty.category());
        assertEquals(new BigDecimal("5000"), regDuty.amount());
        assertEquals(10, regDuty.transactionCount());

        // Capital gains
        AccountingReportResponse.ReportEntry cgt = result.entries().stream()
                .filter(e -> e.glCode().equals("93")).findFirst().orElseThrow();
        assertEquals(new BigDecimal("8000"), cgt.amount());
        assertEquals(5, cgt.transactionCount());

        // IRCM
        AccountingReportResponse.ReportEntry ircm = result.entries().stream()
                .filter(e -> e.glCode().equals("94")).findFirst().orElseThrow();
        assertEquals(new BigDecimal("3000"), ircm.amount());
        assertEquals(7, ircm.transactionCount());

        // Total should be sum of all taxes
        assertEquals(new BigDecimal("16000"), result.total());
    }

    @Test
    void getFeeAndTaxSummary_withFeesAndSpread_includesBothIncomeTypes() {
        when(tradeLogRepository.sumFeesByDateRange(any(), any())).thenReturn(new BigDecimal("10000"));
        when(tradeLogRepository.countByFeeGreaterThanAndDateRange(any(), any())).thenReturn(20);
        when(tradeLogRepository.sumSpreadByDateRange(any(), any())).thenReturn(new BigDecimal("7500"));
        when(taxTransactionRepository.sumByTaxTypeAndDateRange(any(), any())).thenReturn(List.of());

        AccountingReportResponse result = accountingReportService.getFeeAndTaxSummary("XAF", null, null);

        assertEquals(2, result.entries().size());

        // Fee income (GL 88)
        AccountingReportResponse.ReportEntry feeEntry = result.entries().stream()
                .filter(e -> e.glCode().equals("88")).findFirst().orElseThrow();
        assertEquals(new BigDecimal("10000"), feeEntry.amount());

        // Spread income (GL 89)
        AccountingReportResponse.ReportEntry spreadEntry = result.entries().stream()
                .filter(e -> e.glCode().equals("89")).findFirst().orElseThrow();
        assertEquals(new BigDecimal("7500"), spreadEntry.amount());

        assertEquals(new BigDecimal("17500"), result.total());
    }

    @Test
    void getFeeAndTaxSummary_emptyDateRange_returnsAllData() {
        when(tradeLogRepository.sumFeesByDateRange(isNull(), isNull())).thenReturn(new BigDecimal("5000"));
        when(tradeLogRepository.countByFeeGreaterThanAndDateRange(isNull(), isNull())).thenReturn(10);
        when(tradeLogRepository.sumSpreadByDateRange(isNull(), isNull())).thenReturn(BigDecimal.ZERO);
        when(taxTransactionRepository.sumByTaxTypeAndDateRange(isNull(), isNull())).thenReturn(List.of());

        AccountingReportResponse result = accountingReportService.getFeeAndTaxSummary(null, null, null);

        assertNull(result.fromDate());
        assertNull(result.toDate());
        assertEquals(1, result.entries().size());
        assertEquals(new BigDecimal("5000"), result.total());
    }

    @Test
    void getFeeAndTaxSummary_withDateRange_passesInstantsToRepositories() {
        LocalDate from = LocalDate.of(2026, 1, 1);
        LocalDate to = LocalDate.of(2026, 3, 31);

        when(tradeLogRepository.sumFeesByDateRange(any(Instant.class), any(Instant.class))).thenReturn(BigDecimal.ZERO);
        when(tradeLogRepository.countByFeeGreaterThanAndDateRange(any(Instant.class), any(Instant.class))).thenReturn(0);
        when(tradeLogRepository.sumSpreadByDateRange(any(Instant.class), any(Instant.class))).thenReturn(BigDecimal.ZERO);
        when(taxTransactionRepository.sumByTaxTypeAndDateRange(any(Instant.class), any(Instant.class))).thenReturn(List.of());

        AccountingReportResponse result = accountingReportService.getFeeAndTaxSummary("XAF", from, to);

        assertEquals("2026-01-01", result.fromDate());
        assertEquals("2026-03-31", result.toDate());
        assertEquals("XAF", result.currencyCode());
    }

    @Test
    void getFeeAndTaxSummary_nullFees_treatsAsZero() {
        when(tradeLogRepository.sumFeesByDateRange(any(), any())).thenReturn(null);
        when(tradeLogRepository.countByFeeGreaterThanAndDateRange(any(), any())).thenReturn(0);
        when(tradeLogRepository.sumSpreadByDateRange(any(), any())).thenReturn(null);
        when(taxTransactionRepository.sumByTaxTypeAndDateRange(any(), any())).thenReturn(List.of());

        AccountingReportResponse result = accountingReportService.getFeeAndTaxSummary("XAF", null, null);

        assertTrue(result.entries().isEmpty());
        assertEquals(BigDecimal.ZERO, result.total());
    }

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    private Map<String, Object> journalEntry(String entryType, String amount, String currencyCode) {
        return Map.of(
                "entryType", Map.of("value", entryType),
                "amount", amount,
                "currency", Map.of("code", currencyCode)
        );
    }
}
