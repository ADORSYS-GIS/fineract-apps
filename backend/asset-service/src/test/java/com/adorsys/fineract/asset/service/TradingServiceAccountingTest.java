package com.adorsys.fineract.asset.service;

import com.adorsys.fineract.asset.client.FineractClient;
import com.adorsys.fineract.asset.client.FineractClient.BatchOperation;
import com.adorsys.fineract.asset.client.FineractClient.BatchTransferOp;
import com.adorsys.fineract.asset.config.AssetServiceConfig;
import com.adorsys.fineract.asset.config.ResolvedGlAccounts;
import com.adorsys.fineract.asset.dto.TradeSide;
import com.adorsys.fineract.asset.entity.Asset;
import com.adorsys.fineract.asset.metrics.AssetMetrics;
import com.adorsys.fineract.asset.repository.AssetProjectionRepository;
import com.adorsys.fineract.asset.repository.AssetRepository;
import com.adorsys.fineract.asset.repository.OrderRepository;
import com.adorsys.fineract.asset.repository.TradeLogRepository;
import com.adorsys.fineract.asset.repository.UserPositionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.ApplicationEventPublisher;

import java.lang.reflect.Method;
import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

/**
 * Tests for buildBatchOperations — verifies the custodial accounting model:
 * - BUY: Client → Clearing → LP/Spread/Fee/Tax (single client withdrawal)
 * - SELL: LP → Client/Spread/Fee/Tax (LP bears all taxes)
 */
@ExtendWith(MockitoExtension.class)
class TradingServiceAccountingTest {

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
    @Mock private ApplicationEventPublisher eventPublisher;
    @Mock private QuoteReservationService quoteReservationService;
    @Mock private TaxService taxService;
    @Mock private AssetProjectionRepository assetProjectionRepository;

    @InjectMocks
    private TradingService tradingService;

    // Account IDs
    private static final Long USER_CASH = 100L;
    private static final Long USER_ASSET = 200L;
    private static final Long LP_CASH = 300L;
    private static final Long LP_ASSET = 400L;
    private static final Long LP_SPREAD = 500L;
    private static final Long LP_TAX = 360L;
    private static final Long FEE_COLLECT = 999L;
    private static final Long CLEARING = 901L;
    private static final Long TAX_REG_DUTY = 888L;
    private static final Long TAX_TVA = 889L;
    private static final Long TAX_CGT = 887L;

    private Asset testAsset;
    private Method buildBatchOps;

    @BeforeEach
    void setUp() throws Exception {
        testAsset = Asset.builder()
                .id("asset-001")
                .symbol("TST")
                .lpCashAccountId(LP_CASH)
                .lpAssetAccountId(LP_ASSET)
                .lpSpreadAccountId(LP_SPREAD)
                .lpTaxAccountId(LP_TAX)
                .build();

        lenient().when(resolvedGlAccounts.getClearingAccountId()).thenReturn(CLEARING);
        lenient().when(resolvedGlAccounts.getFeeCollectionAccountId()).thenReturn(FEE_COLLECT);
        lenient().when(taxService.getRegistrationDutyAccountId()).thenReturn(TAX_REG_DUTY);
        lenient().when(taxService.getCapitalGainsAccountId()).thenReturn(TAX_CGT);
        lenient().when(taxService.getTvaAccountId()).thenReturn(TAX_TVA);

        buildBatchOps = TradingService.class.getDeclaredMethod("buildBatchOperations",
                TradeSide.class, Asset.class, Long.class, Long.class,
                BigDecimal.class, BigDecimal.class, BigDecimal.class,
                BigDecimal.class, BigDecimal.class, Long.class,
                BigDecimal.class, BigDecimal.class, BigDecimal.class);
        buildBatchOps.setAccessible(true);
    }

    @SuppressWarnings("unchecked")
    private List<BatchOperation> invoke(TradeSide side, BigDecimal gross, BigDecimal units,
            BigDecimal fee, BigDecimal spread, BigDecimal buyback,
            BigDecimal regDuty, BigDecimal cgt, BigDecimal tva) throws Exception {
        return (List<BatchOperation>) buildBatchOps.invoke(tradingService,
                side, testAsset, USER_CASH, USER_ASSET,
                gross, units, fee, spread, buyback, FEE_COLLECT,
                regDuty, cgt, tva);
    }

    // -------------------------------------------------------------------------
    // BUY — Clearing Account Pattern
    // -------------------------------------------------------------------------

    @Nested
    class BuyFlow {

