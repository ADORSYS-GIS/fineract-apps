package com.adorsys.fineract.asset.repository;

import com.adorsys.fineract.asset.dto.TradeSide;
import com.adorsys.fineract.asset.entity.TradeLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Repository
public interface TradeLogRepository extends JpaRepository<TradeLog, String> {

    Page<TradeLog> findByUserId(Long userId, Pageable pageable);

    List<TradeLog> findTop20ByAssetIdOrderByExecutedAtDesc(String assetId);

    @Query("SELECT COALESCE(SUM(t.totalAmount), 0) FROM TradeLog t WHERE t.side = :side AND t.executedAt >= :since")
    BigDecimal sumVolumeBySideSince(@Param("side") TradeSide side, @Param("since") Instant since);

    @Query("SELECT COUNT(DISTINCT t.userId) FROM TradeLog t WHERE t.executedAt >= :since")
    long countDistinctTradersSince(@Param("since") Instant since);

    long countByExecutedAtAfter(Instant since);

    /** Aggregate LP performance: spread, buyback premium, fee per asset. */
    @Query("SELECT t.assetId, " +
           "COALESCE(SUM(t.spreadAmount), 0), " +
           "COALESCE(SUM(t.buybackPremium), 0), " +
           "COALESCE(SUM(t.fee), 0), " +
           "COUNT(t) " +
           "FROM TradeLog t GROUP BY t.assetId")
    List<Object[]> aggregateLPPerformanceByAsset();

    /** Total LP performance across all assets. */
    @Query("SELECT COALESCE(SUM(t.spreadAmount), 0), " +
           "COALESCE(SUM(t.buybackPremium), 0), " +
           "COALESCE(SUM(t.fee), 0), " +
           "COUNT(t) " +
           "FROM TradeLog t")
    List<Object[]> aggregateTotalLPPerformance();

    /** Sum of fees within a date range, for accounting reports. Callers must pass non-null Instants. */
    @Query("SELECT COALESCE(SUM(t.fee), 0) FROM TradeLog t " +
           "WHERE t.executedAt >= :from AND t.executedAt < :to")
    BigDecimal sumFeesByDateRange(@Param("from") Instant from, @Param("to") Instant to);

    /** Count of trades with non-zero fees within a date range. Callers must pass non-null Instants. */
    @Query("SELECT COUNT(t) FROM TradeLog t " +
           "WHERE t.fee > 0 AND t.executedAt >= :from AND t.executedAt < :to")
    int countByFeeGreaterThanAndDateRange(@Param("from") Instant from, @Param("to") Instant to);

    /** Sum of spread amounts within a date range. Callers must pass non-null Instants. */
    @Query("SELECT COALESCE(SUM(t.spreadAmount), 0) FROM TradeLog t " +
           "WHERE t.executedAt >= :from AND t.executedAt < :to")
    BigDecimal sumSpreadByDateRange(@Param("from") Instant from, @Param("to") Instant to);

    /** Count of trades with non-zero spread within a date range. Callers must pass non-null Instants. */
    @Query("SELECT COUNT(t) FROM TradeLog t " +
           "WHERE t.spreadAmount > 0 AND t.executedAt >= :from AND t.executedAt < :to")
    int countBySpreadGreaterThanAndDateRange(@Param("from") Instant from, @Param("to") Instant to);
}
