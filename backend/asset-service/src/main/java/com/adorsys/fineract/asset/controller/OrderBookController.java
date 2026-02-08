package com.adorsys.fineract.asset.controller;

import com.adorsys.fineract.asset.dto.OrderBookResponse;
import com.adorsys.fineract.asset.dto.RecentTradeDto;
import com.adorsys.fineract.asset.service.OrderBookService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Public endpoints for the order book (market maker orders and recent trades).
 */
@RestController
@RequestMapping("/api/orderbook")
@RequiredArgsConstructor
@Tag(name = "Order Book", description = "Market maker orders and recent trades")
public class OrderBookController {

    private final OrderBookService orderBookService;

    @GetMapping("/{assetId}")
    @Operation(summary = "Get order book", description = "Buy/sell sides with price, quantity, and value")
    public ResponseEntity<OrderBookResponse> getOrderBook(@PathVariable String assetId) {
        return ResponseEntity.ok(orderBookService.getOrderBook(assetId));
    }

    @GetMapping("/{assetId}/recent-trades")
    @Operation(summary = "Recent executed trades")
    public ResponseEntity<List<RecentTradeDto>> getRecentTrades(@PathVariable String assetId) {
        return ResponseEntity.ok(orderBookService.getRecentTrades(assetId));
    }
}
