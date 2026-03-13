package com.adorsys.fineract.asset.scheduler;

import com.adorsys.fineract.asset.config.AssetServiceConfig;
import com.adorsys.fineract.asset.entity.Asset;
import com.adorsys.fineract.asset.entity.AssetPrice;
import com.adorsys.fineract.asset.repository.AssetPriceRepository;
import com.adorsys.fineract.asset.repository.AssetRepository;
import com.adorsys.fineract.asset.repository.UserPositionRepository;
import com.adorsys.fineract.asset.service.PortfolioSnapshotWriter;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.ApplicationEventPublisher;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PortfolioSnapshotSchedulerTest {

    @Mock private UserPositionRepository userPositionRepository;
    @Mock private AssetRepository assetRepository;
    @Mock private AssetPriceRepository assetPriceRepository;
    @Mock private PortfolioSnapshotWriter snapshotWriter;
    @Mock private AssetServiceConfig config;
    @Mock private ApplicationEventPublisher eventPublisher;

    @InjectMocks
    private PortfolioSnapshotScheduler scheduler;

    @Test
    void takeSnapshots_noUsers_skips() {
        when(userPositionRepository.findDistinctUserIdsWithPositions()).thenReturn(List.of());

        scheduler.takeSnapshots();

        verify(snapshotWriter, never()).snapshotUser(anyLong(), any(), any(), any());
    }

    @Test
    void takeSnapshots_singleUser_delegatesToWriter() {
        when(userPositionRepository.findDistinctUserIdsWithPositions()).thenReturn(List.of(42L));

        AssetPrice price = new AssetPrice();
        price.setAssetId("asset-1");
        price.setAskPrice(new BigDecimal("150"));
        price.setBidPrice(new BigDecimal("145"));
        when(assetPriceRepository.findAll()).thenReturn(List.of(price));
        when(assetRepository.findAll()).thenReturn(List.of());

        scheduler.takeSnapshots();

        verify(snapshotWriter).snapshotUser(eq(42L), any(LocalDate.class), anyMap(), anyMap());
    }

    @Test
    void takeSnapshots_oneUserFails_otherStillProcessed() {
        when(userPositionRepository.findDistinctUserIdsWithPositions()).thenReturn(List.of(1L, 2L));

        AssetPrice price = new AssetPrice();
        price.setAssetId("a");
        price.setAskPrice(new BigDecimal("100"));
        price.setBidPrice(new BigDecimal("95"));
        when(assetPriceRepository.findAll()).thenReturn(List.of(price));
        when(assetRepository.findAll()).thenReturn(List.of());

        // User 1 throws
        doThrow(new RuntimeException("DB error"))
                .when(snapshotWriter).snapshotUser(eq(1L), any(), any(), any());

        // User 2 succeeds
        doNothing().when(snapshotWriter).snapshotUser(eq(2L), any(), any(), any());

        scheduler.takeSnapshots();

        // Both users should have been attempted
        verify(snapshotWriter).snapshotUser(eq(1L), any(), any(), any());
        verify(snapshotWriter).snapshotUser(eq(2L), any(), any(), any());
    }
}
