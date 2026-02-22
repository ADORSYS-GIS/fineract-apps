package com.adorsys.fineract.asset.repository;

import com.adorsys.fineract.asset.entity.PriceHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Repository
public interface PriceHistoryRepository extends JpaRepository<PriceHistory, Long> {

    List<PriceHistory> findByAssetIdAndCapturedAtAfterOrderByCapturedAtAsc(String assetId, Instant after);

    List<PriceHistory> findByAssetIdOrderByCapturedAtAsc(String assetId);

    Optional<PriceHistory> findTopByAssetIdOrderByCapturedAtDesc(String assetId);
}
