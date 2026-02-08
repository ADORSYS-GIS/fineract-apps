package com.adorsys.fineract.asset.controller;

import com.adorsys.fineract.asset.dto.CreateMarketMakerOrderRequest;
import com.adorsys.fineract.asset.entity.MarketMakerOrder;
import com.adorsys.fineract.asset.service.OrderBookService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Admin endpoints for managing market maker orders (the order book).
 */
@RestController
@RequestMapping("/api/admin/orderbook")
@RequiredArgsConstructor
@Tag(name = "Admin - Order Book", description = "Manage market maker orders")
public class AdminOrderBookController {

    private final OrderBookService orderBookService;

    @PostMapping("/{assetId}/orders")
    @Operation(summary = "Place market maker order")
    public ResponseEntity<MarketMakerOrder> createOrder(
            @PathVariable String assetId,
            @Valid @RequestBody CreateMarketMakerOrderRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(orderBookService.createMarketMakerOrder(assetId, request));
    }

    @PutMapping("/{assetId}/orders/{orderId}")
    @Operation(summary = "Update market maker order")
    public ResponseEntity<MarketMakerOrder> updateOrder(
            @PathVariable String assetId,
            @PathVariable String orderId,
            @Valid @RequestBody CreateMarketMakerOrderRequest request) {
        return ResponseEntity.ok(orderBookService.updateMarketMakerOrder(orderId, request));
    }

    @DeleteMapping("/{assetId}/orders/{orderId}")
    @Operation(summary = "Delete market maker order")
    public ResponseEntity<Void> deleteOrder(
            @PathVariable String assetId,
            @PathVariable String orderId) {
        orderBookService.deleteMarketMakerOrder(orderId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{assetId}/orders")
    @Operation(summary = "List all market maker orders for an asset")
    public ResponseEntity<List<MarketMakerOrder>> listOrders(@PathVariable String assetId) {
        return ResponseEntity.ok(orderBookService.listMarketMakerOrders(assetId));
    }
}
