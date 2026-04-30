package com.adorsys.fineract.asset.service;

import com.adorsys.fineract.asset.dto.BondType;
import com.adorsys.fineract.asset.dto.RedemptionDetailResponse;
import com.adorsys.fineract.asset.entity.Asset;
import com.adorsys.fineract.asset.entity.PrincipalRedemption;
import com.adorsys.fineract.asset.entity.UserPosition;
import com.adorsys.fineract.asset.exception.AssetException;
import com.adorsys.fineract.asset.repository.AssetPriceRepository;
import com.adorsys.fineract.asset.repository.AssetRepository;
import com.adorsys.fineract.asset.repository.CategorySnapshotRepository;
import com.adorsys.fineract.asset.repository.IncomeDistributionRepository;
import com.adorsys.fineract.asset.repository.InterestPaymentRepository;
import com.adorsys.fineract.asset.repository.OrderRepository;
import com.adorsys.fineract.asset.repository.PortfolioSnapshotRepository;
import com.adorsys.fineract.asset.repository.PrincipalRedemptionRepository;
import com.adorsys.fineract.asset.repository.PurchaseLotRepository;
import com.adorsys.fineract.asset.repository.ScheduledPaymentRepository;
import com.adorsys.fineract.asset.repository.TaxTransactionRepository;
import com.adorsys.fineract.asset.repository.UserPositionRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PortfolioServiceTest {

    @Mock private UserPositionRepository userPositionRepository;
    @Mock private AssetRepository assetRepository;
    @Mock private AssetPriceRepository assetPriceRepository;
    @Mock private PurchaseLotRepository purchaseLotRepository;
    @Mock private BondBenefitService bondBenefitService;
    @Mock private IncomeBenefitService incomeBenefitService;
    @Mock private AccruedInterestCalculator accruedInterestCalculator;
    @Mock private PortfolioSnapshotRepository portfolioSnapshotRepository;
    @Mock private CategorySnapshotRepository categorySnapshotRepository;
    @Mock private OrderRepository orderRepository;
    @Mock private InterestPaymentRepository interestPaymentRepository;
    @Mock private IncomeDistributionRepository incomeDistributionRepository;
    @Mock private ScheduledPaymentRepository scheduledPaymentRepository;
    @Mock private TaxTransactionRepository taxTransactionRepository;
    @Mock private TaxService taxService;
    @Mock private PrincipalRedemptionRepository principalRedemptionRepository;

    @InjectMocks
    private PortfolioService portfolioService;

    @Captor private ArgumentCaptor<UserPosition> positionCaptor;

    private static final Long USER_ID = 42L;
    private static final String ASSET_ID = "asset-001";
    private static final Long FINERACT_ACCOUNT_ID = 200L;

    // -------------------------------------------------------------------------
    // updatePositionAfterBuy tests
    // -------------------------------------------------------------------------

    @Test
    void updatePositionAfterBuy_newPosition_createsWithCorrectWAP() {
        // Arrange: no existing position
        when(userPositionRepository.findByUserIdAndAssetId(USER_ID, ASSET_ID))
                .thenReturn(Optional.empty());
        when(userPositionRepository.save(any(UserPosition.class)))
                .thenAnswer(inv -> inv.getArgument(0));

        BigDecimal units = new BigDecimal("10");
        BigDecimal pricePerUnit = new BigDecimal("100");

        // Act
        portfolioService.updatePositionAfterBuy(USER_ID, ASSET_ID, FINERACT_ACCOUNT_ID, units, pricePerUnit, null, null);

        // Assert
        verify(userPositionRepository).save(positionCaptor.capture());
        UserPosition saved = positionCaptor.getValue();

        assertEquals(USER_ID, saved.getUserId());
        assertEquals(ASSET_ID, saved.getAssetId());
        assertEquals(FINERACT_ACCOUNT_ID, saved.getFineractSavingsAccountId());
        // totalUnits = 0 + 10 = 10
        assertEquals(0, new BigDecimal("10").compareTo(saved.getTotalUnits()));
        // totalCostBasis = 0 + (10 * 100) = 1000
        assertEquals(0, new BigDecimal("1000").compareTo(saved.getTotalCostBasis()));
        // avgPurchasePrice = 1000 / 10 = 100.0000
        assertEquals(0, new BigDecimal("100.0000").compareTo(saved.getAvgPurchasePrice()));
        // fees and taxes default to zero when null is passed
        assertEquals(0, BigDecimal.ZERO.compareTo(saved.getTotalFeesPaid()));
        assertEquals(0, BigDecimal.ZERO.compareTo(saved.getTotalTaxesPaid()));
    }

    @Test
    void updatePositionAfterBuy_existingPosition_recalculatesWAP() {
        // Arrange: existing position with 10 units at avg price 100 (cost basis 1000)
        UserPosition existing = UserPosition.builder()
                .userId(USER_ID)
                .assetId(ASSET_ID)
                .fineractSavingsAccountId(FINERACT_ACCOUNT_ID)
                .totalUnits(new BigDecimal("10"))
                .avgPurchasePrice(new BigDecimal("100"))
                .totalCostBasis(new BigDecimal("1000"))
                .realizedPnl(BigDecimal.ZERO)
                .lastTradeAt(Instant.now())
                .build();

        when(userPositionRepository.findByUserIdAndAssetId(USER_ID, ASSET_ID))
                .thenReturn(Optional.of(existing));
        when(userPositionRepository.save(any(UserPosition.class)))
                .thenAnswer(inv -> inv.getArgument(0));

        BigDecimal newUnits = new BigDecimal("5");
        BigDecimal newPricePerUnit = new BigDecimal("120");

        // Act
        portfolioService.updatePositionAfterBuy(USER_ID, ASSET_ID, FINERACT_ACCOUNT_ID, newUnits, newPricePerUnit, null, null);

        // Assert
        verify(userPositionRepository).save(positionCaptor.capture());
        UserPosition saved = positionCaptor.getValue();

        // newTotalUnits = 10 + 5 = 15
        assertEquals(0, new BigDecimal("15").compareTo(saved.getTotalUnits()));
        // newTotalCost = 1000 + (5 * 120) = 1000 + 600 = 1600
        assertEquals(0, new BigDecimal("1600").compareTo(saved.getTotalCostBasis()));
        // newAvgPrice = 1600 / 15 = 106.6667
        BigDecimal expectedWap = new BigDecimal("1600").divide(new BigDecimal("15"), 4, RoundingMode.HALF_UP);
        assertEquals(0, expectedWap.compareTo(saved.getAvgPurchasePrice()));
    }

    @Test
    void updatePositionAfterBuy_accumulatesFeesAndTaxesAcrossMultipleTrades() {
        // Arrange: existing position that already has fees/taxes from a prior trade
        UserPosition existing = UserPosition.builder()
                .userId(USER_ID)
                .assetId(ASSET_ID)
                .fineractSavingsAccountId(FINERACT_ACCOUNT_ID)
                .totalUnits(new BigDecimal("10"))
                .avgPurchasePrice(new BigDecimal("100"))
                .totalCostBasis(new BigDecimal("1000"))
                .realizedPnl(BigDecimal.ZERO)
                .totalFeesPaid(new BigDecimal("500"))
                .totalTaxesPaid(new BigDecimal("200"))
                .lastTradeAt(Instant.now())
                .build();

        when(userPositionRepository.findByUserIdAndAssetId(USER_ID, ASSET_ID))
                .thenReturn(Optional.of(existing));
        when(userPositionRepository.save(any(UserPosition.class)))
                .thenAnswer(inv -> inv.getArgument(0));

        BigDecimal fee = new BigDecimal("150");
        BigDecimal tax = new BigDecimal("75");

        // Act
        portfolioService.updatePositionAfterBuy(USER_ID, ASSET_ID, FINERACT_ACCOUNT_ID,
                new BigDecimal("5"), new BigDecimal("100"), fee, tax);

        // Assert: fees and taxes are cumulative
        verify(userPositionRepository).save(positionCaptor.capture());
        UserPosition saved = positionCaptor.getValue();
        assertEquals(0, new BigDecimal("650").compareTo(saved.getTotalFeesPaid()),
                "totalFeesPaid should be 500 + 150 = 650");
        assertEquals(0, new BigDecimal("275").compareTo(saved.getTotalTaxesPaid()),
                "totalTaxesPaid should be 200 + 75 = 275");
    }

    @Test
    void updatePositionAfterBuy_nullFeesOnExistingPosition_treatedAsZero() {
        // Arrange: existing position loaded from DB before migration (null fees/taxes)
        UserPosition existing = UserPosition.builder()
                .userId(USER_ID)
                .assetId(ASSET_ID)
                .fineractSavingsAccountId(FINERACT_ACCOUNT_ID)
                .totalUnits(new BigDecimal("10"))
                .avgPurchasePrice(new BigDecimal("100"))
                .totalCostBasis(new BigDecimal("1000"))
                .realizedPnl(BigDecimal.ZERO)
                // totalFeesPaid and totalTaxesPaid intentionally left null (pre-migration entity)
                .lastTradeAt(Instant.now())
                .build();

        when(userPositionRepository.findByUserIdAndAssetId(USER_ID, ASSET_ID))
                .thenReturn(Optional.of(existing));
        when(userPositionRepository.save(any(UserPosition.class)))
                .thenAnswer(inv -> inv.getArgument(0));

        // Act: pass a non-null fee — must not NPE
        assertDoesNotThrow(() ->
                portfolioService.updatePositionAfterBuy(USER_ID, ASSET_ID, FINERACT_ACCOUNT_ID,
                        new BigDecimal("5"), new BigDecimal("100"),
                        new BigDecimal("100"), new BigDecimal("40")));

        verify(userPositionRepository).save(positionCaptor.capture());
        UserPosition saved = positionCaptor.getValue();
        assertEquals(0, new BigDecimal("100").compareTo(saved.getTotalFeesPaid()));
        assertEquals(0, new BigDecimal("40").compareTo(saved.getTotalTaxesPaid()));
    }

    // -------------------------------------------------------------------------
    // updatePositionAfterSell tests
    // -------------------------------------------------------------------------

    @Test
    void updatePositionAfterSell_calculatesCorrectPnl() {
        // Arrange: position with 20 units at avg price 100 (cost basis 2000)
        UserPosition existing = UserPosition.builder()
                .userId(USER_ID)
                .assetId(ASSET_ID)
                .fineractSavingsAccountId(FINERACT_ACCOUNT_ID)
                .totalUnits(new BigDecimal("20"))
                .avgPurchasePrice(new BigDecimal("100"))
                .totalCostBasis(new BigDecimal("2000"))
                .realizedPnl(BigDecimal.ZERO)
                .lastTradeAt(Instant.now())
                .build();

        when(userPositionRepository.findByUserIdAndAssetId(USER_ID, ASSET_ID))
                .thenReturn(Optional.of(existing));
        when(userPositionRepository.save(any(UserPosition.class)))
                .thenAnswer(inv -> inv.getArgument(0));

        BigDecimal sellUnits = new BigDecimal("5");
        BigDecimal sellPricePerUnit = new BigDecimal("120");

        // Act
        BigDecimal realizedPnl = portfolioService.updatePositionAfterSell(
                USER_ID, ASSET_ID, sellUnits, sellPricePerUnit, null, null);

        // Assert: P&L = (120 - 100) * 5 = 100
        assertEquals(0, new BigDecimal("100").compareTo(realizedPnl));

        verify(userPositionRepository).save(positionCaptor.capture());
        UserPosition saved = positionCaptor.getValue();

        // totalUnits = 20 - 5 = 15
        assertEquals(0, new BigDecimal("15").compareTo(saved.getTotalUnits()));
        // costReduction = 100 * 5 = 500; newTotalCost = 2000 - 500 = 1500
        assertEquals(0, new BigDecimal("1500").compareTo(saved.getTotalCostBasis()));
        // avgPurchasePrice stays the same on sell
        assertEquals(0, new BigDecimal("100").compareTo(saved.getAvgPurchasePrice()));
        // cumulative realized P&L = 0 + 100 = 100
        assertEquals(0, new BigDecimal("100").compareTo(saved.getRealizedPnl()));
    }

    @Test
    void updatePositionAfterSell_accumulatesFeesAndTaxes() {
        // Arrange: position with existing fees/taxes
        UserPosition existing = UserPosition.builder()
                .userId(USER_ID)
                .assetId(ASSET_ID)
                .fineractSavingsAccountId(FINERACT_ACCOUNT_ID)
                .totalUnits(new BigDecimal("20"))
                .avgPurchasePrice(new BigDecimal("100"))
                .totalCostBasis(new BigDecimal("2000"))
                .realizedPnl(BigDecimal.ZERO)
                .totalFeesPaid(new BigDecimal("300"))
                .totalTaxesPaid(new BigDecimal("100"))
                .lastTradeAt(Instant.now())
                .build();

        when(userPositionRepository.findByUserIdAndAssetId(USER_ID, ASSET_ID))
                .thenReturn(Optional.of(existing));
        when(userPositionRepository.save(any(UserPosition.class)))
                .thenAnswer(inv -> inv.getArgument(0));

        // Act: sell 5 units with fee=80 and tax=40
        portfolioService.updatePositionAfterSell(
                USER_ID, ASSET_ID, new BigDecimal("5"), new BigDecimal("120"),
                new BigDecimal("80"), new BigDecimal("40"));

        // Assert: cumulative totals updated
        verify(userPositionRepository).save(positionCaptor.capture());
        UserPosition saved = positionCaptor.getValue();
        assertEquals(0, new BigDecimal("380").compareTo(saved.getTotalFeesPaid()),
                "totalFeesPaid should be 300 + 80 = 380");
        assertEquals(0, new BigDecimal("140").compareTo(saved.getTotalTaxesPaid()),
                "totalTaxesPaid should be 100 + 40 = 140");
    }

    @Test
    void updatePositionAfterSell_nullFeeAndTaxPassedForSystemRedemption_treatedAsZero() {
        // Arrange: system-initiated redemption (delisting/bond maturity) passes null fees
        UserPosition existing = UserPosition.builder()
                .userId(USER_ID)
                .assetId(ASSET_ID)
                .fineractSavingsAccountId(FINERACT_ACCOUNT_ID)
                .totalUnits(new BigDecimal("10"))
                .avgPurchasePrice(new BigDecimal("900"))
                .totalCostBasis(new BigDecimal("9000"))
                .realizedPnl(BigDecimal.ZERO)
                .totalFeesPaid(new BigDecimal("450"))
                .totalTaxesPaid(new BigDecimal("180"))
                .lastTradeAt(Instant.now())
                .build();

        when(userPositionRepository.findByUserIdAndAssetId(USER_ID, ASSET_ID))
                .thenReturn(Optional.of(existing));
        when(userPositionRepository.save(any(UserPosition.class)))
                .thenAnswer(inv -> inv.getArgument(0));

        // Act: system redemption — no fees/taxes
        portfolioService.updatePositionAfterSell(
                USER_ID, ASSET_ID, new BigDecimal("10"), new BigDecimal("1000"),
                null, null);

        // Assert: fee/tax totals are unchanged (null treated as zero)
        verify(userPositionRepository).save(positionCaptor.capture());
        UserPosition saved = positionCaptor.getValue();
        assertEquals(0, new BigDecimal("450").compareTo(saved.getTotalFeesPaid()),
                "totalFeesPaid should not change when null is passed");
        assertEquals(0, new BigDecimal("180").compareTo(saved.getTotalTaxesPaid()),
                "totalTaxesPaid should not change when null is passed");
    }

    @Test
    void updatePositionAfterSell_nullFeesOnExistingEntity_handledGracefully() {
        // Arrange: entity loaded from DB before V16 migration ran (null fees/taxes fields)
        UserPosition existing = UserPosition.builder()
                .userId(USER_ID)
                .assetId(ASSET_ID)
                .fineractSavingsAccountId(FINERACT_ACCOUNT_ID)
                .totalUnits(new BigDecimal("10"))
                .avgPurchasePrice(new BigDecimal("100"))
                .totalCostBasis(new BigDecimal("1000"))
                .realizedPnl(BigDecimal.ZERO)
                // totalFeesPaid / totalTaxesPaid left null (pre-migration state)
                .lastTradeAt(Instant.now())
                .build();

        when(userPositionRepository.findByUserIdAndAssetId(USER_ID, ASSET_ID))
                .thenReturn(Optional.of(existing));
        when(userPositionRepository.save(any(UserPosition.class)))
                .thenAnswer(inv -> inv.getArgument(0));

        // Act: must not NPE despite null entity fields
        assertDoesNotThrow(() ->
                portfolioService.updatePositionAfterSell(
                        USER_ID, ASSET_ID, new BigDecimal("5"), new BigDecimal("110"),
                        new BigDecimal("55"), new BigDecimal("22")));

        verify(userPositionRepository).save(positionCaptor.capture());
        UserPosition saved = positionCaptor.getValue();
        assertEquals(0, new BigDecimal("55").compareTo(saved.getTotalFeesPaid()));
        assertEquals(0, new BigDecimal("22").compareTo(saved.getTotalTaxesPaid()));
    }

    @Test
    void updatePositionAfterSell_preventsNegativeUnits() {
        // Arrange: position with 3 units, try to sell 10
        UserPosition existing = UserPosition.builder()
                .userId(USER_ID)
                .assetId(ASSET_ID)
                .fineractSavingsAccountId(FINERACT_ACCOUNT_ID)
                .totalUnits(new BigDecimal("3"))
                .avgPurchasePrice(new BigDecimal("100"))
                .totalCostBasis(new BigDecimal("300"))
                .realizedPnl(BigDecimal.ZERO)
                .lastTradeAt(Instant.now())
                .build();

        when(userPositionRepository.findByUserIdAndAssetId(USER_ID, ASSET_ID))
                .thenReturn(Optional.of(existing));

        BigDecimal sellUnits = new BigDecimal("10");
        BigDecimal sellPricePerUnit = new BigDecimal("120");

        // Act & Assert
        IllegalStateException ex = assertThrows(IllegalStateException.class,
                () -> portfolioService.updatePositionAfterSell(
                        USER_ID, ASSET_ID, sellUnits, sellPricePerUnit, null, null));
        assertTrue(ex.getMessage().contains("negative units"));

        // Verify position was NOT saved
        verify(userPositionRepository, never()).save(any());
    }

    // -------------------------------------------------------------------------
    // getRedemption — drives mobile screen 09b (BTA maturity confirmation).
    // Authorization is load-bearing: a stranger must not be able to read another
    // user's redemption breakdown by guessing a numeric ID.
    // -------------------------------------------------------------------------

    private static final Long REDEMPTION_ID = 99L;
    private static final Long OTHER_USER_ID = 7L;

    private PrincipalRedemption successRow() {
        return PrincipalRedemption.builder()
                .id(REDEMPTION_ID)
                .assetId(ASSET_ID)
                .userId(USER_ID)
                .units(new BigDecimal("100"))
                .faceValue(new BigDecimal("10000"))
                .grossCashAmount(new BigDecimal("1000000"))
                .avgPurchasePrice(new BigDecimal("9268"))
                .capitalGain(new BigDecimal("73200"))
                .ircmWithheld(new BigDecimal("12078"))
                .ircmRateApplied(new BigDecimal("0.16500000"))
                .cashAmount(new BigDecimal("987922"))
                .realizedPnl(new BigDecimal("60000"))
                .redemptionDate(java.time.LocalDate.of(2027, 4, 15))
                .redeemedAt(Instant.parse("2027-04-15T00:20:00Z"))
                .status("SUCCESS")
                .build();
    }

    @Test
    void getRedemption_happyPath_returnsBreakdownFromPersistedRow() {
        Asset asset = new Asset();
        asset.setId(ASSET_ID);
        asset.setSymbol("BTA_2Y_2027");
        asset.setName("BTA 2Y 2027");
        asset.setBondType(BondType.DISCOUNT);
        asset.setIsinCode("CM0000654321");

        when(principalRedemptionRepository.findById(REDEMPTION_ID))
                .thenReturn(Optional.of(successRow()));
        when(assetRepository.findById(ASSET_ID)).thenReturn(Optional.of(asset));

        RedemptionDetailResponse result = portfolioService.getRedemption(USER_ID, REDEMPTION_ID);

        assertEquals(REDEMPTION_ID, result.id());
        assertEquals("BTA_2Y_2027", result.assetSymbol());
        assertEquals(BondType.DISCOUNT, result.bondType());
        assertEquals(0, result.grossProceeds().compareTo(new BigDecimal("1000000")));
        assertEquals(0, result.capitalGain().compareTo(new BigDecimal("73200")));
        assertEquals(0, result.ircmWithheld().compareTo(new BigDecimal("12078")));
        // F2 fix: netProceeds is the actual transferred amount (cashAmount), NOT
        // the recomputed gross − ircm. They happen to match here, which is the point.
        assertEquals(0, result.netProceeds().compareTo(new BigDecimal("987922")));
        // F7 fix: ircmRate comes from the persisted ircm_rate_applied column,
        // not reconstructed from ircmWithheld / capitalGain.
        assertEquals(0, result.ircmRate().compareTo(new BigDecimal("0.16500000")));
    }

    @Test
    void getRedemption_wrongUser_throws_doesNotLeakOwnership() {
        when(principalRedemptionRepository.findById(REDEMPTION_ID))
                .thenReturn(Optional.of(successRow()));

        AssetException ex = assertThrows(AssetException.class,
                () -> portfolioService.getRedemption(OTHER_USER_ID, REDEMPTION_ID));
        // Same message as the not-found case — prevents user enumeration.
        assertTrue(ex.getMessage().contains("Redemption not found"));
        // Asset lookup must not happen for an unauthorized request.
        verify(assetRepository, never()).findById(any());
    }

    @Test
    void getRedemption_failedStatus_throws_doesNotExposeFailureInternals() {
        PrincipalRedemption failed = successRow();
        failed.setStatus("FAILED");
        failed.setFailureReason("Fineract batch returned 503");
        when(principalRedemptionRepository.findById(REDEMPTION_ID))
                .thenReturn(Optional.of(failed));

        AssetException ex = assertThrows(AssetException.class,
                () -> portfolioService.getRedemption(USER_ID, REDEMPTION_ID));
        // Same opaque message — failureReason is admin-only and must not leak.
        assertTrue(ex.getMessage().contains("Redemption not found"));
        assertFalse(ex.getMessage().contains("503"));
        assertFalse(ex.getMessage().contains("Fineract"));
        verify(assetRepository, never()).findById(any());
    }

    @Test
    void getRedemption_notFound_throws() {
        when(principalRedemptionRepository.findById(REDEMPTION_ID))
                .thenReturn(Optional.empty());

        AssetException ex = assertThrows(AssetException.class,
                () -> portfolioService.getRedemption(USER_ID, REDEMPTION_ID));
        assertTrue(ex.getMessage().contains("Redemption not found"));
    }
}
