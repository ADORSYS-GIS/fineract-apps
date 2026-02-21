package com.adorsys.fineract.asset.repository;

import com.adorsys.fineract.asset.dto.AssetCategory;
import com.adorsys.fineract.asset.dto.AssetStatus;
import com.adorsys.fineract.asset.entity.Asset;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AssetRepository extends JpaRepository<Asset, String> {

    Page<Asset> findByStatus(AssetStatus status, Pageable pageable);

    Page<Asset> findByStatusAndCategory(AssetStatus status, AssetCategory category, Pageable pageable);

    @Query("SELECT a FROM Asset a WHERE a.status = :status " +
           "AND (LOWER(a.name) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(a.symbol) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Asset> searchByStatusAndNameOrSymbol(@Param("status") AssetStatus status,
                                              @Param("search") String search,
                                              Pageable pageable);

    @Query("SELECT a FROM Asset a WHERE a.status = :status AND a.category = :category " +
           "AND (LOWER(a.name) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(a.symbol) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Asset> searchByStatusCategoryAndNameOrSymbol(@Param("status") AssetStatus status,
                                                      @Param("category") AssetCategory category,
                                                      @Param("search") String search,
                                                      Pageable pageable);

    Optional<Asset> findBySymbol(String symbol);

    Optional<Asset> findByCurrencyCode(String currencyCode);

    List<Asset> findByStatusIn(List<AssetStatus> statuses);

    @Modifying
    @Query("UPDATE Asset a SET a.circulatingSupply = a.circulatingSupply + :delta " +
           "WHERE a.id = :assetId " +
           "AND a.circulatingSupply + :delta >= 0 " +
           "AND a.circulatingSupply + :delta <= a.totalSupply")
    int adjustCirculatingSupply(@Param("assetId") String assetId, @Param("delta") BigDecimal delta);

    /**
     * Update asset status directly via SQL, avoiding a full-entity save that
     * would overwrite fields modified by {@code adjustCirculatingSupply}.
     */
    @Modifying
    @Query("UPDATE Asset a SET a.status = :status WHERE a.id = :assetId")
    void updateStatus(@Param("assetId") String assetId, @Param("status") AssetStatus status);

    /**
     * Find ACTIVE bonds whose maturity date has passed (for MaturityScheduler).
     */
    List<Asset> findByStatusAndMaturityDateLessThanEqual(AssetStatus status, LocalDate date);

    /**
     * Find ACTIVE bonds whose next coupon date is due (for InterestPaymentScheduler).
     */
    List<Asset> findByStatusAndNextCouponDateLessThanEqual(AssetStatus status, LocalDate date);

    /**
     * Find bonds with due coupons, including MATURED bonds.
     * This ensures the final coupon is not missed when maturity date == coupon date,
     * since MaturityScheduler (00:05) runs before InterestPaymentScheduler (00:15).
     */
    @Query("SELECT a FROM Asset a WHERE a.status IN (com.adorsys.fineract.asset.dto.AssetStatus.ACTIVE, " +
           "com.adorsys.fineract.asset.dto.AssetStatus.MATURED) " +
           "AND a.nextCouponDate IS NOT NULL AND a.nextCouponDate <= :date")
    List<Asset> findBondsWithDueCoupons(@Param("date") LocalDate date);

    /**
     * Find ACTIVE/MATURED bonds with upcoming coupon dates within N days from now.
     * Used by TreasuryShortfallScheduler to detect shortfalls before they happen.
     */
    @Query("SELECT a FROM Asset a WHERE a.status IN (com.adorsys.fineract.asset.dto.AssetStatus.ACTIVE, " +
           "com.adorsys.fineract.asset.dto.AssetStatus.MATURED) " +
           "AND a.nextCouponDate IS NOT NULL AND a.nextCouponDate <= :horizon")
    List<Asset> findBondsWithUpcomingCoupons(@Param("horizon") LocalDate horizon);

    /**
     * Find non-bond ACTIVE assets with due income distributions.
     */
    @Query("SELECT a FROM Asset a WHERE a.status = com.adorsys.fineract.asset.dto.AssetStatus.ACTIVE " +
           "AND a.incomeType IS NOT NULL AND a.nextDistributionDate IS NOT NULL " +
           "AND a.nextDistributionDate <= :date")
    List<Asset> findAssetsWithDueDistributions(@Param("date") LocalDate date);

}
