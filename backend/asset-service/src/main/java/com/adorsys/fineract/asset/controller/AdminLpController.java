package com.adorsys.fineract.asset.controller;

import com.adorsys.fineract.asset.dto.*;
import com.adorsys.fineract.asset.service.AdminLpService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/lp")
@RequiredArgsConstructor
@Tag(name = "Admin - LP Management", description = "Register LP partners and query their account details and shortfalls")
@PreAuthorize("@adminSecurity.isOpen() or hasRole('ASSET_MANAGER')")
public class AdminLpController {

    private final AdminLpService adminLpService;

    @PostMapping
    @Operation(summary = "Register a new LP partner and provision their 3 Fineract savings accounts atomically")
    public ResponseEntity<LpDetailResponse> createLp(@Valid @RequestBody CreateLpRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(adminLpService.createLp(request));
    }

    @GetMapping("/{lpClientId}")
    @Operation(summary = "Get LP account details including Fineract account numbers")
    public ResponseEntity<LpDetailResponse> getLp(@PathVariable Long lpClientId) {
        return ResponseEntity.ok(adminLpService.getLp(lpClientId));
    }

    @GetMapping("/{lpClientId}/shortfalls")
    @Operation(summary = "Per-asset obligation breakdown vs shared LP cash balance")
    public ResponseEntity<LpShortfallResponse> getShortfalls(@PathVariable Long lpClientId) {
        return ResponseEntity.ok(adminLpService.getShortfalls(lpClientId));
    }
}
