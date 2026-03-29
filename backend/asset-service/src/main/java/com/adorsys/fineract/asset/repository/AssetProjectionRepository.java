package com.adorsys.fineract.asset.repository;

import com.adorsys.fineract.asset.entity.AssetProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.Instant;

@Repository
public interface AssetProjectionRepository extends JpaRepository<AssetProjection, String> {

    @Modifying
    @Query("""
        UPDATE AssetProjection p SET
            p.totalCashVolume = p.totalCashVolume + :cashVolume,
            p.totalSpread = p.totalSpread + :spread,
            p.totalFees = p.totalFees + :fees,
            p.totalTaxRegDuty = p.totalTaxRegDuty + :taxRegDuty,
            p.totalTaxCapGains = p.totalTaxCapGains + :taxCapGains,
            p.totalTaxTva = p.totalTaxTva + :taxTva,
            p.totalBuyCount = p.totalBuyCount + :buyIncrement,
            p.totalSellCount = p.totalSellCount + :sellIncrement,
            p.lastUpdatedAt = :now
        WHERE p.assetId = :assetId
    """)
    int incrementCounters(
            @Param("assetId") String assetId,
            @Param("cashVolume") BigDecimal cashVolume,
            @Param("spread") BigDecimal spread,
            @Param("fees") BigDecimal fees,
            @Param("taxRegDuty") BigDecimal taxRegDuty,
            @Param("taxCapGains") BigDecimal taxCapGains,
            @Param("taxTva") BigDecimal taxTva,
            @Param("buyIncrement") long buyIncrement,
            @Param("sellIncrement") long sellIncrement,
            @Param("now") Instant now
    );
}
