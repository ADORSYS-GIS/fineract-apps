package com.adorsys.fineract.asset.dto;

/** Classification of bond instruments by their interest payment mechanism. */
public enum BondType {
    /** OTA (Obligations du Tresor Assimilables) / T-Bonds: periodic coupon payments. */
    COUPON,
    /** BTA (Bons du Tresor Assimilables) / T-Bills: zero-coupon, bought at discount, redeemed at face value. */
    DISCOUNT
}
