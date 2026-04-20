package com.adorsys.fineract.asset.dto;

/**
 * Lifecycle status of an asset, controlling which operations the platform permits.
 * Status transitions are driven by admin actions and automated schedulers (e.g. the
 * maturity checker and the delisting executor). The valid transitions are:
 *
 * <pre>
 *   PENDING → ACTIVE      (admin activates the asset)
 *   ACTIVE  → HALTED      (admin suspends trading)
 *   HALTED  → ACTIVE      (admin resumes trading)
 *   ACTIVE  → DELISTING   (admin initiates delisting with a future date)
 *   DELISTING → DELISTED  (scheduled executor runs the forced buyback)
 *   ACTIVE  → MATURED     (maturity scheduler detects the bond's maturity date has passed)
 *   MATURED → REDEEMED    (redemption scheduler pays out all holders' principal)
 * </pre>
 *
 * <p>Used in {@link AssetResponse}, {@link AssetDetailResponse}, and order validation logic.</p>
 */
public enum AssetStatus {
    /** Asset record has been created by an admin but is not yet available for trading. */
    PENDING,
    /** Asset is live — BUY and SELL orders are both accepted. */
    ACTIVE,
    /** Trading has been temporarily suspended by an admin. No orders accepted until reactivated. */
    HALTED,
    /**
     * Delisting grace period is in progress. BUY orders are blocked to stop new purchases,
     * but SELL orders are still accepted so existing holders can exit before the forced buyback.
     */
    DELISTING,
    /**
     * Asset has been permanently removed from trading. All remaining holders were paid out
     * at the configured {@code delistingRedemptionPrice} when the delisting executor ran.
     */
    DELISTED,
    /**
     * Bond asset whose {@code maturityDate} has passed. No new orders are accepted.
     * The redemption scheduler will process holder payouts and transition to REDEEMED.
     */
    MATURED,
    /**
     * Bond whose principal repayment has been fully processed. All unit holders have received
     * their {@code faceValue} per unit from the LP's cash account. The asset is closed.
     */
    REDEEMED
}
