package com.adorsys.fineract.asset.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

/**
 * Admin request to manually set or update an asset's LP price, sent to
 * {@code PUT /api/admin/assets/{id}/price}.
 *
 * <p>In {@code MANUAL} price mode, the LP's ask and bid prices are fixed at the values
 * provided here. In {@code AUTO} mode, prices are continuously recalculated from the
 * issuer price plus a spread percentage. Switching modes is done by providing
 * {@code priceMode}; omitting it leaves the current mode unchanged.</p>
 *
 * <p>The new prices take effect immediately and are cached in Redis for trade quotes.
 * Any in-flight quotes (QUOTED status) are not retroactively updated.</p>
 */
public record SetPriceRequest(
    /**
     * New LP ask price — the price investors pay when buying units, in XAF.
     * Must be positive. Applied immediately to the asset's price cache.
     */
    @NotNull @Positive BigDecimal askPrice,

    /**
     * New LP bid price — the price investors receive when selling units, in XAF.
     * Must be positive when provided. Null to auto-derive from the ask price using
     * the asset's current spread percentage (i.e. {@code bidPrice = askPrice * (1 - spread)}).
     */
    @Positive BigDecimal bidPrice,

    /**
     * Requested price mode for this asset.
     * {@code MANUAL} pins prices to the values in this request and disables auto-updates.
     * {@code AUTO} re-enables automatic price calculation from the issuer price and spread.
     * Null leaves the current mode unchanged.
     */
    PriceMode priceMode
) {}
