package com.adorsys.fineract.asset.repository;

import com.adorsys.fineract.asset.entity.CategorySnapshot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface CategorySnapshotRepository extends JpaRepository<CategorySnapshot, Long> {

    List<CategorySnapshot> findByUserIdAndSnapshotDateGreaterThanEqualOrderBySnapshotDateAsc(
            Long userId, LocalDate fromDate);

    /**
     * Upsert a category snapshot — inserts a new row or updates total_value if
     * a row for the same (user_id, snapshot_date, category) already exists.
     */
    @Modifying
    @Query(value = "INSERT INTO category_snapshots (user_id, snapshot_date, category, total_value, created_at) " +
                   "VALUES (:userId, :snapshotDate, :category, :totalValue, NOW()) " +
                   "ON CONFLICT ON CONSTRAINT uq_category_snapshot " +
                   "DO UPDATE SET total_value = :totalValue",
           nativeQuery = true)
    void upsert(@Param("userId") Long userId,
                @Param("snapshotDate") LocalDate snapshotDate,
                @Param("category") String category,
                @Param("totalValue") BigDecimal totalValue);
}
