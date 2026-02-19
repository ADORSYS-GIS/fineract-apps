package com.adorsys.fineract.asset.service;

import com.adorsys.fineract.asset.client.FineractClient;
import com.adorsys.fineract.asset.client.FineractClient.*;
import com.adorsys.fineract.asset.config.AssetServiceConfig;
import com.adorsys.fineract.asset.config.ResolvedGlAccounts;
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
import com.adorsys.fineract.asset.service.trade.BuyStrategy;
import com.adorsys.fineract.asset.service.trade.SellStrategy;
import com.adorsys.fineract.asset.service.trade.TradeContext;
import com.adorsys.fineract.asset.service.trade.TradeStrategy;
import com.adorsys.fineract.asset.util.JwtUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
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
    private final ResolvedGlAccounts resolvedGlAccounts;
    private final AssetMetrics assetMetrics;
    private final BondBenefitService bondBenefitService;

    /**
     * Execute a BUY order. User identity and accounts are resolved from the JWT.
     */
    @Transactional(timeout = 30)
    public TradeResponse executeBuy(BuyRequest request, Jwt jwt, String idempotencyKey) {
        TradeContext ctx = TradeContext.builder()
                .assetId(request.assetId())
                .units(request.units())
                .idempotencyKey(idempotencyKey)
                .jwt(jwt)
                .strategy(BuyStrategy.INSTANCE)
                .build();
        return executeTrade(ctx);
    }

    /**
     * Execute a SELL order. User identity and accounts are resolved from the JWT.
     */
    @Transactional(timeout = 30)
    public TradeResponse executeSell(SellRequest request, Jwt jwt, String idempotencyKey) {
        TradeContext ctx = TradeContext.builder()
                .assetId(request.assetId())
                .units(request.units())
                .idempotencyKey(idempotencyKey)
                .jwt(jwt)
                .strategy(SellStrategy.INSTANCE)
                .build();
        return executeTrade(ctx);
    }

    /**
     * Unified trade execution flow shared by BUY and SELL.
     * Side-specific behavior is handled via {@link TradeStrategy}.
     */
    private TradeResponse executeTrade(TradeContext ctx) {
        TradeStrategy strategy = ctx.getStrategy();
        TradeSide side = strategy.side();
        BigDecimal units = ctx.getUnits();

        // 1. Idempotency check — verify ownership to prevent privilege escalation
        var existingOrder = orderRepository.findByIdempotencyKey(ctx.getIdempotencyKey());
        if (existingOrder.isPresent()) {
            Order o = existingOrder.get();
            String requestingExternalId = JwtUtils.extractExternalId(ctx.getJwt());
            if (!o.getUserExternalId().equals(requestingExternalId)) {
                throw new TradingException("Idempotency key already used", "IDEMPOTENCY_KEY_CONFLICT");
            }
            log.info("Idempotency collision: key={}, returning existing orderId={}", ctx.getIdempotencyKey(), o.getId());
            return new TradeResponse(o.getId(), o.getStatus(), o.getSide(), o.getUnits(),
                    o.getExecutionPrice(), o.getCashAmount(), o.getFee(), o.getSpreadAmount(), null, o.getCreatedAt());
        }

        // 2. Market hours check
        marketHoursService.assertMarketOpen();

        // 3. Load and validate asset
        Asset asset = assetRepository.findById(ctx.getAssetId())
                .orElseThrow(() -> new AssetException("Asset not found: " + ctx.getAssetId()));
        if (asset.getStatus() != AssetStatus.ACTIVE) {
            throw new TradingHaltedException(ctx.getAssetId());
        }
        ctx.setAsset(asset);

        // 3b. BUY only: Subscription period check
        if (side == TradeSide.BUY) {
            if (LocalDate.now().isBefore(asset.getSubscriptionStartDate())) {
                assetMetrics.incrementSubscriptionExpiredRejections();
                throw new TradingException("Subscription period has not started for this asset", "SUBSCRIPTION_NOT_STARTED");
            }
            if (!asset.getSubscriptionEndDate().isAfter(LocalDate.now())) {
                assetMetrics.incrementSubscriptionExpiredRejections();
                throw new TradingException("Subscription period has ended for this asset", "SUBSCRIPTION_ENDED");
            }
        }

        // 4. Get execution price (strategy applies spread in correct direction)
        CurrentPriceResponse priceData = pricingService.getCurrentPrice(ctx.getAssetId());
        BigDecimal basePrice = priceData.currentPrice();
        BigDecimal spread = asset.getSpreadPercent() != null ? asset.getSpreadPercent() : BigDecimal.ZERO;
        BigDecimal effectiveSpread = isSpreadEnabled() ? spread : BigDecimal.ZERO;
        BigDecimal feePercent = asset.getTradingFeePercent() != null ? asset.getTradingFeePercent() : BigDecimal.ZERO;
        BigDecimal executionPrice = strategy.applySpread(basePrice, effectiveSpread);

        ctx.setEffectiveSpread(effectiveSpread);
        ctx.setFeePercent(feePercent);

        // 5. Calculate amounts
        BigDecimal grossAmount = units.multiply(executionPrice).setScale(0, RoundingMode.HALF_UP);
        BigDecimal fee = grossAmount.multiply(feePercent).setScale(0, RoundingMode.HALF_UP);
        BigDecimal spreadAmount = units.multiply(basePrice.multiply(effectiveSpread))
                .setScale(0, RoundingMode.HALF_UP);
        BigDecimal orderCashAmount = strategy.computeOrderCashAmount(grossAmount, fee);

        // 6. BUY: verify sufficient inventory (SELL position check happens after user resolution)
        if (side == TradeSide.BUY) {
            BigDecimal availableSupply = asset.getTotalSupply().subtract(asset.getCirculatingSupply());
            if (units.compareTo(availableSupply) > 0) {
                throw new InsufficientInventoryException(ctx.getAssetId(), units, availableSupply);
            }
        }

        // 7. Resolve user from JWT
        String externalId = JwtUtils.extractExternalId(ctx.getJwt());
        Map<String, Object> clientData = fineractClient.getClientByExternalId(externalId);
        Long userId = ((Number) clientData.get("id")).longValue();
        ctx.setExternalId(externalId);
        ctx.setUserId(userId);

        // 8. Resolve user cash account
        String currency = assetServiceConfig.getSettlementCurrency();
        Long userCashAccountId = fineractClient.findClientSavingsAccountByCurrency(userId, currency);
        if (userCashAccountId == null) {
            throw new TradingException(
                    "No active " + currency + " account found. Please create one in the Account Manager.",
                    "NO_CASH_ACCOUNT");
        }
        ctx.setUserCashAccountId(userCashAccountId);

        // 9. Resolve user asset account
        Long userAssetAccountId;
        if (side == TradeSide.BUY) {
            userAssetAccountId = resolveOrCreateUserAssetAccount(userId, ctx.getAssetId(), asset);
        } else {
            UserPosition position = userPositionRepository.findByUserIdAndAssetId(userId, ctx.getAssetId())
                    .orElseThrow(() -> new TradingException(
                            "No position found for this asset. You must own units before selling.",
                            "NO_POSITION"));
            userAssetAccountId = position.getFineractSavingsAccountId();

            // SELL: validate sufficient units before creating order
            if (units.compareTo(position.getTotalUnits()) > 0) {
                throw new TradingException(
                        "Insufficient units. You hold " + position.getTotalUnits() + " but tried to sell " + units,
                        "INSUFFICIENT_UNITS");
            }
        }
        ctx.setUserAssetAccountId(userAssetAccountId);

        // 10. Create order
        String orderId = UUID.randomUUID().toString();
        ctx.setOrderId(orderId);
        Order order = Order.builder()
                .id(orderId)
                .idempotencyKey(ctx.getIdempotencyKey())
                .userId(userId)
                .userExternalId(externalId)
                .assetId(ctx.getAssetId())
                .side(side)
                .cashAmount(orderCashAmount)
                .units(units)
                .executionPrice(executionPrice)
                .fee(fee)
                .spreadAmount(spreadAmount)
                .status(OrderStatus.PENDING)
                .build();
        orderRepository.save(order);
        ctx.setOrder(order);

        // 11. Acquire distributed lock
        String lockValue = tradeLockService.acquireTradeLock(userId, ctx.getAssetId());
        ctx.setLockValue(lockValue);

        try {
            order.setStatus(OrderStatus.EXECUTING);
            orderRepository.save(order);

            // 12a. Re-fetch asset INSIDE the lock
            Asset lockedAsset = assetRepository.findById(ctx.getAssetId())
                    .orElseThrow(() -> new AssetException("Asset not found: " + ctx.getAssetId()));

            // 12a2. Validate treasury accounts are configured
            if (lockedAsset.getTreasuryCashAccountId() == null || lockedAsset.getTreasuryAssetAccountId() == null) {
                rejectOrder(order, "Asset treasury accounts not configured");
                throw new TradingException(
                        "Asset is not fully configured for trading. Contact admin.", "CONFIG_ERROR");
            }

            // 12b. Side-specific re-verification inside the lock
            if (side == TradeSide.BUY) {
                BigDecimal lockedAvailableSupply = lockedAsset.getTotalSupply().subtract(lockedAsset.getCirculatingSupply());
                if (units.compareTo(lockedAvailableSupply) > 0) {
                    rejectOrder(order, "Insufficient inventory");
                    throw new InsufficientInventoryException(ctx.getAssetId(), units, lockedAvailableSupply);
                }
            } else {
                UserPosition lockedPosition = userPositionRepository.findByUserIdAndAssetId(userId, ctx.getAssetId())
                        .orElseThrow(() -> new TradingException("No position found (concurrent sell detected)", "NO_POSITION"));
                if (units.compareTo(lockedPosition.getTotalUnits()) > 0) {
                    rejectOrder(order, "Insufficient units after lock");
                    throw new TradingException(
                            "Insufficient units. You hold " + lockedPosition.getTotalUnits() + " but tried to sell " + units,
                            "INSUFFICIENT_UNITS");
                }
            }

            // 12c. Re-fetch authoritative price inside the lock to avoid stale pricing
            CurrentPriceResponse lockedPriceData = pricingService.getCurrentPrice(ctx.getAssetId());
            BigDecimal lockedBasePrice = lockedPriceData.currentPrice();
            executionPrice = strategy.applySpread(lockedBasePrice, effectiveSpread);
            grossAmount = units.multiply(executionPrice).setScale(0, RoundingMode.HALF_UP);
            fee = grossAmount.multiply(feePercent).setScale(0, RoundingMode.HALF_UP);
            spreadAmount = units.multiply(lockedBasePrice.multiply(effectiveSpread))
                    .setScale(0, RoundingMode.HALF_UP);
            orderCashAmount = strategy.computeOrderCashAmount(grossAmount, fee);

            // Update order with authoritative locked values
            order.setExecutionPrice(executionPrice);
            order.setCashAmount(orderCashAmount);
            order.setFee(fee);
            order.setSpreadAmount(spreadAmount);
            orderRepository.save(order);

            // 12d. BUY: verify user has sufficient balance
            if (side == TradeSide.BUY) {
                BigDecimal availableBalance = fineractClient.getAccountBalance(userCashAccountId);
                if (availableBalance.compareTo(orderCashAmount) < 0) {
                    rejectOrder(order, "Insufficient " + currency + " balance");
                    throw new TradingException(
                            "Insufficient " + currency + " balance. Required: " + orderCashAmount + " " + currency + ", Available: " + availableBalance + " " + currency,
                            "INSUFFICIENT_FUNDS");
                }
            }

            // 12e. Update portfolio
            BigDecimal realizedPnl = null;
            if (side == TradeSide.BUY) {
                BigDecimal effectiveCostPerUnit = orderCashAmount.divide(units, 4, RoundingMode.HALF_UP);
                portfolioService.updatePositionAfterBuy(userId, ctx.getAssetId(),
                        userAssetAccountId, units, effectiveCostPerUnit);
            } else {
                BigDecimal netProceedsPerUnit = orderCashAmount.divide(units, 4, RoundingMode.HALF_UP);
                realizedPnl = portfolioService.updatePositionAfterSell(
                        userId, ctx.getAssetId(), units, netProceedsPerUnit);
            }

            // 12f. Record trade log
            TradeLog tradeLog = TradeLog.builder()
                    .id(UUID.randomUUID().toString())
                    .orderId(orderId)
                    .userId(userId)
                    .assetId(ctx.getAssetId())
                    .side(side)
                    .units(units)
                    .pricePerUnit(executionPrice)
                    .totalAmount(orderCashAmount)
                    .fee(fee)
                    .spreadAmount(spreadAmount)
                    .realizedPnl(realizedPnl)
                    .build();
            tradeLogRepository.save(tradeLog);

            // 12g. Update circulating supply (atomic SQL)
            BigDecimal supplyDelta = strategy.supplyAdjustment(units);
            int supplyUpdated = assetRepository.adjustCirculatingSupply(ctx.getAssetId(), supplyDelta);
            if (supplyUpdated == 0) {
                String reason = side == TradeSide.BUY ? "Supply constraint violated" : "Supply constraint violated during sell";
                String errorCode = side == TradeSide.BUY ? "SUPPLY_EXCEEDED" : "SUPPLY_ERROR";
                rejectOrder(order, reason);
                throw new TradingException(
                        side == TradeSide.BUY ? "Insufficient available supply for this trade." : "Supply constraint violated during sell.",
                        errorCode);
            }

            // 12h. Update OHLC
            pricingService.updateOhlcAfterTrade(ctx.getAssetId(), executionPrice);

            // 12i. Execute Fineract Batch API LAST — all local DB writes are done, so if this
            // fails, @Transactional rolls back everything cleanly with no orphaned Fineract transfers.
            // All operations (transfers + fee) are included in a single atomic batch.
            List<BatchOperation> batchOps = buildBatchOperations(
                    side, lockedAsset, userCashAccountId, userAssetAccountId,
                    grossAmount, units, fee, spreadAmount, currency);

            try {
                List<Map<String, Object>> batchResponses = fineractClient.executeAtomicBatch(batchOps);
                order.setFineractBatchId(extractBatchId(batchResponses));
            } catch (Exception batchError) {
                log.error("Batch transfer failed for {} order {}: {}", side, orderId, batchError.getMessage());
                order.setStatus(OrderStatus.FAILED);
                order.setFailureReason("Batch transfer failed: " + batchError.getMessage());
                orderRepository.save(order);
                throw new TradingException("Trade failed: " + batchError.getMessage(), "TRADE_FAILED");
            }

            // 13. Mark order as filled
            order.setStatus(OrderStatus.FILLED);
            orderRepository.save(order);

            if (side == TradeSide.BUY) {
                log.info("BUY executed: orderId={}, userId={}, asset={}, units={}, price={}, charged={}",
                        orderId, userId, lockedAsset.getSymbol(), units, executionPrice, orderCashAmount);
                assetMetrics.recordBuy();
            } else {
                log.info("SELL executed: orderId={}, userId={}, asset={}, units={}, price={}, pnl={}",
                        orderId, userId, lockedAsset.getSymbol(), units, executionPrice, realizedPnl);
                assetMetrics.recordSell();
            }

            return new TradeResponse(orderId, OrderStatus.FILLED, side,
                    units, executionPrice, orderCashAmount, fee, spreadAmount, realizedPnl, Instant.now());

        } catch (TradingException e) {
            assetMetrics.recordTradeFailure();
            throw e;
        } catch (Exception e) {
            assetMetrics.recordTradeFailure();
            log.error("Unexpected error during {} order {}: {}", side, orderId, e.getMessage(), e);
            throw new TradingException("Trade failed unexpectedly: " + e.getMessage(), "TRADE_FAILED");
        } finally {
            tradeLockService.releaseTradeLock(userId, ctx.getAssetId(), lockValue);
        }
    }

    /**
     * Build the atomic batch operations for a trade. Includes transfers, spread sweep,
     * fee withdrawal, and fee journal entry — all in one atomic Fineract batch.
     */
    private List<BatchOperation> buildBatchOperations(
            TradeSide side, Asset asset,
            Long userCashAccountId, Long userAssetAccountId,
            BigDecimal grossAmount, BigDecimal units, BigDecimal fee,
            BigDecimal spreadAmount, String currency) {

        List<BatchOperation> ops = new ArrayList<>();

        if (side == TradeSide.BUY) {
            // Cash leg: user XAF -> treasury XAF
            ops.add(new BatchTransferOp(
                    userCashAccountId, asset.getTreasuryCashAccountId(),
                    grossAmount, "Asset purchase: " + asset.getSymbol()));
            // Spread leg (if applicable)
            if (spreadAmount.compareTo(BigDecimal.ZERO) > 0) {
                ops.add(new BatchTransferOp(
                        asset.getTreasuryCashAccountId(),
                        assetServiceConfig.getAccounting().getSpreadCollectionAccountId(),
                        spreadAmount, "Spread: BUY " + asset.getSymbol()));
            }
            // Asset leg: treasury asset -> user asset
            ops.add(new BatchTransferOp(
                    asset.getTreasuryAssetAccountId(), userAssetAccountId,
                    units, "Asset delivery: " + asset.getSymbol()));
        } else {
            // Asset return: user asset -> treasury asset
            ops.add(new BatchTransferOp(
                    userAssetAccountId, asset.getTreasuryAssetAccountId(),
                    units, "Asset sell: " + asset.getSymbol()));
            // Cash credit: treasury XAF -> user XAF (gross proceeds)
            ops.add(new BatchTransferOp(
                    asset.getTreasuryCashAccountId(), userCashAccountId,
                    grossAmount, "Asset sale proceeds: " + asset.getSymbol()));
            // Spread sweep (if applicable)
            if (spreadAmount.compareTo(BigDecimal.ZERO) > 0) {
                ops.add(new BatchTransferOp(
                        asset.getTreasuryCashAccountId(),
                        assetServiceConfig.getAccounting().getSpreadCollectionAccountId(),
                        spreadAmount, "Spread: SELL " + asset.getSymbol()));
            }
        }

        // Fee legs (both BUY and SELL): withdrawal + journal entry in the same atomic batch
        if (fee.compareTo(BigDecimal.ZERO) > 0) {
            ops.add(new BatchWithdrawalOp(
                    userCashAccountId, fee,
                    "Trading fee: " + side + " " + asset.getSymbol()));
            ops.add(new BatchJournalEntryOp(
                    resolvedGlAccounts.getFundSourceId(),
                    resolvedGlAccounts.getFeeIncomeId(),
                    fee, currency,
                    "Trading fee: " + side + " " + asset.getSymbol()));
        }

        return ops;
    }

    private void rejectOrder(Order order, String reason) {
        order.setStatus(OrderStatus.REJECTED);
        order.setFailureReason(reason);
        orderRepository.save(order);
    }

    private String extractBatchId(List<Map<String, Object>> batchResponses) {
        if (batchResponses == null || batchResponses.isEmpty()) {
            return null;
        }
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < batchResponses.size(); i++) {
            if (i > 0) sb.append(",");
            Object requestId = batchResponses.get(i).get("requestId");
            sb.append(requestId != null ? requestId : "?");
        }
        return sb.toString();
    }

    /**
     * Preview a trade without executing it. Returns a price quote and feasibility check.
     * No locks, no DB writes, no Fineract mutations — purely read-only.
     */
    public TradePreviewResponse previewTrade(TradePreviewRequest request, Jwt jwt) {
        List<String> blockers = new ArrayList<>();

        // 1. Market hours (soft check)
        if (!marketHoursService.isMarketOpen()) {
            blockers.add("MARKET_CLOSED");
        }

        // 2. Load asset
        Asset asset = assetRepository.findById(request.assetId()).orElse(null);
        if (asset == null) {
            return immediateReject("ASSET_NOT_FOUND", request);
        }
        if (asset.getStatus() != AssetStatus.ACTIVE) {
            blockers.add("TRADING_HALTED");
        }

        // 2b. Subscription period check — BUY only
        if (request.side() == TradeSide.BUY) {
            if (LocalDate.now().isBefore(asset.getSubscriptionStartDate())) {
                blockers.add("SUBSCRIPTION_NOT_STARTED");
            }
            if (!asset.getSubscriptionEndDate().isAfter(LocalDate.now())) {
                blockers.add("SUBSCRIPTION_ENDED");
            }
        }

        // 3. Price calculation
        CurrentPriceResponse priceData = pricingService.getCurrentPrice(request.assetId());
        BigDecimal basePrice = priceData.currentPrice();
        BigDecimal spread = asset.getSpreadPercent() != null ? asset.getSpreadPercent() : BigDecimal.ZERO;
        BigDecimal effectiveSpread = isSpreadEnabled() ? spread : BigDecimal.ZERO;
        BigDecimal feePercent = asset.getTradingFeePercent() != null ? asset.getTradingFeePercent() : BigDecimal.ZERO;

        TradeStrategy previewStrategy = request.side() == TradeSide.BUY
                ? BuyStrategy.INSTANCE : SellStrategy.INSTANCE;
        BigDecimal executionPrice = previewStrategy.applySpread(basePrice, effectiveSpread);

        BigDecimal units = request.units();
        BigDecimal grossAmount = units.multiply(executionPrice).setScale(0, RoundingMode.HALF_UP);
        BigDecimal fee = grossAmount.multiply(feePercent).setScale(0, RoundingMode.HALF_UP);
        BigDecimal spreadAmount = units.multiply(basePrice.multiply(effectiveSpread))
                .setScale(0, RoundingMode.HALF_UP);
        BigDecimal netAmount = previewStrategy.computeOrderCashAmount(grossAmount, fee);

        // 4. Resolve user and check balances (soft-fail)
        BigDecimal availableBalance = null;
        BigDecimal availableUnits = null;
        BigDecimal availableSupply = null;

        try {
            String externalId = JwtUtils.extractExternalId(jwt);
            Map<String, Object> clientData = fineractClient.getClientByExternalId(externalId);
            Long userId = ((Number) clientData.get("id")).longValue();

            Long cashAccountId = fineractClient.findClientSavingsAccountByCurrency(userId, assetServiceConfig.getSettlementCurrency());
            if (cashAccountId == null) {
                blockers.add("NO_CASH_ACCOUNT");
            } else {
                availableBalance = fineractClient.getAccountBalance(cashAccountId);
                if (request.side() == TradeSide.BUY && availableBalance.compareTo(netAmount) < 0) {
                    blockers.add("INSUFFICIENT_FUNDS");
                }
            }

            if (request.side() == TradeSide.SELL) {
                var position = userPositionRepository.findByUserIdAndAssetId(userId, request.assetId());
                if (position.isEmpty()) {
                    blockers.add("NO_POSITION");
                } else {
                    availableUnits = position.get().getTotalUnits();
                    if (units.compareTo(availableUnits) > 0) {
                        blockers.add("INSUFFICIENT_UNITS");
                    }
                }
            }
        } catch (Exception e) {
            log.warn("Failed to resolve user for trade preview: {}", e.getMessage());
            blockers.add("USER_RESOLUTION_FAILED");
        }

        // BUY: check inventory
        if (request.side() == TradeSide.BUY) {
            availableSupply = asset.getTotalSupply().subtract(asset.getCirculatingSupply());
            if (units.compareTo(availableSupply) > 0) {
                blockers.add("INSUFFICIENT_INVENTORY");
            }
        }

        // 5. Bond benefit projections (BUY only, null for non-bonds)
        BondBenefitProjection bondBenefit = null;
        if (request.side() == TradeSide.BUY) {
            bondBenefit = bondBenefitService.calculateForPurchase(asset, units, netAmount);
        }

        return new TradePreviewResponse(
                blockers.isEmpty(), blockers,
                asset.getId(), asset.getSymbol(), request.side(), units,
                basePrice, executionPrice, spread, grossAmount, fee, feePercent, spreadAmount, netAmount,
                availableBalance, availableUnits, availableSupply, bondBenefit
        );
    }

    private TradePreviewResponse immediateReject(String blocker, TradePreviewRequest request) {
        return new TradePreviewResponse(
                false, List.of(blocker),
                request.assetId(), null, request.side(), request.units(),
                null, null, null, null, null, null, null, null,
                null, null, null, null
        );
    }

    /**
     * Resolve or create the user's Fineract savings account for the given asset.
     */
    private Long resolveOrCreateUserAssetAccount(Long userId, String assetId, Asset asset) {
        var existingPosition = userPositionRepository.findByUserIdAndAssetId(userId, assetId);
        if (existingPosition.isPresent()) {
            return existingPosition.get().getFineractSavingsAccountId();
        }

        Long existingAccountId = fineractClient.findClientSavingsAccountByCurrency(userId, asset.getCurrencyCode());
        if (existingAccountId != null) {
            return existingAccountId;
        }

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
        Sort stable = pageable.getSort().and(Sort.by("id"));
        Pageable stablePageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), stable);
        Page<Order> orders;
        if (assetId != null) {
            orders = orderRepository.findByUserIdAndAssetId(userId, assetId, stablePageable);
        } else {
            orders = orderRepository.findByUserId(userId, stablePageable);
        }

        return orders.map(o -> {
            Asset orderAsset = o.getAsset();
            return new OrderResponse(
                    o.getId(), o.getAssetId(),
                    orderAsset != null ? orderAsset.getSymbol() : null,
                    o.getSide(), o.getUnits(), o.getExecutionPrice(),
                    o.getCashAmount(), o.getFee(), o.getSpreadAmount(), o.getStatus(), o.getCreatedAt()
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
                o.getCashAmount(), o.getFee(), o.getSpreadAmount(), o.getStatus(), o.getCreatedAt()
        );
    }

    private boolean isSpreadEnabled() {
        Long id = assetServiceConfig.getAccounting().getSpreadCollectionAccountId();
        return id != null && id > 0;
    }
}
