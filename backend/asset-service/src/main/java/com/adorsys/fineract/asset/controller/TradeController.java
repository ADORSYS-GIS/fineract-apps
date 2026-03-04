package com.adorsys.fineract.asset.controller;

import com.adorsys.fineract.asset.dto.*;
import com.adorsys.fineract.asset.service.SseEmitterManager;
import com.adorsys.fineract.asset.service.TradingService;
import com.adorsys.fineract.asset.util.JwtUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

/**
 * Authenticated endpoints for trading operations.
 */
@RestController
@RequestMapping("/api/trades")
@RequiredArgsConstructor
@Validated
@Tag(name = "Trading", description = "Buy and sell assets")
public class TradeController {

    private final TradingService tradingService;
    private final SseEmitterManager sseEmitterManager;

    // ── Quote-based async flow ──────────────────────────────────────────

    @PostMapping("/quote")
    @Operation(summary = "Create trade quote",
               description = "Lock a price for a configurable TTL (default 30s). Returns 201 with the quoted order.")
    public ResponseEntity<QuoteResponse> createQuote(
            @Valid @RequestBody QuoteRequest request,
            @AuthenticationPrincipal Jwt jwt,
            @NotBlank @RequestHeader("X-Idempotency-Key") String idempotencyKey) {
        QuoteResponse quote = tradingService.createQuote(request, jwt, idempotencyKey);
        return ResponseEntity.status(HttpStatus.CREATED).body(quote);
    }

    @PostMapping("/orders/{id}/confirm")
    @Operation(summary = "Confirm a quoted order",
               description = "Promotes QUOTED → PENDING for async execution. Returns 202.")
    public ResponseEntity<OrderResponse> confirmOrder(
            @PathVariable String id,
            @AuthenticationPrincipal Jwt jwt) {
        Long userId = JwtUtils.extractUserId(jwt);
        OrderResponse response = tradingService.confirmOrder(id, userId);
        return ResponseEntity.accepted().body(response);
    }

    @GetMapping(value = "/orders/{id}/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    @Operation(summary = "SSE stream for order status",
               description = "Push notifications on every status transition. Auto-closes on terminal state.")
    public SseEmitter streamOrderStatus(
            @PathVariable String id,
            @AuthenticationPrincipal Jwt jwt) {
        Long userId = JwtUtils.extractUserId(jwt);
        tradingService.getOrder(id, userId); // verify ownership
        return sseEmitterManager.subscribe(id);
    }

    // ── Legacy synchronous flow (preserved for backward compatibility) ──

    @PostMapping("/preview")
    @Operation(summary = "Preview trade", description = "Get a price quote and feasibility check without executing.")
    public ResponseEntity<TradePreviewResponse> preview(
            @Valid @RequestBody TradePreviewRequest request,
            @AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(tradingService.previewTrade(request, jwt));
    }

    @PostMapping("/buy")
    @Operation(summary = "Buy asset", description = "Buy asset units. User identity and accounts are resolved from JWT.")
    public ResponseEntity<TradeResponse> buy(
            @Valid @RequestBody BuyRequest request,
            @AuthenticationPrincipal Jwt jwt,
            @NotBlank @RequestHeader("X-Idempotency-Key") String idempotencyKey) {
        return ResponseEntity.ok(tradingService.executeBuy(request, jwt, idempotencyKey));
    }

    @PostMapping("/sell")
    @Operation(summary = "Sell asset", description = "Sell asset units. User identity and accounts are resolved from JWT.")
    public ResponseEntity<TradeResponse> sell(
            @Valid @RequestBody SellRequest request,
            @AuthenticationPrincipal Jwt jwt,
            @NotBlank @RequestHeader("X-Idempotency-Key") String idempotencyKey) {
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

    @PostMapping("/orders/{id}/cancel")
    @Operation(summary = "Cancel order", description = "Cancel a QUOTED, PENDING, or QUEUED order. Only the owning user can cancel.")
    public ResponseEntity<OrderResponse> cancelOrder(
            @PathVariable String id,
            @AuthenticationPrincipal Jwt jwt) {
        Long userId = JwtUtils.extractUserId(jwt);
        return ResponseEntity.ok(tradingService.cancelOrder(id, userId));
    }
}
