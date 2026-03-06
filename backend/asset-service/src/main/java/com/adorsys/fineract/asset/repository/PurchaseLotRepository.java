package com.adorsys.fineract.asset.repository;

import com.adorsys.fineract.asset.entity.PurchaseLot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Repository
public interface PurchaseLotRepository extends JpaRepository<PurchaseLot, Long> {

    /** All lots for a user+asset, oldest first (for FIFO consumption). */
    List<PurchaseLot> findByUserIdAndAssetIdOrderByPurchasedAtAsc(Long userId, String assetId);

    /** Lots with remaining units > 0, oldest first (active lots for FIFO). */
    List<PurchaseLot> findByUserIdAndAssetIdAndRemainingUnitsGreaterThanOrderByPurchasedAtAsc(
            Long userId, String assetId, BigDecimal zero);

    /** Sum of unlocked units (lockup expired or no lockup). */
    @Query("SELECT COALESCE(SUM(p.remainingUnits), 0) FROM PurchaseLot p " +
           "WHERE p.userId = :userId AND p.assetId = :assetId " +
           "AND p.remainingUnits > 0 " +
           "AND (p.lockupExpiresAt IS NULL OR p.lockupExpiresAt <= :now)")
    BigDecimal sumUnlockedUnits(@Param("userId") Long userId,
                                @Param("assetId") String assetId,
                                @Param("now") Instant now);

    /** Delete all lots for an asset (used during asset deletion). */
    void deleteByAssetId(String assetId);
}
