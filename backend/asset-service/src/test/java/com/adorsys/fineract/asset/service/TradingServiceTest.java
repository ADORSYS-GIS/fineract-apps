package com.adorsys.fineract.asset.service;

import com.adorsys.fineract.asset.client.FineractClient;
import com.adorsys.fineract.asset.client.FineractClient.*;
import com.adorsys.fineract.asset.config.AssetServiceConfig;
import com.adorsys.fineract.asset.config.ResolvedGlAccounts;
import com.adorsys.fineract.asset.dto.*;
import com.adorsys.fineract.asset.entity.Asset;
import com.adorsys.fineract.asset.entity.Order;
import com.adorsys.fineract.asset.entity.UserPosition;
import com.adorsys.fineract.asset.event.OrderStatusChangedEvent;
import com.adorsys.fineract.asset.exception.InsufficientInventoryException;
import com.adorsys.fineract.asset.exception.MarketClosedException;
import com.adorsys.fineract.asset.exception.TradingException;
import com.adorsys.fineract.asset.exception.TradingHaltedException;
import com.adorsys.fineract.asset.metrics.AssetMetrics;
import com.adorsys.fineract.asset.repository.AssetRepository;
import com.adorsys.fineract.asset.repository.OrderRepository;
import com.adorsys.fineract.asset.repository.TradeLogRepository;
import com.adorsys.fineract.asset.repository.UserPositionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.oauth2.jwt.Jwt;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TradingServiceTest {

    @Mock private OrderRepository orderRepository;
    @Mock private TradeLogRepository tradeLogRepository;
    @Mock private AssetRepository assetRepository;
    @Mock private UserPositionRepository userPositionRepository;
    @Mock private FineractClient fineractClient;
    @Mock private MarketHoursService marketHoursService;
    @Mock private TradeLockService tradeLockService;
    @Mock private PortfolioService portfolioService;
    @Mock private PricingService pricingService;
    @Mock private AssetServiceConfig assetServiceConfig;
    @Mock private ResolvedGlAccounts resolvedGlAccounts;
    @Mock private AssetMetrics assetMetrics;
    @Mock private BondBenefitService bondBenefitService;
    @Mock private IncomeBenefitService incomeBenefitService;
    @Mock private ExposureLimitService exposureLimitService;
    @Mock private LockupService lockupService;
    @Mock private org.springframework.context.ApplicationEventPublisher eventPublisher;
    @Mock private QuoteReservationService quoteReservationService;

    @InjectMocks
    private TradingService tradingService;

    @Mock private Jwt jwt;

    @Captor private ArgumentCaptor<List<BatchOperation>> batchOpsCaptor;
    @Captor private ArgumentCaptor<Order> orderCaptor;

    private static final String ASSET_ID = "asset-001";
    private static final String EXTERNAL_ID = "keycloak-uuid-123";
    private static final Long USER_ID = 42L;
    private static final Long USER_CASH_ACCOUNT = 100L;
    private static final Long USER_ASSET_ACCOUNT = 200L;
    private static final Long LP_CASH_ACCOUNT = 300L;
    private static final Long LP_ASSET_ACCOUNT = 400L;
    private static final Long LP_SPREAD_ACCOUNT = 500L;
    private static final Long FEE_COLLECTION_ACCOUNT = 999L;
    private static final Long FEE_INCOME_GL_ID = 87L;
    private static final Long FUND_SOURCE_GL_ID = 42L;
    private static final String IDEMPOTENCY_KEY = "idem-key-1";

    private Asset activeAsset;

    @BeforeEach
    void setUp() {
        activeAsset = Asset.builder()
                .id(ASSET_ID)
                .symbol("TST")
                .currencyCode("TST")
                .name("Test Asset")
                .status(AssetStatus.ACTIVE)
                .totalSupply(new BigDecimal("1000"))
                .circulatingSupply(BigDecimal.ZERO)
                .tradingFeePercent(new BigDecimal("0.005"))
                .lpCashAccountId(LP_CASH_ACCOUNT)
                .lpAssetAccountId(LP_ASSET_ACCOUNT)
                .lpSpreadAccountId(LP_SPREAD_ACCOUNT)
                .issuerPrice(new BigDecimal("100"))
                .fineractProductId(10)
                .subscriptionStartDate(LocalDate.now().minusMonths(1))
                .subscriptionEndDate(LocalDate.now().plusYears(1))
                .build();

        // Default accounting config (spread enabled)
        AssetServiceConfig.Accounting accounting = new AssetServiceConfig.Accounting();
        accounting.setSpreadCollectionAccountId(LP_SPREAD_ACCOUNT);
        lenient().when(assetServiceConfig.getAccounting()).thenReturn(accounting);
        lenient().when(assetServiceConfig.getSettlementCurrency()).thenReturn("XAF");
        lenient().when(resolvedGlAccounts.getFeeIncomeId()).thenReturn(FEE_INCOME_GL_ID);
        lenient().when(resolvedGlAccounts.getFundSourceId()).thenReturn(FUND_SOURCE_GL_ID);
        lenient().when(resolvedGlAccounts.getFeeCollectionAccountId()).thenReturn(FEE_COLLECTION_ACCOUNT);

        // Market hours config (needed for subscription period checks)
        AssetServiceConfig.MarketHours marketHours = new AssetServiceConfig.MarketHours();
        marketHours.setTimezone("Africa/Douala");
        lenient().when(assetServiceConfig.getMarketHours()).thenReturn(marketHours);

        // Quote config
        AssetServiceConfig.Quote quoteConfig = new AssetServiceConfig.Quote();
        quoteConfig.setTtlSeconds(30);
        quoteConfig.setMaxActivePerUser(5);
        lenient().when(assetServiceConfig.getQuote()).thenReturn(quoteConfig);
    }

    // -------------------------------------------------------------------------
    // executeBuy tests
    // -------------------------------------------------------------------------

    @Test
    void executeBuy_happyPath_returnsFilled() {
        // Arrange — LP model: askPrice=110, issuerPrice=100 (on asset), fee=0.5%
        BuyRequest request = new BuyRequest(ASSET_ID, new BigDecimal("10"));
        BigDecimal basePrice = new BigDecimal("100");
        BigDecimal askPrice = new BigDecimal("110");
        BigDecimal feePercent = new BigDecimal("0.005");
        // executionPrice = askPrice = 110
        BigDecimal executionPrice = askPrice;
        // grossAmount = 10 * 110 = 1100
        BigDecimal grossAmount = new BigDecimal("10").multiply(executionPrice).setScale(0, RoundingMode.HALF_UP);
        // fee = 1100 * 0.005 = 6 (5.5 HALF_UP → 6)
        BigDecimal fee = grossAmount.multiply(feePercent).setScale(0, RoundingMode.HALF_UP);
        // spreadAmount = (110 - 100) * 10 = 100
        BigDecimal spreadAmount = executionPrice.subtract(new BigDecimal("100"))
                .multiply(new BigDecimal("10")).setScale(0, RoundingMode.HALF_UP);
        // chargedAmount = grossAmount + fee = 1100 + 6 = 1106 (BUY orderCashAmount)
        BigDecimal chargedAmount = grossAmount.add(fee);
        // effectiveCostPerUnit = 1106 / 10 = 110.6000
        BigDecimal effectiveCostPerUnit = chargedAmount.divide(new BigDecimal("10"), 4, RoundingMode.HALF_UP);

        // Idempotency: no existing order
        when(orderRepository.findByIdempotencyKey(IDEMPOTENCY_KEY)).thenReturn(Optional.empty());

        // Market open
        when(marketHoursService.isMarketOpen()).thenReturn(true);

        // Asset found (initial + re-fetch inside lock)
        when(assetRepository.findById(ASSET_ID)).thenReturn(Optional.of(activeAsset));

        // Price with explicit ask/bid (LP model)
        when(pricingService.getPrice(ASSET_ID))
                .thenReturn(new PriceResponse(ASSET_ID, askPrice, new BigDecimal("90"),
                        new BigDecimal("5.0")));
        when(quoteReservationService.getReservedUnits(ASSET_ID)).thenReturn(BigDecimal.ZERO);

        // JWT resolution
        when(jwt.getSubject()).thenReturn(EXTERNAL_ID);
        when(fineractClient.getClientByExternalId(EXTERNAL_ID))
                .thenReturn(Map.of("id", USER_ID));
        when(fineractClient.findClientSavingsAccountByCurrency(USER_ID, "XAF"))
                .thenReturn(USER_CASH_ACCOUNT);

        // User already has a position with an asset account
        when(userPositionRepository.findByUserIdAndAssetId(USER_ID, ASSET_ID))
                .thenReturn(Optional.of(UserPosition.builder()
                        .userId(USER_ID)
                        .assetId(ASSET_ID)
                        .fineractSavingsAccountId(USER_ASSET_ACCOUNT)
                        .totalUnits(BigDecimal.ZERO)
                        .avgPurchasePrice(BigDecimal.ZERO)
                        .totalCostBasis(BigDecimal.ZERO)
                        .realizedPnl(BigDecimal.ZERO)
                        .lastTradeAt(Instant.now())
                        .build()));

        // Order save
        when(orderRepository.save(any(Order.class))).thenAnswer(inv -> inv.getArgument(0));

        // Trade lock
        when(tradeLockService.acquireTradeLock(USER_ID, ASSET_ID)).thenReturn("lock-val");

        // User XAF balance sufficient
        when(fineractClient.getAccountBalance(USER_CASH_ACCOUNT))
                .thenReturn(new BigDecimal("50000"));

        // Atomic batch succeeds — 4 legs in LP Cash hub model
        List<Map<String, Object>> batchResponses = List.of(
                Map.of("requestId", 1L, "statusCode", 200),
                Map.of("requestId", 2L, "statusCode", 200),
                Map.of("requestId", 3L, "statusCode", 200),
                Map.of("requestId", 4L, "statusCode", 200));
        when(fineractClient.executeAtomicBatch(anyList())).thenReturn(batchResponses);

        // Circulating supply adjustment succeeds
        when(assetRepository.adjustCirculatingSupply(ASSET_ID, new BigDecimal("10"))).thenReturn(1);

        // Act
        TradeResponse response = tradingService.executeBuy(request, jwt, IDEMPOTENCY_KEY);

        // Assert
        assertNotNull(response);
        assertEquals(OrderStatus.FILLED, response.status());
        assertEquals(TradeSide.BUY, response.side());
        assertEquals(new BigDecimal("10"), response.units());
        assertEquals(executionPrice, response.pricePerUnit());
        assertEquals(chargedAmount, response.totalAmount());
        assertEquals(fee, response.fee());
        assertEquals(spreadAmount, response.spreadAmount());
        assertNull(response.realizedPnl());

        // Verify batch ID stored on order
        verify(orderRepository, atLeast(3)).save(orderCaptor.capture());
        Order finalOrder = orderCaptor.getAllValues().stream()
                .filter(o -> o.getStatus() == OrderStatus.FILLED)
                .findFirst().orElseThrow();
        assertEquals("1,2,3,4", finalOrder.getFineractBatchId());

        // Verify atomic batch — LP Cash hub model: 4 BatchTransferOp legs, no withdrawals/journals
        verify(fineractClient).executeAtomicBatch(batchOpsCaptor.capture());
        List<BatchOperation> ops = batchOpsCaptor.getValue();
        assertEquals(4, ops.size());
        ops.forEach(op -> assertInstanceOf(BatchTransferOp.class, op));

        // Leg 1: Investor pays grossAmount+fee to LP Cash (single XAF debit)
        assertTransferOp(ops.get(0), USER_CASH_ACCOUNT, LP_CASH_ACCOUNT, chargedAmount);

        // Leg 2: LP delivers tokens to investor
        assertTransferOp(ops.get(1), LP_ASSET_ACCOUNT, USER_ASSET_ACCOUNT, new BigDecimal("10"));

        // Leg 3 (internal): LP Cash sweeps spread to LP Spread
        assertTransferOp(ops.get(2), LP_CASH_ACCOUNT, LP_SPREAD_ACCOUNT, spreadAmount);

        // Leg 4 (internal): LP Cash sweeps fee to Fee Collection
        assertTransferOp(ops.get(3), LP_CASH_ACCOUNT, FEE_COLLECTION_ACCOUNT, fee);

        // Verify no separate fee calls (everything is in the batch)
        verify(fineractClient, never()).withdrawFromSavingsAccount(anyLong(), any(), anyString());

        // Verify portfolio updated with effective cost per unit (including fee)
        verify(portfolioService).updatePositionAfterBuy(
                eq(USER_ID), eq(ASSET_ID), eq(USER_ASSET_ACCOUNT),
                eq(new BigDecimal("10")), eq(effectiveCostPerUnit));

        // Verify circulating supply adjusted
        verify(assetRepository).adjustCirculatingSupply(ASSET_ID, new BigDecimal("10"));

        // Verify OHLC updated
        verify(pricingService).updateOhlcAfterTrade(ASSET_ID, executionPrice);

        // Verify lock released
        verify(tradeLockService).releaseTradeLock(USER_ID, ASSET_ID, "lock-val");
    }

    @Test
    void executeBuy_idempotencyKey_returnsExistingOrder() {
        // Arrange — idempotency is checked inside lock, so pre-lock validations must pass first
        Order existingOrder = Order.builder()
                .id("existing-order-id")
                .idempotencyKey(IDEMPOTENCY_KEY)
                .userId(USER_ID)
                .userExternalId(EXTERNAL_ID)
                .assetId(ASSET_ID)
                .side(TradeSide.BUY)
                .units(new BigDecimal("5"))
                .executionPrice(new BigDecimal("101"))
                .cashAmount(new BigDecimal("510"))
                .fee(new BigDecimal("3"))
                .spreadAmount(new BigDecimal("5"))
                .status(OrderStatus.FILLED)
                .createdAt(Instant.now())
                .build();

        // Pre-lock validations need to pass
        when(marketHoursService.isMarketOpen()).thenReturn(true);
        when(assetRepository.findById(ASSET_ID)).thenReturn(Optional.of(activeAsset));
        when(jwt.getSubject()).thenReturn(EXTERNAL_ID);
        when(fineractClient.getClientByExternalId(EXTERNAL_ID)).thenReturn(Map.of("id", USER_ID));
        when(pricingService.getPrice(ASSET_ID)).thenReturn(new PriceResponse(ASSET_ID, new BigDecimal("110"), new BigDecimal("90"), null));
        when(quoteReservationService.getReservedUnits(ASSET_ID)).thenReturn(BigDecimal.ZERO);
        when(fineractClient.findClientSavingsAccountByCurrency(USER_ID, "XAF")).thenReturn(USER_CASH_ACCOUNT);

        // Idempotency check inside lock — returns early before balance check
        when(orderRepository.findByIdempotencyKey(IDEMPOTENCY_KEY))
                .thenReturn(Optional.of(existingOrder));
        when(tradeLockService.acquireTradeLock(USER_ID, ASSET_ID)).thenReturn("lock-val");

        BuyRequest request = new BuyRequest(ASSET_ID, new BigDecimal("5"));

        // Act
        TradeResponse response = tradingService.executeBuy(request, jwt, IDEMPOTENCY_KEY);

        // Assert
        assertNotNull(response);
        assertEquals("existing-order-id", response.orderId());
        assertEquals(OrderStatus.FILLED, response.status());
        assertEquals(TradeSide.BUY, response.side());
        assertEquals(new BigDecimal("5"), response.units());
        assertEquals(new BigDecimal("101"), response.pricePerUnit());
    }

    @Test
    void executeBuy_idempotencyKeyBelongsToDifferentUser_throws409() {
        // Arrange — idempotency is checked inside lock, so pre-lock validations must pass
        Order existingOrder = Order.builder()
                .id("existing-order-id")
                .idempotencyKey(IDEMPOTENCY_KEY)
                .userId(999L)
                .userExternalId("different-user-ext-id")
                .assetId(ASSET_ID)
                .side(TradeSide.BUY)
                .units(new BigDecimal("5"))
                .executionPrice(new BigDecimal("101"))
                .cashAmount(new BigDecimal("510"))
                .fee(new BigDecimal("3"))
                .spreadAmount(new BigDecimal("5"))
                .status(OrderStatus.FILLED)
                .createdAt(Instant.now())
                .build();

        when(marketHoursService.isMarketOpen()).thenReturn(true);
        when(assetRepository.findById(ASSET_ID)).thenReturn(Optional.of(activeAsset));
        when(jwt.getSubject()).thenReturn(EXTERNAL_ID);
        when(fineractClient.getClientByExternalId(EXTERNAL_ID)).thenReturn(Map.of("id", USER_ID));
        when(pricingService.getPrice(ASSET_ID)).thenReturn(new PriceResponse(ASSET_ID, new BigDecimal("110"), new BigDecimal("90"), null));
        when(quoteReservationService.getReservedUnits(ASSET_ID)).thenReturn(BigDecimal.ZERO);
        when(fineractClient.findClientSavingsAccountByCurrency(USER_ID, "XAF")).thenReturn(USER_CASH_ACCOUNT);
        when(tradeLockService.acquireTradeLock(USER_ID, ASSET_ID)).thenReturn("lock-val");
        when(orderRepository.findByIdempotencyKey(IDEMPOTENCY_KEY))
                .thenReturn(Optional.of(existingOrder));

        BuyRequest request = new BuyRequest(ASSET_ID, new BigDecimal("5"));

        // Act & Assert — idempotency check inside lock throws before balance check
        TradingException ex = assertThrows(TradingException.class,
                () -> tradingService.executeBuy(request, jwt, IDEMPOTENCY_KEY));
        assertEquals("IDEMPOTENCY_KEY_CONFLICT", ex.getErrorCode());
    }

    @Test
    void executeSell_idempotencyKeyBelongsToDifferentUser_throws409() {
        // Arrange — idempotency is checked inside lock, so pre-lock validations must pass
        Order existingOrder = Order.builder()
                .id("existing-order-id")
                .idempotencyKey(IDEMPOTENCY_KEY)
                .userId(999L)
                .userExternalId("different-user-ext-id")
                .assetId(ASSET_ID)
                .side(TradeSide.SELL)
                .units(new BigDecimal("5"))
                .executionPrice(new BigDecimal("99"))
                .cashAmount(new BigDecimal("490"))
                .fee(new BigDecimal("3"))
                .spreadAmount(new BigDecimal("5"))
                .status(OrderStatus.FILLED)
                .createdAt(Instant.now())
                .build();

        when(marketHoursService.isMarketOpen()).thenReturn(true);
        when(assetRepository.findById(ASSET_ID)).thenReturn(Optional.of(activeAsset));
        when(jwt.getSubject()).thenReturn(EXTERNAL_ID);
        when(fineractClient.getClientByExternalId(EXTERNAL_ID)).thenReturn(Map.of("id", USER_ID));
        when(pricingService.getPrice(ASSET_ID)).thenReturn(new PriceResponse(ASSET_ID, new BigDecimal("110"), new BigDecimal("90"), null));
        when(userPositionRepository.findByUserIdAndAssetId(USER_ID, ASSET_ID))
                .thenReturn(Optional.of(UserPosition.builder().totalUnits(new BigDecimal("10"))
                        .fineractSavingsAccountId(USER_ASSET_ACCOUNT).build()));
        when(fineractClient.findClientSavingsAccountByCurrency(USER_ID, "XAF")).thenReturn(USER_CASH_ACCOUNT);
        when(tradeLockService.acquireTradeLock(USER_ID, ASSET_ID)).thenReturn("lock-val");
        when(orderRepository.findByIdempotencyKey(IDEMPOTENCY_KEY))
                .thenReturn(Optional.of(existingOrder));

        SellRequest request = new SellRequest(ASSET_ID, new BigDecimal("5"));

        // Act & Assert
        TradingException ex = assertThrows(TradingException.class,
                () -> tradingService.executeSell(request, jwt, IDEMPOTENCY_KEY));
        assertEquals("IDEMPOTENCY_KEY_CONFLICT", ex.getErrorCode());
    }

    @Test
    void executeBuy_marketClosed_queuesOrder() {
        // Arrange — when market is closed, order should be queued (not rejected)
        when(marketHoursService.isMarketOpen()).thenReturn(false);
        when(assetRepository.findById(ASSET_ID)).thenReturn(Optional.of(activeAsset));
        when(jwt.getSubject()).thenReturn(EXTERNAL_ID);
        when(fineractClient.getClientByExternalId(EXTERNAL_ID)).thenReturn(Map.of("id", USER_ID));
        when(pricingService.getPrice(ASSET_ID)).thenReturn(new PriceResponse(ASSET_ID, new BigDecimal("110"), new BigDecimal("90"), null));
        when(quoteReservationService.getReservedUnits(ASSET_ID)).thenReturn(BigDecimal.ZERO);
        when(orderRepository.save(any(Order.class))).thenAnswer(inv -> inv.getArgument(0));

        BuyRequest request = new BuyRequest(ASSET_ID, new BigDecimal("10"));

        // Act
        TradeResponse response = tradingService.executeBuy(request, jwt, IDEMPOTENCY_KEY);

        // Assert — order is queued, not executed
        assertNotNull(response);
        assertEquals(OrderStatus.QUEUED, response.status());

        // Verify no lock was acquired or transfers attempted
        verifyNoInteractions(tradeLockService);
    }

    @Test
    void executeBuy_insufficientInventory_throwsAfterLock() {
        // Arrange: asset with low available supply (total 1000, circulating 998 => only 2 available)
        Asset lowSupplyAsset = Asset.builder()
                .id(ASSET_ID)
                .symbol("TST")
                .currencyCode("TST")
                .name("Test Asset")
                .status(AssetStatus.ACTIVE)
                .totalSupply(new BigDecimal("1000"))
                .circulatingSupply(new BigDecimal("998"))
                .tradingFeePercent(new BigDecimal("0.005"))
                .lpCashAccountId(LP_CASH_ACCOUNT)
                .lpAssetAccountId(LP_ASSET_ACCOUNT)
                .fineractProductId(10)
                .subscriptionStartDate(LocalDate.now().minusMonths(1))
                .subscriptionEndDate(LocalDate.now().plusYears(1))
                .build();

        BuyRequest request = new BuyRequest(ASSET_ID, new BigDecimal("10"));

        when(marketHoursService.isMarketOpen()).thenReturn(true);

        // Asset returns low supply — only 2 available (1000 - 998)
        when(assetRepository.findById(ASSET_ID))
                .thenReturn(Optional.of(lowSupplyAsset));

        when(pricingService.getPrice(ASSET_ID))
                .thenReturn(new PriceResponse(ASSET_ID, new BigDecimal("100"), new BigDecimal("95"), null));
        when(quoteReservationService.getReservedUnits(ASSET_ID)).thenReturn(BigDecimal.ZERO);

        // JWT resolution
        when(jwt.getSubject()).thenReturn(EXTERNAL_ID);
        when(fineractClient.getClientByExternalId(EXTERNAL_ID))
                .thenReturn(Map.of("id", USER_ID));

        // Act & Assert: inventory check happens pre-lock and should throw
        assertThrows(InsufficientInventoryException.class,
                () -> tradingService.executeBuy(request, jwt, IDEMPOTENCY_KEY));

        // Verify no lock was acquired (inventory check is pre-lock now)
        verifyNoInteractions(tradeLockService);
    }

    @Test
    void executeBuy_insufficientFunds_throws() {
        // Arrange: user has only 500 XAF but needs ~1015 for the purchase
        BuyRequest request = new BuyRequest(ASSET_ID, new BigDecimal("10"));

        when(marketHoursService.isMarketOpen()).thenReturn(true);
        when(assetRepository.findById(ASSET_ID)).thenReturn(Optional.of(activeAsset));
        when(pricingService.getPrice(ASSET_ID))
                .thenReturn(new PriceResponse(ASSET_ID, new BigDecimal("100"), new BigDecimal("95"), null));
        when(quoteReservationService.getReservedUnits(ASSET_ID)).thenReturn(BigDecimal.ZERO);

        // JWT
        when(jwt.getSubject()).thenReturn(EXTERNAL_ID);
        when(fineractClient.getClientByExternalId(EXTERNAL_ID))
                .thenReturn(Map.of("id", USER_ID));
        when(fineractClient.findClientSavingsAccountByCurrency(USER_ID, "XAF"))
                .thenReturn(USER_CASH_ACCOUNT);
        when(userPositionRepository.findByUserIdAndAssetId(USER_ID, ASSET_ID))
                .thenReturn(Optional.of(UserPosition.builder()
                        .userId(USER_ID)
                        .assetId(ASSET_ID)
                        .fineractSavingsAccountId(USER_ASSET_ACCOUNT)
                        .totalUnits(BigDecimal.ZERO)
                        .avgPurchasePrice(BigDecimal.ZERO)
                        .totalCostBasis(BigDecimal.ZERO)
                        .realizedPnl(BigDecimal.ZERO)
                        .lastTradeAt(Instant.now())
                        .build()));

        when(orderRepository.save(any(Order.class))).thenAnswer(inv -> inv.getArgument(0));
        when(tradeLockService.acquireTradeLock(USER_ID, ASSET_ID)).thenReturn("lock-val");

        // Insufficient balance: user has 500 XAF, but chargedAmount will be ~1015
        when(fineractClient.getAccountBalance(USER_CASH_ACCOUNT))
                .thenReturn(new BigDecimal("500"));

        // Act & Assert
        TradingException ex = assertThrows(TradingException.class,
                () -> tradingService.executeBuy(request, jwt, IDEMPOTENCY_KEY));
        assertTrue(ex.getMessage().contains("Insufficient XAF balance"), "Expected error message to contain currency code");
        assertEquals("INSUFFICIENT_FUNDS", ex.getErrorCode());

        // Verify the lock was acquired (balance check is inside lock)
        verify(tradeLockService).acquireTradeLock(USER_ID, ASSET_ID);

        // Verify the lock was released in finally block
        verify(tradeLockService).releaseTradeLock(USER_ID, ASSET_ID, "lock-val");

        // Verify no batch was attempted
        verify(fineractClient, never()).executeAtomicBatch(anyList());
    }

    // -------------------------------------------------------------------------
    // executeSell tests
    // -------------------------------------------------------------------------

    @Test
    void executeSell_happyPath_returnsFilled() {
        // Arrange — LP model: bidPrice=95, issuerPrice=100 (on asset), fee=0.5%
        SellRequest request = new SellRequest(ASSET_ID, new BigDecimal("5"));
        BigDecimal basePrice = new BigDecimal("100");
        BigDecimal bidPrice = new BigDecimal("95");
        BigDecimal feePercent = new BigDecimal("0.005");
        // executionPrice = bidPrice = 95
        BigDecimal executionPrice = bidPrice;
        // grossAmount = 5 * 95 = 475
        BigDecimal grossAmount = new BigDecimal("5").multiply(executionPrice).setScale(0, RoundingMode.HALF_UP);
        // fee = 475 * 0.005 = 2 (2.375 HALF_UP → 2)
        BigDecimal fee = grossAmount.multiply(feePercent).setScale(0, RoundingMode.HALF_UP);
        // spreadAmount = (100 - 95) * 5 = 25 (bid < issuer → LP profits)
        BigDecimal spreadAmount = new BigDecimal("100").subtract(bidPrice)
                .multiply(new BigDecimal("5")).setScale(0, RoundingMode.HALF_UP);
        // netAmount = grossAmount - fee = 475 - 2 = 473 (SELL orderCashAmount)
        BigDecimal netAmount = grossAmount.subtract(fee);
        // netProceedsPerUnit = 473 / 5 = 94.6000
        BigDecimal netProceedsPerUnit = netAmount.divide(new BigDecimal("5"), 4, RoundingMode.HALF_UP);

        // Idempotency
        when(orderRepository.findByIdempotencyKey(IDEMPOTENCY_KEY)).thenReturn(Optional.empty());
        when(marketHoursService.isMarketOpen()).thenReturn(true);

        // Asset
        when(assetRepository.findById(ASSET_ID)).thenReturn(Optional.of(activeAsset));

        // Price with explicit bid/ask (LP model)
        when(pricingService.getPrice(ASSET_ID))
                .thenReturn(new PriceResponse(ASSET_ID, new BigDecimal("110"), bidPrice,
                        new BigDecimal("5.0")));

        // JWT
        when(jwt.getSubject()).thenReturn(EXTERNAL_ID);
        when(fineractClient.getClientByExternalId(EXTERNAL_ID))
                .thenReturn(Map.of("id", USER_ID));
        when(fineractClient.findClientSavingsAccountByCurrency(USER_ID, "XAF"))
                .thenReturn(USER_CASH_ACCOUNT);

        // Existing position with units
        UserPosition existingPosition = UserPosition.builder()
                .userId(USER_ID)
                .assetId(ASSET_ID)
                .fineractSavingsAccountId(USER_ASSET_ACCOUNT)
                .totalUnits(new BigDecimal("20"))
                .avgPurchasePrice(new BigDecimal("100"))
                .totalCostBasis(new BigDecimal("2000"))
                .realizedPnl(BigDecimal.ZERO)
                .lastTradeAt(Instant.now())
                .build();
        when(userPositionRepository.findByUserIdAndAssetId(USER_ID, ASSET_ID))
                .thenReturn(Optional.of(existingPosition));

        when(orderRepository.save(any(Order.class))).thenAnswer(inv -> inv.getArgument(0));
        when(tradeLockService.acquireTradeLock(USER_ID, ASSET_ID)).thenReturn("lock-val");

        // LP cash balance sufficient for payout
        when(fineractClient.getAccountBalance(LP_CASH_ACCOUNT)).thenReturn(new BigDecimal("50000"));

        // Atomic batch succeeds — 4 legs in LP Cash hub model
        List<Map<String, Object>> batchResponses = List.of(
                Map.of("requestId", 1L, "statusCode", 200),
                Map.of("requestId", 2L, "statusCode", 200),
                Map.of("requestId", 3L, "statusCode", 200),
                Map.of("requestId", 4L, "statusCode", 200));
        when(fineractClient.executeAtomicBatch(anyList())).thenReturn(batchResponses);

        // Portfolio update returns realized P&L
        BigDecimal realizedPnl = new BigDecimal("-27");
        when(portfolioService.updatePositionAfterSell(eq(USER_ID), eq(ASSET_ID),
                eq(new BigDecimal("5")), eq(netProceedsPerUnit)))
                .thenReturn(realizedPnl);

        // Circulating supply adjustment succeeds
        when(assetRepository.adjustCirculatingSupply(ASSET_ID, new BigDecimal("5").negate())).thenReturn(1);

        // Act
        TradeResponse response = tradingService.executeSell(request, jwt, IDEMPOTENCY_KEY);

        // Assert
        assertNotNull(response);
        assertEquals(OrderStatus.FILLED, response.status());
        assertEquals(TradeSide.SELL, response.side());
        assertEquals(new BigDecimal("5"), response.units());
        assertEquals(executionPrice, response.pricePerUnit());
        assertEquals(netAmount, response.totalAmount());
        assertEquals(fee, response.fee());
        assertEquals(spreadAmount, response.spreadAmount());
        assertEquals(realizedPnl, response.realizedPnl());

        // Verify atomic batch — LP Cash hub model: 4 BatchTransferOp legs
        verify(fineractClient).executeAtomicBatch(batchOpsCaptor.capture());
        List<BatchOperation> ops = batchOpsCaptor.getValue();
        assertEquals(4, ops.size());
        ops.forEach(op -> assertInstanceOf(BatchTransferOp.class, op));

        // Leg 1: Investor returns tokens
        assertTransferOp(ops.get(0), USER_ASSET_ACCOUNT, LP_ASSET_ACCOUNT, new BigDecimal("5"));

        // Leg 2: LP Cash pays net proceeds to investor (single XAF credit)
        assertTransferOp(ops.get(1), LP_CASH_ACCOUNT, USER_CASH_ACCOUNT, netAmount);

        // Leg 3 (internal): LP Cash sweeps fee to Fee Collection
        assertTransferOp(ops.get(2), LP_CASH_ACCOUNT, FEE_COLLECTION_ACCOUNT, fee);

        // Leg 4 (internal): LP Cash sweeps spread to LP Spread
        assertTransferOp(ops.get(3), LP_CASH_ACCOUNT, LP_SPREAD_ACCOUNT, spreadAmount);

        // Verify batch ID stored on order
        verify(orderRepository, atLeast(3)).save(orderCaptor.capture());
        Order finalSellOrder = orderCaptor.getAllValues().stream()
                .filter(o -> o.getStatus() == OrderStatus.FILLED)
                .findFirst().orElseThrow();
        assertEquals("1,2,3,4", finalSellOrder.getFineractBatchId());

        // Verify no separate fee calls
        verify(fineractClient, never()).withdrawFromSavingsAccount(anyLong(), any(), anyString());

        // Verify circulating supply decreased
        verify(assetRepository).adjustCirculatingSupply(ASSET_ID, new BigDecimal("5").negate());

        // Verify OHLC updated
        verify(pricingService).updateOhlcAfterTrade(ASSET_ID, executionPrice);

        // Verify lock released
        verify(tradeLockService).releaseTradeLock(USER_ID, ASSET_ID, "lock-val");
    }

    // -------------------------------------------------------------------------
    // Spread-disabled tests
    // -------------------------------------------------------------------------

    @Test
    void executeBuy_spreadDisabled_noSpreadLeg() {
        // Arrange: spread disabled by removing lpSpreadAccountId from asset
        activeAsset.setLpSpreadAccountId(null);

        BuyRequest request = new BuyRequest(ASSET_ID, new BigDecimal("10"));
        BigDecimal basePrice = new BigDecimal("100");
        // No ask/bid → executionPrice = basePrice = 100
        // grossAmount = 10 * 100 = 1000, fee = 1000 * 0.005 = 5
        // chargedAmount = 1000 + 5 = 1005, spreadAmount = 0

        when(orderRepository.findByIdempotencyKey(IDEMPOTENCY_KEY)).thenReturn(Optional.empty());
        when(marketHoursService.isMarketOpen()).thenReturn(true);
        when(assetRepository.findById(ASSET_ID)).thenReturn(Optional.of(activeAsset));
        when(pricingService.getPrice(ASSET_ID))
                .thenReturn(new PriceResponse(ASSET_ID, basePrice, basePrice, null));
        when(quoteReservationService.getReservedUnits(ASSET_ID)).thenReturn(BigDecimal.ZERO);

        when(jwt.getSubject()).thenReturn(EXTERNAL_ID);
        when(fineractClient.getClientByExternalId(EXTERNAL_ID)).thenReturn(Map.of("id", USER_ID));
        when(fineractClient.findClientSavingsAccountByCurrency(USER_ID, "XAF")).thenReturn(USER_CASH_ACCOUNT);
        when(userPositionRepository.findByUserIdAndAssetId(USER_ID, ASSET_ID))
                .thenReturn(Optional.of(UserPosition.builder()
                        .userId(USER_ID).assetId(ASSET_ID)
                        .fineractSavingsAccountId(USER_ASSET_ACCOUNT)
                        .totalUnits(BigDecimal.ZERO).avgPurchasePrice(BigDecimal.ZERO)
                        .totalCostBasis(BigDecimal.ZERO).realizedPnl(BigDecimal.ZERO)
                        .lastTradeAt(Instant.now()).build()));

        when(orderRepository.save(any(Order.class))).thenAnswer(inv -> inv.getArgument(0));
        when(tradeLockService.acquireTradeLock(USER_ID, ASSET_ID)).thenReturn("lock-val");
        when(fineractClient.getAccountBalance(USER_CASH_ACCOUNT)).thenReturn(new BigDecimal("50000"));
        when(fineractClient.executeAtomicBatch(anyList())).thenReturn(List.of());
        when(assetRepository.adjustCirculatingSupply(ASSET_ID, new BigDecimal("10"))).thenReturn(1);

        // Act
        TradeResponse response = tradingService.executeBuy(request, jwt, IDEMPOTENCY_KEY);

        // Assert: execution price = base price (no ask price), spread = 0
        assertEquals(basePrice, response.pricePerUnit());
        assertEquals(BigDecimal.ZERO, response.spreadAmount());

        // Assert: 3 batch ops (cash with fee bundled, asset, fee to fee collection — no spread leg)
        verify(fineractClient).executeAtomicBatch(batchOpsCaptor.capture());
        List<BatchOperation> ops = batchOpsCaptor.getValue();
        assertEquals(3, ops.size());
        ops.forEach(op -> assertInstanceOf(BatchTransferOp.class, op));
        // Leg 1: Investor pays 1005 (1000+5) to LP Cash
        assertTransferOp(ops.get(0), USER_CASH_ACCOUNT, LP_CASH_ACCOUNT, new BigDecimal("1005"));
        // Leg 2: LP delivers tokens
        assertTransferOp(ops.get(1), LP_ASSET_ACCOUNT, USER_ASSET_ACCOUNT, new BigDecimal("10"));
        // Leg 3: Fee to Fee Collection
        assertTransferOp(ops.get(2), LP_CASH_ACCOUNT, FEE_COLLECTION_ACCOUNT, new BigDecimal("5"));
    }

    @Test
    void executeSell_spreadDisabled_noSpreadLeg() {
        // Arrange: spread disabled by removing lpSpreadAccountId from asset
        activeAsset.setLpSpreadAccountId(null);

        SellRequest request = new SellRequest(ASSET_ID, new BigDecimal("5"));
        BigDecimal basePrice = new BigDecimal("100");
        // No bid/ask → executionPrice = basePrice = 100
        // grossAmount = 5 * 100 = 500, fee = 500 * 0.005 = 3 (2.5 HALF_UP → 3)
        // netAmount = 500 - 3 = 497, spread = 0
        BigDecimal netAmount = new BigDecimal("497");
        BigDecimal netProceedsPerUnit = netAmount.divide(new BigDecimal("5"), 4, RoundingMode.HALF_UP);

        when(orderRepository.findByIdempotencyKey(IDEMPOTENCY_KEY)).thenReturn(Optional.empty());
        when(marketHoursService.isMarketOpen()).thenReturn(true);
        when(assetRepository.findById(ASSET_ID)).thenReturn(Optional.of(activeAsset));
        when(pricingService.getPrice(ASSET_ID))
                .thenReturn(new PriceResponse(ASSET_ID, basePrice, basePrice, null));

        when(jwt.getSubject()).thenReturn(EXTERNAL_ID);
        when(fineractClient.getClientByExternalId(EXTERNAL_ID)).thenReturn(Map.of("id", USER_ID));
        when(fineractClient.findClientSavingsAccountByCurrency(USER_ID, "XAF")).thenReturn(USER_CASH_ACCOUNT);
        when(userPositionRepository.findByUserIdAndAssetId(USER_ID, ASSET_ID))
                .thenReturn(Optional.of(UserPosition.builder()
                        .userId(USER_ID).assetId(ASSET_ID)
                        .fineractSavingsAccountId(USER_ASSET_ACCOUNT)
                        .totalUnits(new BigDecimal("20")).avgPurchasePrice(new BigDecimal("100"))
                        .totalCostBasis(new BigDecimal("2000")).realizedPnl(BigDecimal.ZERO)
                        .lastTradeAt(Instant.now()).build()));

        when(orderRepository.save(any(Order.class))).thenAnswer(inv -> inv.getArgument(0));
        when(tradeLockService.acquireTradeLock(USER_ID, ASSET_ID)).thenReturn("lock-val");
        when(fineractClient.getAccountBalance(LP_CASH_ACCOUNT)).thenReturn(new BigDecimal("50000"));
        when(fineractClient.executeAtomicBatch(anyList())).thenReturn(List.of());
        when(portfolioService.updatePositionAfterSell(eq(USER_ID), eq(ASSET_ID),
                eq(new BigDecimal("5")), eq(netProceedsPerUnit))).thenReturn(BigDecimal.ZERO);
        when(assetRepository.adjustCirculatingSupply(ASSET_ID, new BigDecimal("5").negate())).thenReturn(1);

        // Act
        TradeResponse response = tradingService.executeSell(request, jwt, IDEMPOTENCY_KEY);

        // Assert: execution price = base price (no bid price), spread = 0
        assertEquals(basePrice, response.pricePerUnit());
        assertEquals(BigDecimal.ZERO, response.spreadAmount());

        // Assert: 3 batch ops (asset return, net cash credit, fee to fee collection — no spread leg)
        verify(fineractClient).executeAtomicBatch(batchOpsCaptor.capture());
        List<BatchOperation> ops = batchOpsCaptor.getValue();
        assertEquals(3, ops.size());
        ops.forEach(op -> assertInstanceOf(BatchTransferOp.class, op));
        // Leg 1: Investor returns tokens
        assertTransferOp(ops.get(0), USER_ASSET_ACCOUNT, LP_ASSET_ACCOUNT, new BigDecimal("5"));
        // Leg 2: LP Cash pays net proceeds (500-3=497) to investor
        assertTransferOp(ops.get(1), LP_CASH_ACCOUNT, USER_CASH_ACCOUNT, netAmount);
        // Leg 3: Fee to Fee Collection
        assertTransferOp(ops.get(2), LP_CASH_ACCOUNT, FEE_COLLECTION_ACCOUNT, new BigDecimal("3"));
    }

    @Test
    void executeSell_insufficientUnits_throws() {
        // Arrange: user holds 3 units but tries to sell 10
        SellRequest request = new SellRequest(ASSET_ID, new BigDecimal("10"));

        when(marketHoursService.isMarketOpen()).thenReturn(true);
        when(assetRepository.findById(ASSET_ID)).thenReturn(Optional.of(activeAsset));
        when(pricingService.getPrice(ASSET_ID))
                .thenReturn(new PriceResponse(ASSET_ID, new BigDecimal("100"), new BigDecimal("95"), null));

        // JWT
        when(jwt.getSubject()).thenReturn(EXTERNAL_ID);
        when(fineractClient.getClientByExternalId(EXTERNAL_ID))
                .thenReturn(Map.of("id", USER_ID));
        when(fineractClient.findClientSavingsAccountByCurrency(USER_ID, "XAF"))
                .thenReturn(USER_CASH_ACCOUNT);

        // Position with only 3 units
        UserPosition position = UserPosition.builder()
                .userId(USER_ID)
                .assetId(ASSET_ID)
                .fineractSavingsAccountId(USER_ASSET_ACCOUNT)
                .totalUnits(new BigDecimal("3"))
                .avgPurchasePrice(new BigDecimal("100"))
                .totalCostBasis(new BigDecimal("300"))
                .realizedPnl(BigDecimal.ZERO)
                .lastTradeAt(Instant.now())
                .build();
        when(userPositionRepository.findByUserIdAndAssetId(USER_ID, ASSET_ID))
                .thenReturn(Optional.of(position));

        // Act & Assert
        TradingException ex = assertThrows(TradingException.class,
                () -> tradingService.executeSell(request, jwt, IDEMPOTENCY_KEY));
        assertTrue(ex.getMessage().contains("Insufficient units"));
        assertEquals("INSUFFICIENT_UNITS", ex.getErrorCode());

        // Verify no lock was acquired (check happens before lock)
        verifyNoInteractions(tradeLockService);
        verify(fineractClient, never()).executeAtomicBatch(anyList());
    }

    // -------------------------------------------------------------------------
    // Validity date enforcement
    // -------------------------------------------------------------------------

    @Test
    void executeBuy_subscriptionEnded_throwsSubscriptionEnded() {
        // Arrange: asset with an expired subscription end date
        activeAsset.setSubscriptionEndDate(LocalDate.now().minusDays(1));

        BuyRequest request = new BuyRequest(ASSET_ID, new BigDecimal("10"));

        when(marketHoursService.isMarketOpen()).thenReturn(true);
        when(assetRepository.findById(ASSET_ID)).thenReturn(Optional.of(activeAsset));

        // Act & Assert — subscription check fires pre-lock, before idempotency/price/user resolution
        TradingException ex = assertThrows(TradingException.class,
                () -> tradingService.executeBuy(request, jwt, IDEMPOTENCY_KEY));
        assertTrue(ex.getMessage().contains("ended"));
        assertEquals("SUBSCRIPTION_ENDED", ex.getErrorCode());

        verifyNoInteractions(tradeLockService);
        verify(pricingService, never()).getPrice(anyString());
        verify(fineractClient, never()).executeAtomicBatch(anyList());
    }

    // -------------------------------------------------------------------------
    // Zero fee test
    // -------------------------------------------------------------------------

    @Test
    void executeBuy_zeroFee_noFeeLegsInBatch() {
        // Arrange: asset with no trading fee, askPrice=110 for spread testing
        activeAsset.setTradingFeePercent(BigDecimal.ZERO);
        BuyRequest request = new BuyRequest(ASSET_ID, new BigDecimal("10"));
        BigDecimal askPrice = new BigDecimal("110");
        // executionPrice = 110, grossAmount = 1100, fee = 0, spread = (110-100)*10 = 100

        when(orderRepository.findByIdempotencyKey(IDEMPOTENCY_KEY)).thenReturn(Optional.empty());
        when(marketHoursService.isMarketOpen()).thenReturn(true);
        when(assetRepository.findById(ASSET_ID)).thenReturn(Optional.of(activeAsset));
        when(pricingService.getPrice(ASSET_ID))
                .thenReturn(new PriceResponse(ASSET_ID, askPrice, new BigDecimal("90"), null));
        when(quoteReservationService.getReservedUnits(ASSET_ID)).thenReturn(BigDecimal.ZERO);

        when(jwt.getSubject()).thenReturn(EXTERNAL_ID);
        when(fineractClient.getClientByExternalId(EXTERNAL_ID)).thenReturn(Map.of("id", USER_ID));
        when(fineractClient.findClientSavingsAccountByCurrency(USER_ID, "XAF")).thenReturn(USER_CASH_ACCOUNT);
        when(userPositionRepository.findByUserIdAndAssetId(USER_ID, ASSET_ID))
                .thenReturn(Optional.of(UserPosition.builder()
                        .userId(USER_ID).assetId(ASSET_ID)
                        .fineractSavingsAccountId(USER_ASSET_ACCOUNT)
                        .totalUnits(BigDecimal.ZERO).avgPurchasePrice(BigDecimal.ZERO)
                        .totalCostBasis(BigDecimal.ZERO).realizedPnl(BigDecimal.ZERO)
                        .lastTradeAt(Instant.now()).build()));

        when(orderRepository.save(any(Order.class))).thenAnswer(inv -> inv.getArgument(0));
        when(tradeLockService.acquireTradeLock(USER_ID, ASSET_ID)).thenReturn("lock-val");
        when(fineractClient.getAccountBalance(USER_CASH_ACCOUNT)).thenReturn(new BigDecimal("50000"));
        when(fineractClient.executeAtomicBatch(anyList())).thenReturn(List.of());
        when(assetRepository.adjustCirculatingSupply(ASSET_ID, new BigDecimal("10"))).thenReturn(1);

        // Act
        TradeResponse response = tradingService.executeBuy(request, jwt, IDEMPOTENCY_KEY);

        // Assert: no fee
        assertEquals(BigDecimal.ZERO, response.fee());

        // Assert: 3 batch ops (cash, asset, spread — no fee leg)
        verify(fineractClient).executeAtomicBatch(batchOpsCaptor.capture());
        List<BatchOperation> ops = batchOpsCaptor.getValue();
        assertEquals(3, ops.size());
        ops.forEach(op -> assertInstanceOf(BatchTransferOp.class, op));
        // Leg 1: Investor pays 1100 (grossAmount + 0 fee) to LP Cash
        assertTransferOp(ops.get(0), USER_CASH_ACCOUNT, LP_CASH_ACCOUNT, new BigDecimal("1100"));
        // Leg 2: LP delivers tokens
        assertTransferOp(ops.get(1), LP_ASSET_ACCOUNT, USER_ASSET_ACCOUNT, new BigDecimal("10"));
        // Leg 3: Spread to LP Spread (no fee leg)
        assertTransferOp(ops.get(2), LP_CASH_ACCOUNT, LP_SPREAD_ACCOUNT, new BigDecimal("100"));
    }

    // -------------------------------------------------------------------------
    // Bid > Issuer tests (buyback premium funded from LP Spread)
    // -------------------------------------------------------------------------

    @Test
    void executeSell_bidAboveIssuer_fundsPremiumFromSpread() {
        // Arrange — bidPrice=110 > issuerPrice=100: LP pays premium funded from LP Spread
        SellRequest request = new SellRequest(ASSET_ID, new BigDecimal("5"));
        BigDecimal basePrice = new BigDecimal("100");
        BigDecimal bidPrice = new BigDecimal("110");
        BigDecimal feePercent = new BigDecimal("0.005");
        // executionPrice = bidPrice = 110
        BigDecimal executionPrice = bidPrice;
        // grossAmount = 5 * 110 = 550
        BigDecimal grossAmount = new BigDecimal("5").multiply(executionPrice).setScale(0, RoundingMode.HALF_UP);
        // fee = 550 * 0.005 = 3 (2.75 HALF_UP → 3)
        BigDecimal fee = grossAmount.multiply(feePercent).setScale(0, RoundingMode.HALF_UP);
        // rawSpread = issuer - bid = 100 - 110 = -10 → buybackPremium = 10 * 5 = 50, spreadAmount = 0
        BigDecimal buybackPremium = new BigDecimal("50");
        // netAmount = grossAmount - fee = 550 - 3 = 547
        BigDecimal netAmount = grossAmount.subtract(fee);
        BigDecimal netProceedsPerUnit = netAmount.divide(new BigDecimal("5"), 4, RoundingMode.HALF_UP);

        when(orderRepository.findByIdempotencyKey(IDEMPOTENCY_KEY)).thenReturn(Optional.empty());
        when(marketHoursService.isMarketOpen()).thenReturn(true);
        when(assetRepository.findById(ASSET_ID)).thenReturn(Optional.of(activeAsset));
        when(pricingService.getPrice(ASSET_ID))
                .thenReturn(new PriceResponse(ASSET_ID, new BigDecimal("120"), bidPrice, null));

        when(jwt.getSubject()).thenReturn(EXTERNAL_ID);
        when(fineractClient.getClientByExternalId(EXTERNAL_ID)).thenReturn(Map.of("id", USER_ID));
        when(fineractClient.findClientSavingsAccountByCurrency(USER_ID, "XAF")).thenReturn(USER_CASH_ACCOUNT);
        when(userPositionRepository.findByUserIdAndAssetId(USER_ID, ASSET_ID))
                .thenReturn(Optional.of(UserPosition.builder()
                        .userId(USER_ID).assetId(ASSET_ID)
                        .fineractSavingsAccountId(USER_ASSET_ACCOUNT)
                        .totalUnits(new BigDecimal("20")).avgPurchasePrice(new BigDecimal("100"))
                        .totalCostBasis(new BigDecimal("2000")).realizedPnl(BigDecimal.ZERO)
                        .lastTradeAt(Instant.now()).build()));

        when(orderRepository.save(any(Order.class))).thenAnswer(inv -> inv.getArgument(0));
        when(tradeLockService.acquireTradeLock(USER_ID, ASSET_ID)).thenReturn("lock-val");
        when(fineractClient.getAccountBalance(LP_CASH_ACCOUNT)).thenReturn(new BigDecimal("50000"));

        // Atomic batch — 4 legs: asset return, premium from LP Spread, net proceeds, fee
        List<Map<String, Object>> batchResponses = List.of(
                Map.of("requestId", 1L, "statusCode", 200),
                Map.of("requestId", 2L, "statusCode", 200),
                Map.of("requestId", 3L, "statusCode", 200),
                Map.of("requestId", 4L, "statusCode", 200));
        when(fineractClient.executeAtomicBatch(anyList())).thenReturn(batchResponses);

        when(portfolioService.updatePositionAfterSell(eq(USER_ID), eq(ASSET_ID),
                eq(new BigDecimal("5")), eq(netProceedsPerUnit))).thenReturn(new BigDecimal("47"));
        when(assetRepository.adjustCirculatingSupply(ASSET_ID, new BigDecimal("5").negate())).thenReturn(1);

        // Act
        TradeResponse response = tradingService.executeSell(request, jwt, IDEMPOTENCY_KEY);

        // Assert response
        assertNotNull(response);
        assertEquals(OrderStatus.FILLED, response.status());
        assertEquals(executionPrice, response.pricePerUnit());
        assertEquals(netAmount, response.totalAmount());
        assertEquals(fee, response.fee());
        assertEquals(BigDecimal.ZERO, response.spreadAmount()); // spread=0 when bid > issuer
        assertEquals(new BigDecimal("47"), response.realizedPnl());

        // Verify batch — LP Cash hub with buyback premium leg
        verify(fineractClient).executeAtomicBatch(batchOpsCaptor.capture());
        List<BatchOperation> ops = batchOpsCaptor.getValue();
        assertEquals(4, ops.size());
        ops.forEach(op -> assertInstanceOf(BatchTransferOp.class, op));

        // Leg 1: Investor returns tokens
        assertTransferOp(ops.get(0), USER_ASSET_ACCOUNT, LP_ASSET_ACCOUNT, new BigDecimal("5"));

        // Leg 2 (internal): LP Spread funds LP Cash with buyback premium
        assertTransferOp(ops.get(1), LP_SPREAD_ACCOUNT, LP_CASH_ACCOUNT, buybackPremium);

        // Leg 3: LP Cash pays net proceeds to investor
        assertTransferOp(ops.get(2), LP_CASH_ACCOUNT, USER_CASH_ACCOUNT, netAmount);

        // Leg 4 (internal): LP Cash sweeps fee to Fee Collection
        assertTransferOp(ops.get(3), LP_CASH_ACCOUNT, FEE_COLLECTION_ACCOUNT, fee);

        // Verify buybackPremium stored on order
        verify(orderRepository, atLeast(3)).save(orderCaptor.capture());
        Order filledOrder = orderCaptor.getAllValues().stream()
                .filter(o -> o.getStatus() == OrderStatus.FILLED)
                .findFirst().orElseThrow();
        assertEquals(buybackPremium, filledOrder.getBuybackPremium());
    }

    // -------------------------------------------------------------------------
    // createQuote tests
    // -------------------------------------------------------------------------

    @Test
    void createQuote_happyPath_returnsQuotedOrder() {
        QuoteRequest request = new QuoteRequest(ASSET_ID, TradeSide.BUY, new BigDecimal("10"), null);
        BigDecimal askPrice = new BigDecimal("110");

        when(orderRepository.findByIdempotencyKey(IDEMPOTENCY_KEY)).thenReturn(Optional.empty());
        when(jwt.getSubject()).thenReturn(EXTERNAL_ID);
        when(fineractClient.getClientByExternalId(EXTERNAL_ID)).thenReturn(Map.of("id", USER_ID));
        when(orderRepository.countByUserIdAndStatus(USER_ID, OrderStatus.QUOTED)).thenReturn(0L);
        when(assetRepository.findById(ASSET_ID)).thenReturn(Optional.of(activeAsset));
        when(pricingService.getPrice(ASSET_ID)).thenReturn(new PriceResponse(ASSET_ID, askPrice, new BigDecimal("90"), null));
        when(marketHoursService.isMarketOpen()).thenReturn(true);
        when(quoteReservationService.getReservedUnits(ASSET_ID)).thenReturn(BigDecimal.ZERO);
        when(orderRepository.save(any(Order.class))).thenAnswer(inv -> inv.getArgument(0));
        when(fineractClient.findClientSavingsAccountByCurrency(USER_ID, "XAF")).thenReturn(USER_CASH_ACCOUNT);
        when(fineractClient.getAccountBalance(USER_CASH_ACCOUNT)).thenReturn(new BigDecimal("500000"));

        QuoteResponse response = tradingService.createQuote(request, jwt, IDEMPOTENCY_KEY);

        assertNotNull(response);
        assertEquals(OrderStatus.QUOTED, response.status());
        assertNotNull(response.orderId());
        assertNotNull(response.quotedAt());
        assertNotNull(response.quoteExpiresAt());
        assertEquals(askPrice, response.executionPrice());

        verify(orderRepository).save(orderCaptor.capture());
        Order saved = orderCaptor.getValue();
        assertEquals(OrderStatus.QUOTED, saved.getStatus());
        assertNotNull(saved.getQuotedAt());
        assertNotNull(saved.getQuoteExpiresAt());

        verify(quoteReservationService).reserve(eq(ASSET_ID), anyString(), eq(new BigDecimal("10")));
        verify(eventPublisher).publishEvent(any(OrderStatusChangedEvent.class));
    }

    @Test
    void createQuote_idempotencyKey_returnsExistingQuote() {
        Order existingOrder = Order.builder()
                .id("existing-order")
                .idempotencyKey(IDEMPOTENCY_KEY)
                .userId(USER_ID)
                .userExternalId(EXTERNAL_ID)
                .assetId(ASSET_ID)
                .side(TradeSide.BUY)
                .status(OrderStatus.QUOTED)
                .units(new BigDecimal("10"))
                .executionPrice(new BigDecimal("110"))
                .cashAmount(new BigDecimal("1106"))
                .fee(new BigDecimal("6"))
                .quotedAt(Instant.now())
                .quoteExpiresAt(Instant.now().plusSeconds(30))
                .quotedAskPrice(new BigDecimal("110"))
                .quotedBidPrice(new BigDecimal("90"))
                .build();
        when(orderRepository.findByIdempotencyKey(IDEMPOTENCY_KEY)).thenReturn(Optional.of(existingOrder));
        when(jwt.getSubject()).thenReturn(EXTERNAL_ID);

        QuoteRequest request = new QuoteRequest(ASSET_ID, TradeSide.BUY, new BigDecimal("10"), null);
        QuoteResponse response = tradingService.createQuote(request, jwt, IDEMPOTENCY_KEY);

        assertEquals("existing-order", response.orderId());
        verify(orderRepository, never()).save(any());
    }

    @Test
    void createQuote_idempotencyKeyDifferentUser_throws() {
        Order existingOrder = Order.builder()
                .id("existing-order")
                .userExternalId("different-user")
                .status(OrderStatus.QUOTED)
                .build();
        when(orderRepository.findByIdempotencyKey(IDEMPOTENCY_KEY)).thenReturn(Optional.of(existingOrder));
        when(jwt.getSubject()).thenReturn(EXTERNAL_ID);

        QuoteRequest request = new QuoteRequest(ASSET_ID, TradeSide.BUY, new BigDecimal("10"), null);
        TradingException ex = assertThrows(TradingException.class,
                () -> tradingService.createQuote(request, jwt, IDEMPOTENCY_KEY));
        assertTrue(ex.getMessage().contains("Idempotency key already used"));
    }

    @Test
    void createQuote_maxQuotesExceeded_throws() {
        when(orderRepository.findByIdempotencyKey(IDEMPOTENCY_KEY)).thenReturn(Optional.empty());
        when(jwt.getSubject()).thenReturn(EXTERNAL_ID);
        when(fineractClient.getClientByExternalId(EXTERNAL_ID)).thenReturn(Map.of("id", USER_ID));
        when(orderRepository.countByUserIdAndStatus(USER_ID, OrderStatus.QUOTED)).thenReturn(5L);

        QuoteRequest request = new QuoteRequest(ASSET_ID, TradeSide.BUY, new BigDecimal("10"), null);
        TradingException ex = assertThrows(TradingException.class,
                () -> tradingService.createQuote(request, jwt, IDEMPOTENCY_KEY));
        assertTrue(ex.getMessage().contains("Too many active quotes"));
    }

    @Test
    void createQuote_haltedAsset_throws() {
        when(orderRepository.findByIdempotencyKey(IDEMPOTENCY_KEY)).thenReturn(Optional.empty());
        when(jwt.getSubject()).thenReturn(EXTERNAL_ID);
        when(fineractClient.getClientByExternalId(EXTERNAL_ID)).thenReturn(Map.of("id", USER_ID));
        when(orderRepository.countByUserIdAndStatus(USER_ID, OrderStatus.QUOTED)).thenReturn(0L);

        Asset halted = Asset.builder()
                .id(ASSET_ID).status(AssetStatus.HALTED).build();
        when(assetRepository.findById(ASSET_ID)).thenReturn(Optional.of(halted));

        QuoteRequest request = new QuoteRequest(ASSET_ID, TradeSide.BUY, new BigDecimal("10"), null);
        assertThrows(TradingHaltedException.class,
                () -> tradingService.createQuote(request, jwt, IDEMPOTENCY_KEY));
    }

    @Test
    void createQuote_sellDoesNotReserveInventory() {
        QuoteRequest request = new QuoteRequest(ASSET_ID, TradeSide.SELL, new BigDecimal("5"), null);
        BigDecimal bidPrice = new BigDecimal("95");

        when(orderRepository.findByIdempotencyKey(IDEMPOTENCY_KEY)).thenReturn(Optional.empty());
        when(jwt.getSubject()).thenReturn(EXTERNAL_ID);
        when(fineractClient.getClientByExternalId(EXTERNAL_ID)).thenReturn(Map.of("id", USER_ID));
        when(orderRepository.countByUserIdAndStatus(USER_ID, OrderStatus.QUOTED)).thenReturn(0L);
        when(assetRepository.findById(ASSET_ID)).thenReturn(Optional.of(activeAsset));
        when(pricingService.getPrice(ASSET_ID)).thenReturn(new PriceResponse(ASSET_ID, new BigDecimal("110"), bidPrice, null));
        when(marketHoursService.isMarketOpen()).thenReturn(true);
        when(orderRepository.save(any(Order.class))).thenAnswer(inv -> inv.getArgument(0));
        when(fineractClient.findClientSavingsAccountByCurrency(USER_ID, "XAF")).thenReturn(USER_CASH_ACCOUNT);
        when(fineractClient.getAccountBalance(USER_CASH_ACCOUNT)).thenReturn(new BigDecimal("500000"));
        when(userPositionRepository.findByUserIdAndAssetId(USER_ID, ASSET_ID))
                .thenReturn(Optional.of(UserPosition.builder()
                        .totalUnits(new BigDecimal("10")).build()));

        QuoteResponse response = tradingService.createQuote(request, jwt, IDEMPOTENCY_KEY);

        assertNotNull(response);
        assertEquals(bidPrice, response.executionPrice());
        // SELL should not reserve inventory
        verify(quoteReservationService, never()).reserve(anyString(), anyString(), any());
    }

    @Test
    void createQuote_marketClosed_addsWarning() {
        QuoteRequest request = new QuoteRequest(ASSET_ID, TradeSide.BUY, new BigDecimal("10"), null);

        when(orderRepository.findByIdempotencyKey(IDEMPOTENCY_KEY)).thenReturn(Optional.empty());
        when(jwt.getSubject()).thenReturn(EXTERNAL_ID);
        when(fineractClient.getClientByExternalId(EXTERNAL_ID)).thenReturn(Map.of("id", USER_ID));
        when(orderRepository.countByUserIdAndStatus(USER_ID, OrderStatus.QUOTED)).thenReturn(0L);
        when(assetRepository.findById(ASSET_ID)).thenReturn(Optional.of(activeAsset));
        when(pricingService.getPrice(ASSET_ID)).thenReturn(new PriceResponse(ASSET_ID, new BigDecimal("110"), new BigDecimal("90"), null));
        when(marketHoursService.isMarketOpen()).thenReturn(false); // Market closed
        when(quoteReservationService.getReservedUnits(ASSET_ID)).thenReturn(BigDecimal.ZERO);
        when(orderRepository.save(any(Order.class))).thenAnswer(inv -> inv.getArgument(0));
        when(fineractClient.findClientSavingsAccountByCurrency(USER_ID, "XAF")).thenReturn(USER_CASH_ACCOUNT);
        when(fineractClient.getAccountBalance(USER_CASH_ACCOUNT)).thenReturn(new BigDecimal("500000"));

        QuoteResponse response = tradingService.createQuote(request, jwt, IDEMPOTENCY_KEY);

        assertNotNull(response);
        assertTrue(response.warnings().contains("MARKET_CLOSED"));
        assertEquals(OrderStatus.QUOTED, response.status());
    }

    // -------------------------------------------------------------------------
    // confirmOrder tests
    // -------------------------------------------------------------------------

    @Test
    void confirmOrder_happyPath_promotesToPending() {
        Order quotedOrder = Order.builder()
                .id("order-001").userId(USER_ID).assetId(ASSET_ID)
                .side(TradeSide.BUY).status(OrderStatus.QUOTED)
                .units(new BigDecimal("10")).executionPrice(new BigDecimal("110"))
                .cashAmount(new BigDecimal("1106")).fee(new BigDecimal("6"))
                .quoteExpiresAt(Instant.now().plusSeconds(20))
                .build();
        when(orderRepository.findByIdAndUserId("order-001", USER_ID)).thenReturn(Optional.of(quotedOrder));
        when(marketHoursService.isMarketOpen()).thenReturn(true);
        when(orderRepository.save(any(Order.class))).thenAnswer(inv -> inv.getArgument(0));

        OrderResponse response = tradingService.confirmOrder("order-001", USER_ID);

        assertNotNull(response);
        verify(orderRepository).save(orderCaptor.capture());
        assertEquals(OrderStatus.PENDING, orderCaptor.getValue().getStatus());
        verify(eventPublisher).publishEvent(any(OrderStatusChangedEvent.class));
    }

    @Test
    void confirmOrder_expiredQuote_throwsAndCancels() {
        Order expiredOrder = Order.builder()
                .id("order-001").userId(USER_ID).assetId(ASSET_ID)
                .side(TradeSide.BUY).status(OrderStatus.QUOTED)
                .units(new BigDecimal("10"))
                .quoteExpiresAt(Instant.now().minusSeconds(10)) // expired
                .build();
        when(orderRepository.findByIdAndUserId("order-001", USER_ID)).thenReturn(Optional.of(expiredOrder));
        when(orderRepository.save(any(Order.class))).thenAnswer(inv -> inv.getArgument(0));

        TradingException ex = assertThrows(TradingException.class,
                () -> tradingService.confirmOrder("order-001", USER_ID));
        assertTrue(ex.getMessage().contains("expired"));

        verify(orderRepository).save(orderCaptor.capture());
        assertEquals(OrderStatus.CANCELLED, orderCaptor.getValue().getStatus());
        verify(quoteReservationService).release(eq(ASSET_ID), eq("order-001"), eq(new BigDecimal("10")));
    }

    @Test
    void confirmOrder_marketClosed_queuesOrder() {
        Order quotedOrder = Order.builder()
                .id("order-001").userId(USER_ID).assetId(ASSET_ID)
                .side(TradeSide.BUY).status(OrderStatus.QUOTED)
                .units(new BigDecimal("10")).executionPrice(new BigDecimal("110"))
                .cashAmount(new BigDecimal("1106")).fee(new BigDecimal("6"))
                .quoteExpiresAt(Instant.now().plusSeconds(20))
                .build();
        when(orderRepository.findByIdAndUserId("order-001", USER_ID)).thenReturn(Optional.of(quotedOrder));
        when(marketHoursService.isMarketOpen()).thenReturn(false);
        when(orderRepository.save(any(Order.class))).thenAnswer(inv -> inv.getArgument(0));

        OrderResponse response = tradingService.confirmOrder("order-001", USER_ID);

        assertNotNull(response);
        verify(orderRepository).save(orderCaptor.capture());
        assertEquals(OrderStatus.QUEUED, orderCaptor.getValue().getStatus());
        verify(quoteReservationService).release(eq(ASSET_ID), eq("order-001"), eq(new BigDecimal("10")));
    }

    @Test
    void confirmOrder_nonQuotedStatus_throws() {
        Order cancelledOrder = Order.builder()
                .id("order-001").userId(USER_ID).assetId(ASSET_ID)
                .side(TradeSide.BUY).status(OrderStatus.CANCELLED)
                .build();
        when(orderRepository.findByIdAndUserId("order-001", USER_ID)).thenReturn(Optional.of(cancelledOrder));

        TradingException ex = assertThrows(TradingException.class,
                () -> tradingService.confirmOrder("order-001", USER_ID));
        assertTrue(ex.getMessage().contains("Cannot confirm order with status CANCELLED"));
    }

    @Test
    void confirmOrder_alreadyPending_returnsIdempotent() {
        Order pendingOrder = Order.builder()
                .id("order-001").userId(USER_ID).assetId(ASSET_ID)
                .side(TradeSide.BUY).status(OrderStatus.PENDING)
                .units(new BigDecimal("10")).executionPrice(new BigDecimal("110"))
                .cashAmount(new BigDecimal("1106")).fee(new BigDecimal("6"))
                .build();
        when(orderRepository.findByIdAndUserId("order-001", USER_ID)).thenReturn(Optional.of(pendingOrder));

        OrderResponse response = tradingService.confirmOrder("order-001", USER_ID);

        assertNotNull(response);
        // No save, no event — just returns current state
        verify(orderRepository, never()).save(any());
        verify(eventPublisher, never()).publishEvent(any());
    }

    @Test
    void confirmOrder_alreadyFilled_returnsIdempotent() {
        Order filledOrder = Order.builder()
                .id("order-001").userId(USER_ID).assetId(ASSET_ID)
                .side(TradeSide.BUY).status(OrderStatus.FILLED)
                .units(new BigDecimal("10")).executionPrice(new BigDecimal("110"))
                .cashAmount(new BigDecimal("1106")).fee(new BigDecimal("6"))
                .build();
        when(orderRepository.findByIdAndUserId("order-001", USER_ID)).thenReturn(Optional.of(filledOrder));

        OrderResponse response = tradingService.confirmOrder("order-001", USER_ID);

        assertNotNull(response);
        verify(orderRepository, never()).save(any());
    }

    @Test
    void confirmOrder_exactExpiry_rejectsQuote() {
        // Quote with expiresAt = now (exact boundary) should be rejected
        Instant exactExpiry = Instant.now();
        Order order = Order.builder()
                .id("order-001").userId(USER_ID).assetId(ASSET_ID)
                .side(TradeSide.BUY).status(OrderStatus.QUOTED)
                .units(new BigDecimal("10"))
                .quoteExpiresAt(exactExpiry)
                .build();
        when(orderRepository.findByIdAndUserId("order-001", USER_ID)).thenReturn(Optional.of(order));
        when(orderRepository.save(any(Order.class))).thenAnswer(inv -> inv.getArgument(0));

        TradingException ex = assertThrows(TradingException.class,
                () -> tradingService.confirmOrder("order-001", USER_ID));
        assertTrue(ex.getMessage().contains("expired"));

        verify(orderRepository).save(orderCaptor.capture());
        assertEquals(OrderStatus.CANCELLED, orderCaptor.getValue().getStatus());
    }

    @Test
    void confirmOrder_optimisticLockConflict_throwsMeaningfulError() {
        Order quotedOrder = Order.builder()
                .id("order-001").userId(USER_ID).assetId(ASSET_ID)
                .side(TradeSide.BUY).status(OrderStatus.QUOTED)
                .units(new BigDecimal("10")).executionPrice(new BigDecimal("110"))
                .cashAmount(new BigDecimal("1106")).fee(new BigDecimal("6"))
                .quoteExpiresAt(Instant.now().plusSeconds(20))
                .build();
        when(orderRepository.findByIdAndUserId("order-001", USER_ID)).thenReturn(Optional.of(quotedOrder));
        when(marketHoursService.isMarketOpen()).thenReturn(true);
        when(orderRepository.save(any(Order.class)))
                .thenThrow(new org.springframework.orm.ObjectOptimisticLockingFailureException(Order.class, "order-001"));

        TradingException ex = assertThrows(TradingException.class,
                () -> tradingService.confirmOrder("order-001", USER_ID));
        assertTrue(ex.getMessage().contains("already confirmed"));
    }

    // -------------------------------------------------------------------------
    // cancelOrder (QUOTED) tests
    // -------------------------------------------------------------------------

    @Test
    void cancelOrder_quotedBuyOrder_cancelsAndReleases() {
        Order quotedOrder = Order.builder()
                .id("order-001").userId(USER_ID).assetId(ASSET_ID)
                .side(TradeSide.BUY).status(OrderStatus.QUOTED)
                .units(new BigDecimal("10"))
                .build();
        when(orderRepository.findByIdAndUserId("order-001", USER_ID)).thenReturn(Optional.of(quotedOrder));
        when(orderRepository.save(any(Order.class))).thenAnswer(inv -> inv.getArgument(0));

        OrderResponse response = tradingService.cancelOrder("order-001", USER_ID);

        assertNotNull(response);
        verify(orderRepository).save(orderCaptor.capture());
        assertEquals(OrderStatus.CANCELLED, orderCaptor.getValue().getStatus());
        verify(quoteReservationService).release(eq(ASSET_ID), eq("order-001"), eq(new BigDecimal("10")));
        verify(eventPublisher).publishEvent(any(OrderStatusChangedEvent.class));
    }

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    private void assertTransferOp(BatchOperation op, Long expectedFrom, Long expectedTo, BigDecimal expectedAmount) {
        assertInstanceOf(BatchTransferOp.class, op);
        BatchTransferOp transfer = (BatchTransferOp) op;
        assertEquals(expectedFrom, transfer.fromAccountId());
        assertEquals(expectedTo, transfer.toAccountId());
        assertEquals(expectedAmount, transfer.amount());
    }
}
