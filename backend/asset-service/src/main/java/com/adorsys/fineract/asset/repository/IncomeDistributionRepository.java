package com.adorsys.fineract.asset.repository;

import com.adorsys.fineract.asset.entity.IncomeDistribution;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IncomeDistributionRepository extends JpaRepository<IncomeDistribution, Long> {

    Page<IncomeDistribution> findByAssetIdOrderByPaidAtDesc(String assetId, Pageable pageable);

    Page<IncomeDistribution> findByUserIdOrderByPaidAtDesc(Long userId, Pageable pageable);
}
