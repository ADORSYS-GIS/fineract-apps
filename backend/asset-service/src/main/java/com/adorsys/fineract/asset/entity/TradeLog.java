package com.adorsys.fineract.asset.entity;

import com.adorsys.fineract.asset.dto.TradeSide;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * Immutable record of an executed trade. Created once when an order is filled.
 * Stores the execution details and, for SELL trades, the realized P&L.
 */
@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "trade_log")
public class TradeLog {

    /** UUID primary key, generated at trade execution. */
    @Id
    private String id;

    /** ID of the parent {@link Order} that produced this trade. */
    @Column(name = "order_id", nullable = false)
    private String orderId;

    /** Fineract user/client ID that executed this trade. */
    @Column(name = "user_id", nullable = false)
    private Long userId;

    /** ID of the asset traded. References {@link Asset#id}. */
    @Column(name = "asset_id", nullable = false)
    private String assetId;

    /** Direction of the trade: BUY or SELL. */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 4)
    private TradeSide side;

    /** Number of asset units bought or sold in this trade. */
    @Column(nullable = false, precision = 20, scale = 8)
    private BigDecimal units;

    /** Execution price per unit, in XAF. */
    @Column(name = "price_per_unit", nullable = false, precision = 20, scale = 0)
    private BigDecimal pricePerUnit;

    /** Total XAF amount of this trade. For BUY: amount spent (before fees). For SELL: net proceeds (after fees). */
    @Column(name = "total_amount", nullable = false, precision = 20, scale = 0)
    private BigDecimal totalAmount;

    /** Trading fee charged for this trade, in XAF. Defaults to 0. */
    @Column(nullable = false, precision = 20, scale = 0)
    private BigDecimal fee;

    /** Realized profit/loss from this trade, in XAF. Only set for SELL trades: (sellPrice - avgPurchasePrice) × units. Null for BUY trades. */
    @Column(name = "realized_pnl", precision = 20, scale = 0)
    private BigDecimal realizedPnl;

    /** Fineract journal entry ID for the XAF cash transfer leg of this trade. */
    @Column(name = "fineract_cash_transfer_id")
    private Long fineractCashTransferId;

    /** Fineract journal entry ID for the asset unit transfer leg of this trade. */
    @Column(name = "fineract_asset_transfer_id")
    private Long fineractAssetTransferId;

    /** Timestamp when this trade was executed. Defaults to now if not set. */
    @Column(name = "executed_at", nullable = false)
    private Instant executedAt;

    @PrePersist
    protected void onCreate() {
        if (executedAt == null) executedAt = Instant.now();
        if (fee == null) fee = BigDecimal.ZERO;
    }
}
