package com.adorsys.fineract.asset.dto;

/**
 * Classification of bond instruments by their interest payment mechanism. The two types
 * correspond to the two main sovereign debt instruments issued in the CEMAC monetary zone.
 * The bond type governs the yield calculation formula, which coupon fields are required,
 * and how the redemption amount is computed at maturity.
 *
 * <p>Used in {@link AssetDetailResponse}, {@link AssetResponse}, {@link BondBenefitProjection},
 * and the asset creation/update request DTOs. Stored as a string column in the asset table.</p>
 */
public enum BondType {
    /**
     * OTA (Obligations du Trésor Assimilables) — the CEMAC equivalent of T-Bonds.
     * Investors receive periodic coupon payments over the life of the bond and are repaid
     * the full face value at maturity. Requires {@code interestRate}, {@code couponFrequencyMonths},
     * and {@code nextCouponDate} to be configured. Yield is expressed as the nominal coupon
     * rate and the current yield derived from the ask price.
     */
    COUPON,
    /**
     * BTA (Bons du Trésor Assimilables) — the CEMAC equivalent of T-Bills or zero-coupon bonds.
     * Investors purchase the bond at a discount to face value and receive no periodic interest.
     * At maturity they are repaid the full {@code faceValue} per unit. The investor's return
     * is entirely the difference between the purchase price and the face value. Coupon-related
     * fields ({@code interestRate}, {@code couponFrequencyMonths}, etc.) are null for this type.
     */
    DISCOUNT
}
