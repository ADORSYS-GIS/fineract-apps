package com.adorsys.fineract.asset.scheduler;

import com.adorsys.fineract.asset.config.AssetServiceConfig;
import com.adorsys.fineract.asset.metrics.AssetMetrics;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

/**
 * Monthly scheduler that archives old trade_log and orders records.
 * <p>
 * Moves rows older than the configured retention period (default 12 months)
 * from the hot tables into their respective archive tables. Processes in
 * configurable batches to avoid long-running transactions.
 * <p>
 * Archive order respects the FK constraint (trade_log.order_id → orders.id):
 * trade_log rows are archived first, then orders rows.
 * <p>
 * Only terminal orders are archived: FILLED, FAILED, REJECTED.
 * <p>
 * Runs on the 1st of each month at 03:00 WAT (Africa/Douala).
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class ArchivalScheduler {

    private final JdbcTemplate jdbcTemplate;
    private final AssetServiceConfig config;
    private final AssetMetrics metrics;

    @Scheduled(cron = "0 0 3 1 * *", zone = "Africa/Douala")
    public void archiveRecords() {
        try {
            Instant cutoff = Instant.now().minus(
                    config.getArchival().getRetentionMonths() * 30L, ChronoUnit.DAYS);
            int batchSize = config.getArchival().getBatchSize();

            log.info("Starting archival: cutoff={}, batchSize={}", cutoff, batchSize);

            int tradesArchived = archiveTradeLogs(cutoff, batchSize);
            int ordersArchived = archiveOrders(cutoff, batchSize);

            log.info("Archival complete: {} trades archived, {} orders archived",
                    tradesArchived, ordersArchived);
        } catch (Exception e) {
            metrics.recordArchivalFailure();
            log.error("Archival failed: {}", e.getMessage(), e);
        }
    }

    int archiveTradeLogs(Instant cutoff, int batchSize) {
        int totalArchived = 0;

        while (true) {
            int archived = archiveTradeBatch(cutoff, batchSize);
            if (archived == 0) break;
            totalArchived += archived;
            log.debug("Archived {} trade_log rows (total: {})", archived, totalArchived);
        }

        if (totalArchived > 0) {
            metrics.recordTradesArchived(totalArchived);
            log.info("Archived {} trade_log rows", totalArchived);
        }
        return totalArchived;
    }

    int archiveOrders(Instant cutoff, int batchSize) {
        int totalArchived = 0;

        while (true) {
            int archived = archiveOrderBatch(cutoff, batchSize);
            if (archived == 0) break;
            totalArchived += archived;
            log.debug("Archived {} orders rows (total: {})", archived, totalArchived);
        }

        if (totalArchived > 0) {
            metrics.recordOrdersArchived(totalArchived);
            log.info("Archived {} orders rows", totalArchived);
        }
        return totalArchived;
    }

    private int archiveTradeBatch(Instant cutoff, int batchSize) {
        // Insert into archive, skip duplicates
        int inserted = jdbcTemplate.update("""
                INSERT INTO trade_log_archive (
                    id, order_id, user_id, asset_id, side, units,
                    price_per_unit, total_amount, fee, spread_amount,
                    realized_pnl, fineract_cash_transfer_id,
                    fineract_asset_transfer_id, executed_at
                )
                SELECT id, order_id, user_id, asset_id, side, units,
                       price_per_unit, total_amount, fee, spread_amount,
                       realized_pnl, fineract_cash_transfer_id,
                       fineract_asset_transfer_id, executed_at
                FROM trade_log
                WHERE executed_at < ?
                ORDER BY executed_at
                LIMIT ?
                ON CONFLICT (id) DO NOTHING
                """, cutoff, batchSize);

        if (inserted == 0) return 0;

        // Delete the archived rows from the hot table
        int deleted = jdbcTemplate.update("""
                DELETE FROM trade_log
                WHERE id IN (
                    SELECT tl.id FROM trade_log tl
                    JOIN trade_log_archive tla ON tla.id = tl.id
                    WHERE tl.executed_at < ?
                    LIMIT ?
                )
                """, cutoff, batchSize);

        return deleted;
    }

    private int archiveOrderBatch(Instant cutoff, int batchSize) {
        // Only archive terminal orders
        int inserted = jdbcTemplate.update("""
                INSERT INTO orders_archive (
                    id, idempotency_key, user_id, user_external_id,
                    asset_id, side, cash_amount, units, execution_price,
                    fee, spread_amount, status, failure_reason,
                    created_at, updated_at, version
                )
                SELECT id, idempotency_key, user_id, user_external_id,
                       asset_id, side, cash_amount, units, execution_price,
                       fee, spread_amount, status, failure_reason,
                       created_at, updated_at, version
                FROM orders
                WHERE created_at < ?
                  AND status IN ('FILLED', 'FAILED', 'REJECTED')
                ORDER BY created_at
                LIMIT ?
                ON CONFLICT (id) DO NOTHING
                """, cutoff, batchSize);

        if (inserted == 0) return 0;

        // Delete the archived rows from the hot table
        int deleted = jdbcTemplate.update("""
                DELETE FROM orders
                WHERE id IN (
                    SELECT o.id FROM orders o
                    JOIN orders_archive oa ON oa.id = o.id
                    WHERE o.created_at < ?
                      AND o.status IN ('FILLED', 'FAILED', 'REJECTED')
                    LIMIT ?
                )
                """, cutoff, batchSize);

        return deleted;
    }
}
