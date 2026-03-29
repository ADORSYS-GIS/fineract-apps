package com.adorsys.fineract.asset.controller;

import com.adorsys.fineract.asset.dto.SettlementRequest;
import com.adorsys.fineract.asset.entity.Settlement;
import com.adorsys.fineract.asset.service.SettlementService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Settlement endpoints for LP payouts, tax remittances, and trust rebalancing.
 * Supports maker-checker approval workflow.
 */
@RestController
@RequestMapping("/admin/settlement")
@RequiredArgsConstructor
@Tag(name = "Settlement", description = "LP payout, tax remittance, and trust account settlement")
public class SettlementController {

    private final SettlementService settlementService;

    @PostMapping
    @Operation(summary = "Create settlement", description = "Create a new settlement request (status: PENDING).")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Settlement created"),
        @ApiResponse(responseCode = "400", description = "Invalid request"),
        @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @PreAuthorize("@adminSecurity.isOpen() or hasRole('ASSET_MANAGER')")
    public ResponseEntity<Settlement> create(@Valid @RequestBody SettlementRequest request, Authentication auth) {
        Settlement settlement = Settlement.builder()
                .settlementType(request.settlementType())
                .amount(request.amount())
                .lpClientId(request.lpClientId())
                .description(request.description())
                .sourceGlCode(request.sourceGlCode())
                .destinationGlCode(request.destinationGlCode())
                .createdBy(auth != null ? auth.getName() : "system")
                .build();
        return ResponseEntity.ok(settlementService.createSettlement(settlement));
    }

    @GetMapping
    @Operation(summary = "List settlements", description = "List settlements with optional status filter.")
    @PreAuthorize("@adminSecurity.isOpen() or hasRole('ASSET_MANAGER')")
    public ResponseEntity<Page<Settlement>> list(
            @RequestParam(required = false) String status,
            Pageable pageable) {
        List<String> statuses = (status != null && !status.isBlank()) ? List.of(status) : null;
        return ResponseEntity.ok(settlementService.getSettlements(statuses, pageable));
    }

    @GetMapping("/pending")
    @Operation(summary = "Pending settlements", description = "List all pending settlements awaiting approval.")
    @PreAuthorize("@adminSecurity.isOpen() or hasRole('ASSET_MANAGER')")
    public ResponseEntity<List<Settlement>> getPending() {
        return ResponseEntity.ok(settlementService.getPendingSettlements());
    }

    @GetMapping("/summary")
    @Operation(summary = "Settlement summary", description = "Aggregate counts of pending, approved, and total settlements.")
    @PreAuthorize("@adminSecurity.isOpen() or hasRole('ASSET_MANAGER')")
    public ResponseEntity<Map<String, Object>> getSummary() {
        return ResponseEntity.ok(settlementService.getSummary());
    }

