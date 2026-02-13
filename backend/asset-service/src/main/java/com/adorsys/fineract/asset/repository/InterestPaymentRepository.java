package com.adorsys.fineract.asset.repository;

import com.adorsys.fineract.asset.entity.InterestPayment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository for {@link InterestPayment} coupon payment audit records.
 */
@Repository
public interface InterestPaymentRepository extends JpaRepository<InterestPayment, Long> {

    /**
     * Find all coupon payments for a given asset, ordered by most recent first.
     *
     * @param assetId the asset UUID
     * @param pageable pagination parameters
     * @return paginated coupon payment records
     */
    Page<InterestPayment> findByAssetIdOrderByPaidAtDesc(String assetId, Pageable pageable);
}
