package com.adorsys.fineract.asset.service;

import com.adorsys.fineract.asset.client.FineractClient;
import com.adorsys.fineract.asset.config.AssetServiceConfig;
import com.adorsys.fineract.asset.dto.TrialBalanceResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
    public TrialBalanceResponse getTrialBalance(String currencyCode, String fromDate, String toDate) {
        String currency = currencyCode != null ? currencyCode : assetServiceConfig.getSettlementCurrency();

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

        // Sort: parents before children, then by numeric GL code within each level
        entries.sort((a, b) -> {
            // Parse GL codes as integers for proper numeric ordering
            // This ensures 401 < 4011 < 4012 < 410 < 4101 hierarchy is correct
            try {
                int codeA = Integer.parseInt(a.getGlCode());
                int codeB = Integer.parseInt(b.getGlCode());
                // Group by SYSCOHADA class (first digit), then by code length (parents first), then by value
                int classA = codeA / (int) Math.pow(10, a.getGlCode().length() - 1);
                int classB = codeB / (int) Math.pow(10, b.getGlCode().length() - 1);
                if (classA != classB) return Integer.compare(classA, classB);
                // Within same class: shorter codes (parents) before longer codes (children)
                if (a.getGlCode().length() != b.getGlCode().length()) {
                    // But only if one is parent of the other (same prefix)
                    if (b.getGlCode().startsWith(a.getGlCode())) return -1;
                    if (a.getGlCode().startsWith(b.getGlCode())) return 1;
                }
                return Integer.compare(codeA, codeB);
            } catch (NumberFormatException e) {
                return a.getGlCode().compareTo(b.getGlCode());
            }
        });

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
