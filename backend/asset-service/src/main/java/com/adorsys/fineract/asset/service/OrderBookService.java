package com.adorsys.fineract.asset.service;

import com.adorsys.fineract.asset.dto.*;
import com.adorsys.fineract.asset.entity.MarketMakerOrder;
import com.adorsys.fineract.asset.entity.TradeLog;
import com.adorsys.fineract.asset.exception.AssetException;
import com.adorsys.fineract.asset.exception.InsufficientInventoryException;
import com.adorsys.fineract.asset.repository.MarketMakerOrderRepository;
import com.adorsys.fineract.asset.repository.TradeLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

/**
 * Service for managing the order book (market maker orders).
 * The company treasury places standing buy/sell orders at various price levels.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class OrderBookService {

    private final MarketMakerOrderRepository marketMakerOrderRepository;
    private final TradeLogRepository tradeLogRepository;

    /**
     * Get the public order book for an asset.
     */
    @Transactional(readOnly = true)
    public OrderBookResponse getOrderBook(String assetId) {
        // Buy orders sorted by price descending (highest bid first)
        List<MarketMakerOrder> buyOrders = marketMakerOrderRepository
                .findByAssetIdAndSideAndIsActiveTrueOrderByPriceDesc(assetId, TradeSide.BUY);

        // Sell orders sorted by price ascending (lowest ask first)
        List<MarketMakerOrder> sellOrders = marketMakerOrderRepository
                .findByAssetIdAndSideAndIsActiveTrueOrderByPriceAsc(assetId, TradeSide.SELL);

        List<TradeLog> recentTrades = tradeLogRepository.findTop20ByAssetIdOrderByExecutedAtDesc(assetId);

        List<OrderBookEntry> buyEntries = buyOrders.stream()
                .map(o -> new OrderBookEntry(o.getId(), o.getPrice(), o.getRemainingQuantity(),
                        o.getPrice().multiply(o.getRemainingQuantity()), TradeSide.BUY))
                .toList();

        List<OrderBookEntry> sellEntries = sellOrders.stream()
                .map(o -> new OrderBookEntry(o.getId(), o.getPrice(), o.getRemainingQuantity(),
                        o.getPrice().multiply(o.getRemainingQuantity()), TradeSide.SELL))
                .toList();

        List<RecentTradeDto> tradeDtos = recentTrades.stream()
                .map(t -> new RecentTradeDto(t.getPricePerUnit(), t.getUnits(), t.getSide(), t.getExecutedAt()))
                .toList();

        return new OrderBookResponse(buyEntries, sellEntries, tradeDtos);
    }

    /**
     * Get recent trades for an asset.
     */
    @Transactional(readOnly = true)
    public List<RecentTradeDto> getRecentTrades(String assetId) {
        return tradeLogRepository.findTop20ByAssetIdOrderByExecutedAtDesc(assetId).stream()
                .map(t -> new RecentTradeDto(t.getPricePerUnit(), t.getUnits(), t.getSide(), t.getExecutedAt()))
                .toList();
    }

    /**
     * Find the best matching market maker order for a user trade.
     * For user BUY: match against SELL orders (lowest ask).
     * For user SELL: match against BUY orders (highest bid).
     */
    @Transactional(readOnly = true)
    public MarketMakerOrder findBestMatch(String assetId, TradeSide userSide, String orderBookEntryId) {
        if (orderBookEntryId != null) {
            return marketMakerOrderRepository.findById(orderBookEntryId)
                    .filter(o -> o.getIsActive() && o.getRemainingQuantity().compareTo(BigDecimal.ZERO) > 0)
                    .orElseThrow(() -> new AssetException("Order book entry not found or depleted: " + orderBookEntryId));
        }

        // Auto-match: best price
        TradeSide matchSide = userSide == TradeSide.BUY ? TradeSide.SELL : TradeSide.BUY;

        List<MarketMakerOrder> orders;
        if (matchSide == TradeSide.SELL) {
            orders = marketMakerOrderRepository.findByAssetIdAndSideAndIsActiveTrueOrderByPriceAsc(assetId, TradeSide.SELL);
        } else {
            orders = marketMakerOrderRepository.findByAssetIdAndSideAndIsActiveTrueOrderByPriceDesc(assetId, TradeSide.BUY);
        }

        return orders.stream()
                .filter(o -> o.getRemainingQuantity().compareTo(BigDecimal.ZERO) > 0)
                .findFirst()
                .orElseThrow(() -> new InsufficientInventoryException(
                        "No market maker orders available for " + matchSide + " side"));
    }

    /**
     * Deduct quantity from a market maker order after a trade.
     */
    @Transactional
    public void deductQuantity(String orderId, BigDecimal units) {
        MarketMakerOrder order = marketMakerOrderRepository.findById(orderId)
                .orElseThrow(() -> new AssetException("Market maker order not found: " + orderId));

        BigDecimal newRemaining = order.getRemainingQuantity().subtract(units);
        if (newRemaining.compareTo(BigDecimal.ZERO) < 0) {
            throw new InsufficientInventoryException("Insufficient quantity in order book entry");
        }

        order.setRemainingQuantity(newRemaining);
        if (newRemaining.compareTo(BigDecimal.ZERO) == 0) {
            order.setIsActive(false);
        }
        marketMakerOrderRepository.save(order);
    }

    /**
     * Restore quantity to a market maker order (used for sell-back).
     */
    @Transactional
    public void restoreQuantity(String orderId, BigDecimal units) {
        MarketMakerOrder order = marketMakerOrderRepository.findById(orderId)
                .orElseThrow(() -> new AssetException("Market maker order not found: " + orderId));

        order.setRemainingQuantity(order.getRemainingQuantity().add(units));
        order.setIsActive(true);
        marketMakerOrderRepository.save(order);
    }

    // --- Admin operations ---

    /**
     * Place a new market maker order (admin).
     */
    @Transactional
    public MarketMakerOrder createMarketMakerOrder(String assetId, CreateMarketMakerOrderRequest request) {
        MarketMakerOrder order = MarketMakerOrder.builder()
                .id(UUID.randomUUID().toString())
                .assetId(assetId)
                .side(request.side())
                .price(request.price())
                .quantity(request.quantity())
                .remainingQuantity(request.quantity())
                .isActive(true)
                .build();

        marketMakerOrderRepository.save(order);
        log.info("Created market maker order: assetId={}, side={}, price={}, qty={}",
                assetId, request.side(), request.price(), request.quantity());
        return order;
    }

    /**
     * Update a market maker order (admin).
     */
    @Transactional
    public MarketMakerOrder updateMarketMakerOrder(String orderId, CreateMarketMakerOrderRequest request) {
        MarketMakerOrder order = marketMakerOrderRepository.findById(orderId)
                .orElseThrow(() -> new AssetException("Market maker order not found: " + orderId));

        order.setPrice(request.price());
        order.setQuantity(request.quantity());
        order.setRemainingQuantity(request.quantity());
        order.setSide(request.side());
        order.setIsActive(true);

        marketMakerOrderRepository.save(order);
        log.info("Updated market maker order: id={}", orderId);
        return order;
    }

    /**
     * Delete a market maker order (admin).
     */
    @Transactional
    public void deleteMarketMakerOrder(String orderId) {
        marketMakerOrderRepository.deleteById(orderId);
        log.info("Deleted market maker order: id={}", orderId);
    }

    /**
     * List all market maker orders for an asset (admin).
     */
    @Transactional(readOnly = true)
    public List<MarketMakerOrder> listMarketMakerOrders(String assetId) {
        return marketMakerOrderRepository.findByAssetIdOrderByCreatedAtDesc(assetId);
    }
}
