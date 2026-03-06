package com.adorsys.fineract.asset.repository;

import com.adorsys.fineract.asset.entity.PrincipalRedemption;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PrincipalRedemptionRepository extends JpaRepository<PrincipalRedemption, Long> {

    /** Paginated history for a bond (admin view). */
    Page<PrincipalRedemption> findByAssetIdOrderByRedeemedAtDesc(String assetId, Pageable pageable);

    /** All records for a bond (used for retry/idempotency filtering). */
    List<PrincipalRedemption> findByAssetId(String assetId);
}
