package com.adorsys.fineract.asset.repository;

import com.adorsys.fineract.asset.entity.InterestPayment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

/**
 * Repository for {@link InterestPayment} coupon payment audit records.
 */
@Repository
public interface InterestPaymentRepository extends JpaRepository<InterestPayment, Long> {

    /**
     * Find all coupon payments for a given asset, ordered by most recent first.
     */
    Page<InterestPayment> findByAssetIdOrderByPaidAtDesc(String assetId, Pageable pageable);

    /**
     * Find coupon payments for a given asset and coupon date (matches a specific scheduled payment).
     */
    Page<InterestPayment> findByAssetIdAndCouponDateOrderByPaidAtDesc(
            String assetId, LocalDate couponDate, Pageable pageable);

    /**
     * Total settlement currency paid successfully for an asset.
     */
    @Query("SELECT COALESCE(SUM(ip.cashAmount), 0) FROM InterestPayment ip " +
           "WHERE ip.assetId = :assetId AND ip.status = 'SUCCESS'")
    BigDecimal sumPaidByAsset(@Param("assetId") String assetId);

    /**
     * Count of failed coupon payments for an asset.
     */
    @Query("SELECT COUNT(ip) FROM InterestPayment ip " +
           "WHERE ip.assetId = :assetId AND ip.status = 'FAILED'")
    long countFailedByAsset(@Param("assetId") String assetId);

    /**
     * Total coupon payments for an asset (all statuses).
     */
    long countByAssetId(String assetId);

    /**
     * Most recent successful coupon payment for an asset.
     */
    Optional<InterestPayment> findFirstByAssetIdAndStatusOrderByPaidAtDesc(String assetId, String status);

    /**
     * All coupon payments for a given user, ordered by most recent first.
     */
    Page<InterestPayment> findByUserIdOrderByPaidAtDesc(Long userId, Pageable pageable);

    /**
     * Total net coupon cash received by a user (all statuses = SUCCESS).
     */
    @Query("SELECT COALESCE(SUM(ip.cashAmount), 0) FROM InterestPayment ip " +
           "WHERE ip.userId = :userId AND ip.status = 'SUCCESS'")
    BigDecimal sumPaidByUser(@Param("userId") Long userId);

    /**
     * Idempotency check: returns true if a successful coupon payment already exists
     * for the given (assetId, couponDate, userId) tuple.
     * Used in {@code payCouponHolder} to skip already-paid holders on retry.
     */
    boolean existsByAssetIdAndCouponDateAndUserIdAndStatus(
            String assetId, LocalDate couponDate, Long userId, String status);

}
