package com.adorsys.fineract.asset.dto;

/** How an asset's price is determined. */
public enum PriceMode {
    /** Price is derived automatically from market activity. */
    AUTO,
    /** Price is set manually by an admin via the SetPrice API. */
    MANUAL
}
