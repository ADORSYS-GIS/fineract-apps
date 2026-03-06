package com.adorsys.fineract.asset.controller;

import com.adorsys.fineract.asset.dto.LPPerformanceResponse;
import com.adorsys.fineract.asset.service.LPPerformanceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Admin endpoint for LP performance metrics.
 */
@RestController
@RequestMapping("/api/admin/lp")
@RequiredArgsConstructor
@Tag(name = "LP Performance", description = "Liquidity partner performance metrics")
public class LPPerformanceController {

    private final LPPerformanceService lpPerformanceService;

    @GetMapping("/performance")
    @Operation(summary = "LP performance summary", description = "Aggregated spread, buyback premium, and fee metrics.")
    @PreAuthorize("@adminSecurity.isOpen() or hasRole('ASSET_MANAGER')")
    public ResponseEntity<LPPerformanceResponse> getPerformance() {
        return ResponseEntity.ok(lpPerformanceService.getPerformanceSummary());
    }
}
