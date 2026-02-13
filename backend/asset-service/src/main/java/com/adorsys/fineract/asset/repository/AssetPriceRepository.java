package com.adorsys.fineract.asset.repository;

import com.adorsys.fineract.asset.entity.AssetPrice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssetPriceRepository extends JpaRepository<AssetPrice, String> {

    List<AssetPrice> findAllByAssetIdIn(List<String> assetIds);
}
