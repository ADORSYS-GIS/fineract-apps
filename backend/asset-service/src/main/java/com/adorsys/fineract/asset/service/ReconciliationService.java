package com.adorsys.fineract.asset.service;

import com.adorsys.fineract.asset.client.FineractClient;
import com.adorsys.fineract.asset.dto.AssetStatus;
import com.adorsys.fineract.asset.dto.ReconciliationReportResponse;
import com.adorsys.fineract.asset.entity.Asset;
import com.adorsys.fineract.asset.entity.ReconciliationReport;
import com.adorsys.fineract.asset.entity.UserPosition;
import com.adorsys.fineract.asset.exception.AssetException;
import com.adorsys.fineract.asset.metrics.AssetMetrics;
import com.adorsys.fineract.asset.repository.AssetRepository;
import com.adorsys.fineract.asset.repository.ReconciliationReportRepository;
import com.adorsys.fineract.asset.repository.UserPositionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

/**
 * Automated reconciliation between asset service DB state and Fineract ledger balances.
 * Detects discrepancies in supply, positions, and treasury cash.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ReconciliationService {

    private final AssetRepository assetRepository;
    private final UserPositionRepository userPositionRepository;
    private final ReconciliationReportRepository reportRepository;
    private final FineractClient fineractClient;
    private final AssetMetrics assetMetrics;

    private static final BigDecimal POSITION_THRESHOLD = new BigDecimal("0.001");

    /**
     * Run full reconciliation across all active assets.
     */
    @Transactional
    public int runDailyReconciliation() {
        return assetMetrics.getReconciliationRunTimer().record(() -> {
            LocalDate today = LocalDate.now();
            List<Asset> activeAssets = assetRepository.findByStatusIn(
                    List.of(AssetStatus.ACTIVE, AssetStatus.DELISTING, AssetStatus.MATURED));

            int totalDiscrepancies = 0;

            for (Asset asset : activeAssets) {
                try {
                    totalDiscrepancies += reconcileAsset(asset, today);
                } catch (Exception e) {
                    log.error("Reconciliation failed for asset {}: {}", asset.getId(), e.getMessage());
                }
            }

            // Update the open reports gauge
            assetMetrics.setReconciliationOpenReports(reportRepository.countByStatus("OPEN"));

            log.info("Daily reconciliation complete: {} discrepancies found across {} assets",
                    totalDiscrepancies, activeAssets.size());
            return totalDiscrepancies;
        });
    }

    /**
     * Reconcile a single asset.
     */
    @Transactional
    public int reconcileAsset(Asset asset, LocalDate reportDate) {
        int discrepancies = 0;

        // 1. Supply mismatch: circulatingSupply vs (totalSupply - treasuryAssetBalance)
        try {
            BigDecimal treasuryAssetBalance = fineractClient.getAccountBalance(asset.getTreasuryAssetAccountId());
            BigDecimal expectedCirculating = asset.getTotalSupply().subtract(treasuryAssetBalance);
            BigDecimal actualCirculating = asset.getCirculatingSupply();
            BigDecimal supplyDiscrepancy = actualCirculating.subtract(expectedCirculating);

            if (supplyDiscrepancy.abs().compareTo(POSITION_THRESHOLD) > 0) {
                createReport(reportDate, "SUPPLY_MISMATCH", asset.getId(), null,
                        expectedCirculating, actualCirculating, supplyDiscrepancy, "WARNING");
                discrepancies++;
            }
        } catch (Exception e) {
            log.warn("Could not check supply for asset {}: {}", asset.getSymbol(), e.getMessage());
        }

        // 2. Position mismatch: UserPosition.totalUnits vs Fineract savings account balance
        List<UserPosition> positions = userPositionRepository.findHoldersByAssetId(
                asset.getId(), BigDecimal.ZERO);

        for (UserPosition pos : positions) {
            try {
                BigDecimal fineractBalance = fineractClient.getAccountBalance(pos.getFineractSavingsAccountId());
                BigDecimal posDiscrepancy = pos.getTotalUnits().subtract(fineractBalance);

                if (posDiscrepancy.abs().compareTo(POSITION_THRESHOLD) > 0) {
                    createReport(reportDate, "POSITION_MISMATCH", asset.getId(), pos.getUserId(),
                            pos.getTotalUnits(), fineractBalance, posDiscrepancy, "CRITICAL");
                    discrepancies++;
                }
            } catch (Exception e) {
                log.warn("Could not check position for user {} asset {}: {}",
                        pos.getUserId(), asset.getSymbol(), e.getMessage());
            }
        }

        return discrepancies;
    }

    // ── Query and management ──

    @Transactional(readOnly = true)
    public Page<ReconciliationReportResponse> getReports(String status, String severity,
                                                          String assetId, Pageable pageable) {
        Page<ReconciliationReport> reports;
        if (status != null) {
            reports = reportRepository.findByStatusOrderByCreatedAtDesc(status, pageable);
        } else if (severity != null) {
            reports = reportRepository.findBySeverityOrderByCreatedAtDesc(severity, pageable);
        } else if (assetId != null) {
            reports = reportRepository.findByAssetIdOrderByCreatedAtDesc(assetId, pageable);
        } else {
            reports = reportRepository.findAllOrderByCreatedAtDesc(pageable);
        }
        return reports.map(this::toResponse);
    }

    @Transactional
    public void acknowledgeReport(Long reportId, String admin) {
        ReconciliationReport report = reportRepository.findById(reportId)
                .orElseThrow(() -> new AssetException("Report not found: " + reportId));
        report.setStatus("ACKNOWLEDGED");
        report.setResolvedBy(admin);
        reportRepository.save(report);
    }

    @Transactional
    public void resolveReport(Long reportId, String admin, String notes) {
        ReconciliationReport report = reportRepository.findById(reportId)
                .orElseThrow(() -> new AssetException("Report not found: " + reportId));
        report.setStatus("RESOLVED");
        report.setResolvedBy(admin);
        report.setResolvedAt(Instant.now());
        if (notes != null) report.setNotes(notes);
        reportRepository.save(report);
    }

    @Transactional(readOnly = true)
    public long getOpenReportCount() {
        return reportRepository.countByStatus("OPEN");
    }

    // ── Internal ──

    private void createReport(LocalDate reportDate, String reportType, String assetId,
                                Long userId, BigDecimal expected, BigDecimal actual,
                                BigDecimal discrepancy, String severity) {
        ReconciliationReport report = ReconciliationReport.builder()
                .reportDate(reportDate)
                .reportType(reportType)
                .assetId(assetId)
                .userId(userId)
                .expectedValue(expected)
                .actualValue(actual)
                .discrepancy(discrepancy)
                .severity(severity)
                .status("OPEN")
                .build();
        reportRepository.save(report);
        assetMetrics.recordReconciliationDiscrepancy(severity, reportType);

        log.warn("Reconciliation discrepancy: type={}, asset={}, user={}, expected={}, actual={}, discrepancy={}, severity={}",
                reportType, assetId, userId, expected, actual, discrepancy, severity);
    }

    private ReconciliationReportResponse toResponse(ReconciliationReport r) {
        return new ReconciliationReportResponse(
                r.getId(), r.getReportDate(), r.getReportType(),
                r.getAssetId(), r.getUserId(),
                r.getExpectedValue(), r.getActualValue(), r.getDiscrepancy(),
                r.getSeverity(), r.getStatus(), r.getNotes(),
                r.getResolvedBy(), r.getResolvedAt(), r.getCreatedAt());
    }
}
