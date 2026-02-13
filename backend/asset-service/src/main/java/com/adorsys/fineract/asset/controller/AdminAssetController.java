package com.adorsys.fineract.asset.controller;

import com.adorsys.fineract.asset.dto.*;
import com.adorsys.fineract.asset.entity.InterestPayment;
import com.adorsys.fineract.asset.repository.InterestPaymentRepository;
import com.adorsys.fineract.asset.service.AssetCatalogService;
import com.adorsys.fineract.asset.service.AssetProvisioningService;
import com.adorsys.fineract.asset.service.InventoryService;
import com.adorsys.fineract.asset.service.PricingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Admin endpoints for asset management.
 */
@RestController
@RequestMapping("/api/admin/assets")
@RequiredArgsConstructor
@Tag(name = "Admin - Asset Management", description = "Create, manage, and configure assets")
public class AdminAssetController {

    private final AssetProvisioningService provisioningService;
    private final AssetCatalogService catalogService;
    private final PricingService pricingService;
    private final InventoryService inventoryService;
    private final InterestPaymentRepository interestPaymentRepository;

    @PostMapping
    @Operation(summary = "Create asset", description = "Create a new asset with Fineract provisioning")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Asset created")
    public ResponseEntity<AssetDetailResponse> createAsset(@Valid @RequestBody CreateAssetRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(provisioningService.createAsset(request));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get asset detail (admin)", description = "Full asset detail including Fineract IDs")
    public ResponseEntity<AssetDetailResponse> getAsset(@PathVariable String id) {
        return ResponseEntity.ok(catalogService.getAssetDetailAdmin(id));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update asset metadata")
    public ResponseEntity<AssetDetailResponse> updateAsset(@PathVariable String id,
                                                            @Valid @RequestBody UpdateAssetRequest request) {
        return ResponseEntity.ok(provisioningService.updateAsset(id, request));
    }

    @PostMapping("/{id}/set-price")
    @Operation(summary = "Manual price override")
    public ResponseEntity<Void> setPrice(@PathVariable String id, @Valid @RequestBody SetPriceRequest request) {
        pricingService.setPrice(id, request);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/activate")
    @Operation(summary = "Activate asset", description = "PENDING -> ACTIVE")
    public ResponseEntity<Void> activateAsset(@PathVariable String id) {
        provisioningService.activateAsset(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/halt")
    @Operation(summary = "Halt trading")
    public ResponseEntity<Void> haltAsset(@PathVariable String id) {
        provisioningService.haltAsset(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/resume")
    @Operation(summary = "Resume trading")
    public ResponseEntity<Void> resumeAsset(@PathVariable String id) {
        provisioningService.resumeAsset(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/mint")
    @Operation(summary = "Mint additional supply", description = "Increase total supply by depositing more tokens into treasury")
    public ResponseEntity<Void> mintSupply(@PathVariable String id,
                                            @Valid @RequestBody MintSupplyRequest request) {
        provisioningService.mintSupply(id, request);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    @Operation(summary = "List all assets (all statuses)")
    public ResponseEntity<Page<AssetResponse>> listAllAssets(
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        if (pageable.getPageSize() > 100) {
            throw new IllegalArgumentException("Max page size is 100");
        }
        return ResponseEntity.ok(catalogService.listAllAssets(pageable));
    }

    @GetMapping("/inventory")
    @Operation(summary = "Supply stats for all assets")
    public ResponseEntity<Page<InventoryResponse>> getInventory(
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        if (pageable.getPageSize() > 100) {
            throw new IllegalArgumentException("Max page size is 100");
        }
        return ResponseEntity.ok(inventoryService.getInventory(pageable));
    }

    @GetMapping("/{id}/coupons")
    @Operation(summary = "Coupon payment history", description = "Paginated list of coupon payments for a bond asset")
    public ResponseEntity<Page<CouponPaymentResponse>> getCouponHistory(
            @PathVariable String id,
            @PageableDefault(size = 20) Pageable pageable) {
        if (pageable.getPageSize() > 100) {
            throw new IllegalArgumentException("Max page size is 100");
        }
        Page<CouponPaymentResponse> result = interestPaymentRepository
                .findByAssetIdOrderByPaidAtDesc(id, pageable)
                .map(this::toCouponPaymentResponse);
        return ResponseEntity.ok(result);
    }

    private CouponPaymentResponse toCouponPaymentResponse(InterestPayment ip) {
        return new CouponPaymentResponse(
                ip.getId(), ip.getUserId(), ip.getUnits(), ip.getFaceValue(),
                ip.getAnnualRate(), ip.getPeriodMonths(), ip.getCashAmount(),
                ip.getFineractTransferId(), ip.getStatus(), ip.getFailureReason(),
                ip.getPaidAt(), ip.getCouponDate()
        );
    }
}
