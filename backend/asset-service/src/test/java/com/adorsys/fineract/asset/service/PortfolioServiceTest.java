package com.adorsys.fineract.asset.service;

import com.adorsys.fineract.asset.entity.UserPosition;
import com.adorsys.fineract.asset.repository.AssetPriceRepository;
import com.adorsys.fineract.asset.repository.AssetRepository;
import com.adorsys.fineract.asset.repository.PortfolioSnapshotRepository;
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
    @Mock private BondBenefitService bondBenefitService;
    @Mock private PortfolioSnapshotRepository portfolioSnapshotRepository;

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
        portfolioService.updatePositionAfterBuy(USER_ID, ASSET_ID, FINERACT_ACCOUNT_ID, units, pricePerUnit);

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
        portfolioService.updatePositionAfterBuy(USER_ID, ASSET_ID, FINERACT_ACCOUNT_ID, newUnits, newPricePerUnit);

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
        BigDecimal realizedPnl = portfolioService.updatePositionAfterSell(USER_ID, ASSET_ID, sellUnits, sellPricePerUnit);

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
                () -> portfolioService.updatePositionAfterSell(USER_ID, ASSET_ID, sellUnits, sellPricePerUnit));
        assertTrue(ex.getMessage().contains("negative units"));

        // Verify position was NOT saved
        verify(userPositionRepository, never()).save(any());
    }
}
