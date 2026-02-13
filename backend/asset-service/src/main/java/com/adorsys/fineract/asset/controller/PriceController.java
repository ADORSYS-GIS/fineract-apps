package com.adorsys.fineract.asset.controller;

import com.adorsys.fineract.asset.dto.CurrentPriceResponse;
import com.adorsys.fineract.asset.dto.OhlcResponse;
import com.adorsys.fineract.asset.dto.PriceHistoryResponse;
import com.adorsys.fineract.asset.service.PricingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Public endpoints for asset pricing data.
 */
@RestController
@RequestMapping("/api/prices")
@RequiredArgsConstructor
@Tag(name = "Prices", description = "Current prices, OHLC, and price history")
public class PriceController {

    private final PricingService pricingService;

    @GetMapping("/{assetId}")
    @Operation(summary = "Get current price + OHLC")
    public ResponseEntity<CurrentPriceResponse> getCurrentPrice(@PathVariable String assetId) {
        return ResponseEntity.ok(pricingService.getCurrentPrice(assetId));
    }

    @GetMapping("/{assetId}/ohlc")
    @Operation(summary = "Get OHLC data")
    public ResponseEntity<OhlcResponse> getOhlc(@PathVariable String assetId) {
        return ResponseEntity.ok(pricingService.getOhlc(assetId));
    }

    @GetMapping("/{assetId}/history")
    @Operation(summary = "Price history for charts", description = "Periods: 1D, 1W, 1M, 3M, 1Y, ALL")
    public ResponseEntity<PriceHistoryResponse> getPriceHistory(
            @PathVariable String assetId,
            @RequestParam(defaultValue = "1Y") String period) {
        return ResponseEntity.ok(pricingService.getPriceHistory(assetId, period));
    }

}
