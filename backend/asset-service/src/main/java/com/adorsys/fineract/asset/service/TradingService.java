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
import com.adorsys.fineract.asset.event.OrderStatusChangedEvent;
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
import java.time.ZoneId;
import org.springframework.orm.ObjectOptimisticLockingFailureException;

import java.util.ArrayList;
import java.util.EnumSet;
import java.util.List;
import java.util.Set;
import java.util.Map;
import java.util.UUID;

/**
 * Core trading engine. Orchestrates buy/sell operations with:
 * - Idempotency checks
 * - Market hours enforcement
 * - Single-price execution (LP bid/ask prices)
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
    private final QuoteReservationService quoteReservationService;

    // ──────────────────────────────────────────────────────────────────────
    // Quote-based async trade flow
    // ──────────────────────────────────────────────────────────────────────

    /**
     * Create a price-locked trade quote. Performs all pre-lock validations and
     * persists a QUOTED order with locked bid/ask prices. No Redis lock, no Fineract mutations.
     */
    @Transactional(timeout = 15)
    public QuoteResponse createQuote(QuoteRequest request, Jwt jwt, String idempotencyKey) {
        List<String> warnings = new ArrayList<>();

        // Idempotency: return existing quote if same key
        var existing = orderRepository.findByIdempotencyKey(idempotencyKey);
        if (existing.isPresent()) {
            Order o = existing.get();
            String requestingExternalId = JwtUtils.extractExternalId(jwt);
            if (!o.getUserExternalId().equals(requestingExternalId)) {
                throw new TradingException("Idempotency key already used", "IDEMPOTENCY_KEY_CONFLICT");
            }
            if (o.getStatus() == OrderStatus.QUOTED) {
                return toQuoteResponse(o, warnings);
            }
            throw new TradingException(
                    "Idempotency key already used for a non-quote order (status=" + o.getStatus() + ")",
                    "IDEMPOTENCY_KEY_CONFLICT");
        }

        // Resolve user from JWT
        String externalId = JwtUtils.extractExternalId(jwt);
        Map<String, Object> clientData = fineractClient.getClientByExternalId(externalId);
        Long userId = ((Number) clientData.get("id")).longValue();

        // Max active quotes per user
        long activeQuotes = orderRepository.countByUserIdAndStatus(userId, OrderStatus.QUOTED);
        if (activeQuotes >= assetServiceConfig.getQuote().getMaxActivePerUser()) {
            throw new TradingException(
                    "Too many active quotes (" + activeQuotes + "). Cancel existing quotes or wait for expiry.",
                    "MAX_QUOTES_EXCEEDED");
        }

        // Determine strategy
        TradeStrategy strategy = (request.side() == TradeSide.BUY) ? BuyStrategy.INSTANCE : SellStrategy.INSTANCE;

        // Load and validate asset
        Asset asset = assetRepository.findById(request.assetId())
                .orElseThrow(() -> new AssetException("Asset not found: " + request.assetId()));
        if (asset.getStatus() == AssetStatus.DELISTING && request.side() == TradeSide.BUY) {
            throw new TradingException("Asset is being delisted. Only SELL orders are accepted.", "ASSET_DELISTING");
        } else if (asset.getStatus() != AssetStatus.ACTIVE && asset.getStatus() != AssetStatus.DELISTING) {
            throw new TradingHaltedException(request.assetId());
        }

        // Subscription period check (BUY only)
        if (request.side() == TradeSide.BUY) {
            ZoneId marketZone = ZoneId.of(assetServiceConfig.getMarketHours().getTimezone());
            LocalDate today = LocalDate.now(marketZone);
            if (today.isBefore(asset.getSubscriptionStartDate())) {
                throw new TradingException("Subscription period has not started for this asset", "SUBSCRIPTION_NOT_STARTED");
            }
            if (!asset.getSubscriptionEndDate().isAfter(today)) {
                throw new TradingException("Subscription period has ended for this asset", "SUBSCRIPTION_ENDED");
            }
        }

        // Market hours (soft warning — quote can still be created, confirmed when open)
        if (!marketHoursService.isMarketOpen()) {
            warnings.add("MARKET_CLOSED");
        }

        // Calculate price
        PriceResponse priceData = pricingService.getPrice(request.assetId());
        BigDecimal feePercent = asset.getTradingFeePercent() != null ? asset.getTradingFeePercent() : BigDecimal.ZERO;
        BigDecimal executionPrice = (request.side() == TradeSide.BUY) ? priceData.askPrice() : priceData.bidPrice();
        BigDecimal issuerPrice = asset.getIssuerPrice() != null ? asset.getIssuerPrice() : priceData.askPrice();

        // Amount-based conversion
        BigDecimal computedFromAmount = null;
        BigDecimal remainder = null;
        BigDecimal units;
        if (request.amount() != null) {
            computedFromAmount = request.amount();
            int scale = asset.getDecimalPlaces() != null ? asset.getDecimalPlaces() : 0;
            BigDecimal effectivePricePerUnit = executionPrice.multiply(BigDecimal.ONE.add(feePercent));
            if (effectivePricePerUnit.compareTo(BigDecimal.ZERO) <= 0) {
                throw new TradingException("Invalid price for amount-based quote", "INVALID_PRICE");
            }
            units = request.amount().divide(effectivePricePerUnit, scale, RoundingMode.DOWN);
            if (units.compareTo(BigDecimal.ZERO) <= 0) {
                throw new TradingException("Amount too small to purchase any units", "AMOUNT_TOO_SMALL");
            }
        } else {
            units = request.units();
        }

        BigDecimal grossAmount = units.multiply(executionPrice).setScale(0, RoundingMode.HALF_UP);
        BigDecimal fee = grossAmount.multiply(feePercent).setScale(0, RoundingMode.HALF_UP);
        BigDecimal lpMarginPerUnit = executionPrice.subtract(issuerPrice).abs();
        BigDecimal spreadAmount = isSpreadEnabled(asset)
                ? lpMarginPerUnit.multiply(units).setScale(0, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;
        BigDecimal orderCashAmount = strategy.computeOrderCashAmount(grossAmount, fee);

        // Remainder for amount-based mode
        if (computedFromAmount != null && units.compareTo(BigDecimal.ZERO) > 0) {
            remainder = computedFromAmount.subtract(orderCashAmount);
            if (remainder.compareTo(BigDecimal.ZERO) < 0) remainder = BigDecimal.ZERO;
        }

        // Check inventory (BUY) — subtract reserved units
        if (request.side() == TradeSide.BUY) {
            BigDecimal reserved = quoteReservationService.getReservedUnits(request.assetId());
            BigDecimal availableSupply = asset.getTotalSupply().subtract(asset.getCirculatingSupply()).subtract(reserved);
            if (units.compareTo(availableSupply) > 0) {
                throw new InsufficientInventoryException(request.assetId(), units, availableSupply);
            }
        }

        // Exposure limits
        exposureLimitService.validateLimits(asset, userId, request.side(), units, orderCashAmount);

        // SELL: verify position and unit count
        if (request.side() == TradeSide.SELL) {
            UserPosition position = userPositionRepository.findByUserIdAndAssetId(userId, request.assetId())
                    .orElseThrow(() -> new TradingException(
                            "No position found for this asset. You must own units before selling.",
                            "NO_POSITION"));
            if (units.compareTo(position.getTotalUnits()) > 0) {
                throw new TradingException(
                        "Insufficient units. You hold " + position.getTotalUnits() + " but tried to sell " + units,
                        "INSUFFICIENT_UNITS");
            }
            lockupService.validateLockup(asset, userId, units);

            // LP capital adequacy check — early rejection if LP lacks funds to pay seller
            if (asset.getLpCashAccountId() != null) {
                BigDecimal lpCashBalance = fineractClient.getAccountBalance(asset.getLpCashAccountId());
                if (lpCashBalance.compareTo(orderCashAmount) < 0) {
                    String currency = assetServiceConfig.getSettlementCurrency();
                    throw new TradingException(
                            "This asset's liquidity provider currently has insufficient funds to process your sell order. "
                                    + "Required: " + orderCashAmount + " " + currency
                                    + ", LP available: " + lpCashBalance + " " + currency
                                    + ". Please try again later or contact support.",
                            "INSUFFICIENT_LP_FUNDS");
                }
            }
        }

        // Create QUOTED order
        Instant now = Instant.now();
        Instant expiresAt = now.plusSeconds(assetServiceConfig.getQuote().getTtlSeconds());
        String orderId = UUID.randomUUID().toString();
        Order order = Order.builder()
                .id(orderId)
                .idempotencyKey(idempotencyKey)
                .userId(userId)
                .userExternalId(externalId)
                .assetId(request.assetId())
                .side(request.side())
                .cashAmount(orderCashAmount)
                .units(units)
                .executionPrice(executionPrice)
                .fee(fee)
                .spreadAmount(spreadAmount)
                .status(OrderStatus.QUOTED)
                .quotedAt(now)
                .quoteExpiresAt(expiresAt)
                .quotedAskPrice(priceData.askPrice())
                .quotedBidPrice(priceData.bidPrice())
                .build();
        orderRepository.save(order);

        // Soft-reserve inventory (BUY only)
        if (request.side() == TradeSide.BUY) {
            quoteReservationService.reserve(request.assetId(), orderId, units);
        }

        // Publish status event
        eventPublisher.publishEvent(new OrderStatusChangedEvent(
                orderId, userId, request.assetId(), asset.getSymbol(), request.side(),
                null, OrderStatus.QUOTED, units, executionPrice, orderCashAmount, fee, null, now));

        log.info("Quote created: orderId={}, side={}, asset={}, units={}, price={}, expiresAt={}",
                orderId, request.side(), asset.getSymbol(), units, executionPrice, expiresAt);

        // Resolve balances for response (soft-fail)
        BigDecimal availableBalance = null;
        BigDecimal availableUnits = null;
        BigDecimal availableSupply = null;
        try {
            Long cashAccountId = fineractClient.findClientSavingsAccountByCurrency(userId, assetServiceConfig.getSettlementCurrency());
            if (cashAccountId != null) availableBalance = fineractClient.getAccountBalance(cashAccountId);
            if (request.side() == TradeSide.SELL) {
                var position = userPositionRepository.findByUserIdAndAssetId(userId, request.assetId());
                if (position.isPresent()) availableUnits = position.get().getTotalUnits();
            }
            if (request.side() == TradeSide.BUY) {
                availableSupply = asset.getTotalSupply().subtract(asset.getCirculatingSupply());
            }
        } catch (Exception e) {
            log.debug("Could not resolve balances for quote response: {}", e.getMessage());
        }

        // Benefit projections
        BondBenefitProjection bondBenefit = (request.side() == TradeSide.BUY)
                ? bondBenefitService.calculateForPurchase(asset, units, orderCashAmount) : null;
        IncomeBenefitProjection incomeBenefit = (request.side() == TradeSide.BUY)
                ? incomeBenefitService.calculateForPurchase(asset, units, issuerPrice, orderCashAmount) : null;

        return new QuoteResponse(
                orderId, OrderStatus.QUOTED, request.assetId(), asset.getSymbol(), request.side(),
                units, executionPrice, lpMarginPerUnit, grossAmount, fee, feePercent, spreadAmount,
                orderCashAmount, availableBalance, availableUnits, availableSupply,
                bondBenefit, incomeBenefit, computedFromAmount, remainder, now, expiresAt, warnings);
    }

    /**
     * Confirm a quoted order. Promotes QUOTED → PENDING (or QUEUED if market closed).
     * Returns immediately — execution happens asynchronously via TradeWorkerService.
     */
    private static final Set<OrderStatus> CONFIRMED_STATUSES = EnumSet.of(
            OrderStatus.PENDING, OrderStatus.QUEUED, OrderStatus.EXECUTING, OrderStatus.FILLED);

    @Transactional(timeout = 10)
    public OrderResponse confirmOrder(String orderId, Long userId) {
        Order order = orderRepository.findByIdAndUserId(orderId, userId)
                .orElseThrow(() -> new AssetException("Order not found: " + orderId));

        // Idempotent: if already confirmed, return current state
        if (CONFIRMED_STATUSES.contains(order.getStatus())) {
            log.debug("Order {} already confirmed (status={}), returning idempotent response", orderId, order.getStatus());
            return toOrderResponse(order);
        }

        if (order.getStatus() != OrderStatus.QUOTED) {
            throw new TradingException(
                    "Cannot confirm order with status " + order.getStatus() + ". Only QUOTED orders can be confirmed.",
                    "CONFIRM_NOT_ALLOWED");
        }

        // Check expiry (strict: confirmation AT the exact expiry instant is rejected)
        if (!Instant.now().isBefore(order.getQuoteExpiresAt())) {
            order.setStatus(OrderStatus.CANCELLED);
            order.setFailureReason("Quote expired");
            orderRepository.save(order);
            // Release soft reservation
            if (order.getSide() == TradeSide.BUY) {
                quoteReservationService.release(order.getAssetId(), orderId, order.getUnits());
            }
            throw new TradingException("Quote has expired. Please request a new quote.", "QUOTE_EXPIRED");
        }

        try {
            OrderStatus previousStatus = order.getStatus();

            // If market closed, queue instead of executing
            if (!marketHoursService.isMarketOpen()) {
                order.setStatus(OrderStatus.QUEUED);
                order.setQueuedPrice(order.getExecutionPrice());
                orderRepository.save(order);
                // Release soft reservation (queued orders don't hold reservations)
                if (order.getSide() == TradeSide.BUY) {
                    quoteReservationService.release(order.getAssetId(), orderId, order.getUnits());
                }
                eventPublisher.publishEvent(new OrderStatusChangedEvent(
                        orderId, userId, order.getAssetId(), null, order.getSide(),
                        previousStatus, OrderStatus.QUEUED,
                        order.getUnits(), order.getExecutionPrice(), order.getCashAmount(),
                        order.getFee(), null, Instant.now()));
                log.info("Quote confirmed but market closed, queued: orderId={}", orderId);
                return toOrderResponse(order);
            }

            // Promote to PENDING — worker will pick it up
            order.setStatus(OrderStatus.PENDING);
            orderRepository.save(order);

            eventPublisher.publishEvent(new OrderStatusChangedEvent(
                    orderId, userId, order.getAssetId(), null, order.getSide(),
                    previousStatus, OrderStatus.PENDING,
                    order.getUnits(), order.getExecutionPrice(), order.getCashAmount(),
                    order.getFee(), null, Instant.now()));

            log.info("Quote confirmed, pending execution: orderId={}", orderId);
            return toOrderResponse(order);
        } catch (ObjectOptimisticLockingFailureException e) {
            throw new TradingException(
                    "Quote was already confirmed by a concurrent request. Please check order status.",
                    "QUOTE_ALREADY_CONFIRMED");
        }
    }

    /**
     * Execute a PENDING order asynchronously. Called by TradeWorkerService.
     * Acquires lock, resolves accounts, re-verifies, executes Fineract batch.
     */
    @Transactional(timeout = 30)
    public void executeOrderAsync(String orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new AssetException("Order not found: " + orderId));

        if (order.getStatus() != OrderStatus.PENDING) {
            log.debug("Order {} is no longer PENDING (status={}), skipping", orderId, order.getStatus());
            return;
        }

        // Build TradeContext from persisted order
        TradeStrategy strategy = (order.getSide() == TradeSide.BUY) ? BuyStrategy.INSTANCE : SellStrategy.INSTANCE;
        TradeContext ctx = TradeContext.builder()
                .assetId(order.getAssetId())
                .units(order.getUnits())
                .idempotencyKey(order.getIdempotencyKey())
                .jwt(null) // No JWT for async — user already resolved
                .strategy(strategy)
                .build();
        ctx.setExternalId(order.getUserExternalId());
        ctx.setUserId(order.getUserId());
        ctx.setOrderId(order.getId());
        ctx.setOrder(order);
        ctx.setExecutionPrice(order.getExecutionPrice());
        ctx.setFee(order.getFee());
        ctx.setSpreadAmount(order.getSpreadAmount());
        ctx.setBuybackPremium(order.getBuybackPremium());
        ctx.setOrderCashAmount(order.getCashAmount());
        ctx.setFeePercent(BigDecimal.ZERO); // Will be recalculated from asset

        // Load asset to get fee percent
        Asset asset = assetRepository.findById(order.getAssetId())
                .orElseThrow(() -> new AssetException("Asset not found: " + order.getAssetId()));
        ctx.setAsset(asset);
        ctx.setFeePercent(asset.getTradingFeePercent() != null ? asset.getTradingFeePercent() : BigDecimal.ZERO);

        // Resolve user accounts (Fineract calls)
        resolveUserAccounts(ctx);

        // Release soft reservation before execution (inventory will be updated atomically)
        if (order.getSide() == TradeSide.BUY) {
            quoteReservationService.release(order.getAssetId(), orderId, order.getUnits());
        }

        // Acquire trade lock
        String lockValue = tradeLockService.acquireTradeLock(order.getUserId(), order.getAssetId());
        ctx.setLockValue(lockValue);

        try {
            // Re-verify order is still PENDING (another worker may have grabbed it)
            Order lockedOrder = orderRepository.findById(orderId).orElseThrow();
            if (lockedOrder.getStatus() != OrderStatus.PENDING) {
                log.debug("Order {} picked up by another worker (status={})", orderId, lockedOrder.getStatus());
                return;
            }
            ctx.setOrder(lockedOrder);

            // Execute inside lock (reuses full existing pipeline)
            executeInsideLock(ctx);

            // Publish terminal status event
            eventPublisher.publishEvent(new OrderStatusChangedEvent(
                    orderId, order.getUserId(), order.getAssetId(),
                    asset.getSymbol(), order.getSide(),
                    OrderStatus.EXECUTING, OrderStatus.FILLED,
                    order.getUnits(), ctx.getExecutionPrice(), ctx.getOrderCashAmount(),
                    ctx.getFee(), null, Instant.now()));

        } catch (TradingException e) {
            Order failedOrder = orderRepository.findById(orderId).orElse(order);
            eventPublisher.publishEvent(new OrderStatusChangedEvent(
                    orderId, order.getUserId(), order.getAssetId(),
                    asset.getSymbol(), order.getSide(),
                    OrderStatus.EXECUTING, failedOrder.getStatus(),
                    order.getUnits(), order.getExecutionPrice(), order.getCashAmount(),
                    order.getFee(), e.getMessage(), Instant.now()));
            assetMetrics.recordTradeFailure();
            throw e;
        } catch (Exception e) {
            assetMetrics.recordTradeFailure();
            log.error("Async execution failed for order {}: {}", orderId, e.getMessage(), e);
            throw new TradingException("Trade failed unexpectedly: " + e.getMessage(), "TRADE_FAILED");
        } finally {
            tradeLockService.releaseTradeLock(order.getUserId(), order.getAssetId(), lockValue);
        }
    }

    private QuoteResponse toQuoteResponse(Order order, List<String> warnings) {
        return new QuoteResponse(
                order.getId(), order.getStatus(), order.getAssetId(), null,
                order.getSide(), order.getUnits(), order.getExecutionPrice(), null,
                null, order.getFee(), null, order.getSpreadAmount(), order.getCashAmount(),
                null, null, null, null, null, null, null,
                order.getQuotedAt(), order.getQuoteExpiresAt(), warnings);
    }

    private OrderResponse toOrderResponse(Order order) {
        return new OrderResponse(
                order.getId(), order.getAssetId(), null,
                order.getSide(), order.getUnits(), order.getExecutionPrice(),
                order.getCashAmount(), order.getFee(), order.getSpreadAmount(),
                order.getStatus(), order.getCreatedAt());
    }

    // ──────────────────────────────────────────────────────────────────────
    // Shared helpers (used by quote creation and async execution)
    // ──────────────────────────────────────────────────────────────────────

    /** Resolve cash account and asset account. SELL validates unit ownership. */
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

    // ──────────────────────────────────────────────────────────────────────
    // Lock-protected execution
    // ──────────────────────────────────────────────────────────────────────

    /**
     * Executes all steps inside the distributed lock: re-verification, portfolio update,
     * trade log, supply adjustment, OHLC update, and Fineract batch transfer.
     */
    private void executeInsideLock(TradeContext ctx) {
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

        markOrderFilled(ctx, lockedAsset);
    }

    /** Re-fetch asset inside lock, validate LP account configuration. */
    private Asset reVerifyAsset(TradeContext ctx) {
        Asset lockedAsset = assetRepository.findById(ctx.getAssetId())
                .orElseThrow(() -> new AssetException("Asset not found: " + ctx.getAssetId()));
        if (lockedAsset.getLpCashAccountId() == null || lockedAsset.getLpAssetAccountId() == null) {
            rejectOrder(ctx.getOrder(), "Asset LP accounts not configured");
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

    /** Re-fetch authoritative price and recalculate all amounts inside lock using LP bid/ask.
     *  Rejects the trade if the price has moved beyond the slippage tolerance (2%) since preview. */
    private void recalculatePriceInsideLock(TradeContext ctx) {
        TradeStrategy strategy = ctx.getStrategy();
        Asset asset = ctx.getAsset();
        BigDecimal units = ctx.getUnits();

        PriceResponse lockedPriceData = pricingService.getPrice(ctx.getAssetId());
        BigDecimal lockedBasePrice = lockedPriceData.askPrice();

        // BUY executes at LP ask price, SELL at LP bid price
        BigDecimal executionPrice = (strategy.side() == TradeSide.BUY)
                ? lockedPriceData.askPrice()
                : lockedPriceData.bidPrice();

        // Slippage protection: reject if price moved more than 2% from preview
        BigDecimal previewPrice = ctx.getExecutionPrice();
        if (previewPrice != null && previewPrice.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal slippage = executionPrice.subtract(previewPrice).abs()
                    .divide(previewPrice, 6, RoundingMode.HALF_UP);
            BigDecimal maxSlippage = new BigDecimal("0.02"); // 2% tolerance
            if (slippage.compareTo(maxSlippage) > 0) {
                rejectOrder(ctx.getOrder(), "Price moved beyond slippage tolerance");
                throw new TradingException(
                        "Price changed significantly since preview. Preview: " + previewPrice
                                + ", Current: " + executionPrice + " (slippage: "
                                + slippage.multiply(new BigDecimal("100")).setScale(2, RoundingMode.HALF_UP) + "%)",
                        "PRICE_CHANGED");
            }
        }

        BigDecimal grossAmount = units.multiply(executionPrice).setScale(0, RoundingMode.HALF_UP);
        BigDecimal fee = grossAmount.multiply(ctx.getFeePercent()).setScale(0, RoundingMode.HALF_UP);

        // LP margin: directional spread (no .abs())
        BigDecimal issuerPrice = asset.getIssuerPrice() != null ? asset.getIssuerPrice() : lockedBasePrice;
        BigDecimal spreadAmount;
        BigDecimal buybackPremium;
        if (!isSpreadEnabled(asset)) {
            spreadAmount = BigDecimal.ZERO;
            buybackPremium = BigDecimal.ZERO;
        } else if (strategy.side() == TradeSide.BUY) {
            spreadAmount = executionPrice.subtract(issuerPrice).max(BigDecimal.ZERO)
                    .multiply(units).setScale(0, RoundingMode.HALF_UP);
            buybackPremium = BigDecimal.ZERO;
        } else {
            BigDecimal rawSpread = issuerPrice.subtract(executionPrice);
            if (rawSpread.compareTo(BigDecimal.ZERO) >= 0) {
                spreadAmount = rawSpread.multiply(units).setScale(0, RoundingMode.HALF_UP);
                buybackPremium = BigDecimal.ZERO;
            } else {
                spreadAmount = BigDecimal.ZERO;
                buybackPremium = rawSpread.negate().multiply(units).setScale(0, RoundingMode.HALF_UP);
            }
        }

        BigDecimal orderCashAmount = strategy.computeOrderCashAmount(grossAmount, fee);

        ctx.setBasePrice(lockedBasePrice);
        ctx.setExecutionPrice(executionPrice);
        ctx.setIssuerPrice(issuerPrice);
        ctx.setGrossAmount(grossAmount);
        ctx.setFee(fee);
        ctx.setSpreadAmount(spreadAmount);
        ctx.setBuybackPremium(buybackPremium);
        ctx.setOrderCashAmount(orderCashAmount);

        // Update order with authoritative locked values
        Order order = ctx.getOrder();
        order.setExecutionPrice(executionPrice);
        order.setCashAmount(orderCashAmount);
        order.setFee(fee);
        order.setSpreadAmount(spreadAmount);
        order.setBuybackPremium(buybackPremium);
        orderRepository.save(order);
    }

    /** BUY: verify user cash balance. SELL: verify LP cash balance (capital adequacy). */
    private void checkBalanceInsideLock(TradeContext ctx) {
        String currency = assetServiceConfig.getSettlementCurrency();
        if (ctx.getStrategy().side() == TradeSide.BUY) {
            BigDecimal availableBalance = fineractClient.getAccountBalance(ctx.getUserCashAccountId());
            if (availableBalance.compareTo(ctx.getOrderCashAmount()) < 0) {
                rejectOrder(ctx.getOrder(), "Insufficient " + currency + " balance");
                throw new TradingException(
                        "Insufficient " + currency + " balance. Required: " + ctx.getOrderCashAmount()
                                + " " + currency + ", Available: " + availableBalance + " " + currency,
                        "INSUFFICIENT_FUNDS");
            }
        } else {
            // SELL: LP must have enough cash to pay the seller
            Asset asset = ctx.getAsset();
            BigDecimal lpCashBalance = fineractClient.getAccountBalance(asset.getLpCashAccountId());
            if (lpCashBalance.compareTo(ctx.getOrderCashAmount()) < 0) {
                rejectOrder(ctx.getOrder(), "Insufficient LP funds for payout");
                throw new TradingException(
                        "This asset's liquidity provider currently has insufficient funds to process your sell order. "
                                + "Required: " + ctx.getOrderCashAmount() + " " + currency
                                + ", LP available: " + lpCashBalance + " " + currency
                                + ". Please try again later or contact support.",
                        "INSUFFICIENT_LP_FUNDS");
            }
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
                .buybackPremium(ctx.getBuybackPremium() != null ? ctx.getBuybackPremium() : BigDecimal.ZERO)
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
        Long feeCollectionAccountId = resolvedGlAccounts.getFeeCollectionAccountId();
        List<BatchOperation> batchOps = buildBatchOperations(
                side, lockedAsset, ctx.getUserCashAccountId(), ctx.getUserAssetAccountId(),
                ctx.getGrossAmount(), ctx.getUnits(), ctx.getFee(), ctx.getSpreadAmount(),
                ctx.getBuybackPremium(), feeCollectionAccountId);

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

    /** Mark order as FILLED, log, and record metrics. */
    private void markOrderFilled(TradeContext ctx, Asset lockedAsset) {
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

    }

    /**
     * Build the atomic batch operations for a trade.
     * <p>
     * LP Cash is the routing hub — all money flows through it, then gets distributed internally.
     * The investor sees at most 1 XAF transaction per trade (fee bundled, spread invisible).
     * <p>
     * BUY: Investor pays grossAmount + fee to LP Cash (single debit), LP Cash distributes internally.
     * SELL: LP Cash pays grossAmount - fee to investor (single credit), LP Cash distributes internally.
     * LP Cash net change is always ±(issuerPrice × units) when spread/premium is enabled.
     */
    private List<BatchOperation> buildBatchOperations(
            TradeSide side, Asset asset,
            Long userCashAccountId, Long userAssetAccountId,
            BigDecimal grossAmount, BigDecimal units, BigDecimal fee,
            BigDecimal spreadAmount, BigDecimal buybackPremium, Long feeCollectionAccountId) {

        List<BatchOperation> ops = new ArrayList<>();

        if (side == TradeSide.BUY) {
            // Leg 1: Investor pays total (grossAmount + fee) to LP Cash — single XAF debit
            ops.add(new BatchTransferOp(
                    userCashAccountId, asset.getLpCashAccountId(),
                    grossAmount.add(fee), "Asset purchase: " + asset.getSymbol()));
            // Leg 2: LP delivers tokens to investor
            ops.add(new BatchTransferOp(
                    asset.getLpAssetAccountId(), userAssetAccountId,
                    units, "Asset delivery: " + asset.getSymbol()));
            // Leg 3 (internal): LP Cash sweeps spread to LP Spread
            if (spreadAmount.compareTo(BigDecimal.ZERO) > 0 && isSpreadEnabled(asset)) {
                ops.add(new BatchTransferOp(
                        asset.getLpCashAccountId(), asset.getLpSpreadAccountId(),
                        spreadAmount, "LP margin: BUY " + asset.getSymbol()));
            }
            // Leg 4 (internal): LP Cash sweeps fee to Fee Collection (mandatory)
            if (fee.compareTo(BigDecimal.ZERO) > 0) {
                ops.add(new BatchTransferOp(
                        asset.getLpCashAccountId(), feeCollectionAccountId,
                        fee, "Trading fee: BUY " + asset.getSymbol()));
            }
        } else {
            // Leg 1: Investor returns tokens
            ops.add(new BatchTransferOp(
                    userAssetAccountId, asset.getLpAssetAccountId(),
                    units, "Asset sell: " + asset.getSymbol()));
            // Leg 2 (optional, internal): If bid > issuer, fund LP Cash premium from LP Spread
            if (buybackPremium != null && buybackPremium.compareTo(BigDecimal.ZERO) > 0 && isSpreadEnabled(asset)) {
                ops.add(new BatchTransferOp(
                        asset.getLpSpreadAccountId(), asset.getLpCashAccountId(),
                        buybackPremium, "Buyback premium: SELL " + asset.getSymbol()));
            }
            // Leg 3: LP Cash pays net proceeds to investor — single XAF credit
            ops.add(new BatchTransferOp(
                    asset.getLpCashAccountId(), userCashAccountId,
                    grossAmount.subtract(fee), "Asset sale proceeds: " + asset.getSymbol()));
            // Leg 4 (internal): LP Cash sweeps fee to Fee Collection (mandatory)
            if (fee.compareTo(BigDecimal.ZERO) > 0) {
                ops.add(new BatchTransferOp(
                        asset.getLpCashAccountId(), feeCollectionAccountId,
                        fee, "Trading fee: SELL " + asset.getSymbol()));
            }
            // Leg 5 (internal): LP Cash sweeps spread to LP Spread (if bid < issuer)
            if (spreadAmount.compareTo(BigDecimal.ZERO) > 0 && isSpreadEnabled(asset)) {
                ops.add(new BatchTransferOp(
                        asset.getLpCashAccountId(), asset.getLpSpreadAccountId(),
                        spreadAmount, "LP margin: SELL " + asset.getSymbol()));
            }
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

    /**
     * Cancel a PENDING or QUEUED order. Only the owning user can cancel.
     */
    @Transactional
    public OrderResponse cancelOrder(String orderId, Long userId) {
        Order order = orderRepository.findByIdAndUserId(orderId, userId)
                .orElseThrow(() -> new AssetException("Order not found: " + orderId));

        if (order.getStatus() != OrderStatus.PENDING && order.getStatus() != OrderStatus.QUEUED
                && order.getStatus() != OrderStatus.QUOTED) {
            throw new TradingException(
                    "Cannot cancel order with status " + order.getStatus() + ". Only QUOTED, PENDING, or QUEUED orders can be cancelled.",
                    "CANCEL_NOT_ALLOWED");
        }

        OrderStatus previousStatus = order.getStatus();
        order.setStatus(OrderStatus.CANCELLED);
        order.setFailureReason("Cancelled by user");
        orderRepository.save(order);

        // Release soft reservation if cancelling a QUOTED BUY order
        if (previousStatus == OrderStatus.QUOTED && order.getSide() == TradeSide.BUY) {
            quoteReservationService.release(order.getAssetId(), orderId, order.getUnits());
        }

        eventPublisher.publishEvent(new OrderStatusChangedEvent(
                orderId, userId, order.getAssetId(), null, order.getSide(),
                previousStatus, OrderStatus.CANCELLED,
                order.getUnits(), order.getExecutionPrice(), order.getCashAmount(),
                order.getFee(), "Cancelled by user", Instant.now()));

        log.info("Order cancelled: orderId={}, userId={}, previousStatus={}", orderId, userId, previousStatus);

        Asset orderAsset = order.getAsset();
        return new OrderResponse(
                order.getId(), order.getAssetId(),
                orderAsset != null ? orderAsset.getSymbol() : null,
                order.getSide(), order.getUnits(), order.getExecutionPrice(),
                order.getCashAmount(), order.getFee(), order.getSpreadAmount(),
                order.getStatus(), order.getCreatedAt()
        );
    }

    /**
     * Check if LP spread collection is enabled for this asset.
     * In the LP model, each asset has its own spread account (per-asset).
     */
    private boolean isSpreadEnabled(Asset asset) {
        return asset.getLpSpreadAccountId() != null && asset.getLpSpreadAccountId() > 0;
    }
}
