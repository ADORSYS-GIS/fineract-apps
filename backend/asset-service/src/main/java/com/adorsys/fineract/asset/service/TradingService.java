package com.adorsys.fineract.asset.service;

import com.adorsys.fineract.asset.client.FineractClient;
import com.adorsys.fineract.asset.client.FineractClient.BatchTransferRequest;
import com.adorsys.fineract.asset.config.AssetServiceConfig;
import com.adorsys.fineract.asset.dto.*;
import com.adorsys.fineract.asset.entity.Asset;
import com.adorsys.fineract.asset.entity.Order;
import com.adorsys.fineract.asset.entity.TradeLog;
import com.adorsys.fineract.asset.entity.UserPosition;
import com.adorsys.fineract.asset.exception.AssetException;
import com.adorsys.fineract.asset.exception.InsufficientInventoryException;
import com.adorsys.fineract.asset.exception.TradingException;
import com.adorsys.fineract.asset.exception.TradingHaltedException;
import com.adorsys.fineract.asset.metrics.AssetMetrics;
import com.adorsys.fineract.asset.repository.AssetRepository;
import com.adorsys.fineract.asset.repository.OrderRepository;
import com.adorsys.fineract.asset.repository.TradeLogRepository;
import com.adorsys.fineract.asset.repository.UserPositionRepository;
import com.adorsys.fineract.asset.util.JwtUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Core trading engine. Orchestrates buy/sell operations with:
 * - Idempotency checks
 * - Market hours enforcement
 * - Single-price execution (current price +/- spread)
 * - JWT-based user resolution and auto account discovery
 * - Fineract Batch API for atomic transfers (cash + fee + asset legs)
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
    private final UserPositionRepository userPositionRepository;
    private final FineractClient fineractClient;
    private final MarketHoursService marketHoursService;
    private final TradeLockService tradeLockService;
    private final PortfolioService portfolioService;
    private final PricingService pricingService;
    private final AssetServiceConfig assetServiceConfig;
    private final AssetMetrics assetMetrics;

    /**
     * Execute a BUY order. User identity and accounts are resolved from the JWT.
     * Uses Fineract Batch API for atomic transfers.
     */
    @Transactional(timeout = 30)
    public TradeResponse executeBuy(BuyRequest request, Jwt jwt, String idempotencyKey) {
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

        // 4. Get execution price (current price + spread for buy side)
        CurrentPriceResponse priceData = pricingService.getCurrentPrice(request.assetId());
        BigDecimal basePrice = priceData.currentPrice();
        BigDecimal spread = asset.getSpreadPercent() != null ? asset.getSpreadPercent() : BigDecimal.ZERO;
        BigDecimal feePercent = asset.getTradingFeePercent() != null ? asset.getTradingFeePercent() : BigDecimal.ZERO;
        BigDecimal executionPrice = basePrice.add(basePrice.multiply(spread));

        // 5. Calculate cost
        BigDecimal units = request.units();
        BigDecimal actualCost = units.multiply(executionPrice).setScale(0, RoundingMode.HALF_UP);
        BigDecimal fee = actualCost.multiply(feePercent).setScale(0, RoundingMode.HALF_UP);
        BigDecimal chargedAmount = actualCost.add(fee);

        // 6. Verify sufficient inventory
        BigDecimal availableSupply = asset.getTotalSupply().subtract(asset.getCirculatingSupply());
        if (units.compareTo(availableSupply) > 0) {
            throw new InsufficientInventoryException(request.assetId(), units, availableSupply);
        }

        // 7. Resolve user from JWT
        String externalId = JwtUtils.extractExternalId(jwt);
        Map<String, Object> clientData = fineractClient.getClientByExternalId(externalId);
        Long userId = ((Number) clientData.get("id")).longValue();

        // 8. Resolve user XAF account
        Long userCashAccountId = fineractClient.findClientSavingsAccountByCurrency(userId, "XAF");
        if (userCashAccountId == null) {
            throw new TradingException(
                    "No active XAF account found. Please create one in the Account Manager.",
                    "NO_XAF_ACCOUNT");
        }

        // 9. Resolve or create user asset account
        Long userAssetAccountId = resolveOrCreateUserAssetAccount(userId, request.assetId(), asset);

        // 10. Create order
        String orderId = UUID.randomUUID().toString();
        Order order = Order.builder()
                .id(orderId)
                .idempotencyKey(idempotencyKey)
                .userId(userId)
                .userExternalId(externalId)
                .assetId(request.assetId())
                .side(TradeSide.BUY)
                .xafAmount(chargedAmount)
                .units(units)
                .executionPrice(executionPrice)
                .fee(fee)
                .status(OrderStatus.PENDING)
                .build();
        orderRepository.save(order);

        // 11. Acquire distributed lock
        String lockValue = tradeLockService.acquireTradeLock(userId, request.assetId());

        try {
            order.setStatus(OrderStatus.EXECUTING);
            orderRepository.save(order);

            // 12a. Re-verify inventory INSIDE the lock to prevent race condition
            Asset lockedAsset = assetRepository.findById(request.assetId())
                    .orElseThrow(() -> new AssetException("Asset not found: " + request.assetId()));
            BigDecimal lockedAvailableSupply = lockedAsset.getTotalSupply().subtract(lockedAsset.getCirculatingSupply());
            if (units.compareTo(lockedAvailableSupply) > 0) {
                order.setStatus(OrderStatus.REJECTED);
                order.setFailureReason("Insufficient inventory");
                orderRepository.save(order);
                throw new InsufficientInventoryException(request.assetId(), units, lockedAvailableSupply);
            }

            // 12b. Re-fetch authoritative price inside the lock to avoid stale pricing
            CurrentPriceResponse lockedPriceData = pricingService.getCurrentPrice(request.assetId());
            BigDecimal lockedBasePrice = lockedPriceData.currentPrice();
            executionPrice = lockedBasePrice.add(lockedBasePrice.multiply(spread));
            actualCost = units.multiply(executionPrice).setScale(0, RoundingMode.HALF_UP);
            fee = actualCost.multiply(feePercent).setScale(0, RoundingMode.HALF_UP);
            chargedAmount = actualCost.add(fee);

            // Update order with authoritative locked values
            order.setExecutionPrice(executionPrice);
            order.setXafAmount(chargedAmount);
            order.setFee(fee);
            orderRepository.save(order);

            // 12b2. Verify user has sufficient XAF balance for the purchase
            BigDecimal availableBalance = fineractClient.getAccountBalance(userCashAccountId);
            if (availableBalance.compareTo(chargedAmount) < 0) {
                order.setStatus(OrderStatus.REJECTED);
                order.setFailureReason("Insufficient XAF balance");
                orderRepository.save(order);
                throw new TradingException(
                        "Insufficient XAF balance. Required: " + chargedAmount + " XAF, Available: " + availableBalance + " XAF",
                        "INSUFFICIENT_FUNDS");
            }

            // 12c. Validate fee collection account
            Long feeCollectionAccountId = assetServiceConfig.getAccounting().getFeeCollectionAccountId();
            if (feeCollectionAccountId == null || feeCollectionAccountId <= 0) {
                throw new TradingException(
                        "Fee collection account is not configured. Contact admin.", "CONFIG_ERROR");
            }

            // 12d. Record trade log BEFORE external call to ensure local state is consistent
            TradeLog tradeLog = TradeLog.builder()
                    .id(UUID.randomUUID().toString())
                    .orderId(orderId)
                    .userId(userId)
                    .assetId(request.assetId())
                    .side(TradeSide.BUY)
                    .units(units)
                    .pricePerUnit(executionPrice)
                    .totalAmount(chargedAmount)
                    .fee(fee)
                    .build();
            tradeLogRepository.save(tradeLog);

            // 12e. Update portfolio (WAP) — include fee in cost basis for accurate P&L
            BigDecimal effectiveCostPerUnit = chargedAmount.divide(units, 4, RoundingMode.HALF_UP);
            portfolioService.updatePositionAfterBuy(userId, request.assetId(),
                    userAssetAccountId, units, effectiveCostPerUnit);

            // 12f. Update circulating supply (atomic SQL to prevent lost updates from concurrent trades)
            assetRepository.adjustCirculatingSupply(request.assetId(), units);

            // 12g. Update OHLC
            pricingService.updateOhlcAfterTrade(request.assetId(), executionPrice);

            // 12h. Execute Fineract Batch API LAST — all local DB writes are done, so if this
            // fails, @Transactional rolls back everything cleanly with no orphaned Fineract transfers.
            List<BatchTransferRequest> transfers = new java.util.ArrayList<>();
            transfers.add(new BatchTransferRequest(
                    userCashAccountId, lockedAsset.getTreasuryCashAccountId(),
                    actualCost, "Asset purchase: " + lockedAsset.getSymbol()));
            if (fee.compareTo(BigDecimal.ZERO) > 0) {
                transfers.add(new BatchTransferRequest(
                        userCashAccountId, feeCollectionAccountId,
                        fee, "Trading fee: BUY " + lockedAsset.getSymbol()));
            }
            transfers.add(new BatchTransferRequest(
                    lockedAsset.getTreasuryAssetAccountId(), userAssetAccountId,
                    units, "Asset delivery: " + lockedAsset.getSymbol()));

            try {
                fineractClient.executeBatchTransfers(transfers);
            } catch (Exception batchError) {
                log.error("Batch transfer failed for BUY order {}: {}", orderId, batchError.getMessage());
                order.setStatus(OrderStatus.FAILED);
                order.setFailureReason("Batch transfer failed: " + batchError.getMessage());
                orderRepository.save(order);
                throw new TradingException("Trade failed: " + batchError.getMessage(), "TRADE_FAILED");
            }

            // 13. Mark order as filled
            order.setStatus(OrderStatus.FILLED);
            orderRepository.save(order);

            log.info("BUY executed: orderId={}, userId={}, asset={}, units={}, price={}, charged={}",
                    orderId, userId, lockedAsset.getSymbol(), units, executionPrice, chargedAmount);

            assetMetrics.recordBuy();
            return new TradeResponse(orderId, OrderStatus.FILLED, TradeSide.BUY,
                    units, executionPrice, chargedAmount, fee, null, Instant.now());

        } catch (TradingException e) {
            assetMetrics.recordTradeFailure();
            throw e;
        } catch (Exception e) {
            assetMetrics.recordTradeFailure();
            log.error("Unexpected error during BUY order {}: {}", orderId, e.getMessage(), e);
            throw new TradingException("Trade failed unexpectedly: " + e.getMessage(), "TRADE_FAILED");
        } finally {
            tradeLockService.releaseTradeLock(userId, request.assetId(), lockValue);
        }
    }

    /**
     * Execute a SELL order. User identity and accounts are resolved from the JWT.
     * Uses Fineract Batch API for atomic transfers.
     */
    @Transactional(timeout = 30)
    public TradeResponse executeSell(SellRequest request, Jwt jwt, String idempotencyKey) {
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

        // 4. Get execution price (current price - spread for sell side)
        CurrentPriceResponse priceData = pricingService.getCurrentPrice(request.assetId());
        BigDecimal basePrice = priceData.currentPrice();
        BigDecimal spread = asset.getSpreadPercent() != null ? asset.getSpreadPercent() : BigDecimal.ZERO;
        BigDecimal feePercent = asset.getTradingFeePercent() != null ? asset.getTradingFeePercent() : BigDecimal.ZERO;
        BigDecimal executionPrice = basePrice.subtract(basePrice.multiply(spread));

        // 5. Calculate XAF amount and fee
        BigDecimal units = request.units();
        BigDecimal grossAmount = units.multiply(executionPrice).setScale(0, RoundingMode.HALF_UP);
        BigDecimal fee = grossAmount.multiply(feePercent).setScale(0, RoundingMode.HALF_UP);
        BigDecimal netAmount = grossAmount.subtract(fee);

        // 6. Resolve user from JWT
        String externalId = JwtUtils.extractExternalId(jwt);
        Map<String, Object> clientData = fineractClient.getClientByExternalId(externalId);
        Long userId = ((Number) clientData.get("id")).longValue();

        // 7. Resolve user XAF account
        Long userCashAccountId = fineractClient.findClientSavingsAccountByCurrency(userId, "XAF");
        if (userCashAccountId == null) {
            throw new TradingException(
                    "No active XAF account found. Please create one in the Account Manager.",
                    "NO_XAF_ACCOUNT");
        }

        // 8. Resolve user asset account from existing position
        UserPosition position = userPositionRepository.findByUserIdAndAssetId(userId, request.assetId())
                .orElseThrow(() -> new TradingException(
                        "No position found for this asset. You must own units before selling.",
                        "NO_POSITION"));
        Long userAssetAccountId = position.getFineractSavingsAccountId();

        // 9. Validate sufficient units
        if (units.compareTo(position.getTotalUnits()) > 0) {
            throw new TradingException(
                    "Insufficient units. You hold " + position.getTotalUnits() + " but tried to sell " + units,
                    "INSUFFICIENT_UNITS");
        }

        // 10. Create order
        String orderId = UUID.randomUUID().toString();
        Order order = Order.builder()
                .id(orderId)
                .idempotencyKey(idempotencyKey)
                .userId(userId)
                .userExternalId(externalId)
                .assetId(request.assetId())
                .side(TradeSide.SELL)
                .xafAmount(netAmount)
                .units(units)
                .executionPrice(executionPrice)
                .fee(fee)
                .status(OrderStatus.PENDING)
                .build();
        orderRepository.save(order);

        // 11. Acquire distributed lock
        String lockValue = tradeLockService.acquireTradeLock(userId, request.assetId());

        try {
            order.setStatus(OrderStatus.EXECUTING);
            orderRepository.save(order);

            // 12a. Re-fetch asset INSIDE the lock to prevent stale treasury account IDs
            Asset lockedAsset = assetRepository.findById(request.assetId())
                    .orElseThrow(() -> new AssetException("Asset not found: " + request.assetId()));

            // 12b. Re-verify position INSIDE the lock to prevent race condition on concurrent sells
            UserPosition lockedPosition = userPositionRepository.findByUserIdAndAssetId(userId, request.assetId())
                    .orElseThrow(() -> new TradingException("No position found (concurrent sell detected)", "NO_POSITION"));
            if (units.compareTo(lockedPosition.getTotalUnits()) > 0) {
                order.setStatus(OrderStatus.REJECTED);
                order.setFailureReason("Insufficient units after lock");
                orderRepository.save(order);
                throw new TradingException(
                        "Insufficient units. You hold " + lockedPosition.getTotalUnits() + " but tried to sell " + units,
                        "INSUFFICIENT_UNITS");
            }

            // 12c. Re-fetch authoritative price inside the lock to avoid stale pricing
            CurrentPriceResponse lockedPriceData = pricingService.getCurrentPrice(request.assetId());
            BigDecimal lockedBasePrice = lockedPriceData.currentPrice();
            executionPrice = lockedBasePrice.subtract(lockedBasePrice.multiply(spread));
            grossAmount = units.multiply(executionPrice).setScale(0, RoundingMode.HALF_UP);
            fee = grossAmount.multiply(feePercent).setScale(0, RoundingMode.HALF_UP);
            netAmount = grossAmount.subtract(fee);

            // Update order with authoritative locked values
            order.setExecutionPrice(executionPrice);
            order.setXafAmount(netAmount);
            order.setFee(fee);
            orderRepository.save(order);

            // 12d. Validate fee collection account
            Long feeCollectionAccountId = assetServiceConfig.getAccounting().getFeeCollectionAccountId();
            if (feeCollectionAccountId == null || feeCollectionAccountId <= 0) {
                throw new TradingException(
                        "Fee collection account is not configured. Contact admin.", "CONFIG_ERROR");
            }

            // 12e. Calculate realized P&L and update local DB BEFORE external call
            BigDecimal netProceedsPerUnit = netAmount.divide(units, 4, RoundingMode.HALF_UP);
            BigDecimal realizedPnl = portfolioService.updatePositionAfterSell(
                    userId, request.assetId(), units, netProceedsPerUnit);

            // 12f. Record trade log
            TradeLog tradeLog = TradeLog.builder()
                    .id(UUID.randomUUID().toString())
                    .orderId(orderId)
                    .userId(userId)
                    .assetId(request.assetId())
                    .side(TradeSide.SELL)
                    .units(units)
                    .pricePerUnit(executionPrice)
                    .totalAmount(netAmount)
                    .fee(fee)
                    .realizedPnl(realizedPnl)
                    .build();
            tradeLogRepository.save(tradeLog);

            // 12g. Update circulating supply (atomic SQL to prevent lost updates from concurrent trades)
            assetRepository.adjustCirculatingSupply(request.assetId(), units.negate());

            // 12h. Update OHLC
            pricingService.updateOhlcAfterTrade(request.assetId(), executionPrice);

            // 12i. Execute Fineract Batch API LAST — all local DB writes are done, so if this
            // fails, @Transactional rolls back everything cleanly with no orphaned Fineract transfers.
            List<BatchTransferRequest> transfers = new java.util.ArrayList<>();
            transfers.add(new BatchTransferRequest(
                    userAssetAccountId, lockedAsset.getTreasuryAssetAccountId(),
                    units, "Asset sell: " + lockedAsset.getSymbol()));
            transfers.add(new BatchTransferRequest(
                    lockedAsset.getTreasuryCashAccountId(), userCashAccountId,
                    netAmount, "Asset sale proceeds: " + lockedAsset.getSymbol()));
            if (fee.compareTo(BigDecimal.ZERO) > 0) {
                transfers.add(new BatchTransferRequest(
                        lockedAsset.getTreasuryCashAccountId(), feeCollectionAccountId,
                        fee, "Trading fee: SELL " + lockedAsset.getSymbol()));
            }

            try {
                fineractClient.executeBatchTransfers(transfers);
            } catch (Exception batchError) {
                log.error("Batch transfer failed for SELL order {}: {}", orderId, batchError.getMessage());
                order.setStatus(OrderStatus.FAILED);
                order.setFailureReason("Batch transfer failed: " + batchError.getMessage());
                orderRepository.save(order);
                throw new TradingException("Trade failed: " + batchError.getMessage(), "TRADE_FAILED");
            }

            // 13. Mark order as filled
            order.setStatus(OrderStatus.FILLED);
            orderRepository.save(order);

            log.info("SELL executed: orderId={}, userId={}, asset={}, units={}, price={}, pnl={}",
                    orderId, userId, lockedAsset.getSymbol(), units, executionPrice, realizedPnl);

            assetMetrics.recordSell();
            return new TradeResponse(orderId, OrderStatus.FILLED, TradeSide.SELL,
                    units, executionPrice, netAmount, fee, realizedPnl, Instant.now());

        } catch (TradingException e) {
            assetMetrics.recordTradeFailure();
            throw e;
        } catch (Exception e) {
            assetMetrics.recordTradeFailure();
            log.error("Unexpected error during SELL order {}: {}", orderId, e.getMessage(), e);
            throw new TradingException("Trade failed unexpectedly: " + e.getMessage(), "TRADE_FAILED");
        } finally {
            tradeLockService.releaseTradeLock(userId, request.assetId(), lockValue);
        }
    }

    /**
     * Resolve or create the user's Fineract savings account for the given asset.
     * Checks UserPosition first; if no account exists, creates one in Fineract (approve + activate).
     */
    private Long resolveOrCreateUserAssetAccount(Long userId, String assetId, Asset asset) {
        // Check if user already has a position with a Fineract account
        var existingPosition = userPositionRepository.findByUserIdAndAssetId(userId, assetId);
        if (existingPosition.isPresent()) {
            return existingPosition.get().getFineractSavingsAccountId();
        }

        // Check if user already has an active savings account for this asset currency
        Long existingAccountId = fineractClient.findClientSavingsAccountByCurrency(userId, asset.getCurrencyCode());
        if (existingAccountId != null) {
            return existingAccountId;
        }

        // Atomically create, approve, and activate via Fineract Batch API
        log.info("Provisioning asset account for user {} and asset {} (product {})",
                userId, assetId, asset.getFineractProductId());
        Long accountId = fineractClient.provisionSavingsAccount(
                userId, asset.getFineractProductId(), null, null);

        log.info("Provisioned asset account {} atomically for user {} and asset {}",
                accountId, userId, assetId);
        return accountId;
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
            Asset orderAsset = o.getAsset();
            return new OrderResponse(
                    o.getId(), o.getAssetId(),
                    orderAsset != null ? orderAsset.getSymbol() : null,
                    o.getSide(), o.getUnits(), o.getExecutionPrice(),
                    o.getXafAmount(), o.getFee(), o.getStatus(), o.getCreatedAt()
            );
        });
    }

    /**
     * Get a single order by ID. Verifies the order belongs to the requesting user.
     */
    @Transactional(readOnly = true)
    public OrderResponse getOrder(String orderId, Long userId) {
        Order o = orderRepository.findById(orderId)
                .orElseThrow(() -> new AssetException("Order not found: " + orderId));
        if (!o.getUserId().equals(userId)) {
            throw new AssetException("Order not found: " + orderId);
        }
        Asset orderAsset = o.getAsset();
        return new OrderResponse(
                o.getId(), o.getAssetId(),
                orderAsset != null ? orderAsset.getSymbol() : null,
                o.getSide(), o.getUnits(), o.getExecutionPrice(),
                o.getXafAmount(), o.getFee(), o.getStatus(), o.getCreatedAt()
        );
    }
}
