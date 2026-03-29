package com.adorsys.fineract.asset.controller;

import com.adorsys.fineract.asset.dto.TrialBalanceResponse;
import com.adorsys.fineract.asset.entity.AssetProjection;
import com.adorsys.fineract.asset.repository.AssetProjectionRepository;
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
    private final AssetProjectionRepository assetProjectionRepository;

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

    @GetMapping("/fee-tax-summary")
    @Operation(summary = "Fee and tax summary", description = "Summary of fee and tax GL account balances.")
    @PreAuthorize("@adminSecurity.isOpen() or hasRole('ASSET_MANAGER')")
    public ResponseEntity<java.util.Map<String, Object>> getFeeTaxSummary(
            @RequestParam(required = false) String currencyCode) {
        TrialBalanceResponse tb = accountingReportService.getTrialBalance(currencyCode, null, null);
        java.math.BigDecimal total = tb.getEntries().stream()
                .filter(e -> !e.isHeader())
                .map(e -> e.getCreditAmount().add(e.getDebitAmount()))
                .reduce(java.math.BigDecimal.ZERO, java.math.BigDecimal::add);
        return ResponseEntity.ok(java.util.Map.of(
                "reportType", "FEE_AND_TAX_SUMMARY",
                "entries", tb.getEntries(),
                "totalDebits", tb.getTotalDebits(),
                "totalCredits", tb.getTotalCredits(),
                "total", total
        ));
    }

    @GetMapping("/projections")
    @Operation(summary = "All asset projections", description = "Denormalized per-asset trade volume, spread, fee, and tax totals.")
    @PreAuthorize("@adminSecurity.isOpen() or hasRole('ASSET_MANAGER')")
    public ResponseEntity<List<AssetProjection>> getAllProjections() {
        return ResponseEntity.ok(assetProjectionRepository.findAll());
    }

    @GetMapping("/projections/{assetId}")
    @Operation(summary = "Asset projection", description = "Per-asset trade volume, spread, fee, and tax totals.")
    @PreAuthorize("@adminSecurity.isOpen() or hasRole('ASSET_MANAGER')")
    public ResponseEntity<AssetProjection> getProjection(@PathVariable String assetId) {
        return assetProjectionRepository.findById(assetId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
