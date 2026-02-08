package com.adorsys.fineract.asset.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "user_positions", uniqueConstraints = {
    @UniqueConstraint(name = "uq_user_positions", columnNames = {"user_id", "asset_id"})
})
public class UserPosition {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "asset_id", nullable = false)
    private String assetId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "asset_id", insertable = false, updatable = false)
    private Asset asset;

    @Column(name = "fineract_savings_account_id", nullable = false)
    private Long fineractSavingsAccountId;

    @Column(name = "total_units", nullable = false, precision = 20, scale = 8)
    private BigDecimal totalUnits;

    @Column(name = "avg_purchase_price", nullable = false, precision = 20, scale = 0)
    private BigDecimal avgPurchasePrice;

    @Column(name = "total_cost_basis", nullable = false, precision = 20, scale = 0)
    private BigDecimal totalCostBasis;

    @Column(name = "realized_pnl", nullable = false, precision = 20, scale = 0)
    private BigDecimal realizedPnl;

    @Column(name = "last_trade_at", nullable = false)
    private Instant lastTradeAt;

    @Version
    private Long version;

    @PrePersist
    protected void onCreate() {
        if (totalUnits == null) totalUnits = BigDecimal.ZERO;
        if (avgPurchasePrice == null) avgPurchasePrice = BigDecimal.ZERO;
        if (totalCostBasis == null) totalCostBasis = BigDecimal.ZERO;
        if (realizedPnl == null) realizedPnl = BigDecimal.ZERO;
        if (lastTradeAt == null) lastTradeAt = Instant.now();
    }
}
