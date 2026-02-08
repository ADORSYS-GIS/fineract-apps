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
@Table(name = "price_history")
public class PriceHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "asset_id", nullable = false)
    private String assetId;

    @Column(nullable = false, precision = 20, scale = 0)
    private BigDecimal price;

    @Column(name = "captured_at", nullable = false)
    private Instant capturedAt;

    @PrePersist
    protected void onCreate() {
        if (capturedAt == null) capturedAt = Instant.now();
    }
}
