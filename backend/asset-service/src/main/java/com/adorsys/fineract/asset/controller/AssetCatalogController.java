package com.adorsys.fineract.asset.controller;

import com.adorsys.fineract.asset.dto.AssetCategory;
import com.adorsys.fineract.asset.dto.AssetPublicDetailResponse;
import com.adorsys.fineract.asset.dto.AssetResponse;
import com.adorsys.fineract.asset.dto.DiscoverAssetResponse;
import com.adorsys.fineract.asset.service.AssetCatalogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Public endpoints for asset catalog browsing.
 */
@RestController
@RequestMapping("/api/assets")
@RequiredArgsConstructor
@Tag(name = "Asset Catalog", description = "Browse and search the asset marketplace")
public class AssetCatalogController {

    private final AssetCatalogService assetCatalogService;

    @GetMapping
    @Operation(summary = "List active assets", description = "Paginated list with optional category filter and text search")
    public ResponseEntity<Page<AssetResponse>> listAssets(
            @RequestParam(required = false) AssetCategory category,
            @RequestParam(required = false) String search,
            Pageable pageable) {
        return ResponseEntity.ok(assetCatalogService.listAssets(category, search, pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get asset detail", description = "Full asset detail with OHLC, price, supply stats")
    public ResponseEntity<AssetPublicDetailResponse> getAssetDetail(@PathVariable String id) {
        return ResponseEntity.ok(assetCatalogService.getAssetDetail(id));
    }

    @GetMapping("/discover")
    @Operation(summary = "Discover upcoming assets", description = "Pending assets with expected launch dates")
    public ResponseEntity<Page<DiscoverAssetResponse>> discoverAssets(Pageable pageable) {
        return ResponseEntity.ok(assetCatalogService.discoverAssets(pageable));
    }
}
