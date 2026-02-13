package com.adorsys.fineract.asset.scheduler;

import com.adorsys.fineract.asset.config.AssetServiceConfig;
import com.adorsys.fineract.asset.metrics.AssetMetrics;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.jdbc.core.JdbcTemplate;

import java.time.Instant;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ArchivalSchedulerTest {

    @Mock private JdbcTemplate jdbcTemplate;
    @Mock private AssetServiceConfig config;
    @Mock private AssetMetrics metrics;

    @InjectMocks
    private ArchivalScheduler scheduler;

    private AssetServiceConfig.Archival archivalConfig;

    @BeforeEach
    void setUp() {
        archivalConfig = new AssetServiceConfig.Archival();
        archivalConfig.setRetentionMonths(12);
        archivalConfig.setBatchSize(1000);
    }

    @Test
    void archiveTradeLogs_noRowsToArchive_returnsZero() {
        // First batch returns 0 rows affected
        when(jdbcTemplate.update(contains("INSERT INTO trade_log_archive"), any(Instant.class), eq(1000)))
                .thenReturn(0);

        int result = scheduler.archiveTradeLogs(Instant.now(), 1000);

        assertEquals(0, result);
        verify(metrics, never()).recordTradesArchived(anyInt());
    }

    @Test
    void archiveTradeLogs_processesBatchesUntilEmpty() {
        Instant cutoff = Instant.now();

        // First batch: 1000 inserted, 1000 deleted
        // Second batch: 500 inserted, 500 deleted
        // Third batch: 0 inserted (done)
        when(jdbcTemplate.update(contains("INSERT INTO trade_log_archive"), any(Instant.class), eq(1000)))
                .thenReturn(1000)
                .thenReturn(500)
                .thenReturn(0);
        when(jdbcTemplate.update(contains("DELETE FROM trade_log"), any(Instant.class), eq(1000)))
                .thenReturn(1000)
                .thenReturn(500);

        int result = scheduler.archiveTradeLogs(cutoff, 1000);

        assertEquals(1500, result);
        verify(metrics).recordTradesArchived(1500);
    }

    @Test
    void archiveOrders_noRowsToArchive_returnsZero() {
        when(jdbcTemplate.update(contains("INSERT INTO orders_archive"), any(Instant.class), eq(1000)))
                .thenReturn(0);

        int result = scheduler.archiveOrders(Instant.now(), 1000);

        assertEquals(0, result);
        verify(metrics, never()).recordOrdersArchived(anyInt());
    }

    @Test
    void archiveOrders_onlyArchivesTerminalStatuses() {
        Instant cutoff = Instant.now();

        when(jdbcTemplate.update(contains("INSERT INTO orders_archive"), any(Instant.class), eq(1000)))
                .thenReturn(100)
                .thenReturn(0);
        when(jdbcTemplate.update(contains("DELETE FROM orders"), any(Instant.class), eq(1000)))
                .thenReturn(100);

        scheduler.archiveOrders(cutoff, 1000);

        // Verify the INSERT query includes the terminal status filter
        ArgumentCaptor<String> sqlCaptor = ArgumentCaptor.forClass(String.class);
        verify(jdbcTemplate, atLeastOnce()).update(sqlCaptor.capture(), any(Instant.class), eq(1000));

        boolean hasTerminalFilter = sqlCaptor.getAllValues().stream()
                .anyMatch(sql -> sql.contains("FILLED") && sql.contains("FAILED") && sql.contains("REJECTED"));
        assertTrue(hasTerminalFilter, "Query should filter for terminal statuses only");
    }

    @Test
    void archiveRecords_archivesTradesBeforeOrders() {
        when(config.getArchival()).thenReturn(archivalConfig);

        // Both tables have no rows to archive
        when(jdbcTemplate.update(anyString(), any(Instant.class), anyInt()))
                .thenReturn(0);

        scheduler.archiveRecords();

        // Verify trade_log is queried (at least once) before orders
        var inOrder = inOrder(jdbcTemplate);
        inOrder.verify(jdbcTemplate).update(contains("trade_log_archive"), any(Instant.class), anyInt());
        inOrder.verify(jdbcTemplate).update(contains("orders_archive"), any(Instant.class), anyInt());
    }

    @Test
    void archiveRecords_onException_recordsFailureMetric() {
        when(config.getArchival()).thenReturn(archivalConfig);
        when(jdbcTemplate.update(anyString(), any(Instant.class), anyInt()))
                .thenThrow(new RuntimeException("DB connection lost"));

        scheduler.archiveRecords();

        verify(metrics).recordArchivalFailure();
    }

    @Test
    void archiveRecords_usesCutoffFromConfig() {
        archivalConfig.setRetentionMonths(6);
        when(config.getArchival()).thenReturn(archivalConfig);
        when(jdbcTemplate.update(anyString(), any(Instant.class), anyInt()))
                .thenReturn(0);

        Instant before = Instant.now().minusSeconds(6 * 30 * 86400L + 60);
        scheduler.archiveRecords();
        Instant after = Instant.now().minusSeconds(6 * 30 * 86400L - 60);

        // Verify the cutoff passed to JdbcTemplate is approximately 6 months ago
        ArgumentCaptor<Instant> cutoffCaptor = ArgumentCaptor.forClass(Instant.class);
        verify(jdbcTemplate, atLeastOnce()).update(anyString(), cutoffCaptor.capture(), anyInt());

        Instant actualCutoff = cutoffCaptor.getValue();
        assertTrue(actualCutoff.isAfter(before) && actualCutoff.isBefore(after),
                "Cutoff should be approximately 6 months ago");
    }
}
