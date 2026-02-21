package com.adorsys.fineract.asset.controller;

import com.adorsys.fineract.asset.dto.*;
import com.adorsys.fineract.asset.entity.Asset;
import com.adorsys.fineract.asset.entity.InterestPayment;
import com.adorsys.fineract.asset.entity.PrincipalRedemption;
import com.adorsys.fineract.asset.repository.AssetRepository;
import com.adorsys.fineract.asset.repository.InterestPaymentRepository;
import com.adorsys.fineract.asset.repository.PrincipalRedemptionRepository;
import com.adorsys.fineract.asset.scheduler.InterestPaymentScheduler;
import com.adorsys.fineract.asset.service.AssetCatalogService;
import com.adorsys.fineract.asset.service.AssetProvisioningService;
import com.adorsys.fineract.asset.service.CouponForecastService;
import com.adorsys.fineract.asset.service.DelistingService;
import com.adorsys.fineract.asset.service.InventoryService;
import com.adorsys.fineract.asset.service.PricingService;
import com.adorsys.fineract.asset.service.PrincipalRedemptionService;
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
    private final PrincipalRedemptionRepository principalRedemptionRepository;
    private final CouponForecastService couponForecastService;
    private final InterestPaymentScheduler interestPaymentScheduler;
    private final PrincipalRedemptionService principalRedemptionService;
    private final AssetRepository assetRepository;
    private final DelistingService delistingService;

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

    @GetMapping("/{id}/coupon-forecast")
    @Operation(summary = "Coupon obligation forecast",
            description = "Shows remaining coupon liability, principal at maturity, treasury balance, and shortfall for a bond")
    public ResponseEntity<CouponForecastResponse> getCouponForecast(@PathVariable String id) {
        return ResponseEntity.ok(couponForecastService.getForecast(id));
    }

    @PostMapping("/{id}/coupons/trigger")
    @Operation(summary = "Trigger coupon payment",
            description = "Manually trigger coupon payment for a bond, regardless of nextCouponDate")
    public ResponseEntity<CouponTriggerResponse> triggerCouponPayment(@PathVariable String id) {
        Asset bond = assetRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Asset not found: " + id));
        if (bond.getInterestRate() == null || bond.getCouponFrequencyMonths() == null) {
            throw new IllegalArgumentException("Asset " + id + " is not a bond");
        }

        java.time.LocalDate couponDate = bond.getNextCouponDate() != null
                ? bond.getNextCouponDate() : java.time.LocalDate.now();
        interestPaymentScheduler.processBondCoupon(bond, couponDate);

        // Reload to get updated nextCouponDate
        Asset updated = assetRepository.findById(id).orElse(bond);

        // Count results from this coupon date
        var payments = interestPaymentRepository.findByAssetIdOrderByPaidAtDesc(id,
                org.springframework.data.domain.Pageable.unpaged()).getContent().stream()
                .filter(p -> couponDate.equals(p.getCouponDate()))
                .toList();
        int paid = (int) payments.stream().filter(p -> "SUCCESS".equals(p.getStatus())).count();
        int failed = (int) payments.stream().filter(p -> "FAILED".equals(p.getStatus())).count();
        java.math.BigDecimal totalPaid = payments.stream()
                .filter(p -> "SUCCESS".equals(p.getStatus()))
                .map(InterestPayment::getCashAmount)
                .reduce(java.math.BigDecimal.ZERO, java.math.BigDecimal::add);

        return ResponseEntity.ok(new CouponTriggerResponse(
                id, bond.getSymbol(), couponDate, paid, failed, totalPaid, updated.getNextCouponDate()));
    }

    @PostMapping("/{id}/redeem")
    @Operation(summary = "Trigger bond principal redemption",
            description = "Redeems principal for all holders of a MATURED bond at face value. "
                    + "Transfers treasury cash to each holder's XAF account and returns asset units to treasury. "
                    + "Partial failures are isolated — failed holders can be retried by calling this endpoint again.")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Redemption processed")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Bond not MATURED or treasury insufficient")
    public ResponseEntity<RedemptionTriggerResponse> redeemBond(@PathVariable String id) {
        return ResponseEntity.ok(principalRedemptionService.redeemBond(id));
    }

    @GetMapping("/{id}/redemptions")
    @Operation(summary = "Redemption history",
            description = "Paginated list of principal redemption records for a bond asset")
    public ResponseEntity<Page<RedemptionHistoryResponse>> getRedemptionHistory(
            @PathVariable String id,
            @PageableDefault(size = 20) Pageable pageable) {
        if (pageable.getPageSize() > 100) {
            throw new IllegalArgumentException("Max page size is 100");
        }
        Page<RedemptionHistoryResponse> result = principalRedemptionRepository
                .findByAssetIdOrderByRedeemedAtDesc(id, pageable)
                .map(this::toRedemptionHistoryResponse);
        return ResponseEntity.ok(result);
    }

    private RedemptionHistoryResponse toRedemptionHistoryResponse(PrincipalRedemption pr) {
        return new RedemptionHistoryResponse(
                pr.getId(), pr.getUserId(), pr.getUnits(), pr.getFaceValue(),
                pr.getCashAmount(), pr.getRealizedPnl(),
                pr.getFineractCashTransferId(), pr.getFineractAssetTransferId(),
                pr.getStatus(), pr.getFailureReason(),
                pr.getRedeemedAt(), pr.getRedemptionDate()
        );
    }

    @PostMapping("/{id}/delist")
    @Operation(summary = "Initiate asset delisting",
            description = "Sets asset to DELISTING status. BUY is blocked, SELL is allowed. Forced buyback occurs on delisting date.")
    public ResponseEntity<Void> delistAsset(@PathVariable String id,
                                             @RequestBody DelistAssetRequest request) {
        delistingService.initiateDelist(id, request.delistingDate(), request.redemptionPrice());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/cancel-delist")
    @Operation(summary = "Cancel asset delisting",
            description = "Reverts DELISTING status back to ACTIVE. Only works before the delisting date.")
    public ResponseEntity<Void> cancelDelisting(@PathVariable String id) {
        delistingService.cancelDelisting(id);
        return ResponseEntity.ok().build();
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
