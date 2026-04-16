package com.adorsys.fineract.asset.dto;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * Order history entry returned to the authenticated user.
 *
 * <p><b>Amount breakdown:</b> {@code totalAmount} is the single net figure that cleared the
 * user's account. The remaining fields decompose that total into its components:
 * <pre>
 *   BUY:  totalAmount = grossAmount + fee + registrationDutyAmount + tvaAmount + accruedInterestAmount
 *   SELL: totalAmount = grossAmount - fee - registrationDutyAmount - capitalGainsTaxAmount
 *                       - tvaAmount + accruedInterestAmount
 * </pre>
 * where {@code grossAmount = units × pricePerUnit}. Tax fields are null for orders where the
 * corresponding tax does not apply (e.g. {@code capitalGainsTaxAmount} is always null on BUY).
 */
public record OrderResponse(
    /** UUID of the order. */
    String orderId,

    /** ID of the asset that was traded. */
    String assetId,

    /** Ticker symbol of the traded asset, e.g. "BRVM-TST". */
    String symbol,

    /** Direction of the trade: BUY or SELL. */
    TradeSide side,

    /** Number of asset units traded. Null while the order is still in QUOTED or PENDING status. */
    BigDecimal units,

    /**
     * Execution price per unit at the moment the trade was locked, in settlement currency (XAF).
     * For BUY this is the LP ask price; for SELL this is the LP bid price.
     * Null while the order is still in QUOTED or PENDING status.
     */
    BigDecimal pricePerUnit,

    /**
     * Gross trade value before fees and taxes, in settlement currency (XAF).
     * Formula: {@code units × pricePerUnit}.
     * Null while the order is still in QUOTED or PENDING status.
     */
    BigDecimal grossAmount,

    /**
     * Net amount that cleared the user's account, in settlement currency (XAF).
     * <ul>
     *   <li>BUY: total debited from the user's cash account
     *       ({@code grossAmount + fee + taxes + accruedInterest}).</li>
     *   <li>SELL: total credited to the user's cash account
     *       ({@code grossAmount - fee - taxes + accruedInterest}).</li>
     * </ul>
     * Use the individual breakdown fields below to see how this figure is composed.
     */
    BigDecimal totalAmount,

    /**
     * Platform trading fee charged for this order, in settlement currency (XAF).
     * Calculated as a percentage of the gross amount ({@code units × pricePerUnit}).
     * Deducted from the user on BUY; deducted from the user's proceeds on SELL.
     * Null while the order is still in QUOTED or PENDING status.
     */
    BigDecimal fee,

    /**
     * LP spread collected for this order, in settlement currency (XAF).
     * Represents the difference between the LP execution price and the issuer mid-price.
     * Zero if spread collection is disabled for this asset. Null while pending.
     */
    BigDecimal spreadAmount,

    /** Current lifecycle status of the order. See {@link OrderStatus} for the full state machine. */
    OrderStatus status,

    /** Timestamp when the order was created (UTC). */
    Instant createdAt,

    /**
     * Registration duty (droit d'enregistrement) charged on this order, in settlement currency (XAF).
     * Applies to both BUY and SELL orders depending on asset configuration.
     * Null if registration duty is not configured for this asset or the order has not yet executed.
     */
    BigDecimal registrationDutyAmount,

    /**
     * Capital gains tax charged on this order, in settlement currency (XAF).
     * Only applicable to SELL orders where the user has a net gain over their average purchase price.
     * Null for BUY orders and SELL orders where no gain was realised or the annual exemption applies.
     */
    BigDecimal capitalGainsTaxAmount,

    /**
     * TVA (Value Added Tax) charged on this order, in settlement currency (XAF).
     * Calculated on the platform fee ({@code fee × tvaRate}).
     * Null if TVA is not configured for this asset or the order has not yet executed.
     */
    BigDecimal tvaAmount,

    /**
     * Accrued interest (pied du coupon) for coupon-bearing bonds, in settlement currency (XAF).
     * Represents the interest that has accumulated since the last coupon payment date.
     * Added to the buyer's cost on BUY and added to the seller's proceeds on SELL.
     * Null for non-bond assets and bonds with no accrued interest at execution time.
     */
    BigDecimal accruedInterestAmount
) {}
