package com.adorsys.fineract.asset.service;

import com.adorsys.fineract.asset.client.FineractClient;
import com.adorsys.fineract.asset.config.AssetServiceConfig;
import com.adorsys.fineract.asset.dto.TrialBalanceResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Generates accounting reports (trial balance, fee/tax summary) by querying
 * Fineract GL accounts and journal entries.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AccountingReportService {

    private final FineractClient fineractClient;
    private final AssetServiceConfig assetServiceConfig;

    /**
     * Build a full trial balance across ALL GL accounts in Fineract.
     * Groups accounts by parent-child hierarchy (SYSCOHADA classes).
     */
    @Cacheable(value = "trialBalance", key = "#currencyCode + '_' + #fromDate + '_' + #toDate",
               condition = "#fromDate != null && #toDate != null")
    public TrialBalanceResponse getTrialBalance(String currencyCode, String fromDate, String toDate) {
        String currency = currencyCode != null ? currencyCode : assetServiceConfig.getSettlementCurrency();
        String settlementCurrency = assetServiceConfig.getSettlementCurrency();

        // GL codes that track asset-denominated units (not settlement currency)
        Set<String> assetDenominatedGlCodes = Set.of(
                assetServiceConfig.getGlAccounts().getDigitalAssetInventory(),   // 301
                assetServiceConfig.getGlAccounts().getCustomerDigitalAssetHoldings() // 4102
        );

        // Fetch all GL accounts from Fineract
        List<Map<String, Object>> allAccounts = fineractClient.getGlAccountsFull();
        if (allAccounts == null) allAccounts = List.of();

        log.info("Building trial balance for {} GL accounts, currency={}", allAccounts.size(), currency);

        // Build parent lookup
        Map<Long, String> idToCode = new HashMap<>();
        Map<Long, Long> idToParentId = new HashMap<>();
        for (Map<String, Object> acct : allAccounts) {
            Long id = ((Number) acct.get("id")).longValue();
            String code = (String) acct.get("glCode");
            idToCode.put(id, code);
            Object parentId = acct.get("parentId");
            if (parentId instanceof Number n) {
                idToParentId.put(id, n.longValue());
            }
        }

        // Build trial balance entries
        List<TrialBalanceResponse.TrialBalanceEntry> entries = new ArrayList<>();
        BigDecimal totalDebits = BigDecimal.ZERO;
        BigDecimal totalCredits = BigDecimal.ZERO;

        for (Map<String, Object> acct : allAccounts) {
            Long id = ((Number) acct.get("id")).longValue();
            String code = (String) acct.get("glCode");
            String name = (String) acct.get("name");

            // Skip asset-denominated GL accounts (e.g. 301, 4102) when viewing settlement currency
            if (settlementCurrency.equals(currency) && assetDenominatedGlCodes.contains(code)) {
                continue;
            }

            // Extract type
            String type = "UNKNOWN";
            Object typeObj = acct.get("type");
            if (typeObj instanceof Map<?, ?> typeMap) {
                Object val = typeMap.get("value");
                if (val != null) type = val.toString().toUpperCase();
            }

            // Check if header
            boolean isHeader = false;
            Object usageObj = acct.get("usage");
            if (usageObj instanceof Map<?, ?> usageMap) {
                Object val = usageMap.get("value");
                if (val != null) isHeader = "HEADER".equalsIgnoreCase(val.toString());
            }

            // Parent info
            Long parentId = idToParentId.get(id);
            String parentGlCode = parentId != null ? idToCode.get(parentId) : null;
            int depth = parentId != null ? 1 : 0;

            // Query journal entries for non-header accounts
            BigDecimal debits = BigDecimal.ZERO;
            BigDecimal credits = BigDecimal.ZERO;

            if (!isHeader) {
                try {
                    List<Map<String, Object>> journalEntries =
                            fineractClient.getJournalEntries(id, currency, fromDate, toDate);

                    for (Map<String, Object> entry : journalEntries) {
                        BigDecimal amount = toBigDecimal(entry.get("amount"));
                        Object entryType = entry.get("entryType");
                        String entryTypeValue = "";
                        if (entryType instanceof Map<?, ?> etMap) {
                            Object val = etMap.get("value");
                            if (val != null) entryTypeValue = val.toString();
                        }

                        if ("DEBIT".equalsIgnoreCase(entryTypeValue)) {
                            debits = debits.add(amount);
                        } else if ("CREDIT".equalsIgnoreCase(entryTypeValue)) {
                            credits = credits.add(amount);
                        }
                    }
                } catch (Exception e) {
                    log.warn("Failed to fetch journal entries for GL {} ({}): {}", code, name, e.getMessage());
                }
            }

            BigDecimal balance = debits.subtract(credits);
            totalDebits = totalDebits.add(debits);
            totalCredits = totalCredits.add(credits);

            entries.add(TrialBalanceResponse.TrialBalanceEntry.builder()
                    .glAccountId(id)
                    .glCode(code)
                    .glAccountName(name)
                    .glAccountType(type)
                    .header(isHeader)
                    .parentGlCode(parentGlCode)
                    .depth(depth)
                    .debitAmount(debits)
                    .creditAmount(credits)
                    .balance(balance)
                    .build());
        }

        // Sort by lexicographic GL code — this naturally produces the correct SYSCOHADA hierarchy:
        // "101" < "102" < "201" < "301" < "401" < "4011" < "4012" < "4013" < "410" < "4101" < "4102"
        // Parents (shorter codes) sort before their children (longer codes with same prefix).
        entries.sort(Comparator.comparing(TrialBalanceResponse.TrialBalanceEntry::getGlCode));

        return TrialBalanceResponse.builder()
                .currencyCode(currency)
                .fromDate(fromDate)
                .toDate(toDate)
                .entries(entries)
                .totalDebits(totalDebits)
                .totalCredits(totalCredits)
                .build();
    }

    /**
     * Get list of available currencies from Fineract.
     */
    public List<String> getAvailableCurrencies() {
        List<String> currencies = new ArrayList<>();
        currencies.add(assetServiceConfig.getSettlementCurrency());
        // Could query Fineract for registered currencies, but for now return settlement + known
        return currencies;
    }

    private BigDecimal toBigDecimal(Object value) {
        if (value == null) return BigDecimal.ZERO;
        if (value instanceof Number n) return BigDecimal.valueOf(n.doubleValue());
        try {
            return new BigDecimal(value.toString());
        } catch (NumberFormatException e) {
            return BigDecimal.ZERO;
        }
    }
}
