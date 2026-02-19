package com.adorsys.fineract.asset.scheduler;

import com.adorsys.fineract.asset.config.AssetServiceConfig;
import com.adorsys.fineract.asset.entity.AssetPrice;
import com.adorsys.fineract.asset.entity.PortfolioSnapshot;
import com.adorsys.fineract.asset.entity.UserPosition;
import com.adorsys.fineract.asset.repository.AssetPriceRepository;
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
import java.time.Instant;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PortfolioSnapshotSchedulerTest {

    @Mock private UserPositionRepository userPositionRepository;
    @Mock private AssetPriceRepository assetPriceRepository;
    @Mock private PortfolioSnapshotRepository portfolioSnapshotRepository;
    @Mock private AssetServiceConfig config;

    @InjectMocks
    private PortfolioSnapshotScheduler scheduler;

    @Captor private ArgumentCaptor<PortfolioSnapshot> snapshotCaptor;

    @Test
    void takeSnapshots_noUsers_skips() {
        when(userPositionRepository.findDistinctUserIdsWithPositions()).thenReturn(List.of());

        scheduler.takeSnapshots();

        verify(portfolioSnapshotRepository, never()).save(any());
    }

    @Test
    void takeSnapshots_singleUser_computesCorrectValues() {
        when(userPositionRepository.findDistinctUserIdsWithPositions()).thenReturn(List.of(42L));

        AssetPrice price = new AssetPrice();
        price.setAssetId("asset-1");
        price.setCurrentPrice(new BigDecimal("150"));
        when(assetPriceRepository.findAll()).thenReturn(List.of(price));

        UserPosition pos = UserPosition.builder()
                .userId(42L)
                .assetId("asset-1")
                .totalUnits(new BigDecimal("10"))
                .totalCostBasis(new BigDecimal("1000"))
                .avgPurchasePrice(new BigDecimal("100"))
                .realizedPnl(BigDecimal.ZERO)
                .fineractSavingsAccountId(200L)
                .lastTradeAt(Instant.now())
                .build();
        when(userPositionRepository.findByUserId(42L)).thenReturn(List.of(pos));
        when(portfolioSnapshotRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        scheduler.takeSnapshots();

        verify(portfolioSnapshotRepository).save(snapshotCaptor.capture());
        PortfolioSnapshot saved = snapshotCaptor.getValue();

        assertThat(saved.getUserId()).isEqualTo(42L);
        // totalValue = 10 * 150 = 1500
        assertThat(saved.getTotalValue()).isEqualByComparingTo("1500");
        assertThat(saved.getTotalCostBasis()).isEqualByComparingTo("1000");
        // unrealizedPnl = 1500 - 1000 = 500
        assertThat(saved.getUnrealizedPnl()).isEqualByComparingTo("500");
        assertThat(saved.getPositionCount()).isEqualTo(1);
    }

    @Test
    void takeSnapshots_oneUserFails_otherStillProcessed() {
        when(userPositionRepository.findDistinctUserIdsWithPositions()).thenReturn(List.of(1L, 2L));

        AssetPrice price = new AssetPrice();
        price.setAssetId("a");
        price.setCurrentPrice(new BigDecimal("100"));
        when(assetPriceRepository.findAll()).thenReturn(List.of(price));

        // User 1 throws
        when(userPositionRepository.findByUserId(1L)).thenThrow(new RuntimeException("DB error"));

        // User 2 succeeds
        UserPosition pos = UserPosition.builder()
                .userId(2L).assetId("a").totalUnits(new BigDecimal("5"))
                .totalCostBasis(new BigDecimal("400")).avgPurchasePrice(new BigDecimal("80"))
                .realizedPnl(BigDecimal.ZERO).fineractSavingsAccountId(300L)
                .lastTradeAt(Instant.now()).build();
        when(userPositionRepository.findByUserId(2L)).thenReturn(List.of(pos));
        when(portfolioSnapshotRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        scheduler.takeSnapshots();

        // Only user 2's snapshot should be saved
        verify(portfolioSnapshotRepository, times(1)).save(any());
    }
}
