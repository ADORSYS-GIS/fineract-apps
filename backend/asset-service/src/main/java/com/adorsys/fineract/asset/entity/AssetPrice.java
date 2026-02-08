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
@Table(name = "asset_prices")
public class AssetPrice {

    @Id
    @Column(name = "asset_id")
    private String assetId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "asset_id", insertable = false, updatable = false)
    private Asset asset;

    @Column(name = "current_price", nullable = false, precision = 20, scale = 0)
    private BigDecimal currentPrice;

    @Column(name = "previous_close", precision = 20, scale = 0)
    private BigDecimal previousClose;

    @Column(name = "change_24h_percent", precision = 10, scale = 4)
    private BigDecimal change24hPercent;

    @Column(name = "day_open", precision = 20, scale = 0)
    private BigDecimal dayOpen;

    @Column(name = "day_high", precision = 20, scale = 0)
    private BigDecimal dayHigh;

    @Column(name = "day_low", precision = 20, scale = 0)
    private BigDecimal dayLow;

    @Column(name = "day_close", precision = 20, scale = 0)
    private BigDecimal dayClose;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @PrePersist
    @PreUpdate
    protected void onPersist() {
        updatedAt = Instant.now();
    }
}
