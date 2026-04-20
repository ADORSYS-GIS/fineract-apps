package com.adorsys.fineract.asset.repository;

import com.adorsys.fineract.asset.entity.Settlement;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SettlementRepository extends JpaRepository<Settlement, String> {

    List<Settlement> findByStatus(String status);

    List<Settlement> findByLpClientIdAndStatus(Long lpClientId, String status);

    Page<Settlement> findByStatusIn(List<String> statuses, Pageable pageable);

    long countByStatus(String status);

    /**
     * Atomically transitions a settlement from APPROVED to EXECUTING.
     * Returns 1 if the row was updated (caller may proceed to Fineract), 0 if it was not
     * (another thread won the race or the settlement is not in APPROVED state).
     * This prevents duplicate journal entries under concurrent execution attempts.
     */
    @Modifying
    @Query("UPDATE Settlement s SET s.status = 'EXECUTING' WHERE s.id = :id AND s.status = 'APPROVED'")
    int transitionToExecuting(@Param("id") String id);
}
