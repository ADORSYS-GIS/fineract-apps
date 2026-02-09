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

    /**
     * Execute a BUY order. User identity and accounts are resolved from the JWT.
     * Uses Fineract Batch API for atomic transfers.
     */
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
        BigDecimal executionPrice = basePrice.add(basePrice.multiply(asset.getSpreadPercent()));

        // 5. Calculate cost
        BigDecimal units = request.units();
        BigDecimal actualCost = units.multiply(executionPrice).setScale(0, RoundingMode.HALF_UP);
        BigDecimal fee = actualCost.multiply(asset.getTradingFeePercent()).setScale(0, RoundingMode.HALF_UP);
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

            // 12. Execute via Fineract Batch API (atomic)
            Long feeCollectionAccountId = assetServiceConfig.getAccounting().getFeeCollectionAccountId();

            List<BatchTransferRequest> transfers = new java.util.ArrayList<>();
            // Transfer 1: Cash leg — user XAF → treasury XAF
            transfers.add(new BatchTransferRequest(
                    userCashAccountId, asset.getTreasuryCashAccountId(),
                    actualCost, "Asset purchase: " + asset.getSymbol()));
            // Transfer 2: Fee leg — user XAF → fee collection
            if (fee.compareTo(BigDecimal.ZERO) > 0) {
                transfers.add(new BatchTransferRequest(
                        userCashAccountId, feeCollectionAccountId,
                        fee, "Trading fee: BUY " + asset.getSymbol()));
            }
            // Transfer 3: Asset leg — treasury asset → user asset
            transfers.add(new BatchTransferRequest(
                    asset.getTreasuryAssetAccountId(), userAssetAccountId,
                    units, "Asset delivery: " + asset.getSymbol()));

            try {
                fineractClient.executeBatchTransfers(transfers);
            } catch (Exception batchError) {
                log.error("Batch transfer failed for BUY order {}: {}", orderId, batchError.getMessage());
                order.setStatus(OrderStatus.FAILED);
                order.setFailureReason("Batch transfer failed: " + batchError.getMessage());
                orderRepository.save(order);
                throw new TradingException("Trade failed: " + batchError.getMessage(), "TRADE_FAILED");
            }

            // 13. Record trade log
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

            // 14. Update portfolio (WAP)
            portfolioService.updatePositionAfterBuy(userId, request.assetId(),
                    userAssetAccountId, units, executionPrice);

            // 15. Update circulating supply
            asset.setCirculatingSupply(asset.getCirculatingSupply().add(units));
            assetRepository.save(asset);

            // 16. Update OHLC
            pricingService.updateOhlcAfterTrade(request.assetId(), executionPrice);

            // 17. Mark order as filled
            order.setStatus(OrderStatus.FILLED);
            orderRepository.save(order);

            log.info("BUY executed: orderId={}, userId={}, asset={}, units={}, price={}, charged={}",
                    orderId, userId, asset.getSymbol(), units, executionPrice, chargedAmount);

            return new TradeResponse(orderId, OrderStatus.FILLED, TradeSide.BUY,
                    units, executionPrice, chargedAmount, fee, null, Instant.now());

        } finally {
            tradeLockService.releaseTradeLock(userId, request.assetId(), lockValue);
        }
    }

    /**
     * Execute a SELL order. User identity and accounts are resolved from the JWT.
     * Uses Fineract Batch API for atomic transfers.
     */
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
        BigDecimal executionPrice = basePrice.subtract(basePrice.multiply(asset.getSpreadPercent()));

        // 5. Calculate XAF amount and fee
        BigDecimal units = request.units();
        BigDecimal grossAmount = units.multiply(executionPrice).setScale(0, RoundingMode.HALF_UP);
        BigDecimal fee = grossAmount.multiply(asset.getTradingFeePercent()).setScale(0, RoundingMode.HALF_UP);
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

            // 12. Execute via Fineract Batch API (atomic)
            Long feeCollectionAccountId = assetServiceConfig.getAccounting().getFeeCollectionAccountId();

            List<BatchTransferRequest> transfers = new java.util.ArrayList<>();
            // Transfer 1: Asset leg — user asset → treasury asset
            transfers.add(new BatchTransferRequest(
                    userAssetAccountId, asset.getTreasuryAssetAccountId(),
                    units, "Asset sell: " + asset.getSymbol()));
            // Transfer 2: Cash leg — treasury XAF → user XAF (net proceeds)
            transfers.add(new BatchTransferRequest(
                    asset.getTreasuryCashAccountId(), userCashAccountId,
                    netAmount, "Asset sale proceeds: " + asset.getSymbol()));
            // Transfer 3: Fee leg — treasury XAF → fee collection
            if (fee.compareTo(BigDecimal.ZERO) > 0) {
                transfers.add(new BatchTransferRequest(
                        asset.getTreasuryCashAccountId(), feeCollectionAccountId,
                        fee, "Trading fee: SELL " + asset.getSymbol()));
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

            // 13. Calculate realized P&L and update portfolio
            BigDecimal realizedPnl = portfolioService.updatePositionAfterSell(
                    userId, request.assetId(), units, executionPrice);

            // 14. Record trade log
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

            // 15. Update circulating supply
            asset.setCirculatingSupply(asset.getCirculatingSupply().subtract(units));
            assetRepository.save(asset);

            // 16. Update OHLC
            pricingService.updateOhlcAfterTrade(request.assetId(), executionPrice);

            // 17. Mark order as filled
            order.setStatus(OrderStatus.FILLED);
            orderRepository.save(order);

            log.info("SELL executed: orderId={}, userId={}, asset={}, units={}, price={}, pnl={}",
                    orderId, userId, asset.getSymbol(), units, executionPrice, realizedPnl);

            return new TradeResponse(orderId, OrderStatus.FILLED, TradeSide.SELL,
                    units, executionPrice, netAmount, fee, realizedPnl, Instant.now());

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

        // Create a new savings account for this asset currency
        log.info("Creating asset account for user {} and asset {} (product {})",
                userId, assetId, asset.getFineractProductId());
        Long accountId = fineractClient.createSavingsAccount(userId, asset.getFineractProductId());
        fineractClient.approveSavingsAccount(accountId);
        fineractClient.activateSavingsAccount(accountId);

        log.info("Created and activated asset account {} for user {} and asset {}",
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
