package com.adorsys.fineract.asset.controller;

import com.adorsys.fineract.asset.dto.*;
import com.adorsys.fineract.asset.service.TradingService;
import com.adorsys.fineract.asset.util.JwtUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

/**
 * Authenticated endpoints for trading operations.
 */
@RestController
@RequestMapping("/api/trades")
@RequiredArgsConstructor
@Tag(name = "Trading", description = "Buy and sell assets")
public class TradeController {

    private final TradingService tradingService;

    @PostMapping("/buy")
    @Operation(summary = "Buy asset", description = "Buy asset units. User identity and accounts are resolved from JWT.")
    public ResponseEntity<TradeResponse> buy(
            @Valid @RequestBody BuyRequest request,
            @AuthenticationPrincipal Jwt jwt,
            @RequestHeader("X-Idempotency-Key") String idempotencyKey) {
        return ResponseEntity.ok(tradingService.executeBuy(request, jwt, idempotencyKey));
    }

    @PostMapping("/sell")
    @Operation(summary = "Sell asset", description = "Sell asset units. User identity and accounts are resolved from JWT.")
    public ResponseEntity<TradeResponse> sell(
            @Valid @RequestBody SellRequest request,
            @AuthenticationPrincipal Jwt jwt,
            @RequestHeader("X-Idempotency-Key") String idempotencyKey) {
        return ResponseEntity.ok(tradingService.executeSell(request, jwt, idempotencyKey));
    }

    @GetMapping("/orders")
    @Operation(summary = "User's order history", description = "Paginated, filterable by asset")
    public ResponseEntity<Page<OrderResponse>> getOrders(
            @AuthenticationPrincipal Jwt jwt,
            @RequestParam(required = false) String assetId,
            Pageable pageable) {
        Long userId = JwtUtils.extractUserId(jwt);
        return ResponseEntity.ok(tradingService.getUserOrders(userId, assetId, pageable));
    }

    @GetMapping("/orders/{id}")
    @Operation(summary = "Single order status")
    public ResponseEntity<OrderResponse> getOrder(
            @PathVariable String id,
            @AuthenticationPrincipal Jwt jwt) {
        Long userId = JwtUtils.extractUserId(jwt);
        return ResponseEntity.ok(tradingService.getOrder(id, userId));
    }
}
