package com.adorsys.fineract.asset.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

/**
 * Response from creating a trade quote. Contains a price-locked order with
 * feasibility data and a countdown until expiry.
 */
public record QuoteResponse(
    /** Order ID for this quote. Use to confirm or cancel. */
    String orderId,
    /** Current status — always QUOTED for a fresh quote. */
    OrderStatus status,
    String assetId,
    String assetSymbol,
    TradeSide side,
    BigDecimal units,
    /** Execution price (LP ask for BUY, LP bid for SELL). Locked for the quote duration. */
    BigDecimal executionPrice,
    /** LP margin per unit: |executionPrice - issuerPrice|. */
    BigDecimal lpMarginPerUnit,
    /** units x executionPrice */
    BigDecimal grossAmount,
    /** grossAmount x feePercent */
    BigDecimal fee,
    BigDecimal feePercent,
    /** Spread amount in settlement currency. Zero if spread is disabled. */
    BigDecimal spreadAmount,
    /** Accrued interest for coupon bond (OTA) trades. Added to buyer cost / seller proceeds. Null for non-bond trades. */
    BigDecimal accruedInterestAmount,
    /** BUY: grossAmount + fee + accruedInterest (total charged). SELL: grossAmount - fee + accruedInterest (net proceeds). */
    BigDecimal netAmount,
    /** User's available cash balance, null if could not resolve. */
    BigDecimal availableBalance,
    /** User's held units for this asset (SELL only), null for BUY. */
    BigDecimal availableUnits,
    /** Remaining asset inventory (BUY only), null for SELL. */
    BigDecimal availableSupply,
    /** Bond benefit projections. Null for non-bond assets. */
    BondBenefitProjection bondBenefit,
    /** Income benefit projections. Null for bonds and non-income assets. */
    IncomeBenefitProjection incomeBenefit,
    /** Original XAF amount from amount-based quote. Null in unit-based mode. */
    BigDecimal computedFromAmount,
    /** Leftover XAF that cannot buy another unit. Null in unit-based mode. */
    BigDecimal remainder,
    /** When this quote was created. */
    Instant quotedAt,
    /** When this quote expires. Confirm before this time. */
    Instant quoteExpiresAt,
    /** Warning codes (e.g. MARKET_CLOSED). Empty if no warnings. */
    List<String> warnings,
    /** Tax breakdown: registration duty, capital gains, total. Null if taxes disabled. */
    TaxBreakdown taxBreakdown
) {}
