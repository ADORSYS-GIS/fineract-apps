package com.adorsys.fineract.asset.repository;

import com.adorsys.fineract.asset.entity.PriceHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Pageable;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Repository
public interface PriceHistoryRepository extends JpaRepository<PriceHistory, Long> {

    @Modifying
    void deleteByAssetId(String assetId);

    List<PriceHistory> findByAssetIdAndCapturedAtAfterOrderByCapturedAtAsc(String assetId, Instant after);

    List<PriceHistory> findByAssetIdAndCapturedAtAfterOrderByCapturedAtAsc(String assetId, Instant after, Pageable pageable);

    List<PriceHistory> findByAssetIdOrderByCapturedAtAsc(String assetId);

    List<PriceHistory> findByAssetIdOrderByCapturedAtAsc(String assetId, Pageable pageable);

    Optional<PriceHistory> findTopByAssetIdOrderByCapturedAtDesc(String assetId);
}
