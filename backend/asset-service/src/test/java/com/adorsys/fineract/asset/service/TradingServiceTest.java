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
import io.micrometer.core.instrument.simple.SimpleMeterRegistry;
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
    @Mock private TaxService taxService;
    @Mock private AccruedInterestCalculator accruedInterestCalculator;
    @Mock private com.adorsys.fineract.asset.repository.AssetProjectionRepository assetProjectionRepository;

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
                .build();

        // Default accounting config (spread enabled)
        AssetServiceConfig.Accounting accounting = new AssetServiceConfig.Accounting();
        accounting.setSpreadCollectionAccountId(LP_SPREAD_ACCOUNT);
        lenient().when(assetServiceConfig.getAccounting()).thenReturn(accounting);
        lenient().when(assetServiceConfig.getSettlementCurrency()).thenReturn("XAF");
        lenient().when(resolvedGlAccounts.getFeeIncomeId()).thenReturn(FEE_INCOME_GL_ID);
        lenient().when(resolvedGlAccounts.getFundSourceId()).thenReturn(FUND_SOURCE_GL_ID);
        lenient().when(resolvedGlAccounts.getFeeCollectionAccountId()).thenReturn(FEE_COLLECTION_ACCOUNT);

        // Market hours config
        AssetServiceConfig.MarketHours marketHours = new AssetServiceConfig.MarketHours();
        marketHours.setTimezone("Africa/Douala");
        lenient().when(assetServiceConfig.getMarketHours()).thenReturn(marketHours);

        // Quote config
        AssetServiceConfig.Quote quoteConfig = new AssetServiceConfig.Quote();
        quoteConfig.setTtlSeconds(30);
        quoteConfig.setMaxActivePerUser(5);
        lenient().when(assetServiceConfig.getQuote()).thenReturn(quoteConfig);

        // Tax service defaults (returns zero tax for all calculations)
        lenient().when(taxService.calculateRegistrationDuty(any(), any())).thenReturn(BigDecimal.ZERO);
        lenient().when(taxService.calculateCapitalGainsTax(any(), anyLong(), any())).thenReturn(BigDecimal.ZERO);
        lenient().when(taxService.calculateTva(any(), any())).thenReturn(BigDecimal.ZERO);
        lenient().when(taxService.getRegistrationDutyRate(any())).thenReturn(BigDecimal.ZERO);
        lenient().when(taxService.getTvaRate(any())).thenReturn(BigDecimal.ZERO);
        lenient().when(taxService.buildTaxBreakdown(any(), anyLong(), any(), any(), any(), anyBoolean()))
                .thenReturn(new TaxBreakdown(BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO,
                        BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO, false));

        // Accrued interest calculator defaults (returns zero for non-bond assets)
        lenient().when(accruedInterestCalculator.calculate(any(), any())).thenReturn(BigDecimal.ZERO);

        // AssetMetrics timer mocks
        SimpleMeterRegistry registry = new SimpleMeterRegistry();
        lenient().when(assetMetrics.getQuoteToExecutionTimer())
                .thenReturn(io.micrometer.core.instrument.Timer.builder("test.q2e").register(registry));
        lenient().when(assetMetrics.getBuyTimer())
                .thenReturn(io.micrometer.core.instrument.Timer.builder("test.buy").register(registry));
        lenient().when(assetMetrics.getSellTimer())
                .thenReturn(io.micrometer.core.instrument.Timer.builder("test.sell").register(registry));
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
        when(fineractClient.getAccountBalance(LP_CASH_ACCOUNT)).thenReturn(new BigDecimal("999999"));
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
    // executeOrderAsync tests (covers executeInsideLock pipeline)
    // -------------------------------------------------------------------------

    private Order buildPendingOrder(TradeSide side, BigDecimal units, BigDecimal executionPrice, BigDecimal fee, BigDecimal spreadAmount) {
        BigDecimal grossAmount = units.multiply(executionPrice).setScale(0, RoundingMode.HALF_UP);
        BigDecimal cashAmount = (side == TradeSide.BUY)
                ? grossAmount.add(fee)
                : grossAmount.subtract(fee);
        return Order.builder()
                .id("order-exec-001")
                .idempotencyKey("idem-exec-1")
                .userId(USER_ID)
                .userExternalId(EXTERNAL_ID)
                .assetId(ASSET_ID)
                .side(side)
                .status(OrderStatus.PENDING)
                .units(units)
                .executionPrice(executionPrice)
                .cashAmount(cashAmount)
                .fee(fee)
                .spreadAmount(spreadAmount)
                .quotedAskPrice(new BigDecimal("110"))
                .quotedBidPrice(new BigDecimal("90"))
                .build();
    }

    private void stubExecutionDefaults(Order order) {
        // Order lookups (findById called twice: initial + re-verify inside lock)
        lenient().when(orderRepository.findById(order.getId())).thenReturn(Optional.of(order));
        lenient().when(assetRepository.findById(ASSET_ID)).thenReturn(Optional.of(activeAsset));
        lenient().when(orderRepository.save(any(Order.class))).thenAnswer(inv -> inv.getArgument(0));

        // User account resolution
        lenient().when(fineractClient.findClientSavingsAccountByCurrency(eq(USER_ID), eq("XAF"))).thenReturn(USER_CASH_ACCOUNT);

        // Trade lock
        lenient().when(tradeLockService.acquireTradeLock(USER_ID, ASSET_ID)).thenReturn("lock-value-1");

        // Pricing inside lock (same as quoted — no slippage)
        lenient().when(pricingService.getPrice(ASSET_ID)).thenReturn(
                new PriceResponse(ASSET_ID, new BigDecimal("110"), new BigDecimal("90"), null));

        // Supply adjustment succeeds
        lenient().when(assetRepository.adjustCirculatingSupply(eq(ASSET_ID), any())).thenReturn(1);

        // Fineract batch succeeds
        lenient().when(fineractClient.executeAtomicBatch(anyList())).thenReturn(List.of(Map.of("requestId", "batch-1")));
    }

    @Test
    void executeOrderAsync_buyHappyPath_filledWith4BatchOps() {
        BigDecimal units = new BigDecimal("10");
        BigDecimal askPrice = new BigDecimal("110");
        BigDecimal fee = new BigDecimal("6"); // 0.5% of 1100
        BigDecimal spreadAmount = new BigDecimal("100"); // (110 - 100) * 10
        Order order = buildPendingOrder(TradeSide.BUY, units, askPrice, fee, spreadAmount);
        stubExecutionDefaults(order);

        // BUY: resolve or create user asset account
        when(userPositionRepository.findByUserIdAndAssetId(USER_ID, ASSET_ID)).thenReturn(Optional.empty());
        when(fineractClient.findClientSavingsAccountByCurrency(eq(USER_ID), eq("TST"))).thenReturn(USER_ASSET_ACCOUNT);

        // BUY: user has enough cash
        when(fineractClient.getAccountBalance(USER_CASH_ACCOUNT)).thenReturn(new BigDecimal("500000"));

        tradingService.executeOrderAsync("order-exec-001");

        // Verify order marked FILLED
        verify(orderRepository, atLeast(2)).save(orderCaptor.capture());
        Order finalOrder = orderCaptor.getAllValues().stream()
                .filter(o -> o.getStatus() == OrderStatus.FILLED).findFirst().orElse(null);
        assertNotNull(finalOrder, "Order should be marked FILLED");

        // Verify batch contains expected ops (clearing pattern + revenue recognition + TVA)
        verify(fineractClient).executeAtomicBatch(batchOpsCaptor.capture());
        List<BatchOperation> ops = batchOpsCaptor.getValue();
        assertTrue(ops.size() >= 4, "Should have at least 4 batch ops, got: " + ops.size());

        // Verify supply adjusted, OHLC updated, metrics recorded
        verify(assetRepository).adjustCirculatingSupply(ASSET_ID, units);
        verify(pricingService).updateOhlcAfterTrade(ASSET_ID, askPrice);
        verify(assetMetrics).recordBuy();
        verify(tradeLockService).releaseTradeLock(USER_ID, ASSET_ID, "lock-value-1");
    }

    @Test
    void executeOrderAsync_sellHappyPath_filledWith4BatchOps() {
        BigDecimal units = new BigDecimal("5");
        BigDecimal bidPrice = new BigDecimal("90");
        BigDecimal fee = new BigDecimal("2"); // 0.5% of 450
        BigDecimal spreadAmount = new BigDecimal("50"); // (100 - 90) * 5
        Order order = buildPendingOrder(TradeSide.SELL, units, bidPrice, fee, spreadAmount);
        stubExecutionDefaults(order);

        // SELL: user has a position
        UserPosition position = UserPosition.builder()
                .totalUnits(new BigDecimal("10"))
                .fineractSavingsAccountId(USER_ASSET_ACCOUNT)
                .build();
        when(userPositionRepository.findByUserIdAndAssetId(USER_ID, ASSET_ID)).thenReturn(Optional.of(position));

        // SELL: LP has enough cash
        when(fineractClient.getAccountBalance(LP_CASH_ACCOUNT)).thenReturn(new BigDecimal("999999"));

        tradingService.executeOrderAsync("order-exec-001");

        // Verify FILLED
        verify(orderRepository, atLeast(2)).save(orderCaptor.capture());
        Order finalOrder = orderCaptor.getAllValues().stream()
                .filter(o -> o.getStatus() == OrderStatus.FILLED).findFirst().orElse(null);
        assertNotNull(finalOrder, "Order should be marked FILLED");

        // Verify 4-leg batch: token return, LP pays investor, fee, spread
        verify(fineractClient).executeAtomicBatch(batchOpsCaptor.capture());
        List<BatchOperation> ops = batchOpsCaptor.getValue();
        assertEquals(5, ops.size());
        assertTransferOp(ops.get(0), USER_ASSET_ACCOUNT, LP_ASSET_ACCOUNT, units); // token return
        BigDecimal grossAmount = new BigDecimal("450"); // 5 * 90
        assertTransferOp(ops.get(1), LP_CASH_ACCOUNT, USER_CASH_ACCOUNT, grossAmount.subtract(fee)); // net proceeds
        assertTransferOp(ops.get(2), LP_CASH_ACCOUNT, FEE_COLLECTION_ACCOUNT, fee); // fee
        assertTransferOp(ops.get(3), LP_CASH_ACCOUNT, LP_SPREAD_ACCOUNT, spreadAmount); // spread

        verify(assetRepository).adjustCirculatingSupply(ASSET_ID, units.negate());
        verify(pricingService).updateOhlcAfterTrade(ASSET_ID, bidPrice);
        verify(assetMetrics).recordSell();
        verify(portfolioService).updatePositionAfterSell(eq(USER_ID), eq(ASSET_ID), eq(units), any());
    }

    @Test
    void executeOrderAsync_insufficientInventoryInsideLock_rejects() {
        BigDecimal units = new BigDecimal("10");
        Order order = buildPendingOrder(TradeSide.BUY, units, new BigDecimal("110"), new BigDecimal("6"), new BigDecimal("100"));
        stubExecutionDefaults(order);

        // Exhaust supply between quote and execution
        activeAsset.setCirculatingSupply(new BigDecimal("995")); // only 5 available

        when(userPositionRepository.findByUserIdAndAssetId(USER_ID, ASSET_ID)).thenReturn(Optional.empty());
        when(fineractClient.findClientSavingsAccountByCurrency(eq(USER_ID), eq("TST"))).thenReturn(USER_ASSET_ACCOUNT);

        assertThrows(InsufficientInventoryException.class,
                () -> tradingService.executeOrderAsync("order-exec-001"));

        verify(orderRepository, atLeast(1)).save(orderCaptor.capture());
        assertTrue(orderCaptor.getAllValues().stream()
                .anyMatch(o -> o.getStatus() == OrderStatus.REJECTED));
        verify(fineractClient, never()).executeAtomicBatch(anyList());
    }

    @Test
    void executeOrderAsync_insufficientUserFundsInsideLock_rejects() {
        BigDecimal units = new BigDecimal("10");
        Order order = buildPendingOrder(TradeSide.BUY, units, new BigDecimal("110"), new BigDecimal("6"), new BigDecimal("100"));
        stubExecutionDefaults(order);

        when(userPositionRepository.findByUserIdAndAssetId(USER_ID, ASSET_ID)).thenReturn(Optional.empty());
        when(fineractClient.findClientSavingsAccountByCurrency(eq(USER_ID), eq("TST"))).thenReturn(USER_ASSET_ACCOUNT);
        // User balance dropped since quote
        when(fineractClient.getAccountBalance(USER_CASH_ACCOUNT)).thenReturn(new BigDecimal("50"));

        TradingException ex = assertThrows(TradingException.class,
                () -> tradingService.executeOrderAsync("order-exec-001"));
        assertTrue(ex.getMessage().contains("Insufficient"));

        verify(orderRepository, atLeast(1)).save(orderCaptor.capture());
        assertTrue(orderCaptor.getAllValues().stream()
                .anyMatch(o -> o.getStatus() == OrderStatus.REJECTED));
        verify(fineractClient, never()).executeAtomicBatch(anyList());
    }

    @Test
    void executeOrderAsync_insufficientLpFundsForSell_rejects() {
        BigDecimal units = new BigDecimal("5");
        Order order = buildPendingOrder(TradeSide.SELL, units, new BigDecimal("90"), new BigDecimal("2"), new BigDecimal("50"));
        stubExecutionDefaults(order);

        UserPosition position = UserPosition.builder()
                .totalUnits(new BigDecimal("10"))
                .fineractSavingsAccountId(USER_ASSET_ACCOUNT)
                .build();
        when(userPositionRepository.findByUserIdAndAssetId(USER_ID, ASSET_ID)).thenReturn(Optional.of(position));
        // LP has insufficient cash
        when(fineractClient.getAccountBalance(LP_CASH_ACCOUNT)).thenReturn(new BigDecimal("10"));

        TradingException ex = assertThrows(TradingException.class,
                () -> tradingService.executeOrderAsync("order-exec-001"));
        assertTrue(ex.getMessage().contains("insufficient funds"));

        verify(orderRepository, atLeast(1)).save(orderCaptor.capture());
        assertTrue(orderCaptor.getAllValues().stream()
                .anyMatch(o -> o.getStatus() == OrderStatus.REJECTED));
        verify(fineractClient, never()).executeAtomicBatch(anyList());
    }

    @Test
    void executeOrderAsync_insufficientUnitsInsideLock_rejects() {
        BigDecimal units = new BigDecimal("10");
        Order order = buildPendingOrder(TradeSide.SELL, units, new BigDecimal("90"), new BigDecimal("5"), new BigDecimal("100"));
        stubExecutionDefaults(order);

        // Position passes resolveUserAccounts (10 units) but fails reVerifyInventoryOrPosition (3 units)
        UserPosition positionAtResolve = UserPosition.builder()
                .totalUnits(new BigDecimal("10"))
                .fineractSavingsAccountId(USER_ASSET_ACCOUNT)
                .build();
        UserPosition positionAtLock = UserPosition.builder()
                .totalUnits(new BigDecimal("3")) // reduced concurrently
                .fineractSavingsAccountId(USER_ASSET_ACCOUNT)
                .build();
        when(userPositionRepository.findByUserIdAndAssetId(USER_ID, ASSET_ID))
                .thenReturn(Optional.of(positionAtResolve))   // first call: resolveUserAccounts
                .thenReturn(Optional.of(positionAtLock));      // second call: reVerifyInventoryOrPosition

        // LP has enough cash (passes checkBalanceInsideLock won't reach, but needed for early checks)
        lenient().when(fineractClient.getAccountBalance(LP_CASH_ACCOUNT)).thenReturn(new BigDecimal("999999"));

        TradingException ex = assertThrows(TradingException.class,
                () -> tradingService.executeOrderAsync("order-exec-001"));
        assertTrue(ex.getMessage().contains("Insufficient units"));

        verify(orderRepository, atLeast(1)).save(orderCaptor.capture());
        assertTrue(orderCaptor.getAllValues().stream()
                .anyMatch(o -> o.getStatus() == OrderStatus.REJECTED));
    }

    @Test
    void executeOrderAsync_priceSlippageExceeds2Percent_rejects() {
        BigDecimal units = new BigDecimal("10");
        // Quoted at 110 ask
        Order order = buildPendingOrder(TradeSide.BUY, units, new BigDecimal("110"), new BigDecimal("6"), new BigDecimal("100"));
        stubExecutionDefaults(order);

        // Price moved >2% since quote (110 → 115 = ~4.5% slippage)
        when(pricingService.getPrice(ASSET_ID)).thenReturn(
                new PriceResponse(ASSET_ID, new BigDecimal("115"), new BigDecimal("95"), null));

        when(userPositionRepository.findByUserIdAndAssetId(USER_ID, ASSET_ID)).thenReturn(Optional.empty());
        when(fineractClient.findClientSavingsAccountByCurrency(eq(USER_ID), eq("TST"))).thenReturn(USER_ASSET_ACCOUNT);

        TradingException ex = assertThrows(TradingException.class,
                () -> tradingService.executeOrderAsync("order-exec-001"));
        assertTrue(ex.getMessage().contains("Price changed"));

        verify(orderRepository, atLeast(1)).save(orderCaptor.capture());
        assertTrue(orderCaptor.getAllValues().stream()
                .anyMatch(o -> o.getStatus() == OrderStatus.REJECTED));
        verify(fineractClient, never()).executeAtomicBatch(anyList());
    }

    @Test
    void executeOrderAsync_sellBidAboveIssuer_fundsPremiumFromSpread() {
        // bid=105 > issuer=100 → buybackPremium = (105-100)*5 = 25, spreadAmount=0
        BigDecimal units = new BigDecimal("5");
        BigDecimal bidPrice = new BigDecimal("105");
        BigDecimal fee = new BigDecimal("3");
        Order order = buildPendingOrder(TradeSide.SELL, units, bidPrice, fee, BigDecimal.ZERO);
        order.setBuybackPremium(new BigDecimal("25"));
        stubExecutionDefaults(order);

        // Override price to bid=105
        when(pricingService.getPrice(ASSET_ID)).thenReturn(
                new PriceResponse(ASSET_ID, new BigDecimal("115"), new BigDecimal("105"), null));

        UserPosition position = UserPosition.builder()
                .totalUnits(new BigDecimal("10"))
                .fineractSavingsAccountId(USER_ASSET_ACCOUNT)
                .build();
        when(userPositionRepository.findByUserIdAndAssetId(USER_ID, ASSET_ID)).thenReturn(Optional.of(position));
        when(fineractClient.getAccountBalance(LP_CASH_ACCOUNT)).thenReturn(new BigDecimal("999999"));

        tradingService.executeOrderAsync("order-exec-001");

        verify(fineractClient).executeAtomicBatch(batchOpsCaptor.capture());
        List<BatchOperation> ops = batchOpsCaptor.getValue();

        // Expect 5 legs: token return, buyback premium (spread→LP cash), net proceeds, fee, + revenue recognition
        assertEquals(5, ops.size());
        assertTransferOp(ops.get(0), USER_ASSET_ACCOUNT, LP_ASSET_ACCOUNT, units); // token return
        // Leg 2: buyback premium from LP Spread → LP Cash
        assertTransferOp(ops.get(1), LP_SPREAD_ACCOUNT, LP_CASH_ACCOUNT, new BigDecimal("25"));
        // Leg 3: net proceeds (grossAmount=525, net=525-3=522)
        BigDecimal grossAmount = new BigDecimal("525");
        assertTransferOp(ops.get(2), LP_CASH_ACCOUNT, USER_CASH_ACCOUNT, grossAmount.subtract(fee));
        // Leg 4: fee
        assertTransferOp(ops.get(3), LP_CASH_ACCOUNT, FEE_COLLECTION_ACCOUNT, fee);
    }

    @Test
    void executeOrderAsync_spreadDisabled_3LegBuyBatch() {
        BigDecimal units = new BigDecimal("10");
        BigDecimal askPrice = new BigDecimal("110");
        BigDecimal fee = new BigDecimal("6");
        Order order = buildPendingOrder(TradeSide.BUY, units, askPrice, fee, BigDecimal.ZERO);
        stubExecutionDefaults(order);

        // Disable spread: lpSpreadAccountId = null
        activeAsset.setLpSpreadAccountId(null);

        when(userPositionRepository.findByUserIdAndAssetId(USER_ID, ASSET_ID)).thenReturn(Optional.empty());
        when(fineractClient.findClientSavingsAccountByCurrency(eq(USER_ID), eq("TST"))).thenReturn(USER_ASSET_ACCOUNT);
        when(fineractClient.getAccountBalance(USER_CASH_ACCOUNT)).thenReturn(new BigDecimal("500000"));

        tradingService.executeOrderAsync("order-exec-001");

        verify(fineractClient).executeAtomicBatch(batchOpsCaptor.capture());
        List<BatchOperation> ops = batchOpsCaptor.getValue();
        // No spread leg → clearing pattern + token delivery + fee + revenue recognition
        assertTrue(ops.size() >= 3, "Should have at least 3 batch ops, got: " + ops.size());
    }

    @Test
    void executeOrderAsync_zeroFee_noFeeLeg() {
        BigDecimal units = new BigDecimal("10");
        BigDecimal askPrice = new BigDecimal("110");
        BigDecimal fee = BigDecimal.ZERO;
        BigDecimal spreadAmount = new BigDecimal("100");
        Order order = buildPendingOrder(TradeSide.BUY, units, askPrice, fee, spreadAmount);
        stubExecutionDefaults(order);

        // Zero fee config
        activeAsset.setTradingFeePercent(BigDecimal.ZERO);

        when(userPositionRepository.findByUserIdAndAssetId(USER_ID, ASSET_ID)).thenReturn(Optional.empty());
        when(fineractClient.findClientSavingsAccountByCurrency(eq(USER_ID), eq("TST"))).thenReturn(USER_ASSET_ACCOUNT);
        when(fineractClient.getAccountBalance(USER_CASH_ACCOUNT)).thenReturn(new BigDecimal("500000"));

        tradingService.executeOrderAsync("order-exec-001");

        verify(fineractClient).executeAtomicBatch(batchOpsCaptor.capture());
        List<BatchOperation> ops = batchOpsCaptor.getValue();
        // No fee leg → clearing pattern + token delivery + spread + revenue recognition
        assertTrue(ops.size() >= 3, "Should have at least 3 batch ops, got: " + ops.size());
    }

    @Test
    void executeOrderAsync_assetMissingLpAccounts_rejects() {
        BigDecimal units = new BigDecimal("10");
        Order order = buildPendingOrder(TradeSide.BUY, units, new BigDecimal("110"), new BigDecimal("6"), new BigDecimal("100"));
        stubExecutionDefaults(order);

        // LP Cash not configured
        activeAsset.setLpCashAccountId(null);

        when(userPositionRepository.findByUserIdAndAssetId(USER_ID, ASSET_ID)).thenReturn(Optional.empty());
        when(fineractClient.findClientSavingsAccountByCurrency(eq(USER_ID), eq("TST"))).thenReturn(USER_ASSET_ACCOUNT);

        TradingException ex = assertThrows(TradingException.class,
                () -> tradingService.executeOrderAsync("order-exec-001"));
        assertTrue(ex.getMessage().contains("not fully configured"));

        verify(orderRepository, atLeast(1)).save(orderCaptor.capture());
        assertTrue(orderCaptor.getAllValues().stream()
                .anyMatch(o -> o.getStatus() == OrderStatus.REJECTED));
        verify(fineractClient, never()).executeAtomicBatch(anyList());
    }

    @Test
    void executeOrderAsync_supplyConstraintViolated_rejects() {
        BigDecimal units = new BigDecimal("10");
        Order order = buildPendingOrder(TradeSide.BUY, units, new BigDecimal("110"), new BigDecimal("6"), new BigDecimal("100"));
        stubExecutionDefaults(order);

        when(userPositionRepository.findByUserIdAndAssetId(USER_ID, ASSET_ID)).thenReturn(Optional.empty());
        when(fineractClient.findClientSavingsAccountByCurrency(eq(USER_ID), eq("TST"))).thenReturn(USER_ASSET_ACCOUNT);
        when(fineractClient.getAccountBalance(USER_CASH_ACCOUNT)).thenReturn(new BigDecimal("500000"));

        // adjustCirculatingSupply returns 0 → constraint violated
        when(assetRepository.adjustCirculatingSupply(eq(ASSET_ID), any())).thenReturn(0);

        TradingException ex = assertThrows(TradingException.class,
                () -> tradingService.executeOrderAsync("order-exec-001"));
        assertTrue(ex.getMessage().contains("supply"));

        verify(orderRepository, atLeast(1)).save(orderCaptor.capture());
        assertTrue(orderCaptor.getAllValues().stream()
                .anyMatch(o -> o.getStatus() == OrderStatus.REJECTED));
        verify(fineractClient, never()).executeAtomicBatch(anyList());
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
