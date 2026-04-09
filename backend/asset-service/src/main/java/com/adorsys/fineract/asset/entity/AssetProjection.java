package com.adorsys.fineract.asset.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * Denormalized per-asset counters for fast reporting and admin dashboards.
 * One row per asset, keyed by {@link Asset#id}. Updated atomically on each
 * filled trade so that aggregate stats can be queried without scanning
 * {@code trade_log}. All monetary amounts are in settlement currency (XAF).
 * Counters are cumulative from asset creation and are never reset.
 */
@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "asset_projections")
public class AssetProjection {

    /** Asset ID, doubles as the primary key. Matches {@link Asset#id}. */
    @Id
    private String assetId;

    /**
     * Cumulative settlement currency volume of all filled BUY and SELL orders
     * for this asset, in XAF. Incremented by the order's {@code cashAmount} on
     * each fill. Starts at 0; never decremented.
     */
    @Column(name = "total_cash_volume", nullable = false)
    @Builder.Default
    private BigDecimal totalCashVolume = BigDecimal.ZERO;

    /**
     * Cumulative spread (LP margin) earned from all trades on this asset, in XAF.
     * For BUY: (askPrice - issuerPrice) * units.
     * For SELL: (issuerPrice - bidPrice) * units.
     * Starts at 0. Negative only when a configuration error produces inverted prices.
     */
    @Column(name = "total_spread", nullable = false)
    @Builder.Default
    private BigDecimal totalSpread = BigDecimal.ZERO;

    /**
     * Cumulative trading fees collected from users for this asset, in XAF.
     * Each trade contributes {@code cashAmount * tradingFeePercent}. Starts at 0.
     */
    @Column(name = "total_fees", nullable = false)
    @Builder.Default
    private BigDecimal totalFees = BigDecimal.ZERO;

    /**
     * Cumulative registration duty (droit d'enregistrement) collected on trades
     * of this asset, in XAF. Only incremented when {@link Asset#registrationDutyEnabled}
     * is {@code true}. Default rate is 2% of the trade's cash amount. Starts at 0.
     */
    @Column(name = "total_tax_reg_duty", nullable = false)
    @Builder.Default
    private BigDecimal totalTaxRegDuty = BigDecimal.ZERO;

    /**
     * Cumulative IRCM (Impôt sur le Revenu des Capitaux Mobiliers) withheld
     * from income distributions (dividends, coupons, rent) on this asset, in XAF.
     * Only incremented when {@link Asset#ircmEnabled} is {@code true} and the asset
     * is not IRCM-exempt. Starts at 0.
     */
    @Column(name = "total_tax_ircm", nullable = false)
    @Builder.Default
    private BigDecimal totalTaxIrcm = BigDecimal.ZERO;

    /**
     * Cumulative capital gains tax collected on profitable SELL trades of this
     * asset, in XAF. Only incremented when {@link Asset#capitalGainsTaxEnabled}
     * is {@code true}. Default rate is 16.5% of the realized gain. Starts at 0.
     */
    @Column(name = "total_tax_cap_gains", nullable = false)
    @Builder.Default
    private BigDecimal totalTaxCapGains = BigDecimal.ZERO;

    /**
     * Cumulative TVA (Taxe sur la Valeur Ajoutée / VAT) collected on trades of
     * this asset, in XAF. Only incremented when {@link Asset#tvaEnabled} is
     * {@code true}. Starts at 0.
     */
    @Column(name = "total_tax_tva", nullable = false)
    @Builder.Default
    private BigDecimal totalTaxTva = BigDecimal.ZERO;

    /**
     * Total number of filled BUY orders for this asset since creation.
     * Incremented by 1 on each successful BUY execution. Never decremented.
     */
    @Column(name = "total_buy_count", nullable = false)
    @Builder.Default
    private Long totalBuyCount = 0L;

    /**
     * Total number of filled SELL orders for this asset since creation.
     * Incremented by 1 on each successful SELL execution. Never decremented.
     */
    @Column(name = "total_sell_count", nullable = false)
    @Builder.Default
    private Long totalSellCount = 0L;

    /**
     * Timestamp of the last trade that updated this projection.
     * Null until the first trade executes for this asset.
     */
    @Column(name = "last_updated_at")
    private Instant lastUpdatedAt;

    /** Optimistic locking version. Incremented on each counter update to prevent lost updates under concurrent trades. */
    @Version
    private Long version;
}
