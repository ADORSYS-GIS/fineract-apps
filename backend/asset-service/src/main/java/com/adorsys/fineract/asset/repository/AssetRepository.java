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
     * Find ACTIVE bonds whose maturity date has passed (for MaturityScheduler).
     */
    List<Asset> findByStatusAndMaturityDateLessThanEqual(AssetStatus status, LocalDate date);

    /**
     * Find ACTIVE bonds whose next coupon date is due (for InterestPaymentScheduler).
     */
    List<Asset> findByStatusAndNextCouponDateLessThanEqual(AssetStatus status, LocalDate date);

}
