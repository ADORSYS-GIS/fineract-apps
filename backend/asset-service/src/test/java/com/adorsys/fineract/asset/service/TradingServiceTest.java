package com.adorsys.fineract.asset.service;

import com.adorsys.fineract.asset.client.FineractClient;
import com.adorsys.fineract.asset.client.FineractClient.*;
import com.adorsys.fineract.asset.config.AssetServiceConfig;
import com.adorsys.fineract.asset.config.ResolvedGlAccounts;
import com.adorsys.fineract.asset.dto.*;
import com.adorsys.fineract.asset.entity.Asset;
import com.adorsys.fineract.asset.entity.Order;
import com.adorsys.fineract.asset.entity.UserPosition;
import com.adorsys.fineract.asset.exception.InsufficientInventoryException;
import com.adorsys.fineract.asset.exception.MarketClosedException;
import com.adorsys.fineract.asset.exception.TradingException;
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
    private static final Long TREASURY_CASH_ACCOUNT = 300L;
    private static final Long TREASURY_ASSET_ACCOUNT = 400L;
    private static final Long SPREAD_COLLECTION_ACCOUNT = 888L;
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
                .spreadPercent(new BigDecimal("0.01"))
                .tradingFeePercent(new BigDecimal("0.005"))
                .treasuryCashAccountId(TREASURY_CASH_ACCOUNT)
                .treasuryAssetAccountId(TREASURY_ASSET_ACCOUNT)
                .fineractProductId(10)
                .subscriptionStartDate(LocalDate.now().minusMonths(1))
                .subscriptionEndDate(LocalDate.now().plusYears(1))
                .build();

        // Default accounting config (spread enabled)
        AssetServiceConfig.Accounting accounting = new AssetServiceConfig.Accounting();
        accounting.setSpreadCollectionAccountId(SPREAD_COLLECTION_ACCOUNT);
        lenient().when(assetServiceConfig.getAccounting()).thenReturn(accounting);
        lenient().when(assetServiceConfig.getSettlementCurrency()).thenReturn("XAF");
        lenient().when(resolvedGlAccounts.getFeeIncomeId()).thenReturn(FEE_INCOME_GL_ID);
        lenient().when(resolvedGlAccounts.getFundSourceId()).thenReturn(FUND_SOURCE_GL_ID);
    }

    // -------------------------------------------------------------------------
    // executeBuy tests
    // -------------------------------------------------------------------------

    @Test
    void executeBuy_happyPath_returnsFilled() {
        // Arrange
        BuyRequest request = new BuyRequest(ASSET_ID, new BigDecimal("10"));
        BigDecimal basePrice = new BigDecimal("100");
        BigDecimal spread = new BigDecimal("0.01");
        BigDecimal feePercent = new BigDecimal("0.005");
        // executionPrice = 100 + 100*0.01 = 101
        BigDecimal executionPrice = basePrice.add(basePrice.multiply(spread));
        // actualCost = 10 * 101 = 1010
        BigDecimal actualCost = new BigDecimal("10").multiply(executionPrice).setScale(0, RoundingMode.HALF_UP);
        // fee = 1010 * 0.005 = 5 (rounded)
        BigDecimal fee = actualCost.multiply(feePercent).setScale(0, RoundingMode.HALF_UP);
        // spreadAmount = 10 * 100 * 0.01 = 10
        BigDecimal spreadAmount = new BigDecimal("10").multiply(basePrice.multiply(spread))
                .setScale(0, RoundingMode.HALF_UP);
        // chargedAmount = 1010 + 5 = 1015
        BigDecimal chargedAmount = actualCost.add(fee);
        // effectiveCostPerUnit = 1015 / 10 = 101.5000
        BigDecimal effectiveCostPerUnit = chargedAmount.divide(new BigDecimal("10"), 4, RoundingMode.HALF_UP);

        // Idempotency: no existing order
        when(orderRepository.findByIdempotencyKey(IDEMPOTENCY_KEY)).thenReturn(Optional.empty());

        // Market open
        doNothing().when(marketHoursService).assertMarketOpen();

        // Asset found (initial + re-fetch inside lock)
        when(assetRepository.findById(ASSET_ID)).thenReturn(Optional.of(activeAsset));

        // Price (initial + re-fetch inside lock)
        when(pricingService.getCurrentPrice(ASSET_ID))
                .thenReturn(new CurrentPriceResponse(ASSET_ID, basePrice, new BigDecimal("5.0")));

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

        // Atomic batch succeeds — return response with requestIds for batch ID tracking
        List<Map<String, Object>> batchResponses = List.of(
                Map.of("requestId", 1L, "statusCode", 200),
                Map.of("requestId", 2L, "statusCode", 200),
                Map.of("requestId", 3L, "statusCode", 200),
                Map.of("requestId", 4L, "statusCode", 200),
                Map.of("requestId", 5L, "statusCode", 200));
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
        assertEquals("1,2,3,4,5", finalOrder.getFineractBatchId());

        // Verify atomic batch was called with all legs (transfers + fee) in one batch
        verify(fineractClient).executeAtomicBatch(batchOpsCaptor.capture());
        List<BatchOperation> ops = batchOpsCaptor.getValue();
        // Should have 5 legs: cash transfer, spread transfer, asset transfer, fee withdrawal, fee journal entry
        assertEquals(5, ops.size());

        // Cash leg: user XAF -> treasury XAF
        assertTransferOp(ops.get(0), USER_CASH_ACCOUNT, TREASURY_CASH_ACCOUNT, actualCost);

        // Spread leg: treasury XAF -> spread collection (internal)
        assertTransferOp(ops.get(1), TREASURY_CASH_ACCOUNT, SPREAD_COLLECTION_ACCOUNT, spreadAmount);

        // Asset leg: treasury asset -> user asset
        assertTransferOp(ops.get(2), TREASURY_ASSET_ACCOUNT, USER_ASSET_ACCOUNT, new BigDecimal("10"));

        // Fee withdrawal leg
        assertInstanceOf(BatchWithdrawalOp.class, ops.get(3));
        BatchWithdrawalOp withdrawal = (BatchWithdrawalOp) ops.get(3);
        assertEquals(USER_CASH_ACCOUNT, withdrawal.savingsAccountId());
        assertEquals(fee, withdrawal.amount());

        // Fee journal entry leg
        assertInstanceOf(BatchJournalEntryOp.class, ops.get(4));
        BatchJournalEntryOp journal = (BatchJournalEntryOp) ops.get(4);
        assertEquals(FUND_SOURCE_GL_ID, journal.debitGlAccountId());
        assertEquals(FEE_INCOME_GL_ID, journal.creditGlAccountId());
        assertEquals(fee, journal.amount());

        // Verify no separate fee calls (everything is in the batch now)
        verify(fineractClient, never()).withdrawFromSavingsAccount(anyLong(), any(), anyString());
        verify(fineractClient, never()).createJournalEntry(anyLong(), anyLong(), any(), anyString(), anyString());

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
        // Arrange
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

        when(orderRepository.findByIdempotencyKey(IDEMPOTENCY_KEY))
                .thenReturn(Optional.of(existingOrder));
        when(jwt.getSubject()).thenReturn(EXTERNAL_ID);

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

        // Verify no further processing happened
        verifyNoInteractions(marketHoursService);
        verifyNoInteractions(pricingService);
        verifyNoInteractions(fineractClient);
        verifyNoInteractions(tradeLockService);
    }

    @Test
    void executeBuy_idempotencyKeyBelongsToDifferentUser_throws409() {
        // Arrange - order belongs to a different user
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

        when(orderRepository.findByIdempotencyKey(IDEMPOTENCY_KEY))
                .thenReturn(Optional.of(existingOrder));
        when(jwt.getSubject()).thenReturn(EXTERNAL_ID);

        BuyRequest request = new BuyRequest(ASSET_ID, new BigDecimal("5"));

        // Act & Assert
        TradingException ex = assertThrows(TradingException.class,
                () -> tradingService.executeBuy(request, jwt, IDEMPOTENCY_KEY));
        assertEquals("IDEMPOTENCY_KEY_CONFLICT", ex.getErrorCode());

        // Verify no further processing happened
        verifyNoInteractions(marketHoursService);
        verifyNoInteractions(pricingService);
        verifyNoInteractions(fineractClient);
        verifyNoInteractions(tradeLockService);
    }

    @Test
    void executeSell_idempotencyKeyBelongsToDifferentUser_throws409() {
        // Arrange - order belongs to a different user
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

        when(orderRepository.findByIdempotencyKey(IDEMPOTENCY_KEY))
                .thenReturn(Optional.of(existingOrder));
        when(jwt.getSubject()).thenReturn(EXTERNAL_ID);

        SellRequest request = new SellRequest(ASSET_ID, new BigDecimal("5"));

        // Act & Assert
        TradingException ex = assertThrows(TradingException.class,
                () -> tradingService.executeSell(request, jwt, IDEMPOTENCY_KEY));
        assertEquals("IDEMPOTENCY_KEY_CONFLICT", ex.getErrorCode());

        // Verify no further processing happened
        verifyNoInteractions(marketHoursService);
        verifyNoInteractions(pricingService);
        verifyNoInteractions(fineractClient);
        verifyNoInteractions(tradeLockService);
    }

    @Test
    void executeBuy_marketClosed_throws() {
        // Arrange
        when(orderRepository.findByIdempotencyKey(IDEMPOTENCY_KEY)).thenReturn(Optional.empty());
        doThrow(new MarketClosedException("Market is closed"))
                .when(marketHoursService).assertMarketOpen();

        BuyRequest request = new BuyRequest(ASSET_ID, new BigDecimal("10"));

        // Act & Assert
        MarketClosedException ex = assertThrows(MarketClosedException.class,
                () -> tradingService.executeBuy(request, jwt, IDEMPOTENCY_KEY));
        assertTrue(ex.getMessage().contains("Market is closed"));

        // Verify no lock was acquired or transfers attempted
        verifyNoInteractions(tradeLockService);
        verifyNoInteractions(fineractClient);
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
                .spreadPercent(new BigDecimal("0.01"))
                .tradingFeePercent(new BigDecimal("0.005"))
                .treasuryCashAccountId(TREASURY_CASH_ACCOUNT)
                .treasuryAssetAccountId(TREASURY_ASSET_ACCOUNT)
                .fineractProductId(10)
                .subscriptionStartDate(LocalDate.now().minusMonths(1))
                .subscriptionEndDate(LocalDate.now().plusYears(1))
                .build();

        BuyRequest request = new BuyRequest(ASSET_ID, new BigDecimal("10"));

        when(orderRepository.findByIdempotencyKey(IDEMPOTENCY_KEY)).thenReturn(Optional.empty());
        doNothing().when(marketHoursService).assertMarketOpen();

        // First findById returns asset with enough supply to pass initial check,
        // second findById (inside lock) returns asset with low supply
        when(assetRepository.findById(ASSET_ID))
                .thenReturn(Optional.of(activeAsset))  // initial check: 1000 available
                .thenReturn(Optional.of(lowSupplyAsset)); // inside lock: only 2 available

        when(pricingService.getCurrentPrice(ASSET_ID))
                .thenReturn(new CurrentPriceResponse(ASSET_ID, new BigDecimal("100"), null));

        // JWT resolution
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

        // Act & Assert: inventory check inside the lock should throw
        assertThrows(InsufficientInventoryException.class,
                () -> tradingService.executeBuy(request, jwt, IDEMPOTENCY_KEY));

        // Verify the lock was acquired (inventory check happens inside lock)
        verify(tradeLockService).acquireTradeLock(USER_ID, ASSET_ID);

        // Verify the lock was released in finally block
        verify(tradeLockService).releaseTradeLock(USER_ID, ASSET_ID, "lock-val");

        // Verify no batch was attempted
        verify(fineractClient, never()).executeAtomicBatch(anyList());
    }

    @Test
    void executeBuy_insufficientFunds_throws() {
        // Arrange: user has only 500 XAF but needs ~1015 for the purchase
        BuyRequest request = new BuyRequest(ASSET_ID, new BigDecimal("10"));

        when(orderRepository.findByIdempotencyKey(IDEMPOTENCY_KEY)).thenReturn(Optional.empty());
        doNothing().when(marketHoursService).assertMarketOpen();
        when(assetRepository.findById(ASSET_ID)).thenReturn(Optional.of(activeAsset));
        when(pricingService.getCurrentPrice(ASSET_ID))
                .thenReturn(new CurrentPriceResponse(ASSET_ID, new BigDecimal("100"), null));

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
        // Arrange
        SellRequest request = new SellRequest(ASSET_ID, new BigDecimal("5"));
        BigDecimal basePrice = new BigDecimal("100");
        BigDecimal spread = new BigDecimal("0.01");
        BigDecimal feePercent = new BigDecimal("0.005");
        // executionPrice = 100 - 100*0.01 = 99
        BigDecimal executionPrice = basePrice.subtract(basePrice.multiply(spread));
        // grossAmount = 5 * 99 = 495
        BigDecimal grossAmount = new BigDecimal("5").multiply(executionPrice).setScale(0, RoundingMode.HALF_UP);
        // fee = 495 * 0.005 = 2 (rounded)
        BigDecimal fee = grossAmount.multiply(feePercent).setScale(0, RoundingMode.HALF_UP);
        // spreadAmount = 5 * 100 * 0.01 = 5
        BigDecimal spreadAmount = new BigDecimal("5").multiply(basePrice.multiply(spread))
                .setScale(0, RoundingMode.HALF_UP);
        // netAmount = 495 - 2 = 493
        BigDecimal netAmount = grossAmount.subtract(fee);
        // netProceedsPerUnit = 493 / 5 = 98.6000
        BigDecimal netProceedsPerUnit = netAmount.divide(new BigDecimal("5"), 4, RoundingMode.HALF_UP);

        // Idempotency
        when(orderRepository.findByIdempotencyKey(IDEMPOTENCY_KEY)).thenReturn(Optional.empty());
        doNothing().when(marketHoursService).assertMarketOpen();

        // Asset
        when(assetRepository.findById(ASSET_ID)).thenReturn(Optional.of(activeAsset));

        // Price (initial + re-fetch inside lock)
        when(pricingService.getCurrentPrice(ASSET_ID))
                .thenReturn(new CurrentPriceResponse(ASSET_ID, basePrice, new BigDecimal("5.0")));

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

        // Atomic batch succeeds — return response with requestIds for batch ID tracking
        List<Map<String, Object>> batchResponses = List.of(
                Map.of("requestId", 1L, "statusCode", 200),
                Map.of("requestId", 2L, "statusCode", 200),
                Map.of("requestId", 3L, "statusCode", 200),
                Map.of("requestId", 4L, "statusCode", 200),
                Map.of("requestId", 5L, "statusCode", 200));
        when(fineractClient.executeAtomicBatch(anyList())).thenReturn(batchResponses);

        // Portfolio update returns realized P&L
        BigDecimal realizedPnl = new BigDecimal("-7");
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

        // Verify atomic batch with all legs in one batch
        verify(fineractClient).executeAtomicBatch(batchOpsCaptor.capture());
        List<BatchOperation> ops = batchOpsCaptor.getValue();
        // Should have 5 legs: asset return, cash credit, spread sweep, fee withdrawal, fee journal
        assertEquals(5, ops.size());

        // Leg 1: Asset return: user asset -> treasury asset
        assertTransferOp(ops.get(0), USER_ASSET_ACCOUNT, TREASURY_ASSET_ACCOUNT, new BigDecimal("5"));

        // Leg 2: Cash credit: treasury XAF -> user XAF (gross proceeds)
        assertTransferOp(ops.get(1), TREASURY_CASH_ACCOUNT, USER_CASH_ACCOUNT, grossAmount);

        // Leg 3: Spread sweep: treasury XAF -> spread collection (internal)
        assertTransferOp(ops.get(2), TREASURY_CASH_ACCOUNT, SPREAD_COLLECTION_ACCOUNT, spreadAmount);

        // Leg 4: Fee withdrawal from user savings
        assertInstanceOf(BatchWithdrawalOp.class, ops.get(3));
        BatchWithdrawalOp withdrawal = (BatchWithdrawalOp) ops.get(3);
        assertEquals(USER_CASH_ACCOUNT, withdrawal.savingsAccountId());
        assertEquals(fee, withdrawal.amount());

        // Leg 5: Fee journal entry
        assertInstanceOf(BatchJournalEntryOp.class, ops.get(4));
        BatchJournalEntryOp journal = (BatchJournalEntryOp) ops.get(4);
        assertEquals(FUND_SOURCE_GL_ID, journal.debitGlAccountId());
        assertEquals(FEE_INCOME_GL_ID, journal.creditGlAccountId());
        assertEquals(fee, journal.amount());

        // Verify batch ID stored on order
        verify(orderRepository, atLeast(3)).save(orderCaptor.capture());
        Order finalSellOrder = orderCaptor.getAllValues().stream()
                .filter(o -> o.getStatus() == OrderStatus.FILLED)
                .findFirst().orElseThrow();
        assertEquals("1,2,3,4,5", finalSellOrder.getFineractBatchId());

        // Verify no separate fee calls
        verify(fineractClient, never()).withdrawFromSavingsAccount(anyLong(), any(), anyString());
        verify(fineractClient, never()).createJournalEntry(anyLong(), anyLong(), any(), anyString(), anyString());

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
        // Arrange: spread collection account not configured → spread disabled
        AssetServiceConfig.Accounting noSpreadAccounting = new AssetServiceConfig.Accounting();
        noSpreadAccounting.setSpreadCollectionAccountId(null);
        when(assetServiceConfig.getAccounting()).thenReturn(noSpreadAccounting);

        BuyRequest request = new BuyRequest(ASSET_ID, new BigDecimal("10"));
        BigDecimal basePrice = new BigDecimal("100");
        // When spread disabled: executionPrice = basePrice (no spread markup)
        // actualCost = 10 * 100 = 1000
        // fee = 1000 * 0.005 = 5
        // chargedAmount = 1000 + 5 = 1005

        when(orderRepository.findByIdempotencyKey(IDEMPOTENCY_KEY)).thenReturn(Optional.empty());
        doNothing().when(marketHoursService).assertMarketOpen();
        when(assetRepository.findById(ASSET_ID)).thenReturn(Optional.of(activeAsset));
        when(pricingService.getCurrentPrice(ASSET_ID))
                .thenReturn(new CurrentPriceResponse(ASSET_ID, basePrice, null));

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

        // Assert: execution price = base price (no spread)
        assertEquals(basePrice, response.pricePerUnit());
        assertEquals(BigDecimal.ZERO, response.spreadAmount());

        // Assert: 4 batch ops (cash, asset, fee withdrawal, fee journal — no spread)
        verify(fineractClient).executeAtomicBatch(batchOpsCaptor.capture());
        List<BatchOperation> ops = batchOpsCaptor.getValue();
        assertEquals(4, ops.size());
        assertInstanceOf(BatchTransferOp.class, ops.get(0)); // cash
        assertInstanceOf(BatchTransferOp.class, ops.get(1)); // asset
        assertInstanceOf(BatchWithdrawalOp.class, ops.get(2)); // fee withdrawal
        assertInstanceOf(BatchJournalEntryOp.class, ops.get(3)); // fee journal
    }

    @Test
    void executeSell_spreadDisabled_noSpreadLeg() {
        // Arrange: spread disabled
        AssetServiceConfig.Accounting noSpreadAccounting = new AssetServiceConfig.Accounting();
        noSpreadAccounting.setSpreadCollectionAccountId(null);
        when(assetServiceConfig.getAccounting()).thenReturn(noSpreadAccounting);

        SellRequest request = new SellRequest(ASSET_ID, new BigDecimal("5"));
        BigDecimal basePrice = new BigDecimal("100");
        // When spread disabled: executionPrice = basePrice (no spread deduction)
        // grossAmount = 5 * 100 = 500
        // fee = 500 * 0.005 = 3 (rounded)
        // netAmount = 500 - 3 = 497
        BigDecimal grossAmount = new BigDecimal("500");
        BigDecimal fee = new BigDecimal("3");
        BigDecimal netAmount = new BigDecimal("497");
        BigDecimal netProceedsPerUnit = netAmount.divide(new BigDecimal("5"), 4, RoundingMode.HALF_UP);

        when(orderRepository.findByIdempotencyKey(IDEMPOTENCY_KEY)).thenReturn(Optional.empty());
        doNothing().when(marketHoursService).assertMarketOpen();
        when(assetRepository.findById(ASSET_ID)).thenReturn(Optional.of(activeAsset));
        when(pricingService.getCurrentPrice(ASSET_ID))
                .thenReturn(new CurrentPriceResponse(ASSET_ID, basePrice, null));

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
        when(fineractClient.executeAtomicBatch(anyList())).thenReturn(List.of());
        when(portfolioService.updatePositionAfterSell(eq(USER_ID), eq(ASSET_ID),
                eq(new BigDecimal("5")), eq(netProceedsPerUnit))).thenReturn(BigDecimal.ZERO);
        when(assetRepository.adjustCirculatingSupply(ASSET_ID, new BigDecimal("5").negate())).thenReturn(1);

        // Act
        TradeResponse response = tradingService.executeSell(request, jwt, IDEMPOTENCY_KEY);

        // Assert: execution price = base price (no spread)
        assertEquals(basePrice, response.pricePerUnit());
        assertEquals(BigDecimal.ZERO, response.spreadAmount());

        // Assert: 4 batch ops (asset, cash, fee withdrawal, fee journal — no spread)
        verify(fineractClient).executeAtomicBatch(batchOpsCaptor.capture());
        List<BatchOperation> ops = batchOpsCaptor.getValue();
        assertEquals(4, ops.size());
        assertInstanceOf(BatchTransferOp.class, ops.get(0)); // asset return
        assertInstanceOf(BatchTransferOp.class, ops.get(1)); // cash credit
        assertInstanceOf(BatchWithdrawalOp.class, ops.get(2)); // fee withdrawal
        assertInstanceOf(BatchJournalEntryOp.class, ops.get(3)); // fee journal
    }

    @Test
    void executeSell_insufficientUnits_throws() {
        // Arrange: user holds 3 units but tries to sell 10
        SellRequest request = new SellRequest(ASSET_ID, new BigDecimal("10"));

        when(orderRepository.findByIdempotencyKey(IDEMPOTENCY_KEY)).thenReturn(Optional.empty());
        doNothing().when(marketHoursService).assertMarketOpen();
        when(assetRepository.findById(ASSET_ID)).thenReturn(Optional.of(activeAsset));
        when(pricingService.getCurrentPrice(ASSET_ID))
                .thenReturn(new CurrentPriceResponse(ASSET_ID, new BigDecimal("100"), null));

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

        when(orderRepository.findByIdempotencyKey(IDEMPOTENCY_KEY)).thenReturn(Optional.empty());
        doNothing().when(marketHoursService).assertMarketOpen();
        when(assetRepository.findById(ASSET_ID)).thenReturn(Optional.of(activeAsset));

        // Act & Assert — subscription check fires before price lookup or user resolution
        TradingException ex = assertThrows(TradingException.class,
                () -> tradingService.executeBuy(request, jwt, IDEMPOTENCY_KEY));
        assertTrue(ex.getMessage().contains("ended"));
        assertEquals("SUBSCRIPTION_ENDED", ex.getErrorCode());

        verifyNoInteractions(tradeLockService);
        verify(pricingService, never()).getCurrentPrice(anyString());
        verify(fineractClient, never()).executeAtomicBatch(anyList());
    }

    // -------------------------------------------------------------------------
    // Zero fee test
    // -------------------------------------------------------------------------

    @Test
    void executeBuy_zeroFee_noFeeLegsInBatch() {
        // Arrange: asset with no trading fee
        activeAsset.setTradingFeePercent(BigDecimal.ZERO);
        BuyRequest request = new BuyRequest(ASSET_ID, new BigDecimal("10"));
        BigDecimal basePrice = new BigDecimal("100");

        when(orderRepository.findByIdempotencyKey(IDEMPOTENCY_KEY)).thenReturn(Optional.empty());
        doNothing().when(marketHoursService).assertMarketOpen();
        when(assetRepository.findById(ASSET_ID)).thenReturn(Optional.of(activeAsset));
        when(pricingService.getCurrentPrice(ASSET_ID))
                .thenReturn(new CurrentPriceResponse(ASSET_ID, basePrice, null));

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

        // Assert: only 3 batch ops (cash, spread, asset — no fee legs)
        verify(fineractClient).executeAtomicBatch(batchOpsCaptor.capture());
        List<BatchOperation> ops = batchOpsCaptor.getValue();
        assertEquals(3, ops.size());
        // All should be transfer ops (no withdrawal or journal entry)
        ops.forEach(op -> assertInstanceOf(BatchTransferOp.class, op));
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
