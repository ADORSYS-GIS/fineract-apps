package com.adorsys.fineract.asset.controller;

import com.adorsys.fineract.asset.dto.*;
import com.adorsys.fineract.asset.service.TradingService;
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
    @Operation(summary = "Buy asset", description = "Buy an asset at a price level from the order book")
    public ResponseEntity<TradeResponse> buy(
            @Valid @RequestBody BuyRequest request,
            @RequestHeader(value = "X-Idempotency-Key", required = false) String idempotencyKey) {
        if (idempotencyKey == null) {
            idempotencyKey = java.util.UUID.randomUUID().toString();
        }
        return ResponseEntity.ok(tradingService.executeBuy(request, idempotencyKey));
    }

    @PostMapping("/sell")
    @Operation(summary = "Sell asset", description = "Sell an asset back at a price level from the order book")
    public ResponseEntity<TradeResponse> sell(
            @Valid @RequestBody SellRequest request,
            @RequestHeader(value = "X-Idempotency-Key", required = false) String idempotencyKey) {
        if (idempotencyKey == null) {
            idempotencyKey = java.util.UUID.randomUUID().toString();
        }
        return ResponseEntity.ok(tradingService.executeSell(request, idempotencyKey));
    }

    @GetMapping("/orders")
    @Operation(summary = "User's order history", description = "Paginated, filterable by asset")
    public ResponseEntity<Page<OrderResponse>> getOrders(
            @AuthenticationPrincipal Jwt jwt,
            @RequestParam(required = false) String assetId,
            Pageable pageable) {
        Long userId = extractUserId(jwt);
        return ResponseEntity.ok(tradingService.getUserOrders(userId, assetId, pageable));
    }

    @GetMapping("/orders/{id}")
    @Operation(summary = "Single order status")
    public ResponseEntity<OrderResponse> getOrder(@PathVariable String id) {
        return ResponseEntity.ok(tradingService.getOrder(id));
    }

    private Long extractUserId(Jwt jwt) {
        Object clientId = jwt.getClaim("fineract_client_id");
        if (clientId instanceof Number) {
            return ((Number) clientId).longValue();
        }
        return (long) jwt.getSubject().hashCode();
    }
}
