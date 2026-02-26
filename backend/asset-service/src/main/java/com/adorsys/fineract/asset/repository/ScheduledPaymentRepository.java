package com.adorsys.fineract.asset.repository;

import com.adorsys.fineract.asset.entity.ScheduledPayment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ScheduledPaymentRepository extends JpaRepository<ScheduledPayment, Long> {

    boolean existsByAssetIdAndPaymentTypeAndScheduleDateAndStatus(
            String assetId, String paymentType, java.time.LocalDate scheduleDate, String status);

    boolean existsByAssetIdAndPaymentTypeAndScheduleDate(
            String assetId, String paymentType, java.time.LocalDate scheduleDate);

    @EntityGraph(attributePaths = "asset")
    Optional<ScheduledPayment> findWithAssetById(Long id);

    @Query(value = "SELECT * FROM scheduled_payments sp WHERE "
         + "(CAST(:status AS varchar) IS NULL OR sp.status = CAST(:status AS varchar)) AND "
         + "(CAST(:assetId AS varchar) IS NULL OR sp.asset_id = CAST(:assetId AS varchar)) AND "
         + "(CAST(:paymentType AS varchar) IS NULL OR sp.payment_type = CAST(:paymentType AS varchar))",
         countQuery = "SELECT count(*) FROM scheduled_payments sp WHERE "
         + "(CAST(:status AS varchar) IS NULL OR sp.status = CAST(:status AS varchar)) AND "
         + "(CAST(:assetId AS varchar) IS NULL OR sp.asset_id = CAST(:assetId AS varchar)) AND "
         + "(CAST(:paymentType AS varchar) IS NULL OR sp.payment_type = CAST(:paymentType AS varchar))",
         nativeQuery = true)
    Page<ScheduledPayment> findFiltered(@Param("status") String status,
                                         @Param("assetId") String assetId,
                                         @Param("paymentType") String paymentType,
                                         Pageable pageable);

    long countByStatus(String status);

    @Query("SELECT COALESCE(SUM(sp.totalAmountPaid), 0) FROM ScheduledPayment sp " +
           "WHERE sp.status = 'CONFIRMED' AND sp.confirmedAt >= :since")
    java.math.BigDecimal sumPaidSince(@Param("since") java.time.Instant since);

    long countByStatusAndConfirmedAtGreaterThanEqual(String status, java.time.Instant since);
}
