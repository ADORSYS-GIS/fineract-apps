package com.adorsys.fineract.asset.repository;

import com.adorsys.fineract.asset.entity.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    Page<AuditLog> findAllByOrderByPerformedAtDesc(Pageable pageable);

    @Query("SELECT a FROM AuditLog a WHERE "
         + "(:admin IS NULL OR a.adminSubject = :admin) AND "
         + "(:assetId IS NULL OR a.targetAssetId = :assetId) AND "
         + "(:action IS NULL OR a.action = :action) "
         + "ORDER BY a.performedAt DESC")
    Page<AuditLog> findFiltered(@Param("admin") String admin,
                                @Param("assetId") String assetId,
                                @Param("action") String action,
                                Pageable pageable);
}
