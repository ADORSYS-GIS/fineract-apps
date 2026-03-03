package com.adorsys.fineract.asset.service;

import com.adorsys.fineract.asset.dto.LPPerformanceResponse;
import com.adorsys.fineract.asset.entity.Asset;
import com.adorsys.fineract.asset.repository.AssetRepository;
import com.adorsys.fineract.asset.repository.TradeLogRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class LPPerformanceServiceTest {

    @Mock private TradeLogRepository tradeLogRepository;
    @Mock private AssetRepository assetRepository;

    @InjectMocks
    private LPPerformanceService lpPerformanceService;

    @Test
    void getPerformanceSummary_aggregatesTotals() {
        // Total aggregation: spread=1000, buyback=200, fee=300, count=50
        Object[] totals = new Object[]{
                new BigDecimal("1000"), new BigDecimal("200"), new BigDecimal("300"), 50L
        };
        when(tradeLogRepository.aggregateTotalLPPerformance()).thenReturn(totals);

        // Per-asset: one asset
        Object[] assetRow = new Object[]{
                "asset-001", new BigDecimal("1000"), new BigDecimal("200"), new BigDecimal("300"), 50L
        };
        when(tradeLogRepository.aggregateLPPerformanceByAsset()).thenReturn(List.of(assetRow));

        Asset asset = Asset.builder().id("asset-001").symbol("TST").build();
        when(assetRepository.findAllById(List.of("asset-001"))).thenReturn(List.of(asset));

        LPPerformanceResponse result = lpPerformanceService.getPerformanceSummary();

        assertNotNull(result);
        assertEquals(0, new BigDecimal("1000").compareTo(result.totalSpreadEarned()));
        assertEquals(0, new BigDecimal("200").compareTo(result.totalBuybackPremiumPaid()));
        assertEquals(0, new BigDecimal("300").compareTo(result.totalFeeCommission()));
        // netMargin = spread + fee - buyback = 1000 + 300 - 200 = 1100
        assertEquals(0, new BigDecimal("1100").compareTo(result.netMargin()));
        assertEquals(50L, result.totalTrades());

        // Per-asset
        assertEquals(1, result.perAsset().size());
        LPPerformanceResponse.AssetPerformance ap = result.perAsset().get(0);
        assertEquals("asset-001", ap.assetId());
        assertEquals("TST", ap.symbol());
        assertEquals(0, new BigDecimal("1100").compareTo(ap.netMargin()));
    }

    @Test
    void getPerformanceSummary_noTrades_returnsZeros() {
        Object[] totals = new Object[]{
                BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO, 0L
        };
        when(tradeLogRepository.aggregateTotalLPPerformance()).thenReturn(totals);
        when(tradeLogRepository.aggregateLPPerformanceByAsset()).thenReturn(List.of());
        when(assetRepository.findAllById(List.of())).thenReturn(List.of());

        LPPerformanceResponse result = lpPerformanceService.getPerformanceSummary();

        assertNotNull(result);
        assertEquals(0, BigDecimal.ZERO.compareTo(result.totalSpreadEarned()));
        assertEquals(0L, result.totalTrades());
        assertTrue(result.perAsset().isEmpty());
    }

    @Test
    void getPerformanceSummary_missingAsset_symbolIsNull() {
        Object[] totals = new Object[]{
                new BigDecimal("500"), BigDecimal.ZERO, new BigDecimal("100"), 10L
        };
        when(tradeLogRepository.aggregateTotalLPPerformance()).thenReturn(totals);

        Object[] assetRow = new Object[]{
                "deleted-asset", new BigDecimal("500"), BigDecimal.ZERO, new BigDecimal("100"), 10L
        };
        when(tradeLogRepository.aggregateLPPerformanceByAsset()).thenReturn(List.of(assetRow));
        // Asset not found
        when(assetRepository.findAllById(List.of("deleted-asset"))).thenReturn(List.of());

        LPPerformanceResponse result = lpPerformanceService.getPerformanceSummary();

        assertEquals(1, result.perAsset().size());
        assertNull(result.perAsset().get(0).symbol());
    }
}
