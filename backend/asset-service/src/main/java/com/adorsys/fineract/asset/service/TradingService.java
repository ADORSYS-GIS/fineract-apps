package com.adorsys.fineract.asset.service;

import com.adorsys.fineract.asset.client.FineractClient;
import com.adorsys.fineract.asset.dto.*;
import com.adorsys.fineract.asset.entity.Asset;
import com.adorsys.fineract.asset.entity.MarketMakerOrder;
import com.adorsys.fineract.asset.entity.Order;
import com.adorsys.fineract.asset.entity.TradeLog;
import com.adorsys.fineract.asset.exception.AssetException;
import com.adorsys.fineract.asset.exception.TradingException;
import com.adorsys.fineract.asset.exception.TradingHaltedException;
import com.adorsys.fineract.asset.repository.AssetRepository;
import com.adorsys.fineract.asset.repository.OrderRepository;
import com.adorsys.fineract.asset.repository.TradeLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.UUID;

/**
 * Core trading engine. Orchestrates buy/sell operations with:
 * - Idempotency checks
 * - Market hours enforcement
 * - Order book matching
 * - Fineract account transfers (cash + asset legs)
 * - Compensating transactions on failure
 * - Portfolio updates (WAP, P&L)
 * - OHLC updates
 * - Redis distributed locks
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class TradingService {

    private final OrderRepository orderRepository;
    private final TradeLogRepository tradeLogRepository;
    private final AssetRepository assetRepository;
    private final FineractClient fineractClient;
    private final MarketHoursService marketHoursService;
    private final OrderBookService orderBookService;
    private final TradeLockService tradeLockService;
    private final PortfolioService portfolioService;
    private final PricingService pricingService;

    /**
     * Execute a BUY order.
     */
    public TradeResponse executeBuy(BuyRequest request, String idempotencyKey) {
        // 1. Idempotency check
        var existingOrder = orderRepository.findByIdempotencyKey(idempotencyKey);
        if (existingOrder.isPresent()) {
            Order o = existingOrder.get();
            return new TradeResponse(o.getId(), o.getStatus(), o.getSide(), o.getUnits(),
                    o.getExecutionPrice(), o.getXafAmount(), o.getFee(), null, o.getCreatedAt());
        }

        // 2. Market hours check
        marketHoursService.assertMarketOpen();

        // 3. Load and validate asset
        Asset asset = assetRepository.findById(request.assetId())
                .orElseThrow(() -> new AssetException("Asset not found: " + request.assetId()));
        if (asset.getStatus() != AssetStatus.ACTIVE) {
            throw new TradingHaltedException(request.assetId());
        }

        // 4. Match against order book
        MarketMakerOrder mmOrder = orderBookService.findBestMatch(
                request.assetId(), TradeSide.BUY, request.orderBookEntryId());
        BigDecimal executionPrice = mmOrder.getPrice();

        // 5. Calculate units and fee
        BigDecimal fee = request.xafAmount().multiply(asset.getTradingFeePercent()).setScale(0, RoundingMode.HALF_UP);
        BigDecimal netAmount = request.xafAmount().subtract(fee);
        BigDecimal units = netAmount.divide(executionPrice, asset.getDecimalPlaces(), RoundingMode.DOWN);

        // 6. Verify sufficient quantity in order book
        if (units.compareTo(mmOrder.getRemainingQuantity()) > 0) {
            throw new TradingException("Insufficient quantity available at this price level", "INSUFFICIENT_INVENTORY");
        }

        // 7. Create order
        String orderId = UUID.randomUUID().toString();
        // Resolve user's Fineract client ID
        var clientData = fineractClient.getClientByExternalId(request.externalId());
        Long userId = ((Number) clientData.get("id")).longValue();

        Order order = Order.builder()
                .id(orderId)
                .idempotencyKey(idempotencyKey)
                .userId(userId)
                .userExternalId(request.externalId())
                .assetId(request.assetId())
                .side(TradeSide.BUY)
                .xafAmount(request.xafAmount())
                .units(units)
                .executionPrice(executionPrice)
                .fee(fee)
                .status(OrderStatus.PENDING)
                .build();
        orderRepository.save(order);

        // 8. Acquire distributed lock
        String lockValue = tradeLockService.acquireTradeLock(userId, request.assetId());

        Long cashTransferId = null;
        Long assetTransferId = null;

        try {
            order.setStatus(OrderStatus.EXECUTING);
            orderRepository.save(order);

            // 9. Cash leg: user XAF account -> treasury XAF account
            cashTransferId = fineractClient.createAccountTransfer(
                    request.userCashAccountId(), asset.getTreasuryCashAccountId(),
                    request.xafAmount(), "Asset purchase: " + asset.getSymbol());

            // 10. Asset leg: treasury asset account -> user asset account
            try {
                assetTransferId = fineractClient.createAccountTransfer(
                        asset.getTreasuryAssetAccountId(), request.userAssetAccountId(),
                        units, "Asset delivery: " + asset.getSymbol());
            } catch (Exception assetLegError) {
                // 11. Compensating transaction - reverse cash leg
                log.error("Asset leg failed, reversing cash leg: {}", assetLegError.getMessage());
                fineractClient.createAccountTransfer(
                        asset.getTreasuryCashAccountId(), request.userCashAccountId(),
                        request.xafAmount(), "REVERSAL: Failed asset purchase " + asset.getSymbol());

                order.setStatus(OrderStatus.FAILED);
                order.setFailureReason("Asset transfer failed: " + assetLegError.getMessage());
                orderRepository.save(order);

                throw new TradingException("Trade failed: asset transfer error. Cash refunded.", "TRADE_FAILED");
            }

            // 12. Record trade log
            TradeLog tradeLog = TradeLog.builder()
                    .id(UUID.randomUUID().toString())
                    .orderId(orderId)
                    .userId(userId)
                    .assetId(request.assetId())
                    .side(TradeSide.BUY)
                    .units(units)
                    .pricePerUnit(executionPrice)
                    .totalAmount(request.xafAmount())
                    .fee(fee)
                    .fineractCashTransferId(cashTransferId)
                    .fineractAssetTransferId(assetTransferId)
                    .build();
            tradeLogRepository.save(tradeLog);

            // 13. Update market maker order quantity
            orderBookService.deductQuantity(mmOrder.getId(), units);

            // 14. Update portfolio (WAP)
            portfolioService.updatePositionAfterBuy(userId, request.assetId(),
                    request.userAssetAccountId(), units, executionPrice);

            // 15. Update circulating supply
            asset.setCirculatingSupply(asset.getCirculatingSupply().add(units));
            assetRepository.save(asset);

            // 16. Update OHLC
            pricingService.updateOhlcAfterTrade(request.assetId(), executionPrice);

            // 17. Mark order as filled
            order.setStatus(OrderStatus.FILLED);
            orderRepository.save(order);

            log.info("BUY executed: orderId={}, userId={}, asset={}, units={}, price={}, total={}",
                    orderId, userId, asset.getSymbol(), units, executionPrice, request.xafAmount());

            return new TradeResponse(orderId, OrderStatus.FILLED, TradeSide.BUY,
                    units, executionPrice, request.xafAmount(), fee, null, Instant.now());

        } finally {
            // 18. Release locks
            tradeLockService.releaseTradeLock(userId, request.assetId(), lockValue);
        }
    }

    /**
     * Execute a SELL order.
     */
    public TradeResponse executeSell(SellRequest request, String idempotencyKey) {
        // 1. Idempotency check
        var existingOrder = orderRepository.findByIdempotencyKey(idempotencyKey);
        if (existingOrder.isPresent()) {
            Order o = existingOrder.get();
            return new TradeResponse(o.getId(), o.getStatus(), o.getSide(), o.getUnits(),
                    o.getExecutionPrice(), o.getXafAmount(), o.getFee(), null, o.getCreatedAt());
        }

        // 2. Market hours check
        marketHoursService.assertMarketOpen();

        // 3. Load and validate asset
        Asset asset = assetRepository.findById(request.assetId())
                .orElseThrow(() -> new AssetException("Asset not found: " + request.assetId()));
        if (asset.getStatus() != AssetStatus.ACTIVE) {
            throw new TradingHaltedException(request.assetId());
        }

        // 4. Match against order book (buy side)
        MarketMakerOrder mmOrder = orderBookService.findBestMatch(
                request.assetId(), TradeSide.SELL, request.orderBookEntryId());
        BigDecimal executionPrice = mmOrder.getPrice();

        // 5. Calculate XAF amount and fee
        BigDecimal grossAmount = request.units().multiply(executionPrice);
        BigDecimal fee = grossAmount.multiply(asset.getTradingFeePercent()).setScale(0, RoundingMode.HALF_UP);
        BigDecimal netAmount = grossAmount.subtract(fee);

        // 6. Create order
        String orderId = UUID.randomUUID().toString();
        var clientData = fineractClient.getClientByExternalId(request.externalId());
        Long userId = ((Number) clientData.get("id")).longValue();

        Order order = Order.builder()
                .id(orderId)
                .idempotencyKey(idempotencyKey)
                .userId(userId)
                .userExternalId(request.externalId())
                .assetId(request.assetId())
                .side(TradeSide.SELL)
                .xafAmount(netAmount)
                .units(request.units())
                .executionPrice(executionPrice)
                .fee(fee)
                .status(OrderStatus.PENDING)
                .build();
        orderRepository.save(order);

        // 7. Acquire distributed lock
        String lockValue = tradeLockService.acquireTradeLock(userId, request.assetId());

        Long assetTransferId = null;
        Long cashTransferId = null;

        try {
            order.setStatus(OrderStatus.EXECUTING);
            orderRepository.save(order);

            // 8. Asset leg: user asset account -> treasury asset account
            assetTransferId = fineractClient.createAccountTransfer(
                    request.userAssetAccountId(), asset.getTreasuryAssetAccountId(),
                    request.units(), "Asset sell: " + asset.getSymbol());

            // 9. Cash leg: treasury XAF account -> user XAF account
            try {
                cashTransferId = fineractClient.createAccountTransfer(
                        asset.getTreasuryCashAccountId(), request.userCashAccountId(),
                        netAmount, "Asset sale proceeds: " + asset.getSymbol());
            } catch (Exception cashLegError) {
                // Compensating transaction - reverse asset leg
                log.error("Cash leg failed, reversing asset leg: {}", cashLegError.getMessage());
                fineractClient.createAccountTransfer(
                        asset.getTreasuryAssetAccountId(), request.userAssetAccountId(),
                        request.units(), "REVERSAL: Failed asset sale " + asset.getSymbol());

                order.setStatus(OrderStatus.FAILED);
                order.setFailureReason("Cash transfer failed: " + cashLegError.getMessage());
                orderRepository.save(order);

                throw new TradingException("Trade failed: cash transfer error. Assets returned.", "TRADE_FAILED");
            }

            // 10. Calculate realized P&L and update portfolio
            BigDecimal realizedPnl = portfolioService.updatePositionAfterSell(
                    userId, request.assetId(), request.units(), executionPrice);

            // 11. Record trade log
            TradeLog tradeLog = TradeLog.builder()
                    .id(UUID.randomUUID().toString())
                    .orderId(orderId)
                    .userId(userId)
                    .assetId(request.assetId())
                    .side(TradeSide.SELL)
                    .units(request.units())
                    .pricePerUnit(executionPrice)
                    .totalAmount(netAmount)
                    .fee(fee)
                    .realizedPnl(realizedPnl)
                    .fineractCashTransferId(cashTransferId)
                    .fineractAssetTransferId(assetTransferId)
                    .build();
            tradeLogRepository.save(tradeLog);

            // 12. Restore market maker order quantity
            orderBookService.restoreQuantity(mmOrder.getId(), request.units());

            // 13. Update circulating supply
            asset.setCirculatingSupply(asset.getCirculatingSupply().subtract(request.units()));
            assetRepository.save(asset);

            // 14. Update OHLC
            pricingService.updateOhlcAfterTrade(request.assetId(), executionPrice);

            // 15. Mark order as filled
            order.setStatus(OrderStatus.FILLED);
            orderRepository.save(order);

            log.info("SELL executed: orderId={}, userId={}, asset={}, units={}, price={}, pnl={}",
                    orderId, userId, asset.getSymbol(), request.units(), executionPrice, realizedPnl);

            return new TradeResponse(orderId, OrderStatus.FILLED, TradeSide.SELL,
                    request.units(), executionPrice, netAmount, fee, realizedPnl, Instant.now());

        } finally {
            tradeLockService.releaseTradeLock(userId, request.assetId(), lockValue);
        }
    }

    /**
     * Get user's order history.
     */
    @Transactional(readOnly = true)
    public Page<OrderResponse> getUserOrders(Long userId, String assetId, Pageable pageable) {
        Page<Order> orders;
        if (assetId != null) {
            orders = orderRepository.findByUserIdAndAssetId(userId, assetId, pageable);
        } else {
            orders = orderRepository.findByUserId(userId, pageable);
        }

        return orders.map(o -> {
            Asset asset = assetRepository.findById(o.getAssetId()).orElse(null);
            return new OrderResponse(
                    o.getId(), o.getAssetId(),
                    asset != null ? asset.getSymbol() : null,
                    o.getSide(), o.getUnits(), o.getExecutionPrice(),
                    o.getXafAmount(), o.getFee(), o.getStatus(), o.getCreatedAt()
            );
        });
    }

    /**
     * Get a single order by ID.
     */
    @Transactional(readOnly = true)
    public OrderResponse getOrder(String orderId) {
        Order o = orderRepository.findById(orderId)
                .orElseThrow(() -> new AssetException("Order not found: " + orderId));
        Asset asset = assetRepository.findById(o.getAssetId()).orElse(null);
        return new OrderResponse(
                o.getId(), o.getAssetId(),
                asset != null ? asset.getSymbol() : null,
                o.getSide(), o.getUnits(), o.getExecutionPrice(),
                o.getXafAmount(), o.getFee(), o.getStatus(), o.getCreatedAt()
        );
    }
}
