package com.adorsys.fineract.asset.controller;

import com.adorsys.fineract.asset.dto.TrialBalanceResponse;
import com.adorsys.fineract.asset.service.AccountingReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Admin endpoints for accounting reports: trial balance, fee/tax summaries, and GL account queries.
 */
@RestController
@RequestMapping("/admin/accounting")
@RequiredArgsConstructor
@Tag(name = "Accounting", description = "GL trial balance and accounting reports")
public class AdminAccountingController {

    private final AccountingReportService accountingReportService;

    @GetMapping("/trial-balance")
    @Operation(summary = "Trial balance", description = "Full trial balance across all GL accounts with SYSCOHADA hierarchy.")
    @PreAuthorize("@adminSecurity.isOpen() or hasRole('ASSET_MANAGER')")
    public ResponseEntity<TrialBalanceResponse> getTrialBalance(
            @RequestParam(required = false) String currencyCode,
            @RequestParam(required = false) String fromDate,
            @RequestParam(required = false) String toDate) {
        return ResponseEntity.ok(accountingReportService.getTrialBalance(currencyCode, fromDate, toDate));
    }

    @GetMapping("/currencies")
    @Operation(summary = "Available currencies", description = "List of available currency codes for reporting.")
    @PreAuthorize("@adminSecurity.isOpen() or hasRole('ASSET_MANAGER')")
    public ResponseEntity<List<String>> getAvailableCurrencies() {
        return ResponseEntity.ok(accountingReportService.getAvailableCurrencies());
    }
}
