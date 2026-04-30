package com.adorsys.fineract.asset.repository;

import com.adorsys.fineract.asset.entity.LiquidityProvider;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LiquidityProviderRepository extends JpaRepository<LiquidityProvider, Long> {
}