        @Test
        void buy_singleClientWithdrawalToClearing() throws Exception {
            // gross=100000, fee=500, regDuty=2000, tva=0, spread=5000
            List<BatchOperation> ops = invoke(TradeSide.BUY,
                    bd("100000"), bd("10"), bd("500"), bd("5000"), bd("0"),
                    bd("2000"), bd("0"), bd("0"));

            // Leg 1: Client → Clearing (total: 100000 + 500 + 2000 = 102500)
            BatchTransferOp leg1 = findTransfer(ops, USER_CASH, CLEARING);
            assertNotNull(leg1, "Should transfer from client to clearing");
            assertEquals(bd("102500"), leg1.amount());
        }

        @Test
        void buy_clearingDistributesToLP() throws Exception {
            List<BatchOperation> ops = invoke(TradeSide.BUY,
                    bd("100000"), bd("10"), bd("500"), bd("5000"), bd("0"),
                    bd("2000"), bd("0"), bd("0"));

            // Leg 3: Clearing → LP LSAV (nominal = gross - spread = 95000)
            BatchTransferOp lpLeg = findTransfer(ops, CLEARING, LP_CASH);
            assertNotNull(lpLeg, "Should transfer nominal to LP settlement");
            assertEquals(bd("95000"), lpLeg.amount());

            // Leg 4: Clearing → LP Spread
            BatchTransferOp spreadLeg = findTransfer(ops, CLEARING, LP_SPREAD);
            assertNotNull(spreadLeg, "Should transfer spread to LP spread");
            assertEquals(bd("5000"), spreadLeg.amount());
        }

        @Test
        void buy_clearingDistributesFeeAndTax() throws Exception {
            List<BatchOperation> ops = invoke(TradeSide.BUY,
                    bd("100000"), bd("10"), bd("500"), bd("5000"), bd("0"),
                    bd("2000"), bd("0"), bd("1000"));

            // Fee: Clearing → Fee Collection
            BatchTransferOp feeLeg = findTransfer(ops, CLEARING, FEE_COLLECT);
            assertNotNull(feeLeg, "Should transfer fee to platform");
            assertEquals(bd("500"), feeLeg.amount());

            // Reg duty: Clearing → Tax Authority
            BatchTransferOp regDutyLeg = findTransfer(ops, CLEARING, TAX_REG_DUTY);
            assertNotNull(regDutyLeg, "Should transfer reg duty to tax authority");
            assertEquals(bd("2000"), regDutyLeg.amount());

            // TVA: Clearing → Tax Authority
            BatchTransferOp tvaLeg = findTransfer(ops, CLEARING, TAX_TVA);
            assertNotNull(tvaLeg, "Should transfer TVA to tax authority");
            assertEquals(bd("1000"), tvaLeg.amount());
        }

        @Test
        void buy_clearingNetsToZero() throws Exception {
            BigDecimal gross = bd("100000");
            BigDecimal fee = bd("500");
            BigDecimal spread = bd("5000");
            BigDecimal regDuty = bd("2000");
            BigDecimal tva = bd("1000");

            List<BatchOperation> ops = invoke(TradeSide.BUY,
                    gross, bd("10"), fee, spread, bd("0"),
                    regDuty, bd("0"), tva);

            // Sum inflows to clearing
            BigDecimal inflow = bd("0");
            BigDecimal outflow = bd("0");
            for (BatchOperation op : ops) {
                if (op instanceof BatchTransferOp t) {
                    if (t.toAccountId().equals(CLEARING)) inflow = inflow.add(t.amount());
                    if (t.fromAccountId().equals(CLEARING)) outflow = outflow.add(t.amount());
                }
            }

            assertEquals(0, inflow.compareTo(outflow),
                    "Clearing inflow (" + inflow + ") should equal outflow (" + outflow + ")");
        }

        @Test
        void buy_tokenDelivery() throws Exception {
            List<BatchOperation> ops = invoke(TradeSide.BUY,
                    bd("100000"), bd("10"), bd("500"), bd("0"), bd("0"),
                    bd("0"), bd("0"), bd("0"));

            BatchTransferOp tokenLeg = findTransfer(ops, LP_ASSET, USER_ASSET);
            assertNotNull(tokenLeg, "Should deliver tokens from LP to client");
            assertEquals(bd("10"), tokenLeg.amount());
        }
    }

    // -------------------------------------------------------------------------
    // SELL — LP Bears Tax
    // -------------------------------------------------------------------------

    @Nested
    class SellFlow {

        @Test
        void sell_clientReceivesGrossMinusFeeOnly() throws Exception {
            // gross=95000, fee=500, regDuty=1900, tva=0
            // Client gets: 95000 - 500 = 94500 (LP pays tax separately)
            List<BatchOperation> ops = invoke(TradeSide.SELL,
                    bd("95000"), bd("10"), bd("500"), bd("5000"), bd("0"),
                    bd("1900"), bd("0"), bd("0"));

            BatchTransferOp clientLeg = findTransfer(ops, LP_CASH, USER_CASH);
            assertNotNull(clientLeg, "Should transfer proceeds to client");
            assertEquals(bd("94500"), clientLeg.amount()); // gross - fee, no tax deduction
        }

