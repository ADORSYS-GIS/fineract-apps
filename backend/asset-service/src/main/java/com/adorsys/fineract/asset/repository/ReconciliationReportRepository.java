package com.adorsys.fineract.asset.repository;

import com.adorsys.fineract.asset.entity.ReconciliationReport;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ReconciliationReportRepository extends JpaRepository<ReconciliationReport, Long> {

    Page<ReconciliationReport> findByStatusOrderByCreatedAtDesc(String status, Pageable pageable);

    Page<ReconciliationReport> findBySeverityOrderByCreatedAtDesc(String severity, Pageable pageable);

    Page<ReconciliationReport> findByAssetIdOrderByCreatedAtDesc(String assetId, Pageable pageable);

    @Query("SELECT r FROM ReconciliationReport r ORDER BY r.createdAt DESC")
    Page<ReconciliationReport> findAllOrderByCreatedAtDesc(Pageable pageable);

    long countByStatus(String status);
}
