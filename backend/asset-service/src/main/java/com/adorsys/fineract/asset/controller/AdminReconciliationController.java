package com.adorsys.fineract.asset.controller;

import com.adorsys.fineract.asset.dto.ReconciliationReportResponse;
import com.adorsys.fineract.asset.service.ReconciliationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Admin endpoints for viewing and managing reconciliation reports.
 */
@RestController
@RequestMapping("/api/admin/reconciliation")
@RequiredArgsConstructor
@Tag(name = "Admin - Reconciliation", description = "View and manage reconciliation reports")
public class AdminReconciliationController {

    private final ReconciliationService reconciliationService;

    @GetMapping("/reports")
    @Operation(summary = "List reconciliation reports",
            description = "Paginated list of reports, filterable by status, severity, or assetId")
    public Page<ReconciliationReportResponse> getReports(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String severity,
            @RequestParam(required = false) String assetId,
            @PageableDefault(size = 20) Pageable pageable) {
        return reconciliationService.getReports(status, severity, assetId, pageable);
    }

    @PostMapping("/trigger")
    @Operation(summary = "Trigger full reconciliation",
            description = "Run immediate reconciliation across all active assets")
    public Map<String, Integer> triggerReconciliation() {
        int discrepancies = reconciliationService.runDailyReconciliation();
        return Map.of("discrepancies", discrepancies);
    }

    @PostMapping("/trigger/{assetId}")
    @Operation(summary = "Trigger reconciliation for a single asset")
    public Map<String, Integer> triggerAssetReconciliation(@PathVariable String assetId) {
        int discrepancies = reconciliationService.reconcileSingleAsset(assetId);
        return Map.of("discrepancies", discrepancies);
    }

    @PatchMapping("/reports/{id}/acknowledge")
    @Operation(summary = "Acknowledge a reconciliation report")
    public ResponseEntity<Void> acknowledgeReport(
            @PathVariable Long id,
            @RequestParam(defaultValue = "admin") String admin) {
        reconciliationService.acknowledgeReport(id, admin);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/reports/{id}/resolve")
    @Operation(summary = "Resolve a reconciliation report")
    public ResponseEntity<Void> resolveReport(
            @PathVariable Long id,
            @RequestParam(defaultValue = "admin") String admin,
            @RequestParam(required = false) String notes) {
        reconciliationService.resolveReport(id, admin, notes);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/summary")
    @Operation(summary = "Reconciliation summary", description = "Count of open reports")
    public Map<String, Long> getSummary() {
        return Map.of("openReports", reconciliationService.getOpenReportCount());
    }
}
