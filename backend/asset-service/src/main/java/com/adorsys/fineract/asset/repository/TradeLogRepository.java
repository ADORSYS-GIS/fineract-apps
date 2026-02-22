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
}
