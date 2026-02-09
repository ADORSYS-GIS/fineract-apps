package com.adorsys.fineract.asset.service;

import com.adorsys.fineract.asset.client.FineractClient;
import com.adorsys.fineract.asset.client.FineractClient.BatchTransferRequest;
import com.adorsys.fineract.asset.config.AssetServiceConfig;
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
    @Mock private AssetMetrics assetMetrics;

    @InjectMocks
    private TradingService tradingService;

    @Mock private Jwt jwt;

    @Captor private ArgumentCaptor<List<BatchTransferRequest>> transfersCaptor;
    @Captor private ArgumentCaptor<Order> orderCaptor;

    private static final String ASSET_ID = "asset-001";
    private static final String EXTERNAL_ID = "keycloak-uuid-123";
    private static final Long USER_ID = 42L;
    private static final Long USER_CASH_ACCOUNT = 100L;
    private static final Long USER_ASSET_ACCOUNT = 200L;
    private static final Long TREASURY_CASH_ACCOUNT = 300L;
    private static final Long TREASURY_ASSET_ACCOUNT = 400L;
    private static final Long FEE_COLLECTION_ACCOUNT = 999L;
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
                .build();
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
        when(jwt.getClaim("fineract_client_id")).thenReturn(USER_ID);
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

        // Fee collection account config
        AssetServiceConfig.Accounting accounting = new AssetServiceConfig.Accounting();
        accounting.setFeeCollectionAccountId(FEE_COLLECTION_ACCOUNT);
        when(assetServiceConfig.getAccounting()).thenReturn(accounting);

        // Batch transfers succeed
        when(fineractClient.executeBatchTransfers(anyList())).thenReturn(List.of());

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
        assertNull(response.realizedPnl());

        // Verify batch transfers were called with correct legs
        verify(fineractClient).executeBatchTransfers(transfersCaptor.capture());
        List<BatchTransferRequest> transfers = transfersCaptor.getValue();
        // Should have 3 legs: cash, fee, asset
        assertEquals(3, transfers.size());

        // Cash leg: user XAF -> treasury XAF
        assertEquals(USER_CASH_ACCOUNT, transfers.get(0).fromAccountId());
        assertEquals(TREASURY_CASH_ACCOUNT, transfers.get(0).toAccountId());
        assertEquals(actualCost, transfers.get(0).amount());

        // Fee leg: user XAF -> fee collection
        assertEquals(USER_CASH_ACCOUNT, transfers.get(1).fromAccountId());
        assertEquals(FEE_COLLECTION_ACCOUNT, transfers.get(1).toAccountId());
        assertEquals(fee, transfers.get(1).amount());

        // Asset leg: treasury asset -> user asset
        assertEquals(TREASURY_ASSET_ACCOUNT, transfers.get(2).fromAccountId());
        assertEquals(USER_ASSET_ACCOUNT, transfers.get(2).toAccountId());
        assertEquals(new BigDecimal("10"), transfers.get(2).amount());

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
                .assetId(ASSET_ID)
                .side(TradeSide.BUY)
                .units(new BigDecimal("5"))
                .executionPrice(new BigDecimal("101"))
                .xafAmount(new BigDecimal("510"))
                .fee(new BigDecimal("3"))
                .status(OrderStatus.FILLED)
                .createdAt(Instant.now())
                .build();

        when(orderRepository.findByIdempotencyKey(IDEMPOTENCY_KEY))
                .thenReturn(Optional.of(existingOrder));

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

        // Verify no batch transfers were attempted
        verify(fineractClient, never()).executeBatchTransfers(anyList());
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
        assertTrue(ex.getMessage().contains("Insufficient XAF balance"));
        assertEquals("INSUFFICIENT_FUNDS", ex.getErrorCode());

        // Verify the lock was acquired (balance check is inside lock)
        verify(tradeLockService).acquireTradeLock(USER_ID, ASSET_ID);

        // Verify the lock was released in finally block
        verify(tradeLockService).releaseTradeLock(USER_ID, ASSET_ID, "lock-val");

        // Verify no batch transfers were attempted
        verify(fineractClient, never()).executeBatchTransfers(anyList());
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
        // netAmount = 495 - 2 = 493
        BigDecimal netAmount = grossAmount.subtract(fee);
        // netProceedsPerUnit = 493 / 5 = 98.6000
        BigDecimal netProceedsPerUnit = netAmount.divide(new BigDecimal("5"), 4, RoundingMode.HALF_UP);

        BigDecimal expectedPnl = new BigDecimal("-7.0000"); // (98.6 - 100) * 5 = -7 (approx)

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

        // Fee collection account config
        AssetServiceConfig.Accounting accounting = new AssetServiceConfig.Accounting();
        accounting.setFeeCollectionAccountId(FEE_COLLECTION_ACCOUNT);
        when(assetServiceConfig.getAccounting()).thenReturn(accounting);

        // Batch transfers
        when(fineractClient.executeBatchTransfers(anyList())).thenReturn(List.of());

        // Portfolio update returns realized P&L
        BigDecimal realizedPnl = new BigDecimal("-7");
        when(portfolioService.updatePositionAfterSell(eq(USER_ID), eq(ASSET_ID),
                eq(new BigDecimal("5")), eq(netProceedsPerUnit)))
                .thenReturn(realizedPnl);

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
        assertEquals(realizedPnl, response.realizedPnl());

        // Verify batch transfers
        verify(fineractClient).executeBatchTransfers(transfersCaptor.capture());
        List<BatchTransferRequest> transfers = transfersCaptor.getValue();
        assertEquals(3, transfers.size());

        // Asset leg: user asset -> treasury asset
        assertEquals(USER_ASSET_ACCOUNT, transfers.get(0).fromAccountId());
        assertEquals(TREASURY_ASSET_ACCOUNT, transfers.get(0).toAccountId());
        assertEquals(new BigDecimal("5"), transfers.get(0).amount());

        // Cash leg: treasury XAF -> user XAF (net proceeds)
        assertEquals(TREASURY_CASH_ACCOUNT, transfers.get(1).fromAccountId());
        assertEquals(USER_CASH_ACCOUNT, transfers.get(1).toAccountId());
        assertEquals(netAmount, transfers.get(1).amount());

        // Fee leg: treasury XAF -> fee collection
        assertEquals(TREASURY_CASH_ACCOUNT, transfers.get(2).fromAccountId());
        assertEquals(FEE_COLLECTION_ACCOUNT, transfers.get(2).toAccountId());
        assertEquals(fee, transfers.get(2).amount());

        // Verify circulating supply decreased
        verify(assetRepository).adjustCirculatingSupply(ASSET_ID, new BigDecimal("5").negate());

        // Verify OHLC updated
        verify(pricingService).updateOhlcAfterTrade(ASSET_ID, executionPrice);

        // Verify lock released
        verify(tradeLockService).releaseTradeLock(USER_ID, ASSET_ID, "lock-val");
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
        verify(fineractClient, never()).executeBatchTransfers(anyList());
    }
}
