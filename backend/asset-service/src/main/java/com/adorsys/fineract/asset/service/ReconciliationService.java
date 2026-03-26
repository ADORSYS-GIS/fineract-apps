package com.adorsys.fineract.asset.service;

import com.adorsys.fineract.asset.client.FineractClient;
import com.adorsys.fineract.asset.config.ResolvedGlAccounts;
import com.adorsys.fineract.asset.config.ResolvedTaxAccounts;
import com.adorsys.fineract.asset.dto.AssetStatus;
import com.adorsys.fineract.asset.dto.ReconciliationReportResponse;
import com.adorsys.fineract.asset.entity.Asset;
import com.adorsys.fineract.asset.entity.ReconciliationReport;
import com.adorsys.fineract.asset.entity.UserPosition;
import com.adorsys.fineract.asset.event.AdminAlertEvent;
import com.adorsys.fineract.asset.exception.AssetException;
import com.adorsys.fineract.asset.metrics.AssetMetrics;
import com.adorsys.fineract.asset.repository.AssetRepository;
import com.adorsys.fineract.asset.repository.ReconciliationReportRepository;
import com.adorsys.fineract.asset.repository.TaxTransactionRepository;
import com.adorsys.fineract.asset.repository.TradeLogRepository;
import com.adorsys.fineract.asset.repository.UserPositionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
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
 * Detects discrepancies in supply, positions, and LP cash.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ReconciliationService {

    private final AssetRepository assetRepository;
    private final UserPositionRepository userPositionRepository;
    private final ReconciliationReportRepository reportRepository;
    private final TaxTransactionRepository taxTransactionRepository;
    private final TradeLogRepository tradeLogRepository;
    private final FineractClient fineractClient;
    private final ResolvedGlAccounts resolvedGlAccounts;
    private final ResolvedTaxAccounts resolvedTaxAccounts;
    private final AssetMetrics assetMetrics;
    private final ApplicationEventPublisher eventPublisher;

    private static final BigDecimal POSITION_THRESHOLD = new BigDecimal("0.001");

    /**
     * Run full reconciliation across all active assets.
     * <p>
     * Not @Transactional: each sub-reconciliation runs in its own transaction so that
     * a PostgreSQL error in one asset doesn't poison the transaction and abort all
     * subsequent SQL commands ("current transaction is aborted" error).
     */
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

            // 5. Tax account reconciliation (global, not per-asset)
            try {
                totalDiscrepancies += reconcileTaxAccounts(today);
            } catch (Exception e) {
                log.error("Tax account reconciliation failed: {}", e.getMessage());
            }

            // 6. Fee collection account reconciliation
            try {
                totalDiscrepancies += reconcileFeeCollectionAccount(today);
            } catch (Exception e) {
                log.error("Fee collection reconciliation failed: {}", e.getMessage());
            }

            // Update the open reports gauge
            try {
                assetMetrics.setReconciliationOpenReports(reportRepository.countByStatus("OPEN"));
            } catch (Exception e) {
                log.error("Failed to update open reports gauge: {}", e.getMessage());
            }

            log.info("Daily reconciliation complete: {} discrepancies found across {} assets",
                    totalDiscrepancies, activeAssets.size());
            return totalDiscrepancies;
        });
    }

    /**
     * Reconcile a single asset by ID. Used by the per-asset trigger endpoint.
     */
    @Transactional
    public int reconcileSingleAsset(String assetId) {
        Asset asset = assetRepository.findById(assetId)
                .orElseThrow(() -> new AssetException("Asset not found: " + assetId));
        LocalDate today = LocalDate.now();
        int discrepancies = reconcileAsset(asset, today);
        assetMetrics.setReconciliationOpenReports(reportRepository.countByStatus("OPEN"));
        log.info("Single-asset reconciliation for {}: {} discrepancies found", asset.getSymbol(), discrepancies);
        return discrepancies;
    }

    /**
     * Reconcile a single asset.
     */
    @Transactional
    public int reconcileAsset(Asset asset, LocalDate reportDate) {
        int discrepancies = 0;

        // 1. Supply mismatch: circulatingSupply vs (totalSupply - lpAssetBalance)
        try {
            BigDecimal lpAssetBalance = fineractClient.getAccountBalance(asset.getLpAssetAccountId());
            BigDecimal expectedCirculating = asset.getTotalSupply().subtract(lpAssetBalance);
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

        // 3. LP cash balance: verify non-negative
        if (asset.getLpCashAccountId() != null) {
            try {
                BigDecimal lpCashBalance = fineractClient.getAccountBalance(asset.getLpCashAccountId());
                if (lpCashBalance.compareTo(BigDecimal.ZERO) < 0) {
                    createReport(reportDate, "LP_CASH_NEGATIVE", asset.getId(), null,
                            BigDecimal.ZERO, lpCashBalance, lpCashBalance, "CRITICAL");
                    discrepancies++;
                }
            } catch (Exception e) {
                log.warn("Could not check LP cash for asset {}: {}", asset.getSymbol(), e.getMessage());
            }
        }

        // 4. LP spread account: verify non-negative (negative means more buyback premiums paid than spread earned)
        if (asset.getLpSpreadAccountId() != null) {
            try {
                BigDecimal lpSpreadBalance = fineractClient.getAccountBalance(asset.getLpSpreadAccountId());
                if (lpSpreadBalance.compareTo(BigDecimal.ZERO) < 0) {
                    createReport(reportDate, "LP_SPREAD_NEGATIVE", asset.getId(), null,
                            BigDecimal.ZERO, lpSpreadBalance, lpSpreadBalance, "WARNING");
                    discrepancies++;
                }
            } catch (Exception e) {
                log.warn("Could not check LP spread account for asset {}: {}", asset.getSymbol(), e.getMessage());
            }
        }

        return discrepancies;
    }

    /**
     * Reconcile tax collection accounts: compare sum of successful tax_transactions
     * against actual Fineract tax account balances. Detects missing or extra tax entries
     * (e.g. from a crash between Fineract batch success and tax_transaction write).
     */
    private int reconcileTaxAccounts(LocalDate reportDate) {
        int discrepancies = 0;

        discrepancies += reconcileSingleTaxAccount(reportDate, "REGISTRATION_DUTY",
                resolvedTaxAccounts.getRegistrationDutyAccountId());
        discrepancies += reconcileSingleTaxAccount(reportDate, "IRCM",
                resolvedTaxAccounts.getIrcmAccountId());
        discrepancies += reconcileSingleTaxAccount(reportDate, "CAPITAL_GAINS",
                resolvedTaxAccounts.getCapitalGainsAccountId());

        return discrepancies;
    }

    private int reconcileSingleTaxAccount(LocalDate reportDate, String taxType, Long fineractAccountId) {
        if (fineractAccountId == null) {
            log.warn("Tax account not configured for {}, skipping reconciliation", taxType);
            return 0;
        }

        try {
            BigDecimal expectedBalance = taxTransactionRepository.sumCollectedByTaxType(taxType);
            BigDecimal actualBalance = fineractClient.getAccountBalance(fineractAccountId);
            BigDecimal discrepancy = expectedBalance.subtract(actualBalance);

            if (discrepancy.abs().compareTo(POSITION_THRESHOLD) > 0) {
                createReport(reportDate, "TAX_ACCOUNT_MISMATCH", null, null,
                        expectedBalance, actualBalance, discrepancy, "CRITICAL");
                log.error("Tax account mismatch for {}: expected={}, actual={}, discrepancy={}",
                        taxType, expectedBalance, actualBalance, discrepancy);
                return 1;
            }
        } catch (Exception e) {
            log.warn("Could not reconcile tax account for {}: {}", taxType, e.getMessage());
        }

        return 0;
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

    /**
     * Reconcile fee collection account: compare sum of all trade fees from trade_logs
     * against the actual Fineract fee collection savings account balance.
     * <p>
     * Assumption: no withdrawals are made from the fee collection account. If fees are
     * swept to an operating account, this check will produce false-positive mismatches.
     */
    private int reconcileFeeCollectionAccount(LocalDate reportDate) {
        Long feeAccountId = resolvedGlAccounts.getFeeCollectionAccountId();
        if (feeAccountId == null) {
            log.warn("Fee collection account not configured, skipping reconciliation");
            return 0;
        }
        try {
            BigDecimal expectedBalance = tradeLogRepository.sumFeesByDateRange(null, null);
            BigDecimal actualBalance = fineractClient.getAccountBalance(feeAccountId);
            BigDecimal discrepancy = expectedBalance.subtract(actualBalance).abs();

            if (discrepancy.compareTo(POSITION_THRESHOLD) > 0) {
                createReport(reportDate, "FEE_COLLECTION_MISMATCH", null, null,
                        expectedBalance, actualBalance, discrepancy, "WARNING");
                log.warn("Fee collection mismatch: expected={}, actual={}, discrepancy={}",
                        expectedBalance, actualBalance, discrepancy);
                return 1;
            }
        } catch (Exception e) {
            log.warn("Fee collection reconciliation skipped: {}", e.getMessage());
        }
        return 0;
    }

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

        if ("CRITICAL".equals(severity)) {
            String alertDetail = assetId != null
                    ? String.format("Asset %s: expected=%s, actual=%s, discrepancy=%s",
                            assetId, expected, actual, discrepancy)
                    : String.format("expected=%s, actual=%s, discrepancy=%s",
                            expected, actual, discrepancy);
            eventPublisher.publishEvent(new AdminAlertEvent(
                    "RECONCILIATION_CRITICAL",
                    "Critical discrepancy: " + reportType,
                    alertDetail,
                    assetId, "ASSET"
            ));
        }
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
