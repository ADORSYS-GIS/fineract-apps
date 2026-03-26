package com.adorsys.fineract.asset.service;

import com.adorsys.fineract.asset.client.FineractClient;
import com.adorsys.fineract.asset.config.AssetServiceConfig;
import com.adorsys.fineract.asset.config.ResolvedGlAccounts;
import com.adorsys.fineract.asset.dto.AccountingReportResponse;
import com.adorsys.fineract.asset.dto.TrialBalanceResponse;
import com.adorsys.fineract.asset.repository.TaxTransactionRepository;
import com.adorsys.fineract.asset.repository.TradeLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class AccountingReportService {

    private final FineractClient fineractClient;
    private final ResolvedGlAccounts resolvedGlAccounts;
    private final AssetServiceConfig assetServiceConfig;
    private final TradeLogRepository tradeLogRepository;
    private final TaxTransactionRepository taxTransactionRepository;

    private static final DateTimeFormatter FINERACT_DATE_FORMAT =
            DateTimeFormatter.ofPattern("dd MMMM yyyy", Locale.ENGLISH);

    /**
     * Build a trial balance from Fineract journal entries, optionally filtered by currency.
     * Queries the accounting GL accounts configured for the asset service and aggregates
     * debits and credits for each account.
     */
    @SuppressWarnings("unchecked")
    public TrialBalanceResponse getTrialBalance(String currencyCode, LocalDate fromDate, LocalDate toDate) {
        String currency = currencyCode != null ? currencyCode : assetServiceConfig.getSettlementCurrency();
        String from = fromDate != null ? fromDate.format(FINERACT_DATE_FORMAT) : null;
        String to = toDate != null ? toDate.format(FINERACT_DATE_FORMAT) : null;

        // Build map of GL account IDs we care about to their metadata
        Map<Long, GlAccountMeta> glAccountMap = buildGlAccountMap(currency);

        // Query journal entries for each GL account
        List<TrialBalanceResponse.TrialBalanceEntry> entries = new ArrayList<>();
        BigDecimal totalDebits = BigDecimal.ZERO;
        BigDecimal totalCredits = BigDecimal.ZERO;

        for (Map.Entry<Long, GlAccountMeta> entry : glAccountMap.entrySet()) {
            Long glAccountId = entry.getKey();
            GlAccountMeta meta = entry.getValue();

            try {
                BigDecimal debits = BigDecimal.ZERO;
                BigDecimal credits = BigDecimal.ZERO;

                // Paginate through all journal entries for this GL account
                int offset = 0;
                int pageSize = 500;
                boolean hasMore = true;

                while (hasMore) {
                    Map<String, Object> response = fineractClient.getJournalEntries(
                            glAccountId, currency, from, to, offset, pageSize);

                    List<Map<String, Object>> pageItems = (List<Map<String, Object>>)
                            response.getOrDefault("pageItems", List.of());

                    for (Map<String, Object> je : pageItems) {
                        Map<String, Object> entryType = (Map<String, Object>) je.get("entryType");
                        String type = entryType != null ? (String) entryType.get("value") : "";
                        BigDecimal amount = je.get("amount") != null
                                ? new BigDecimal(je.get("amount").toString()) : BigDecimal.ZERO;

                        // Filter by currency if Fineract returns mixed currencies
                        Map<String, Object> jeCurrency = (Map<String, Object>) je.get("currency");
                        if (jeCurrency != null && !currency.equals(jeCurrency.get("code"))) {
                            continue;
                        }

                        if ("DEBIT".equalsIgnoreCase(type)) {
                            debits = debits.add(amount);
                        } else if ("CREDIT".equalsIgnoreCase(type)) {
                            credits = credits.add(amount);
                        }
                    }

                    // Check if more pages exist
                    Number totalRecords = (Number) response.get("totalFilteredRecords");
                    int fetched = offset + pageItems.size();
                    hasMore = totalRecords != null && fetched < totalRecords.intValue() && !pageItems.isEmpty();
                    offset = fetched;
                }

                if (debits.compareTo(BigDecimal.ZERO) > 0 || credits.compareTo(BigDecimal.ZERO) > 0) {
                    entries.add(new TrialBalanceResponse.TrialBalanceEntry(
                            glAccountId, meta.glCode, meta.name, meta.type,
                            debits, credits, debits.subtract(credits)));
                    totalDebits = totalDebits.add(debits);
                    totalCredits = totalCredits.add(credits);
                }
            } catch (Exception e) {
                log.warn("Failed to query journal entries for GL account {}: {}", glAccountId, e.getMessage());
            }
        }

        return new TrialBalanceResponse(
                currency,
                fromDate != null ? fromDate.toString() : null,
                toDate != null ? toDate.toString() : null,
                entries, totalDebits, totalCredits);
    }

    /**
     * Get a fee and tax summary report aggregated from the local trade_logs and tax_transactions tables.
     * This is faster than querying Fineract and provides asset-level detail.
     */
    public AccountingReportResponse getFeeAndTaxSummary(String currencyCode, LocalDate fromDate, LocalDate toDate) {
        String currency = currencyCode != null ? currencyCode : assetServiceConfig.getSettlementCurrency();

        // Use epoch boundaries instead of null to avoid PostgreSQL "could not determine data type" errors
        Instant fromInstant = fromDate != null ? fromDate.atStartOfDay().toInstant(ZoneOffset.UTC) : Instant.EPOCH;
        Instant toInstant = toDate != null ? toDate.plusDays(1).atStartOfDay().toInstant(ZoneOffset.UTC) : Instant.now().plusSeconds(86400);

        List<AccountingReportResponse.ReportEntry> entries = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        // Platform fees from trade logs
        BigDecimal totalFees = tradeLogRepository.sumFeesByDateRange(fromInstant, toInstant);
        if (totalFees == null) totalFees = BigDecimal.ZERO;
        int feeCount = tradeLogRepository.countByFeeGreaterThanAndDateRange(fromInstant, toInstant);

        AssetServiceConfig.GlAccounts glConfig = assetServiceConfig.getGlAccounts();

        if (totalFees.compareTo(BigDecimal.ZERO) > 0) {
            entries.add(new AccountingReportResponse.ReportEntry(
                    "INCOME", glConfig.getPlatformFeeIncome(), "Platform Fee Income", totalFees, feeCount));
            total = total.add(totalFees);
        }

        // Spread income from trade logs
        BigDecimal totalSpread = tradeLogRepository.sumSpreadByDateRange(fromInstant, toInstant);
        if (totalSpread == null) totalSpread = BigDecimal.ZERO;
        int spreadCount = tradeLogRepository.countBySpreadGreaterThanAndDateRange(fromInstant, toInstant);

        if (totalSpread.compareTo(BigDecimal.ZERO) > 0) {
            entries.add(new AccountingReportResponse.ReportEntry(
                    "INCOME", glConfig.getSpreadIncome(), "Trading Spread Income", totalSpread, spreadCount));
            total = total.add(totalSpread);
        }

        // Tax summary from tax_transactions
        List<Object[]> taxSummary = taxTransactionRepository.sumByTaxTypeAndDateRange(fromInstant, toInstant);

        for (Object[] row : taxSummary) {
            String taxType = (String) row[0];
            BigDecimal taxAmount = (BigDecimal) row[1];
            int count = ((Number) row[2]).intValue();

            String glCode;
            String description;
            switch (taxType) {
                case "REGISTRATION_DUTY" -> { glCode = glConfig.getTaxExpenseRegDuty(); description = "Registration Duty Tax Expense"; }
                case "CAPITAL_GAINS" -> { glCode = glConfig.getTaxExpenseCapGains(); description = "Capital Gains Tax Expense"; }
                case "IRCM" -> { glCode = glConfig.getTaxExpenseIrcm(); description = "IRCM Withholding Tax Expense"; }
                default -> { glCode = "??"; description = "Unknown Tax: " + taxType; }
            }

            if (taxAmount != null && taxAmount.compareTo(BigDecimal.ZERO) > 0) {
                entries.add(new AccountingReportResponse.ReportEntry(
                        "EXPENSE", glCode, description, taxAmount, count));
                total = total.add(taxAmount);
            }
        }

        return new AccountingReportResponse(
                "FEE_AND_TAX_SUMMARY", currency,
                fromDate != null ? fromDate.toString() : null,
                toDate != null ? toDate.toString() : null,
                entries, total);
    }

    private Map<Long, GlAccountMeta> buildGlAccountMap(String currency) {
        AssetServiceConfig.GlAccounts gl = assetServiceConfig.getGlAccounts();
        boolean isSettlementCurrency = assetServiceConfig.getSettlementCurrency().equals(currency);
        Map<Long, GlAccountMeta> map = new LinkedHashMap<>();

        // Cash/settlement accounts — only for settlement currency (XAF)
        if (isSettlementCurrency) {
            putIfNonNull(map, resolvedGlAccounts.getFundSourceId(), gl.getFundSource(), "Fund Source", "ASSET");
            putIfNonNull(map, resolvedGlAccounts.getTransfersInSuspenseId(), gl.getTransfersInSuspense(), "Transfers in Suspense", "LIABILITY");
            putIfNonNull(map, resolvedGlAccounts.getSavingsControlId(), gl.getSavingsControl(), "Voluntary Savings Control", "LIABILITY");
            putIfNonNull(map, resolvedGlAccounts.getAssetEquityId(), gl.getAssetEquity(), "Asset Equity / LP Capital", "EQUITY");
            putIfNonNull(map, resolvedGlAccounts.getPlatformFeeIncomeId(), gl.getPlatformFeeIncome(), "Platform Fee Income", "INCOME");
            putIfNonNull(map, resolvedGlAccounts.getSpreadIncomeId(), gl.getSpreadIncome(), "Trading Spread Income", "INCOME");
            putIfNonNull(map, resolvedGlAccounts.getExpenseAccountId(), gl.getExpenseAccount(), "General Expense", "EXPENSE");
            putIfNonNull(map, resolvedGlAccounts.getTaxExpenseRegDutyId(), gl.getTaxExpenseRegDuty(), "Tax Expense - Registration Duty", "EXPENSE");
            putIfNonNull(map, resolvedGlAccounts.getTaxExpenseCapGainsId(), gl.getTaxExpenseCapGains(), "Tax Expense - Capital Gains", "EXPENSE");
            putIfNonNull(map, resolvedGlAccounts.getTaxExpenseIrcmId(), gl.getTaxExpenseIrcm(), "Tax Expense - IRCM", "EXPENSE");
        }

        // Token inventory/holdings accounts — only for asset currencies (not XAF)
        if (!isSettlementCurrency) {
            putIfNonNull(map, resolvedGlAccounts.getDigitalAssetInventoryId(), gl.getDigitalAssetInventory(), "Digital Asset Inventory", "ASSET");
            putIfNonNull(map, resolvedGlAccounts.getCustomerDigitalAssetHoldingsId(), gl.getCustomerDigitalAssetHoldings(), "Customer Digital Asset Holdings", "LIABILITY");
            putIfNonNull(map, resolvedGlAccounts.getAssetEquityId(), gl.getAssetEquity(), "Asset Equity / LP Capital", "EQUITY");
            putIfNonNull(map, resolvedGlAccounts.getSavingsControlId(), gl.getSavingsControl(), "Voluntary Savings Control", "LIABILITY");
            putIfNonNull(map, resolvedGlAccounts.getIncomeFromInterestId(), gl.getIncomeFromInterest(), "Income from Interest", "INCOME");
        }

        return map;
    }

    private void putIfNonNull(Map<Long, GlAccountMeta> map, Long id, String glCode, String name, String type) {
        if (id != null) {
            map.put(id, new GlAccountMeta(glCode, name, type));
        }
    }

    private record GlAccountMeta(String glCode, String name, String type) {}
}
