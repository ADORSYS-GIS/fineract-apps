package com.adorsys.fineract.asset.controller;

import com.adorsys.fineract.asset.dto.MarketStatusResponse;
import com.adorsys.fineract.asset.service.MarketHoursService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Public endpoint for market status.
 */
@RestController
@RequestMapping("/api/market")
@RequiredArgsConstructor
@Tag(name = "Market", description = "Market status and schedule")
public class MarketController {

    private final MarketHoursService marketHoursService;

    @GetMapping("/status")
    @Operation(summary = "Get market status", description = "Returns open/closed state, schedule, and countdown timers")
    public ResponseEntity<MarketStatusResponse> getMarketStatus() {
        return ResponseEntity.ok(marketHoursService.getMarketStatus());
    }
}
