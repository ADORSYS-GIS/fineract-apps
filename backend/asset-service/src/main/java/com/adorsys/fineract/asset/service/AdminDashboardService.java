package com.adorsys.fineract.asset.service;

import com.adorsys.fineract.asset.dto.AdminDashboardResponse;
import com.adorsys.fineract.asset.dto.AdminDashboardResponse.*;
import com.adorsys.fineract.asset.dto.AssetStatus;
import com.adorsys.fineract.asset.dto.OrderStatus;
import com.adorsys.fineract.asset.dto.TradeSide;
import com.adorsys.fineract.asset.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
public class AdminDashboardService {

    private final AssetRepository assetRepository;
    private final TradeLogRepository tradeLogRepository;
    private final OrderRepository orderRepository;
    private final ReconciliationReportRepository reconciliationReportRepository;
    private final UserPositionRepository userPositionRepository;

    public AdminDashboardResponse getSummary() {
        return new AdminDashboardResponse(
                buildAssetMetrics(),
                buildTradingMetrics(),
                buildOrderHealth(),
                buildReconMetrics(),
                userPositionRepository.findDistinctUserIdsWithPositions().size()
        );
    }

    private AssetMetrics buildAssetMetrics() {
        return new AssetMetrics(
                assetRepository.count(),
                assetRepository.countByStatus(AssetStatus.ACTIVE),
                assetRepository.countByStatus(AssetStatus.HALTED),
                assetRepository.countByStatus(AssetStatus.PENDING),
                assetRepository.countByStatus(AssetStatus.DELISTING),
                assetRepository.countByStatus(AssetStatus.MATURED),
                assetRepository.countByStatus(AssetStatus.DELISTED)
        );
    }

    private TradingMetrics buildTradingMetrics() {
        Instant since24h = Instant.now().minus(24, ChronoUnit.HOURS);
        return new TradingMetrics(
                tradeLogRepository.countByExecutedAtAfter(since24h),
                tradeLogRepository.sumVolumeBySideSince(TradeSide.BUY, since24h),
                tradeLogRepository.sumVolumeBySideSince(TradeSide.SELL, since24h),
                tradeLogRepository.countDistinctTradersSince(since24h)
        );
    }

    private OrderHealthMetrics buildOrderHealth() {
        return new OrderHealthMetrics(
                orderRepository.countByStatus(OrderStatus.NEEDS_RECONCILIATION),
                orderRepository.countByStatus(OrderStatus.FAILED),
                orderRepository.countByStatus(OrderStatus.MANUALLY_CLOSED)
        );
    }

    private ReconMetrics buildReconMetrics() {
        return new ReconMetrics(
                reconciliationReportRepository.countByStatus("OPEN"),
                reconciliationReportRepository.countByStatusAndSeverity("OPEN", "CRITICAL"),
                reconciliationReportRepository.countByStatusAndSeverity("OPEN", "WARNING")
        );
    }
}
