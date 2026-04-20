package com.adorsys.fineract.asset.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Request body for the admin initiate-delisting endpoint
 * ({@code POST /admin/assets/{id}/delist}). Transitions the asset from ACTIVE to
 * DELISTING status and schedules a forced buyback on the specified date. During the
 * DELISTING grace period BUY orders are blocked but SELL orders remain open so
 * existing holders can exit voluntarily before the forced redemption.
 *
 * <p>When the delisting date arrives, the scheduled delisting executor automatically
 * buys back all remaining positions at {@code redemptionPrice} per unit and transitions
 * the asset to DELISTED status.</p>
 */
public record DelistAssetRequest(
    /**
     * Date on which the forced buyback will execute. Must be in the future. Defaults to
     * 30 days from the time of the request when null, giving holders a standard grace period.
     */
    @Schema(description = "Date on which forced buyback will occur. Defaults to 30 days from now if null.")
    LocalDate delistingDate,
    /**
     * Per-unit price in XAF at which remaining holdings will be compulsorily redeemed
     * on the delisting date. When null, the service uses the last traded (ask) price
     * at the time the delisting executor runs. Admins may specify a negotiated or
     * fair-value price when the last traded price is not appropriate.
     */
    @Schema(description = "Price per unit for forced buyback. Uses last traded price if null.", nullable = true)
    BigDecimal redemptionPrice
) {}