        @Test
        void sell_lpPaysTaxToLtaxAccount() throws Exception {
            List<BatchOperation> ops = invoke(TradeSide.SELL,
                    bd("95000"), bd("10"), bd("500"), bd("5000"), bd("0"),
                    bd("1900"), bd("500"), bd("0"));

            // Reg duty → LP TAX account (not global)
            BatchTransferOp regDutyLeg = findTransfer(ops, LP_CASH, LP_TAX);
            assertNotNull(regDutyLeg, "Reg duty should go to LP's LTAX account");
            assertEquals(bd("1900"), regDutyLeg.amount());

            // Capital gains → LP TAX account
            BatchTransferOp cgtLeg = findTransferByAmount(ops, LP_CASH, LP_TAX, bd("500"));
            assertNotNull(cgtLeg, "CGT should go to LP's LTAX account");
        }

        @Test
        void sell_lpPaysFeeAndSpread() throws Exception {
            List<BatchOperation> ops = invoke(TradeSide.SELL,
                    bd("95000"), bd("10"), bd("500"), bd("5000"), bd("0"),
                    bd("0"), bd("0"), bd("0"));

            // Fee: LP → Fee Collection
            BatchTransferOp feeLeg = findTransfer(ops, LP_CASH, FEE_COLLECT);
            assertNotNull(feeLeg, "LP should pay fee");
            assertEquals(bd("500"), feeLeg.amount());

            // Spread: LP → LP Spread
            BatchTransferOp spreadLeg = findTransfer(ops, LP_CASH, LP_SPREAD);
            assertNotNull(spreadLeg, "LP should sweep spread");
            assertEquals(bd("5000"), spreadLeg.amount());
        }

        @Test
        void sell_tokenReturnedToLP() throws Exception {
            List<BatchOperation> ops = invoke(TradeSide.SELL,
                    bd("95000"), bd("10"), bd("500"), bd("0"), bd("0"),
                    bd("0"), bd("0"), bd("0"));

            BatchTransferOp tokenLeg = findTransfer(ops, USER_ASSET, LP_ASSET);
            assertNotNull(tokenLeg, "Should return tokens from client to LP");
            assertEquals(bd("10"), tokenLeg.amount());
        }

        @Test
        void sell_withTva_routesToLpTaxAccount() throws Exception {
            List<BatchOperation> ops = invoke(TradeSide.SELL,
                    bd("95000"), bd("10"), bd("500"), bd("0"), bd("0"),
                    bd("0"), bd("0"), bd("1800"));

            BatchTransferOp tvaLeg = findTransfer(ops, LP_CASH, LP_TAX);
            assertNotNull(tvaLeg, "TVA should go to LP's LTAX account on SELL");
            assertEquals(bd("1800"), tvaLeg.amount());
        }

        @Test
        void sell_fallsBackToGlobalTaxWhenNoLpTax() throws Exception {
            testAsset.setLpTaxAccountId(null); // No LTAX account

            List<BatchOperation> ops = invoke(TradeSide.SELL,
                    bd("95000"), bd("10"), bd("500"), bd("0"), bd("0"),
                    bd("1900"), bd("0"), bd("0"));

            // Should fall back to global tax authority
            BatchTransferOp regDutyLeg = findTransfer(ops, LP_CASH, TAX_REG_DUTY);
            assertNotNull(regDutyLeg, "Should fall back to global reg duty account");
            assertEquals(bd("1900"), regDutyLeg.amount());
        }
    }

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    private static BigDecimal bd(String val) {
        return new BigDecimal(val);
    }

    private static BatchTransferOp findTransfer(List<BatchOperation> ops, Long from, Long to) {
        return ops.stream()
                .filter(op -> op instanceof BatchTransferOp t
                        && t.fromAccountId().equals(from) && t.toAccountId().equals(to))
                .map(op -> (BatchTransferOp) op)
                .findFirst().orElse(null);
    }

    private static BatchTransferOp findTransferByAmount(List<BatchOperation> ops, Long from, Long to, BigDecimal amount) {
        return ops.stream()
                .filter(op -> op instanceof BatchTransferOp t
                        && t.fromAccountId().equals(from) && t.toAccountId().equals(to)
                        && t.amount().compareTo(amount) == 0)
                .map(op -> (BatchTransferOp) op)
                .findFirst().orElse(null);
    }
}
