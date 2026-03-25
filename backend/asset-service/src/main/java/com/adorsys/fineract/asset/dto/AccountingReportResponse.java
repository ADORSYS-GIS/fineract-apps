package com.adorsys.fineract.asset.dto;

import java.math.BigDecimal;
import java.util.List;

public record AccountingReportResponse(
        String reportType,
        String currencyCode,
        String fromDate,
        String toDate,
        List<ReportEntry> entries,
        BigDecimal total
) {
    public record ReportEntry(
            String category,
            String glCode,
            String description,
            BigDecimal amount,
            int transactionCount
    ) {}
}
