package com.adorsys.fineract.asset.entity;

import com.adorsys.fineract.asset.dto.TradeSide;
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
@Table(name = "trade_log")
public class TradeLog {

    @Id
    private String id;

    @Column(name = "order_id", nullable = false)
    private String orderId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "asset_id", nullable = false)
    private String assetId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 4)
    private TradeSide side;

    @Column(nullable = false, precision = 20, scale = 8)
    private BigDecimal units;

    @Column(name = "price_per_unit", nullable = false, precision = 20, scale = 0)
    private BigDecimal pricePerUnit;

    @Column(name = "total_amount", nullable = false, precision = 20, scale = 0)
    private BigDecimal totalAmount;

    @Column(nullable = false, precision = 20, scale = 0)
    private BigDecimal fee;

    @Column(name = "realized_pnl", precision = 20, scale = 0)
    private BigDecimal realizedPnl;

    @Column(name = "fineract_cash_transfer_id")
    private Long fineractCashTransferId;

    @Column(name = "fineract_asset_transfer_id")
    private Long fineractAssetTransferId;

    @Column(name = "executed_at", nullable = false)
    private Instant executedAt;

    @PrePersist
    protected void onCreate() {
        if (executedAt == null) executedAt = Instant.now();
        if (fee == null) fee = BigDecimal.ZERO;
    }
}
