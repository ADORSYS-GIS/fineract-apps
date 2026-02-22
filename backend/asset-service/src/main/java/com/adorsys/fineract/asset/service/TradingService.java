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
import com.adorsys.fineract.asset.event.TradeExecutedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
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
    private final IncomeBenefitService incomeBenefitService;
    private final ExposureLimitService exposureLimitService;
    private final LockupService lockupService;
    private final ApplicationEventPublisher eventPublisher;

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
     * Each step is a discrete method for extensibility (exposure limits, lock-ups, etc.).
     */
    private TradeResponse executeTrade(TradeContext ctx) {
        // Pre-lock validation pipeline
        TradeResponse idempotentResult = checkIdempotency(ctx);
        if (idempotentResult != null) return idempotentResult;

        checkMarketHours();
        loadAndValidateAsset(ctx);
        checkSubscriptionPeriod(ctx);
        calculatePrice(ctx);
        checkInventory(ctx);
        resolveUser(ctx);
        checkExposureLimits(ctx);
        checkLockup(ctx);
        resolveUserAccounts(ctx);
        createPendingOrder(ctx);

        // Lock-protected execution
        String lockValue = tradeLockService.acquireTradeLock(ctx.getUserId(), ctx.getAssetId());
        ctx.setLockValue(lockValue);

        try {
            return executeInsideLock(ctx);
        } catch (TradingException e) {
            assetMetrics.recordTradeFailure();
            throw e;
        } catch (Exception e) {
            assetMetrics.recordTradeFailure();
            log.error("Unexpected error during {} order {}: {}", ctx.getStrategy().side(), ctx.getOrderId(), e.getMessage(), e);
            throw new TradingException("Trade failed unexpectedly: " + e.getMessage(), "TRADE_FAILED");
        } finally {
            tradeLockService.releaseTradeLock(ctx.getUserId(), ctx.getAssetId(), lockValue);
        }
    }

    // ──────────────────────────────────────────────────────────────────────
    // Pre-lock validation steps
    // ──────────────────────────────────────────────────────────────────────

    /**
     * Step 1: Check idempotency key. Returns a cached response if this key was already used
     * by the same user, or throws if used by a different user.
     */
    private TradeResponse checkIdempotency(TradeContext ctx) {
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
        return null;
    }

    /** Step 2: Assert market is open. */
    private void checkMarketHours() {
        marketHoursService.assertMarketOpen();
    }

    /** Step 3: Load asset and validate it is in a tradable state. */
    private void loadAndValidateAsset(TradeContext ctx) {
        Asset asset = assetRepository.findById(ctx.getAssetId())
                .orElseThrow(() -> new AssetException("Asset not found: " + ctx.getAssetId()));
        if (asset.getStatus() == AssetStatus.DELISTING) {
            // DELISTING: only SELL allowed
            if (ctx.getStrategy().side() == TradeSide.BUY) {
                throw new TradingException(
                        "Asset is being delisted. Only SELL orders are accepted.",
                        "ASSET_DELISTING");
            }
        } else if (asset.getStatus() != AssetStatus.ACTIVE) {
            throw new TradingHaltedException(ctx.getAssetId());
        }
        ctx.setAsset(asset);
    }

    /** Step 4: BUY only — verify the subscription window is open. */
    private void checkSubscriptionPeriod(TradeContext ctx) {
        if (ctx.getStrategy().side() != TradeSide.BUY) return;
        Asset asset = ctx.getAsset();
        if (LocalDate.now().isBefore(asset.getSubscriptionStartDate())) {
            assetMetrics.incrementSubscriptionExpiredRejections();
            throw new TradingException("Subscription period has not started for this asset", "SUBSCRIPTION_NOT_STARTED");
        }
        if (!asset.getSubscriptionEndDate().isAfter(LocalDate.now())) {
            assetMetrics.incrementSubscriptionExpiredRejections();
            throw new TradingException("Subscription period has ended for this asset", "SUBSCRIPTION_ENDED");
        }
    }

    /** Step 5: Calculate execution price, fees, and amounts. Stores results in ctx. */
    private void calculatePrice(TradeContext ctx) {
        TradeStrategy strategy = ctx.getStrategy();
        Asset asset = ctx.getAsset();
        BigDecimal units = ctx.getUnits();

        CurrentPriceResponse priceData = pricingService.getCurrentPrice(ctx.getAssetId());
        BigDecimal basePrice = priceData.currentPrice();
        BigDecimal spread = asset.getSpreadPercent() != null ? asset.getSpreadPercent() : BigDecimal.ZERO;
        BigDecimal effectiveSpread = isSpreadEnabled() ? spread : BigDecimal.ZERO;
        BigDecimal feePercent = asset.getTradingFeePercent() != null ? asset.getTradingFeePercent() : BigDecimal.ZERO;
        BigDecimal executionPrice = strategy.applySpread(basePrice, effectiveSpread);

        BigDecimal grossAmount = units.multiply(executionPrice).setScale(0, RoundingMode.HALF_UP);
        BigDecimal fee = grossAmount.multiply(feePercent).setScale(0, RoundingMode.HALF_UP);
        BigDecimal spreadAmount = units.multiply(basePrice.multiply(effectiveSpread))
                .setScale(0, RoundingMode.HALF_UP);
        BigDecimal orderCashAmount = strategy.computeOrderCashAmount(grossAmount, fee);

        ctx.setBasePrice(basePrice);
        ctx.setEffectiveSpread(effectiveSpread);
        ctx.setFeePercent(feePercent);
        ctx.setExecutionPrice(executionPrice);
        ctx.setGrossAmount(grossAmount);
        ctx.setFee(fee);
        ctx.setSpreadAmount(spreadAmount);
        ctx.setOrderCashAmount(orderCashAmount);
    }

    /** Step 6: BUY — verify sufficient treasury inventory. */
    private void checkInventory(TradeContext ctx) {
        if (ctx.getStrategy().side() != TradeSide.BUY) return;
        Asset asset = ctx.getAsset();
        BigDecimal availableSupply = asset.getTotalSupply().subtract(asset.getCirculatingSupply());
        if (ctx.getUnits().compareTo(availableSupply) > 0) {
            throw new InsufficientInventoryException(ctx.getAssetId(), ctx.getUnits(), availableSupply);
        }
    }

    /** Step 7: Validate exposure limits (order size, position %, daily volume). */
    private void checkExposureLimits(TradeContext ctx) {
        exposureLimitService.validateLimits(
                ctx.getAsset(), ctx.getUserId(), ctx.getStrategy().side(),
                ctx.getUnits(), ctx.getOrderCashAmount());
    }

    /** Step 8: SELL only — validate lock-up period has elapsed. */
    private void checkLockup(TradeContext ctx) {
        if (ctx.getStrategy().side() != TradeSide.SELL) return;
        lockupService.validateLockup(ctx.getAsset(), ctx.getUserId());
    }

    /** Step 9: Resolve Fineract user from JWT external ID. */
    private void resolveUser(TradeContext ctx) {
        String externalId = JwtUtils.extractExternalId(ctx.getJwt());
        Map<String, Object> clientData = fineractClient.getClientByExternalId(externalId);
        Long userId = ((Number) clientData.get("id")).longValue();
        ctx.setExternalId(externalId);
        ctx.setUserId(userId);
    }

    /** Step 8–9: Resolve cash account and asset account. SELL validates unit ownership. */
    private void resolveUserAccounts(TradeContext ctx) {
        TradeSide side = ctx.getStrategy().side();
        Long userId = ctx.getUserId();
        String currency = assetServiceConfig.getSettlementCurrency();

        // Cash account
        Long userCashAccountId = fineractClient.findClientSavingsAccountByCurrency(userId, currency);
        if (userCashAccountId == null) {
            throw new TradingException(
                    "No active " + currency + " account found. Please create one in the Account Manager.",
                    "NO_CASH_ACCOUNT");
        }
        ctx.setUserCashAccountId(userCashAccountId);

        // Asset account
        Long userAssetAccountId;
        if (side == TradeSide.BUY) {
            userAssetAccountId = resolveOrCreateUserAssetAccount(userId, ctx.getAssetId(), ctx.getAsset());
        } else {
            UserPosition position = userPositionRepository.findByUserIdAndAssetId(userId, ctx.getAssetId())
                    .orElseThrow(() -> new TradingException(
                            "No position found for this asset. You must own units before selling.",
                            "NO_POSITION"));
            userAssetAccountId = position.getFineractSavingsAccountId();
            if (ctx.getUnits().compareTo(position.getTotalUnits()) > 0) {
                throw new TradingException(
                        "Insufficient units. You hold " + position.getTotalUnits() + " but tried to sell " + ctx.getUnits(),
                        "INSUFFICIENT_UNITS");
            }
        }
        ctx.setUserAssetAccountId(userAssetAccountId);
    }

    /** Step 10: Create the order in PENDING state. */
    private void createPendingOrder(TradeContext ctx) {
        String orderId = UUID.randomUUID().toString();
        ctx.setOrderId(orderId);
        Order order = Order.builder()
                .id(orderId)
                .idempotencyKey(ctx.getIdempotencyKey())
                .userId(ctx.getUserId())
                .userExternalId(ctx.getExternalId())
                .assetId(ctx.getAssetId())
                .side(ctx.getStrategy().side())
                .cashAmount(ctx.getOrderCashAmount())
                .units(ctx.getUnits())
                .executionPrice(ctx.getExecutionPrice())
                .fee(ctx.getFee())
                .spreadAmount(ctx.getSpreadAmount())
                .status(OrderStatus.PENDING)
                .build();
        orderRepository.save(order);
        ctx.setOrder(order);
    }

    // ──────────────────────────────────────────────────────────────────────
    // Lock-protected execution
    // ──────────────────────────────────────────────────────────────────────

    /**
     * Executes all steps inside the distributed lock: re-verification, portfolio update,
     * trade log, supply adjustment, OHLC update, and Fineract batch transfer.
     */
    private TradeResponse executeInsideLock(TradeContext ctx) {
        TradeStrategy strategy = ctx.getStrategy();
        TradeSide side = strategy.side();
        Order order = ctx.getOrder();
        BigDecimal units = ctx.getUnits();

        order.setStatus(OrderStatus.EXECUTING);
        orderRepository.save(order);

        // Re-fetch and re-verify inside the lock
        Asset lockedAsset = reVerifyAsset(ctx);
        reVerifyInventoryOrPosition(ctx, lockedAsset);
        recalculatePriceInsideLock(ctx);
        checkBalanceInsideLock(ctx);

        // Execute trade
        updatePortfolio(ctx);
        recordTradeLog(ctx);
        adjustSupply(ctx);
        pricingService.updateOhlcAfterTrade(ctx.getAssetId(), ctx.getExecutionPrice());
        executeFineractBatch(ctx, lockedAsset);

        return markOrderFilled(ctx, lockedAsset);
    }

    /** Re-fetch asset inside lock, validate treasury configuration. */
    private Asset reVerifyAsset(TradeContext ctx) {
        Asset lockedAsset = assetRepository.findById(ctx.getAssetId())
                .orElseThrow(() -> new AssetException("Asset not found: " + ctx.getAssetId()));
        if (lockedAsset.getTreasuryCashAccountId() == null || lockedAsset.getTreasuryAssetAccountId() == null) {
            rejectOrder(ctx.getOrder(), "Asset treasury accounts not configured");
            throw new TradingException(
                    "Asset is not fully configured for trading. Contact admin.", "CONFIG_ERROR");
        }
        return lockedAsset;
    }

    /** Re-verify inventory (BUY) or position (SELL) inside the lock. */
    private void reVerifyInventoryOrPosition(TradeContext ctx, Asset lockedAsset) {
        TradeSide side = ctx.getStrategy().side();
        BigDecimal units = ctx.getUnits();
        if (side == TradeSide.BUY) {
            BigDecimal lockedAvailableSupply = lockedAsset.getTotalSupply().subtract(lockedAsset.getCirculatingSupply());
            if (units.compareTo(lockedAvailableSupply) > 0) {
                rejectOrder(ctx.getOrder(), "Insufficient inventory");
                throw new InsufficientInventoryException(ctx.getAssetId(), units, lockedAvailableSupply);
            }
        } else {
            UserPosition lockedPosition = userPositionRepository.findByUserIdAndAssetId(ctx.getUserId(), ctx.getAssetId())
                    .orElseThrow(() -> new TradingException("No position found (concurrent sell detected)", "NO_POSITION"));
            if (units.compareTo(lockedPosition.getTotalUnits()) > 0) {
                rejectOrder(ctx.getOrder(), "Insufficient units after lock");
                throw new TradingException(
                        "Insufficient units. You hold " + lockedPosition.getTotalUnits() + " but tried to sell " + units,
                        "INSUFFICIENT_UNITS");
            }
        }
    }

    /** Re-fetch authoritative price and recalculate all amounts inside lock. */
    private void recalculatePriceInsideLock(TradeContext ctx) {
        TradeStrategy strategy = ctx.getStrategy();
        BigDecimal units = ctx.getUnits();

        CurrentPriceResponse lockedPriceData = pricingService.getCurrentPrice(ctx.getAssetId());
        BigDecimal lockedBasePrice = lockedPriceData.currentPrice();
        BigDecimal executionPrice = strategy.applySpread(lockedBasePrice, ctx.getEffectiveSpread());
        BigDecimal grossAmount = units.multiply(executionPrice).setScale(0, RoundingMode.HALF_UP);
        BigDecimal fee = grossAmount.multiply(ctx.getFeePercent()).setScale(0, RoundingMode.HALF_UP);
        BigDecimal spreadAmount = units.multiply(lockedBasePrice.multiply(ctx.getEffectiveSpread()))
                .setScale(0, RoundingMode.HALF_UP);
        BigDecimal orderCashAmount = strategy.computeOrderCashAmount(grossAmount, fee);

        ctx.setBasePrice(lockedBasePrice);
        ctx.setExecutionPrice(executionPrice);
        ctx.setGrossAmount(grossAmount);
        ctx.setFee(fee);
        ctx.setSpreadAmount(spreadAmount);
        ctx.setOrderCashAmount(orderCashAmount);

        // Update order with authoritative locked values
        Order order = ctx.getOrder();
        order.setExecutionPrice(executionPrice);
        order.setCashAmount(orderCashAmount);
        order.setFee(fee);
        order.setSpreadAmount(spreadAmount);
        orderRepository.save(order);
    }

    /** BUY only: verify user has sufficient cash balance inside lock. */
    private void checkBalanceInsideLock(TradeContext ctx) {
        if (ctx.getStrategy().side() != TradeSide.BUY) return;
        String currency = assetServiceConfig.getSettlementCurrency();
        BigDecimal availableBalance = fineractClient.getAccountBalance(ctx.getUserCashAccountId());
        if (availableBalance.compareTo(ctx.getOrderCashAmount()) < 0) {
            rejectOrder(ctx.getOrder(), "Insufficient " + currency + " balance");
            throw new TradingException(
                    "Insufficient " + currency + " balance. Required: " + ctx.getOrderCashAmount()
                            + " " + currency + ", Available: " + availableBalance + " " + currency,
                    "INSUFFICIENT_FUNDS");
        }
    }

    /** Update portfolio: WAP on BUY, realized P&L on SELL. */
    private void updatePortfolio(TradeContext ctx) {
        TradeSide side = ctx.getStrategy().side();
        BigDecimal units = ctx.getUnits();
        if (side == TradeSide.BUY) {
            BigDecimal effectiveCostPerUnit = ctx.getOrderCashAmount().divide(units, 4, RoundingMode.HALF_UP);
            portfolioService.updatePositionAfterBuy(ctx.getUserId(), ctx.getAssetId(),
                    ctx.getUserAssetAccountId(), units, effectiveCostPerUnit);
        } else {
            BigDecimal netProceedsPerUnit = ctx.getOrderCashAmount().divide(units, 4, RoundingMode.HALF_UP);
            BigDecimal realizedPnl = portfolioService.updatePositionAfterSell(
                    ctx.getUserId(), ctx.getAssetId(), units, netProceedsPerUnit);
            ctx.setRealizedPnl(realizedPnl);
        }
    }

    /** Record immutable trade log entry. */
    private void recordTradeLog(TradeContext ctx) {
        TradeLog tradeLog = TradeLog.builder()
                .id(UUID.randomUUID().toString())
                .orderId(ctx.getOrderId())
                .userId(ctx.getUserId())
                .assetId(ctx.getAssetId())
                .side(ctx.getStrategy().side())
                .units(ctx.getUnits())
                .pricePerUnit(ctx.getExecutionPrice())
                .totalAmount(ctx.getOrderCashAmount())
                .fee(ctx.getFee())
                .spreadAmount(ctx.getSpreadAmount())
                .realizedPnl(ctx.getRealizedPnl())
                .build();
        tradeLogRepository.save(tradeLog);
    }

    /** Atomically adjust circulating supply. */
    private void adjustSupply(TradeContext ctx) {
        TradeSide side = ctx.getStrategy().side();
        BigDecimal supplyDelta = ctx.getStrategy().supplyAdjustment(ctx.getUnits());
        int supplyUpdated = assetRepository.adjustCirculatingSupply(ctx.getAssetId(), supplyDelta);
        if (supplyUpdated == 0) {
            String reason = side == TradeSide.BUY ? "Supply constraint violated" : "Supply constraint violated during sell";
            String errorCode = side == TradeSide.BUY ? "SUPPLY_EXCEEDED" : "SUPPLY_ERROR";
            rejectOrder(ctx.getOrder(), reason);
            throw new TradingException(
                    side == TradeSide.BUY ? "Insufficient available supply for this trade." : "Supply constraint violated during sell.",
                    errorCode);
        }
    }

    /** Execute all Fineract transfers as an atomic batch. */
    private void executeFineractBatch(TradeContext ctx, Asset lockedAsset) {
        TradeSide side = ctx.getStrategy().side();
        String currency = assetServiceConfig.getSettlementCurrency();
        List<BatchOperation> batchOps = buildBatchOperations(
                side, lockedAsset, ctx.getUserCashAccountId(), ctx.getUserAssetAccountId(),
                ctx.getGrossAmount(), ctx.getUnits(), ctx.getFee(), ctx.getSpreadAmount(), currency);

        try {
            List<Map<String, Object>> batchResponses = fineractClient.executeAtomicBatch(batchOps);
            ctx.getOrder().setFineractBatchId(extractBatchId(batchResponses));
        } catch (Exception batchError) {
            log.error("Batch transfer failed for {} order {}: {}", side, ctx.getOrderId(), batchError.getMessage());
            ctx.getOrder().setStatus(OrderStatus.FAILED);
            ctx.getOrder().setFailureReason("Batch transfer failed: " + batchError.getMessage());
            orderRepository.save(ctx.getOrder());
            throw new TradingException("Trade failed: " + batchError.getMessage(), "TRADE_FAILED");
        }
    }

    /** Mark order as FILLED, log, record metrics, and return the response. */
    private TradeResponse markOrderFilled(TradeContext ctx, Asset lockedAsset) {
        TradeSide side = ctx.getStrategy().side();
        Order order = ctx.getOrder();
        order.setStatus(OrderStatus.FILLED);
        orderRepository.save(order);

        // Record daily trade volume for exposure limit tracking
        exposureLimitService.recordTradeVolume(ctx.getUserId(), ctx.getAssetId(), ctx.getOrderCashAmount());

        // Publish trade event for notifications
        eventPublisher.publishEvent(new TradeExecutedEvent(
                ctx.getUserId(), ctx.getAssetId(), lockedAsset.getSymbol(),
                side, ctx.getUnits(), ctx.getExecutionPrice(),
                ctx.getOrderCashAmount(), ctx.getOrderId()));

        if (side == TradeSide.BUY) {
            log.info("BUY executed: orderId={}, userId={}, asset={}, units={}, price={}, charged={}",
                    ctx.getOrderId(), ctx.getUserId(), lockedAsset.getSymbol(), ctx.getUnits(), ctx.getExecutionPrice(), ctx.getOrderCashAmount());
            assetMetrics.recordBuy();
        } else {
            log.info("SELL executed: orderId={}, userId={}, asset={}, units={}, price={}, pnl={}",
                    ctx.getOrderId(), ctx.getUserId(), lockedAsset.getSymbol(), ctx.getUnits(), ctx.getExecutionPrice(), ctx.getRealizedPnl());
            assetMetrics.recordSell();
        }

        return new TradeResponse(ctx.getOrderId(), OrderStatus.FILLED, side,
                ctx.getUnits(), ctx.getExecutionPrice(), ctx.getOrderCashAmount(), ctx.getFee(),
                ctx.getSpreadAmount(), ctx.getRealizedPnl(), Instant.now());
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
     *
     * <p>Supports two modes:
     * <ul>
     *   <li><b>Unit-based</b>: caller specifies {@code units} directly.</li>
     *   <li><b>Amount-based</b>: caller specifies {@code amount} in XAF; the system computes
     *       the maximum whole units purchasable for that amount (including fees).</li>
     * </ul>
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

        // 3b. Amount-based conversion: compute units from XAF amount
        BigDecimal computedFromAmount = null;
        BigDecimal remainder = null;
        BigDecimal units;

        if (request.amount() != null) {
            // Amount mode: derive units from the XAF budget
            computedFromAmount = request.amount();
            int scale = asset.getDecimalPlaces() != null ? asset.getDecimalPlaces() : 0;
            // effectivePricePerUnit = executionPrice * (1 + feePercent)
            BigDecimal effectivePricePerUnit = executionPrice
                    .multiply(BigDecimal.ONE.add(feePercent));
            if (effectivePricePerUnit.compareTo(BigDecimal.ZERO) <= 0) {
                return immediateReject("INVALID_PRICE", request);
            }
            units = request.amount()
                    .divide(effectivePricePerUnit, scale, RoundingMode.DOWN);
            if (units.compareTo(BigDecimal.ZERO) <= 0) {
                blockers.add("AMOUNT_TOO_SMALL");
                // Still return a response with zero units so the caller sees the blocker
                units = BigDecimal.ZERO;
            }
        } else {
            units = request.units();
        }

        BigDecimal grossAmount = units.multiply(executionPrice).setScale(0, RoundingMode.HALF_UP);
        BigDecimal fee = grossAmount.multiply(feePercent).setScale(0, RoundingMode.HALF_UP);
        BigDecimal spreadAmount = units.multiply(basePrice.multiply(effectiveSpread))
                .setScale(0, RoundingMode.HALF_UP);
        BigDecimal netAmount = previewStrategy.computeOrderCashAmount(grossAmount, fee);

        // Compute remainder for amount-based mode
        if (computedFromAmount != null && units.compareTo(BigDecimal.ZERO) > 0) {
            remainder = computedFromAmount.subtract(netAmount);
            if (remainder.compareTo(BigDecimal.ZERO) < 0) {
                remainder = BigDecimal.ZERO;
            }
        }

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
                    // Check lock-up period for SELL
                    LocalDate unlockDate = lockupService.getUnlockDate(asset, userId);
                    if (unlockDate != null && LocalDate.now().isBefore(unlockDate)) {
                        blockers.add("LOCKUP_PERIOD_ACTIVE");
                    }
                }
            }

            // Check exposure limits (soft-fail for preview)
            try {
                exposureLimitService.validateLimits(asset, userId, request.side(), units, netAmount);
            } catch (TradingException e) {
                blockers.add(e.getErrorCode());
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

        // 6. Income benefit projections (BUY only, null for bonds and non-income assets)
        IncomeBenefitProjection incomeBenefit = null;
        if (request.side() == TradeSide.BUY) {
            incomeBenefit = incomeBenefitService.calculateForPurchase(
                    asset, units, basePrice, netAmount);
        }

        return new TradePreviewResponse(
                blockers.isEmpty(), blockers,
                asset.getId(), asset.getSymbol(), request.side(), units,
                basePrice, executionPrice, spread, grossAmount, fee, feePercent, spreadAmount, netAmount,
                availableBalance, availableUnits, availableSupply,
                bondBenefit, incomeBenefit, computedFromAmount, remainder
        );
    }

    private TradePreviewResponse immediateReject(String blocker, TradePreviewRequest request) {
        BigDecimal units = request.units() != null ? request.units() : BigDecimal.ZERO;
        return new TradePreviewResponse(
                false, List.of(blocker),
                request.assetId(), null, request.side(), units,
                null, null, null, null, null, null, null, null,
                null, null, null, null, null,
                request.amount(), null
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
