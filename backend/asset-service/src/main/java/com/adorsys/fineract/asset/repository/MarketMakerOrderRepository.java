package com.adorsys.fineract.asset.repository;

import com.adorsys.fineract.asset.dto.TradeSide;
import com.adorsys.fineract.asset.entity.MarketMakerOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MarketMakerOrderRepository extends JpaRepository<MarketMakerOrder, String> {

    List<MarketMakerOrder> findByAssetIdAndIsActiveTrueOrderByPriceAsc(String assetId);

    List<MarketMakerOrder> findByAssetIdAndSideAndIsActiveTrueOrderByPriceAsc(String assetId, TradeSide side);

    List<MarketMakerOrder> findByAssetIdAndSideAndIsActiveTrueOrderByPriceDesc(String assetId, TradeSide side);

    List<MarketMakerOrder> findByAssetIdOrderByCreatedAtDesc(String assetId);
}
