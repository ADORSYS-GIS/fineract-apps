package com.adorsys.fineract.asset.repository;

import com.adorsys.fineract.asset.entity.UserPosition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserPositionRepository extends JpaRepository<UserPosition, Long> {

    List<UserPosition> findByUserId(Long userId);

    Optional<UserPosition> findByUserIdAndAssetId(Long userId, String assetId);

    /**
     * Find all holders of a specific asset with positive units (for coupon payments).
     */
    @Query("SELECT p FROM UserPosition p WHERE p.assetId = :assetId AND p.totalUnits > :zero")
    List<UserPosition> findHoldersByAssetId(@Param("assetId") String assetId,
                                             @Param("zero") BigDecimal zero);
}
