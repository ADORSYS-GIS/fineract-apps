package com.adorsys.fineract.asset.service;

import com.adorsys.fineract.asset.client.FineractClient;
import com.adorsys.fineract.asset.client.FineractClient.*;
import com.adorsys.fineract.asset.config.AssetServiceConfig;
import com.adorsys.fineract.asset.config.ResolvedGlAccounts;
import com.adorsys.fineract.asset.dto.TradeSide;
import com.adorsys.fineract.asset.entity.Asset;
import com.adorsys.fineract.asset.metrics.AssetMetrics;
import com.adorsys.fineract.asset.repository.AssetRepository;
import com.adorsys.fineract.asset.repository.OrderRepository;
import com.adorsys.fineract.asset.repository.TradeLogRepository;
import com.adorsys.fineract.asset.repository.UserPositionRepository;
import org.junit.jupiter.api.BeforeEach;
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
 * Tests for the journal entry and batch operation building logic in TradingService.
 * Uses reflection to invoke the private buildBatchOperations method directly,
 * as testing through the full trade execution flow would require excessive mocking.
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

    @InjectMocks
    private TradingService tradingService;

    // GL account IDs (mocked from ResolvedGlAccounts)
    private static final Long FUND_SOURCE_GL_ID = 1042L;
    private static final Long PLATFORM_FEE_INCOME_GL_ID = 1088L;
    private static final Long SPREAD_INCOME_GL_ID = 1089L;
    private static final Long TAX_EXPENSE_REG_DUTY_GL_ID = 1092L;
    private static final Long TAX_EXPENSE_CGT_GL_ID = 1093L;

    // Savings account IDs
    private static final Long USER_CASH_ACCOUNT = 100L;
    private static final Long USER_ASSET_ACCOUNT = 200L;
    private static final Long LP_CASH_ACCOUNT = 300L;
    private static final Long LP_ASSET_ACCOUNT = 400L;
    private static final Long LP_SPREAD_ACCOUNT = 500L;
    private static final Long FEE_COLLECTION_ACCOUNT = 999L;
    private static final Long TAX_REG_DUTY_ACCOUNT = 888L;
    private static final Long TAX_CGT_ACCOUNT = 887L;

    private Asset testAsset;
    private Method buildBatchOps;

    @BeforeEach
    void setUp() throws Exception {
        testAsset = Asset.builder()
                .id("asset-001")
                .symbol("TST")
                .name("Test Asset")
                .lpCashAccountId(LP_CASH_ACCOUNT)
                .lpAssetAccountId(LP_ASSET_ACCOUNT)
                .lpSpreadAccountId(LP_SPREAD_ACCOUNT)
                .build();

        // Setup ResolvedGlAccounts mock
        lenient().when(resolvedGlAccounts.getFundSourceId()).thenReturn(FUND_SOURCE_GL_ID);
        lenient().when(resolvedGlAccounts.getPlatformFeeIncomeId()).thenReturn(PLATFORM_FEE_INCOME_GL_ID);
        lenient().when(resolvedGlAccounts.getSpreadIncomeId()).thenReturn(SPREAD_INCOME_GL_ID);
        lenient().when(resolvedGlAccounts.getTaxExpenseRegDutyId()).thenReturn(TAX_EXPENSE_REG_DUTY_GL_ID);
        lenient().when(resolvedGlAccounts.getTaxExpenseCapGainsId()).thenReturn(TAX_EXPENSE_CGT_GL_ID);

        // Setup AssetServiceConfig mock
        lenient().when(assetServiceConfig.getSettlementCurrency()).thenReturn("XAF");

        // Setup TaxService mock for tax account IDs
        lenient().when(taxService.getRegistrationDutyAccountId()).thenReturn(TAX_REG_DUTY_ACCOUNT);
        lenient().when(taxService.getCapitalGainsAccountId()).thenReturn(TAX_CGT_ACCOUNT);

        // Access private method via reflection
        buildBatchOps = TradingService.class.getDeclaredMethod("buildBatchOperations",
                TradeSide.class, Asset.class, Long.class, Long.class,
                BigDecimal.class, BigDecimal.class, BigDecimal.class,
                BigDecimal.class, BigDecimal.class, Long.class,
                BigDecimal.class, BigDecimal.class,
                String.class, Long.class);
        buildBatchOps.setAccessible(true);
    }

    // -------------------------------------------------------------------------
    // BUY with fee and registration duty (no spread, no capital gains)
    // -------------------------------------------------------------------------

    @Test
    @SuppressWarnings("unchecked")
    void buildBatchOperations_buyWithFeeAndRegDuty_producesCorrectOps() throws Exception {
        BigDecimal grossAmount = new BigDecimal("100000");
        BigDecimal units = new BigDecimal("10");
        BigDecimal fee = new BigDecimal("500");
        BigDecimal spreadAmount = BigDecimal.ZERO;
        BigDecimal buybackPremium = BigDecimal.ZERO;
        BigDecimal registrationDuty = new BigDecimal("2000");
        BigDecimal capitalGainsTax = BigDecimal.ZERO;

        List<BatchOperation> ops = (List<BatchOperation>) buildBatchOps.invoke(tradingService,
                TradeSide.BUY, testAsset, USER_CASH_ACCOUNT, USER_ASSET_ACCOUNT,
                grossAmount, units, fee, spreadAmount, buybackPremium, FEE_COLLECTION_ACCOUNT,
                registrationDuty, capitalGainsTax,
                "order-test-001", 42L);

        // Leg 1: User pays gross + fee + tax to LP Cash
        BatchTransferOp leg1 = findTransferOp(ops, USER_CASH_ACCOUNT, LP_CASH_ACCOUNT);
        assertNotNull(leg1, "Should have transfer from user cash to LP cash");
        assertEquals(new BigDecimal("102500"), leg1.amount()); // 100000 + 500 + 2000

        // Leg 2: LP delivers tokens to user
        BatchTransferOp leg2 = findTransferOp(ops, LP_ASSET_ACCOUNT, USER_ASSET_ACCOUNT);
        assertNotNull(leg2, "Should have transfer from LP asset to user asset");
        assertEquals(units, leg2.amount());

        // No spread transfer (spread is zero)
        assertNull(findTransferOp(ops, LP_CASH_ACCOUNT, LP_SPREAD_ACCOUNT),
                "No spread transfer when spread is zero");

        // Leg 4: Fee sweep to fee collection
        BatchTransferOp feeTransfer = findTransferOp(ops, LP_CASH_ACCOUNT, FEE_COLLECTION_ACCOUNT);
        assertNotNull(feeTransfer, "Should have fee transfer to fee collection");
        assertEquals(fee, feeTransfer.amount());

        // Leg 5: Registration duty sweep to tax authority
        BatchTransferOp taxTransfer = findTransferOp(ops, LP_CASH_ACCOUNT, TAX_REG_DUTY_ACCOUNT);
        assertNotNull(taxTransfer, "Should have registration duty transfer");
        assertEquals(registrationDuty, taxTransfer.amount());

        // Journal Entry: DR Fund Source, CR Platform Fee Income (GL 88)
        BatchJournalEntryOp feeJe = findJournalEntryOp(ops, FUND_SOURCE_GL_ID, PLATFORM_FEE_INCOME_GL_ID);
        assertNotNull(feeJe, "Should have fee income journal entry");
        assertEquals(fee, feeJe.amount());
        assertEquals("XAF", feeJe.currencyCode());

        // Journal Entry: DR Tax Expense Reg Duty (GL 92), CR Fund Source
        BatchJournalEntryOp regDutyJe = findJournalEntryOp(ops, TAX_EXPENSE_REG_DUTY_GL_ID, FUND_SOURCE_GL_ID);
        assertNotNull(regDutyJe, "Should have reg duty expense journal entry");
        assertEquals(registrationDuty, regDutyJe.amount());

        // No capital gains journal entry
        assertNull(findJournalEntryOp(ops, TAX_EXPENSE_CGT_GL_ID, FUND_SOURCE_GL_ID),
                "No CGT journal entry when capital gains tax is zero");
    }

    // -------------------------------------------------------------------------
    // BUY with fee, spread, and registration duty
    // -------------------------------------------------------------------------

    @Test
    @SuppressWarnings("unchecked")
    void buildBatchOperations_buyWithFeeSpreadAndRegDuty_includesSpreadOps() throws Exception {
        BigDecimal grossAmount = new BigDecimal("100000");
        BigDecimal units = new BigDecimal("10");
        BigDecimal fee = new BigDecimal("500");
        BigDecimal spreadAmount = new BigDecimal("5000");
        BigDecimal buybackPremium = BigDecimal.ZERO;
        BigDecimal registrationDuty = new BigDecimal("2000");
        BigDecimal capitalGainsTax = BigDecimal.ZERO;

        List<BatchOperation> ops = (List<BatchOperation>) buildBatchOps.invoke(tradingService,
                TradeSide.BUY, testAsset, USER_CASH_ACCOUNT, USER_ASSET_ACCOUNT,
                grossAmount, units, fee, spreadAmount, buybackPremium, FEE_COLLECTION_ACCOUNT,
                registrationDuty, capitalGainsTax,
                "order-test-001", 42L);

        // Leg 1: User pays total to LP Cash
        BatchTransferOp leg1 = findTransferOp(ops, USER_CASH_ACCOUNT, LP_CASH_ACCOUNT);
        assertEquals(new BigDecimal("102500"), leg1.amount()); // 100000 + 500 + 2000

        // Leg 3: Spread sweep LP Cash -> LP Spread
        BatchTransferOp spreadTransfer = findTransferOp(ops, LP_CASH_ACCOUNT, LP_SPREAD_ACCOUNT);
        assertNotNull(spreadTransfer, "Should have spread transfer when spread > 0 and enabled");
        assertEquals(spreadAmount, spreadTransfer.amount());

        // Journal Entry: DR Fund Source, CR Spread Income (GL 89)
        BatchJournalEntryOp spreadJe = findJournalEntryOp(ops, FUND_SOURCE_GL_ID, SPREAD_INCOME_GL_ID);
        assertNotNull(spreadJe, "Should have spread income journal entry");
        assertEquals(spreadAmount, spreadJe.amount());
        assertEquals("XAF", spreadJe.currencyCode());

        // Fee and reg duty journal entries still present
        assertNotNull(findJournalEntryOp(ops, FUND_SOURCE_GL_ID, PLATFORM_FEE_INCOME_GL_ID));
        assertNotNull(findJournalEntryOp(ops, TAX_EXPENSE_REG_DUTY_GL_ID, FUND_SOURCE_GL_ID));
    }

    // -------------------------------------------------------------------------
    // SELL with fee, registration duty, and capital gains tax
    // -------------------------------------------------------------------------

    @Test
    @SuppressWarnings("unchecked")
    void buildBatchOperations_sellWithFeeRegDutyAndCgt_producesCorrectOps() throws Exception {
        BigDecimal grossAmount = new BigDecimal("120000");
        BigDecimal units = new BigDecimal("10");
        BigDecimal fee = new BigDecimal("600");
        BigDecimal spreadAmount = BigDecimal.ZERO;
        BigDecimal buybackPremium = BigDecimal.ZERO;
        BigDecimal registrationDuty = new BigDecimal("2400");
        BigDecimal capitalGainsTax = new BigDecimal("3300");

        List<BatchOperation> ops = (List<BatchOperation>) buildBatchOps.invoke(tradingService,
                TradeSide.SELL, testAsset, USER_CASH_ACCOUNT, USER_ASSET_ACCOUNT,
                grossAmount, units, fee, spreadAmount, buybackPremium, FEE_COLLECTION_ACCOUNT,
                registrationDuty, capitalGainsTax,
                "order-test-001", 42L);

        // Leg 1: User returns tokens
        BatchTransferOp tokenReturn = findTransferOp(ops, USER_ASSET_ACCOUNT, LP_ASSET_ACCOUNT);
        assertNotNull(tokenReturn, "Should have token return transfer");
        assertEquals(units, tokenReturn.amount());

        // Leg 3: LP Cash pays net proceeds to user (gross - fee - totalTax)
        BatchTransferOp proceeds = findTransferOp(ops, LP_CASH_ACCOUNT, USER_CASH_ACCOUNT);
        assertNotNull(proceeds, "Should have proceeds transfer to user");
        // 120000 - 600 - (2400 + 3300) = 113700
        assertEquals(new BigDecimal("113700"), proceeds.amount());

        // Leg 4: Fee sweep
        BatchTransferOp feeTransfer = findTransferOp(ops, LP_CASH_ACCOUNT, FEE_COLLECTION_ACCOUNT);
        assertNotNull(feeTransfer, "Should have fee transfer");
        assertEquals(fee, feeTransfer.amount());

        // Leg 6: Registration duty to tax authority
        BatchTransferOp regDutyTransfer = findTransferOp(ops, LP_CASH_ACCOUNT, TAX_REG_DUTY_ACCOUNT);
        assertNotNull(regDutyTransfer, "Should have reg duty transfer");
        assertEquals(registrationDuty, regDutyTransfer.amount());

        // Leg 7: Capital gains tax to tax authority
        BatchTransferOp cgtTransfer = findTransferOp(ops, LP_CASH_ACCOUNT, TAX_CGT_ACCOUNT);
        assertNotNull(cgtTransfer, "Should have CGT transfer");
        assertEquals(capitalGainsTax, cgtTransfer.amount());

        // Journal Entry: DR Fund Source, CR Platform Fee Income (GL 88)
        BatchJournalEntryOp feeJe = findJournalEntryOp(ops, FUND_SOURCE_GL_ID, PLATFORM_FEE_INCOME_GL_ID);
        assertNotNull(feeJe, "Should have fee income journal entry");
        assertEquals(fee, feeJe.amount());

        // Journal Entry: DR Tax Expense Reg Duty (GL 92), CR Fund Source
        BatchJournalEntryOp regDutyJe = findJournalEntryOp(ops, TAX_EXPENSE_REG_DUTY_GL_ID, FUND_SOURCE_GL_ID);
        assertNotNull(regDutyJe, "Should have reg duty expense journal entry");
        assertEquals(registrationDuty, regDutyJe.amount());

        // Journal Entry: DR Tax Expense CGT (GL 93), CR Fund Source
        BatchJournalEntryOp cgtJe = findJournalEntryOp(ops, TAX_EXPENSE_CGT_GL_ID, FUND_SOURCE_GL_ID);
        assertNotNull(cgtJe, "Should have CGT expense journal entry");
        assertEquals(capitalGainsTax, cgtJe.amount());
    }

    // -------------------------------------------------------------------------
    // SELL with spread (bid < issuer, spread collected on sell)
    // -------------------------------------------------------------------------

    @Test
    @SuppressWarnings("unchecked")
    void buildBatchOperations_sellWithSpread_includesSpreadTransferAndJournal() throws Exception {
        BigDecimal grossAmount = new BigDecimal("90000");
        BigDecimal units = new BigDecimal("10");
        BigDecimal fee = new BigDecimal("450");
        BigDecimal spreadAmount = new BigDecimal("5000"); // bid < issuer
        BigDecimal buybackPremium = BigDecimal.ZERO;
        BigDecimal registrationDuty = new BigDecimal("1800");
        BigDecimal capitalGainsTax = BigDecimal.ZERO;

        List<BatchOperation> ops = (List<BatchOperation>) buildBatchOps.invoke(tradingService,
                TradeSide.SELL, testAsset, USER_CASH_ACCOUNT, USER_ASSET_ACCOUNT,
                grossAmount, units, fee, spreadAmount, buybackPremium, FEE_COLLECTION_ACCOUNT,
                registrationDuty, capitalGainsTax,
                "order-test-001", 42L);

        // Spread sweep: LP Cash -> LP Spread
        BatchTransferOp spreadTransfer = findTransferOp(ops, LP_CASH_ACCOUNT, LP_SPREAD_ACCOUNT);
        assertNotNull(spreadTransfer, "Should have spread transfer on sell");
        assertEquals(spreadAmount, spreadTransfer.amount());

        // Spread journal entry
        BatchJournalEntryOp spreadJe = findJournalEntryOp(ops, FUND_SOURCE_GL_ID, SPREAD_INCOME_GL_ID);
        assertNotNull(spreadJe, "Should have spread income journal entry");
        assertEquals(spreadAmount, spreadJe.amount());
    }

    // -------------------------------------------------------------------------
    // SELL with buyback premium (bid > issuer, premium funded from LP Spread)
    // -------------------------------------------------------------------------

    @Test
    @SuppressWarnings("unchecked")
    void buildBatchOperations_sellWithBuybackPremium_fundsFromLpSpread() throws Exception {
        BigDecimal grossAmount = new BigDecimal("110000");
        BigDecimal units = new BigDecimal("10");
        BigDecimal fee = new BigDecimal("550");
        BigDecimal spreadAmount = BigDecimal.ZERO;
        BigDecimal buybackPremium = new BigDecimal("10000"); // bid > issuer
        BigDecimal registrationDuty = new BigDecimal("2200");
        BigDecimal capitalGainsTax = BigDecimal.ZERO;

        List<BatchOperation> ops = (List<BatchOperation>) buildBatchOps.invoke(tradingService,
                TradeSide.SELL, testAsset, USER_CASH_ACCOUNT, USER_ASSET_ACCOUNT,
                grossAmount, units, fee, spreadAmount, buybackPremium, FEE_COLLECTION_ACCOUNT,
                registrationDuty, capitalGainsTax,
                "order-test-001", 42L);

        // Buyback premium: LP Spread -> LP Cash
        BatchTransferOp premiumTransfer = findTransferOp(ops, LP_SPREAD_ACCOUNT, LP_CASH_ACCOUNT);
        assertNotNull(premiumTransfer, "Should have buyback premium transfer from LP Spread");
        assertEquals(buybackPremium, premiumTransfer.amount());

        // Journal Entry: DR Spread Income (GL 89), CR Fund Source — reverses spread income
        BatchJournalEntryOp premiumJe = findJournalEntryOp(ops, SPREAD_INCOME_GL_ID, FUND_SOURCE_GL_ID);
        assertNotNull(premiumJe, "Should have buyback premium spread income reversal journal entry");
        assertEquals(buybackPremium, premiumJe.amount());
        assertTrue(premiumJe.comments().contains("Buyback premium"), "Comment should describe buyback premium");
    }

    // -------------------------------------------------------------------------
    // BUY with zero fee - no fee transfer or journal entry
    // -------------------------------------------------------------------------

    @Test
    @SuppressWarnings("unchecked")
    void buildBatchOperations_buyWithZeroFee_noFeeOps() throws Exception {
        BigDecimal grossAmount = new BigDecimal("50000");
        BigDecimal units = new BigDecimal("5");
        BigDecimal fee = BigDecimal.ZERO;
        BigDecimal spreadAmount = BigDecimal.ZERO;
        BigDecimal buybackPremium = BigDecimal.ZERO;
        BigDecimal registrationDuty = BigDecimal.ZERO;
        BigDecimal capitalGainsTax = BigDecimal.ZERO;

        List<BatchOperation> ops = (List<BatchOperation>) buildBatchOps.invoke(tradingService,
                TradeSide.BUY, testAsset, USER_CASH_ACCOUNT, USER_ASSET_ACCOUNT,
                grossAmount, units, fee, spreadAmount, buybackPremium, FEE_COLLECTION_ACCOUNT,
                registrationDuty, capitalGainsTax,
                "order-test-001", 42L);

        // Should only have 2 transfer ops (user->LP cash, LP asset->user asset)
        long transferCount = ops.stream().filter(op -> op instanceof BatchTransferOp).count();
        assertEquals(2, transferCount, "Only cash and asset transfers when no fee/tax/spread");

        // No journal entries at all
        long journalCount = ops.stream().filter(op -> op instanceof BatchJournalEntryOp).count();
        assertEquals(0, journalCount, "No journal entries when no fee/tax/spread");
    }

    // -------------------------------------------------------------------------
    // Spread disabled (LP spread account null) - spread ops skipped
    // -------------------------------------------------------------------------

    @Test
    @SuppressWarnings("unchecked")
    void buildBatchOperations_spreadDisabledNullAccount_noSpreadOps() throws Exception {
        // Asset with no spread account
        Asset noSpreadAsset = Asset.builder()
                .id("asset-no-spread")
                .symbol("NSP")
                .name("No Spread Asset")
                .lpCashAccountId(LP_CASH_ACCOUNT)
                .lpAssetAccountId(LP_ASSET_ACCOUNT)
                .lpSpreadAccountId(null)
                .build();

        BigDecimal grossAmount = new BigDecimal("100000");
        BigDecimal units = new BigDecimal("10");
        BigDecimal fee = new BigDecimal("500");
        BigDecimal spreadAmount = new BigDecimal("5000"); // non-zero but spread disabled
        BigDecimal buybackPremium = BigDecimal.ZERO;
        BigDecimal registrationDuty = BigDecimal.ZERO;
        BigDecimal capitalGainsTax = BigDecimal.ZERO;

        List<BatchOperation> ops = (List<BatchOperation>) buildBatchOps.invoke(tradingService,
                TradeSide.BUY, noSpreadAsset, USER_CASH_ACCOUNT, USER_ASSET_ACCOUNT,
                grossAmount, units, fee, spreadAmount, buybackPremium, FEE_COLLECTION_ACCOUNT,
                registrationDuty, capitalGainsTax,
                "order-test-001", 42L);

        // No spread transfer
        assertNull(findTransferOp(ops, LP_CASH_ACCOUNT, LP_SPREAD_ACCOUNT),
                "No spread transfer when spread is disabled");

        // No spread journal entry
        assertNull(findJournalEntryOp(ops, FUND_SOURCE_GL_ID, SPREAD_INCOME_GL_ID),
                "No spread journal entry when spread is disabled");
    }

    // -------------------------------------------------------------------------
    // Journal entry comments contain trade side and symbol
    // -------------------------------------------------------------------------

    @Test
    @SuppressWarnings("unchecked")
    void buildBatchOperations_buyJournalEntries_commentsContainBuyAndSymbol() throws Exception {
        BigDecimal grossAmount = new BigDecimal("100000");
        BigDecimal units = new BigDecimal("10");
        BigDecimal fee = new BigDecimal("500");

        List<BatchOperation> ops = (List<BatchOperation>) buildBatchOps.invoke(tradingService,
                TradeSide.BUY, testAsset, USER_CASH_ACCOUNT, USER_ASSET_ACCOUNT,
                grossAmount, units, fee, BigDecimal.ZERO, BigDecimal.ZERO, FEE_COLLECTION_ACCOUNT,
                BigDecimal.ZERO, BigDecimal.ZERO,
                "order-test-001", 42L);

        BatchJournalEntryOp feeJe = findJournalEntryOp(ops, FUND_SOURCE_GL_ID, PLATFORM_FEE_INCOME_GL_ID);
        assertNotNull(feeJe);
        assertTrue(feeJe.comments().contains("BUY"), "Comment should contain trade side");
        assertTrue(feeJe.comments().contains("TST"), "Comment should contain asset symbol");
        assertTrue(feeJe.comments().contains("order-test-001"), "Comment should contain orderId");
        assertTrue(feeJe.comments().contains("42"), "Comment should contain userId");
    }

    @Test
    @SuppressWarnings("unchecked")
    void buildBatchOperations_sellJournalEntries_commentsContainSellAndSymbol() throws Exception {
        BigDecimal grossAmount = new BigDecimal("100000");
        BigDecimal units = new BigDecimal("10");
        BigDecimal fee = new BigDecimal("500");

        List<BatchOperation> ops = (List<BatchOperation>) buildBatchOps.invoke(tradingService,
                TradeSide.SELL, testAsset, USER_CASH_ACCOUNT, USER_ASSET_ACCOUNT,
                grossAmount, units, fee, BigDecimal.ZERO, BigDecimal.ZERO, FEE_COLLECTION_ACCOUNT,
                BigDecimal.ZERO, BigDecimal.ZERO,
                "order-test-001", 42L);

        BatchJournalEntryOp feeJe = findJournalEntryOp(ops, FUND_SOURCE_GL_ID, PLATFORM_FEE_INCOME_GL_ID);
        assertNotNull(feeJe);
        assertTrue(feeJe.comments().contains("SELL"), "Comment should contain trade side");
        assertTrue(feeJe.comments().contains("TST"), "Comment should contain asset symbol");
        assertTrue(feeJe.comments().contains("order-test-001"), "Comment should contain orderId");
        assertTrue(feeJe.comments().contains("42"), "Comment should contain userId");
    }

    // -------------------------------------------------------------------------
    // Full scenario: SELL with all components (fee, spread, reg duty, CGT)
    // -------------------------------------------------------------------------

    @Test
    @SuppressWarnings("unchecked")
    void buildBatchOperations_sellWithAllComponents_producesCompleteOpsList() throws Exception {
        BigDecimal grossAmount = new BigDecimal("150000");
        BigDecimal units = new BigDecimal("15");
        BigDecimal fee = new BigDecimal("750");
        BigDecimal spreadAmount = new BigDecimal("7500");
        BigDecimal buybackPremium = BigDecimal.ZERO;
        BigDecimal registrationDuty = new BigDecimal("3000");
        BigDecimal capitalGainsTax = new BigDecimal("8250");

        List<BatchOperation> ops = (List<BatchOperation>) buildBatchOps.invoke(tradingService,
                TradeSide.SELL, testAsset, USER_CASH_ACCOUNT, USER_ASSET_ACCOUNT,
                grossAmount, units, fee, spreadAmount, buybackPremium, FEE_COLLECTION_ACCOUNT,
                registrationDuty, capitalGainsTax,
                "order-test-001", 42L);

        // Count operations by type
        long transferCount = ops.stream().filter(op -> op instanceof BatchTransferOp).count();
        long journalCount = ops.stream().filter(op -> op instanceof BatchJournalEntryOp).count();

        // Transfers: token return, proceeds, fee sweep, spread sweep, reg duty, CGT = 6
        assertEquals(6, transferCount, "Should have 6 transfer operations");

        // Journal entries: fee income, spread income, reg duty expense, CGT expense = 4
        assertEquals(4, journalCount, "Should have 4 journal entry operations");

        // Verify net proceeds calculation: gross - fee - (regDuty + CGT)
        BatchTransferOp proceeds = findTransferOp(ops, LP_CASH_ACCOUNT, USER_CASH_ACCOUNT);
        // 150000 - 750 - (3000 + 8250) = 138000
        assertEquals(new BigDecimal("138000"), proceeds.amount());
    }

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    /**
     * Find a BatchTransferOp matching the given from/to account IDs.
     */
    private BatchTransferOp findTransferOp(List<BatchOperation> ops, Long fromAccountId, Long toAccountId) {
        return ops.stream()
                .filter(op -> op instanceof BatchTransferOp)
                .map(op -> (BatchTransferOp) op)
                .filter(t -> t.fromAccountId().equals(fromAccountId) && t.toAccountId().equals(toAccountId))
                .findFirst()
                .orElse(null);
    }

    /**
     * Find a BatchJournalEntryOp matching the given debit/credit GL account IDs.
     */
    private BatchJournalEntryOp findJournalEntryOp(List<BatchOperation> ops, Long debitGlId, Long creditGlId) {
        return ops.stream()
                .filter(op -> op instanceof BatchJournalEntryOp)
                .map(op -> (BatchJournalEntryOp) op)
                .filter(j -> j.debitGlAccountId().equals(debitGlId) && j.creditGlAccountId().equals(creditGlId))
                .findFirst()
                .orElse(null);
    }
}