    @PostMapping("/{id}/approve")
    @Operation(summary = "Approve settlement", description = "Approve a pending settlement (maker-checker: approver must differ from creator).")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Settlement approved"),
        @ApiResponse(responseCode = "400", description = "Not PENDING or same user as creator (maker-checker violation)"),
        @ApiResponse(responseCode = "404", description = "Settlement not found")
    })
    @PreAuthorize("@adminSecurity.isOpen() or hasRole('ASSET_MANAGER')")
    public ResponseEntity<Settlement> approve(@PathVariable String id, Authentication auth) {
        String approver = auth != null ? auth.getName() : "system";
        return ResponseEntity.ok(settlementService.approveSettlement(id, approver));
    }

    @PostMapping("/{id}/execute")
    @Operation(summary = "Execute settlement", description = "Execute an approved settlement (creates Fineract journal entry via batch API).")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Settlement executed, GL journal entry posted"),
        @ApiResponse(responseCode = "400", description = "Not APPROVED or GL codes not found"),
        @ApiResponse(responseCode = "404", description = "Settlement not found")
    })
    @PreAuthorize("@adminSecurity.isOpen() or hasRole('ASSET_MANAGER')")
    public ResponseEntity<Settlement> execute(@PathVariable String id) {
        return ResponseEntity.ok(settlementService.executeSettlement(id));
    }

    @PostMapping("/{id}/reject")
    @Operation(summary = "Reject settlement", description = "Reject a pending or approved settlement.")
    @PreAuthorize("@adminSecurity.isOpen() or hasRole('ASSET_MANAGER')")
    public ResponseEntity<Settlement> reject(@PathVariable String id, @RequestBody(required = false) Map<String, String> body) {
        String reason = body != null ? body.get("reason") : null;
        return ResponseEntity.ok(settlementService.rejectSettlement(id, reason));
    }

    @GetMapping("/{id}/report")
    @Operation(summary = "Export settlement report", description = "Download settlement as CSV for bank wire instructions.")
    @PreAuthorize("@adminSecurity.isOpen() or hasRole('ASSET_MANAGER')")
    public ResponseEntity<String> exportReport(@PathVariable String id) {
        Settlement s = settlementService.getSettlement(id);
        StringBuilder csv = new StringBuilder();
        csv.append("Settlement ID,Type,Status,Amount (XAF),LP Client ID,Source GL,Destination GL,Created By,Created At,Approved By,Approved At,Description\n");
        csv.append(String.format("%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s\n",
                s.getId(), s.getSettlementType(), s.getStatus(), s.getAmount(),
                s.getLpClientId() != null ? s.getLpClientId() : "",
                sanitizeCsv(s.getSourceGlCode()),
                sanitizeCsv(s.getDestinationGlCode()),
                sanitizeCsv(s.getCreatedBy()),
                s.getCreatedAt() != null ? s.getCreatedAt() : "",
                sanitizeCsv(s.getApprovedBy()),
                s.getApprovedAt() != null ? s.getApprovedAt() : "",
                sanitizeCsv(s.getDescription())));
        return ResponseEntity.ok()
                .header("Content-Type", "text/csv")
                .header("Content-Disposition", "attachment; filename=settlement-" + id + ".csv")
                .body(csv.toString());
    }

    @GetMapping("/lp-balances")
    @Operation(summary = "LP unsettled balances", description = "Per-LP LSAV/LSPD/LTAX balances for settlement creation.")
    @PreAuthorize("@adminSecurity.isOpen() or hasRole('ASSET_MANAGER')")
    public ResponseEntity<?> getLpBalances() {
        return ResponseEntity.ok(settlementService.getLpBalances());
    }

    @GetMapping("/trust-balances")
    @Operation(summary = "Trust account balances", description = "Physical cash balances in MoMo, Orange, UBA, Afriland trust accounts.")
    @PreAuthorize("@adminSecurity.isOpen() or hasRole('ASSET_MANAGER')")
    public ResponseEntity<?> getTrustBalances() {
        return ResponseEntity.ok(settlementService.getTrustBalances());
    }

    @GetMapping("/rebalance-proposal")
    @Operation(summary = "Rebalance proposal", description = "Calculate proposed MoMo/Orange → UBA/Afriland transfers to cover LP, tax, and fee obligations.")
    @PreAuthorize("@adminSecurity.isOpen() or hasRole('ASSET_MANAGER')")
    public ResponseEntity<com.adorsys.fineract.asset.dto.RebalanceProposalResponse> getRebalanceProposal(
            @RequestParam(required = false) java.math.BigDecimal reservePercent) {
        return ResponseEntity.ok(settlementService.proposeRebalance(reservePercent));
    }

    @PostMapping("/rebalance-proposal/execute")
    @Operation(summary = "Execute rebalance proposal", description = "Batch-create all proposed settlements as PENDING.")
    @PreAuthorize("@adminSecurity.isOpen() or hasRole('ASSET_MANAGER')")
    public ResponseEntity<?> executeRebalanceProposal(
            @RequestBody com.adorsys.fineract.asset.dto.ExecuteRebalanceRequest request) {
        return ResponseEntity.ok(settlementService.executeRebalanceProposal(request, "admin"));
    }

    /** Sanitize a string for CSV output — prevent formula injection (OWASP). */
    private static String sanitizeCsv(String value) {
        if (value == null) return "";
        String v = value.replace(",", ";").replace("\"", "'");
        if (v.startsWith("=") || v.startsWith("+") || v.startsWith("-") || v.startsWith("@")) {
            v = "'" + v;
        }
        return v;
    }
}
