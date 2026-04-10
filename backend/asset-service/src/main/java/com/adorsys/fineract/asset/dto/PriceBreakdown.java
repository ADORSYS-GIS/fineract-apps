package com.adorsys.fineract.asset.dto;

import java.math.BigDecimal;
import org.springframework.lang.Nullable;

/**
 * Itemized price breakdown for a trade quote, embedded in {@link QuoteResponse}.
 *
 * <p>Decomposes the execution price into its clean and dirty components, shows how the
 * gross proceeds are derived from units and price, and itemises the platform fee
 * and final net amount the user will pay or receive.</p>
 *
 * <p>Only present for bond assets (COUPON/DISCOUNT). Null for non-bond assets.</p>
 *
 * <p>All monetary amounts are in XAF unless otherwise noted.</p>
 */
public record PriceBreakdown(
    /** Clean execution price per unit (LP ask for BUY, LP bid for SELL). */
    BigDecimal cleanPricePerUnit,

    /** Accrued coupon couru per unit. Zero for BTA/DISCOUNT bonds. */
    BigDecimal accruedInterestPerUnit,

    /** Dirty price = cleanPrice + accruedInterest. */
    BigDecimal dirtyPricePerUnit,

    /** Number of units. */
    BigDecimal units,

    /** Gross proceeds before fee (dirtyPrice × units). */
    BigDecimal grossAmount,

    /** Platform fee (floor to nearest XAF). */
    BigDecimal platformFee,

    /** Fee basis note: always the clean price, not the dirty price. */
    String feeBasisNote,

    /** Net amount after fee (for SELL: grossAmount - platformFee; for BUY: grossAmount + platformFee). */
    BigDecimal netAmount,

    /** Day count convention used for accrued calculation. Null for non-bond assets. */
    @Nullable String dayCountConvention,

    /** Days since last coupon (OTA only). Null for BTA or non-bonds. */
    @Nullable Long daysSinceLastCoupon
) {}
