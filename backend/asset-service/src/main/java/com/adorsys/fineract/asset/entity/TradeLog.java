package com.adorsys.fineract.asset.entity;

import com.adorsys.fineract.asset.dto.TradeSide;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * Immutable execution record of a filled trade. Created exactly once by the order
 * execution service immediately after the Fineract batch transfer succeeds, and
 * linked to the parent {@link Order} by {@code orderId}.
 * <p>
 * While {@link Order} tracks the command and its lifecycle state, {@code TradeLog}
 * is the append-only ledger of what actually happened: units moved, prices paid,
 * fees charged, and realized P&amp;L computed. Rows must never be updated or deleted.
 * <p>
 * The no-args constructor has protected access ({@code @NoArgsConstructor(access = PROTECTED)})
 * to enforce builder-only construction and prevent accidental mutation via reflection.
 * <p>
 * For BUY trades: {@code totalAmount = units * pricePerUnit} (gross cost before fees).
 * For SELL trades: {@code totalAmount} is the net proceeds after fee and spread deduction.
 */
@Getter
@Entity
@Builder
@NoArgsConstructor(access = lombok.AccessLevel.PROTECTED)
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

    /** Execution price per unit, in settlement currency. */
    @Column(name = "price_per_unit", nullable = false, precision = 20, scale = 0)
    private BigDecimal pricePerUnit;

    /** Total settlement currency amount of this trade. For BUY: amount spent (before fees). For SELL: net proceeds (after fees). */
    @Column(name = "total_amount", nullable = false, precision = 20, scale = 0)
    private BigDecimal totalAmount;

    /** Trading fee charged for this trade, in settlement currency. Defaults to 0. */
    @Column(nullable = false, precision = 20, scale = 0)
    private BigDecimal fee;

    /** Spread amount for this trade, in settlement currency. Zero if spread is disabled. */
    @Column(name = "spread_amount", nullable = false, precision = 20, scale = 0)
    private BigDecimal spreadAmount;

    /** Buyback premium for SELL trades where bid > issuer price. Zero otherwise. */
    @Column(name = "buyback_premium", nullable = false, precision = 20, scale = 0)
    private BigDecimal buybackPremium;

    /** Accrued interest amount for coupon bond (OTA) trades. Null for non-bond trades. */
    @Column(name = "accrued_interest_amount", precision = 20, scale = 0)
    private BigDecimal accruedInterestAmount;

    /** Realized profit/loss from this trade, in settlement currency. Only set for SELL trades: (sellPrice - avgPurchasePrice) × units. Null for BUY trades. */
    @Column(name = "realized_pnl", precision = 20, scale = 0)
    private BigDecimal realizedPnl;

    /** Fineract journal entry ID for the cash transfer leg of this trade. */
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
        if (spreadAmount == null) spreadAmount = BigDecimal.ZERO;
        if (buybackPremium == null) buybackPremium = BigDecimal.ZERO;
    }
}
