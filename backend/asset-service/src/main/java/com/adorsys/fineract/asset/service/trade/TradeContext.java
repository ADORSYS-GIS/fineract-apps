package com.adorsys.fineract.asset.service.trade;

import com.adorsys.fineract.asset.entity.Asset;
import com.adorsys.fineract.asset.entity.Order;
import lombok.Builder;
import lombok.Data;
import org.springframework.security.oauth2.jwt.Jwt;

import java.math.BigDecimal;

/**
 * Mutable context object that accumulates state through the trade execution pipeline.
 * Shared between BUY and SELL flows to eliminate duplication.
 */
@Data
@Builder
public class TradeContext {

    // -- Inputs (set at creation) --
    private final String assetId;
    private final BigDecimal units;
    private final String idempotencyKey;
    private final Jwt jwt;
    private final TradeStrategy strategy;

    // -- Resolved during execution --
    private Asset asset;
    private String externalId;
    private Long userId;
    private Long userCashAccountId;
    private Long userAssetAccountId;
    private String orderId;
    private Order order;
    private String lockValue;

    // -- Pricing --
    private BigDecimal basePrice;
    private BigDecimal effectiveSpread;
    private BigDecimal feePercent;
    private BigDecimal executionPrice;
    private BigDecimal grossAmount;
    private BigDecimal fee;
    private BigDecimal spreadAmount;
    private BigDecimal orderCashAmount;

    // -- Output --
    private BigDecimal realizedPnl;
}
