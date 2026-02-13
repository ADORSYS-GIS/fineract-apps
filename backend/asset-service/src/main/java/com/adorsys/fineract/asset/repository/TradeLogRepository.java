package com.adorsys.fineract.asset.repository;

import com.adorsys.fineract.asset.entity.TradeLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TradeLogRepository extends JpaRepository<TradeLog, String> {

    Page<TradeLog> findByUserId(Long userId, Pageable pageable);

    List<TradeLog> findTop20ByAssetIdOrderByExecutedAtDesc(String assetId);
}
