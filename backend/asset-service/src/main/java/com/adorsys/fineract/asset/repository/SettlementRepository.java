package com.adorsys.fineract.asset.repository;

import com.adorsys.fineract.asset.entity.Settlement;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SettlementRepository extends JpaRepository<Settlement, String> {

    List<Settlement> findByStatus(String status);

    List<Settlement> findByLpClientIdAndStatus(Long lpClientId, String status);

    Page<Settlement> findByStatusIn(List<String> statuses, Pageable pageable);

    long countByStatus(String status);
}
