package com.adorsys.fineract.asset.service;

import com.adorsys.fineract.asset.dto.AdminDashboardResponse;
import com.adorsys.fineract.asset.dto.AssetStatus;
import com.adorsys.fineract.asset.dto.OrderStatus;
import com.adorsys.fineract.asset.dto.TradeSide;
import com.adorsys.fineract.asset.repository.*;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AdminDashboardServiceTest {

    @Mock private AssetRepository assetRepository;
    @Mock private TradeLogRepository tradeLogRepository;
    @Mock private OrderRepository orderRepository;
    @Mock private ReconciliationReportRepository reconciliationReportRepository;
    @Mock private UserPositionRepository userPositionRepository;

    @InjectMocks private AdminDashboardService dashboardService;

    @Test
    void getSummary_emptyPlatform_returnsZeros() {
        when(assetRepository.count()).thenReturn(0L);
        when(assetRepository.countByStatus(any())).thenReturn(0L);
        when(tradeLogRepository.countByExecutedAtAfter(any())).thenReturn(0L);
        when(tradeLogRepository.sumVolumeBySideSince(any(), any())).thenReturn(BigDecimal.ZERO);
        when(tradeLogRepository.countDistinctTradersSince(any())).thenReturn(0L);
        when(orderRepository.countByStatus(any())).thenReturn(0L);
        when(reconciliationReportRepository.countByStatus(any())).thenReturn(0L);
        when(reconciliationReportRepository.countByStatusAndSeverity(any(), any())).thenReturn(0L);
        when(userPositionRepository.findDistinctUserIdsWithPositions()).thenReturn(List.of());

        AdminDashboardResponse response = dashboardService.getSummary();

        assertThat(response.assets().total()).isZero();
        assertThat(response.assets().active()).isZero();
        assertThat(response.trading().tradeCount24h()).isZero();
        assertThat(response.trading().buyVolume24h()).isEqualByComparingTo(BigDecimal.ZERO);
        assertThat(response.trading().sellVolume24h()).isEqualByComparingTo(BigDecimal.ZERO);
        assertThat(response.orders().needsReconciliation()).isZero();
        assertThat(response.orders().failed()).isZero();
        assertThat(response.reconciliation().openReports()).isZero();
        assertThat(response.activeInvestors()).isZero();
    }

    @Test
    void getSummary_populatedPlatform_returnsCorrectMetrics() {
        when(assetRepository.count()).thenReturn(15L);
        when(assetRepository.countByStatus(AssetStatus.ACTIVE)).thenReturn(12L);
        when(assetRepository.countByStatus(AssetStatus.PENDING)).thenReturn(2L);
        when(assetRepository.countByStatus(AssetStatus.HALTED)).thenReturn(1L);
        when(assetRepository.countByStatus(AssetStatus.DELISTING)).thenReturn(0L);
        when(assetRepository.countByStatus(AssetStatus.MATURED)).thenReturn(0L);
        when(assetRepository.countByStatus(AssetStatus.DELISTED)).thenReturn(0L);
        when(tradeLogRepository.countByExecutedAtAfter(any())).thenReturn(27L);
        when(tradeLogRepository.sumVolumeBySideSince(eq(TradeSide.BUY), any())).thenReturn(new BigDecimal("1500000"));
        when(tradeLogRepository.sumVolumeBySideSince(eq(TradeSide.SELL), any())).thenReturn(new BigDecimal("300000"));
        when(tradeLogRepository.countDistinctTradersSince(any())).thenReturn(10L);
        when(orderRepository.countByStatus(OrderStatus.NEEDS_RECONCILIATION)).thenReturn(2L);
        when(orderRepository.countByStatus(OrderStatus.FAILED)).thenReturn(0L);
        when(orderRepository.countByStatus(OrderStatus.MANUALLY_CLOSED)).thenReturn(1L);
        when(reconciliationReportRepository.countByStatus("OPEN")).thenReturn(3L);
        when(reconciliationReportRepository.countByStatusAndSeverity("OPEN", "CRITICAL")).thenReturn(1L);
        when(reconciliationReportRepository.countByStatusAndSeverity("OPEN", "WARNING")).thenReturn(2L);
        when(userPositionRepository.findDistinctUserIdsWithPositions()).thenReturn(List.of(1L, 2L, 3L, 4L, 5L));

        AdminDashboardResponse response = dashboardService.getSummary();

        assertThat(response.assets().total()).isEqualTo(15L);
        assertThat(response.assets().active()).isEqualTo(12L);
        assertThat(response.assets().pending()).isEqualTo(2L);
        assertThat(response.assets().halted()).isEqualTo(1L);
        assertThat(response.trading().tradeCount24h()).isEqualTo(27L);
        assertThat(response.trading().buyVolume24h()).isEqualByComparingTo("1500000");
        assertThat(response.trading().sellVolume24h()).isEqualByComparingTo("300000");
        assertThat(response.trading().activeTraders24h()).isEqualTo(10L);
        assertThat(response.orders().needsReconciliation()).isEqualTo(2L);
        assertThat(response.orders().failed()).isZero();
        assertThat(response.orders().manuallyClosed()).isEqualTo(1L);
        assertThat(response.reconciliation().openReports()).isEqualTo(3L);
        assertThat(response.reconciliation().criticalOpen()).isEqualTo(1L);
        assertThat(response.reconciliation().warningOpen()).isEqualTo(2L);
        assertThat(response.activeInvestors()).isEqualTo(5L);
    }

    @Test
    void getSummary_uses24HourCutoff() {
        when(assetRepository.count()).thenReturn(0L);
        when(assetRepository.countByStatus(any())).thenReturn(0L);
        when(tradeLogRepository.countByExecutedAtAfter(any())).thenReturn(0L);
        when(tradeLogRepository.sumVolumeBySideSince(any(), any())).thenReturn(BigDecimal.ZERO);
        when(tradeLogRepository.countDistinctTradersSince(any())).thenReturn(0L);
        when(orderRepository.countByStatus(any())).thenReturn(0L);
        when(reconciliationReportRepository.countByStatus(any())).thenReturn(0L);
        when(reconciliationReportRepository.countByStatusAndSeverity(any(), any())).thenReturn(0L);
        when(userPositionRepository.findDistinctUserIdsWithPositions()).thenReturn(List.of());

        dashboardService.getSummary();

        ArgumentCaptor<Instant> captor = ArgumentCaptor.forClass(Instant.class);
        verify(tradeLogRepository).countByExecutedAtAfter(captor.capture());

        Instant cutoff = captor.getValue();
        Instant expected24hAgo = Instant.now().minus(24, ChronoUnit.HOURS);
        assertThat(cutoff).isBetween(
                expected24hAgo.minus(5, ChronoUnit.SECONDS),
                expected24hAgo.plus(5, ChronoUnit.SECONDS));
    }
}
