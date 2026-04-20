package com.adorsys.fineract.asset.repository;

import com.adorsys.fineract.asset.entity.IncomeDistribution;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

public interface IncomeDistributionRepository extends JpaRepository<IncomeDistribution, Long> {

    Page<IncomeDistribution> findByAssetIdOrderByPaidAtDesc(String assetId, Pageable pageable);

    Page<IncomeDistribution> findByUserIdOrderByPaidAtDesc(Long userId, Pageable pageable);

    /**
     * Find income distributions for a given asset and distribution date (matches a specific scheduled payment).
     */
    Page<IncomeDistribution> findByAssetIdAndDistributionDateOrderByPaidAtDesc(
            String assetId, LocalDate distributionDate, Pageable pageable);

    /**
     * Total settlement currency paid successfully for an asset.
     */
    @Query("SELECT COALESCE(SUM(id.cashAmount), 0) FROM IncomeDistribution id " +
           "WHERE id.assetId = :assetId AND id.status = 'SUCCESS'")
    BigDecimal sumPaidByAsset(@Param("assetId") String assetId);

    /**
     * Count of failed income distributions for an asset.
     */
    @Query("SELECT COUNT(id) FROM IncomeDistribution id " +
           "WHERE id.assetId = :assetId AND id.status = 'FAILED'")
    long countFailedByAsset(@Param("assetId") String assetId);

    /**
     * Total income distributions for an asset (all statuses).
     */
    long countByAssetId(String assetId);

    /**
     * Most recent successful income distribution for an asset.
     */
    Optional<IncomeDistribution> findFirstByAssetIdAndStatusOrderByPaidAtDesc(String assetId, String status);

    /**
     * Total net income cash received by a user across all successful distributions.
     * The cashAmount stored in IncomeDistribution is already net of IRCM withholding.
     */
    @Query("SELECT COALESCE(SUM(id.cashAmount), 0) FROM IncomeDistribution id " +
           "WHERE id.userId = :userId AND id.status = 'SUCCESS'")
    BigDecimal sumPaidByUser(@Param("userId") Long userId);

    /**
     * Idempotency check: returns true if a successful income distribution already exists
     * for the given (assetId, distributionDate, userId) tuple.
     * Used in {@code payIncomeHolder} to skip already-paid holders on retry.
     */
    boolean existsByAssetIdAndDistributionDateAndUserIdAndStatus(
            String assetId, LocalDate distributionDate, Long userId, String status);
}
