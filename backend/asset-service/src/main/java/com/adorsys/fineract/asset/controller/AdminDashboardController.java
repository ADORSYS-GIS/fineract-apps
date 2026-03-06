package com.adorsys.fineract.asset.controller;

import com.adorsys.fineract.asset.dto.AdminDashboardResponse;
import com.adorsys.fineract.asset.dto.AuditLogResponse;
import com.adorsys.fineract.asset.repository.AuditLogRepository;
import com.adorsys.fineract.asset.service.AdminDashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Tag(name = "Admin - Dashboard", description = "Platform-wide metrics, health overview, and audit log")
public class AdminDashboardController {

    private final AdminDashboardService dashboardService;
    private final AuditLogRepository auditLogRepository;

    @GetMapping("/dashboard/summary")
    @Operation(summary = "Dashboard summary",
            description = "Aggregated platform metrics: asset counts, 24h trading activity, order health, reconciliation status")
    public ResponseEntity<AdminDashboardResponse> getSummary() {
        return ResponseEntity.ok(dashboardService.getSummary());
    }

    @GetMapping("/audit-log")
    @Operation(summary = "Audit log",
            description = "Paginated, filterable history of all admin actions")
    public ResponseEntity<Page<AuditLogResponse>> getAuditLog(
            @RequestParam(required = false) String admin,
            @RequestParam(required = false) String assetId,
            @RequestParam(required = false) String action,
            @PageableDefault(size = 20) Pageable pageable) {
        if (pageable.getPageSize() > 100) {
            throw new IllegalArgumentException("Max page size is 100");
        }
        Page<AuditLogResponse> result = auditLogRepository
                .findFiltered(admin, assetId, action, pageable)
                .map(a -> new AuditLogResponse(
                        a.getId(), a.getAction(), a.getAdminSubject(),
                        a.getTargetAssetId(), a.getTargetAssetSymbol(),
                        a.getResult(), a.getErrorMessage(), a.getDurationMs(),
                        a.getRequestSummary(), a.getPerformedAt()));
        return ResponseEntity.ok(result);
    }
}
