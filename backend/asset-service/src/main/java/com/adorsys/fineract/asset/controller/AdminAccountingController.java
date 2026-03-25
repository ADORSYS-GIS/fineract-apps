package com.adorsys.fineract.asset.controller;

import com.adorsys.fineract.asset.dto.AccountingReportResponse;
import com.adorsys.fineract.asset.dto.TrialBalanceResponse;
import com.adorsys.fineract.asset.service.AccountingReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/admin/accounting")
@RequiredArgsConstructor
@PreAuthorize("@adminSecurity.isOpen() or hasRole('ASSET_MANAGER')")
@Tag(name = "Admin - Accounting", description = "Trial balance, fee/tax reports with currency filtering")
public class AdminAccountingController {

    private final AccountingReportService accountingReportService;

    @GetMapping("/trial-balance")
    @Operation(summary = "Trial balance",
            description = "GL-level trial balance from Fineract journal entries, filterable by currency and date range. "
                    + "Shows debits, credits, and net balance for each configured GL account.")
    public ResponseEntity<TrialBalanceResponse> getTrialBalance(
            @Parameter(description = "Currency code filter (e.g. XAF, TBOND1). Defaults to settlement currency.")
            @RequestParam(required = false) String currencyCode,
            @Parameter(description = "Start date (inclusive)")
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @Parameter(description = "End date (inclusive)")
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate) {
        return ResponseEntity.ok(accountingReportService.getTrialBalance(currencyCode, fromDate, toDate));
    }

    @GetMapping("/fee-tax-summary")
    @Operation(summary = "Fee and tax summary",
            description = "Aggregated summary of platform fees, spread income, and tax expenses from local data. "
                    + "Faster than the trial balance endpoint and includes transaction counts.")
    public ResponseEntity<AccountingReportResponse> getFeeTaxSummary(
            @Parameter(description = "Currency code filter. Defaults to settlement currency.")
            @RequestParam(required = false) String currencyCode,
            @Parameter(description = "Start date (inclusive)")
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @Parameter(description = "End date (inclusive)")
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate) {
        return ResponseEntity.ok(accountingReportService.getFeeAndTaxSummary(currencyCode, fromDate, toDate));
    }
}
