package com.adorsys.fineract.asset.dto;

/** Lifecycle status of an asset. */
public enum AssetStatus {
    /** Asset created but not yet available for trading. */
    PENDING,
    /** Asset is live and available for trading. */
    ACTIVE,
    /** Trading temporarily suspended by admin. */
    HALTED,
    /** Asset permanently removed from trading. */
    DELISTED,
    /** Bond reached maturity date; no further trading allowed. */
    MATURED,
    /** Bond principal has been fully redeemed; all holders paid out. */
    REDEEMED
}
