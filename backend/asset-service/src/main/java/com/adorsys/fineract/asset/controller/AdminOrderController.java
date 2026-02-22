package com.adorsys.fineract.asset.controller;

import com.adorsys.fineract.asset.dto.*;
import com.adorsys.fineract.asset.service.AdminOrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

/**
 * Admin endpoints for viewing and resolving orders that need manual intervention.
 */
@RestController
@RequestMapping("/api/admin/orders")
@RequiredArgsConstructor
@Tag(name = "Admin - Order Resolution", description = "View and resolve orders requiring manual intervention")
public class AdminOrderController {

    private final AdminOrderService adminOrderService;

    @GetMapping
    @Operation(summary = "List orders with filters",
            description = "Paginated list of orders, filterable by status, asset, search text, and date range")
    public ResponseEntity<Page<AdminOrderResponse>> getOrders(
            @RequestParam(required = false) OrderStatus status,
            @RequestParam(required = false) String assetId,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Instant fromDate,
            @RequestParam(required = false) Instant toDate,
            @PageableDefault(size = 20, sort = "created_at", direction = Sort.Direction.DESC) Pageable pageable) {
        if (pageable.getPageSize() > 100) {
            throw new IllegalArgumentException("Max page size is 100");
        }
        return ResponseEntity.ok(adminOrderService.getFilteredOrders(status, assetId, search, fromDate, toDate, pageable));
    }

    @GetMapping("/summary")
    @Operation(summary = "Order status summary", description = "Counts of orders by resolution-relevant statuses")
    public ResponseEntity<OrderSummaryResponse> getOrderSummary() {
        return ResponseEntity.ok(adminOrderService.getOrderSummary());
    }

    @GetMapping("/asset-options")
    @Operation(summary = "Asset options for order filter", description = "Distinct assets that have orders in resolution-relevant statuses")
    public ResponseEntity<List<AssetOptionResponse>> getAssetOptions() {
        return ResponseEntity.ok(adminOrderService.getOrderAssetOptions());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get order detail", description = "Full order detail including Fineract batch ID and idempotency key")
    public ResponseEntity<OrderDetailResponse> getOrderDetail(@PathVariable String id) {
        return ResponseEntity.ok(adminOrderService.getOrderDetail(id));
    }

    @PostMapping("/{id}/resolve")
    @Operation(summary = "Resolve an order", description = "Manually close a NEEDS_RECONCILIATION or FAILED order")
    public ResponseEntity<AdminOrderResponse> resolveOrder(
            @PathVariable String id,
            @Valid @RequestBody ResolveOrderRequest request,
            @AuthenticationPrincipal Jwt jwt) {
        String adminUsername = jwt != null ? jwt.getClaimAsString("preferred_username") : "system";
        return ResponseEntity.ok(adminOrderService.resolveOrder(id, request.resolution(), adminUsername));
    }
}
