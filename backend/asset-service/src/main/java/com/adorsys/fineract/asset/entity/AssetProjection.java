package com.adorsys.fineract.asset.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * Denormalized per-asset counters for fast reporting.
 * Updated atomically with each filled trade.
 */
@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "asset_projections")
public class AssetProjection {

    @Id
    private String assetId;

    @Column(name = "total_cash_volume", nullable = false)
    @Builder.Default
    private BigDecimal totalCashVolume = BigDecimal.ZERO;

    @Column(name = "total_spread", nullable = false)
    @Builder.Default
    private BigDecimal totalSpread = BigDecimal.ZERO;

    @Column(name = "total_fees", nullable = false)
    @Builder.Default
    private BigDecimal totalFees = BigDecimal.ZERO;

    @Column(name = "total_tax_reg_duty", nullable = false)
    @Builder.Default
    private BigDecimal totalTaxRegDuty = BigDecimal.ZERO;

    @Column(name = "total_tax_ircm", nullable = false)
    @Builder.Default
    private BigDecimal totalTaxIrcm = BigDecimal.ZERO;

    @Column(name = "total_tax_cap_gains", nullable = false)
    @Builder.Default
    private BigDecimal totalTaxCapGains = BigDecimal.ZERO;

    @Column(name = "total_tax_tva", nullable = false)
    @Builder.Default
    private BigDecimal totalTaxTva = BigDecimal.ZERO;

    @Column(name = "total_buy_count", nullable = false)
    @Builder.Default
    private Long totalBuyCount = 0L;

    @Column(name = "total_sell_count", nullable = false)
    @Builder.Default
    private Long totalSellCount = 0L;

    @Column(name = "last_updated_at")
    private Instant lastUpdatedAt;

    @Version
    private Long version;
}
