-- Persists the effective IRCM rate that was used at redemption time.
--
-- Background: the mobile redemption confirmation screen displays the IRCM rate
-- alongside the withholding amount. Reconstructing the rate as
-- ircm_withheld / capital_gain on the frontend has two problems:
--   1. Integer rounding on small capital-gain amounts can shift the displayed
--      rate by 0.1–0.3 percentage points (e.g. 16.5% → 16.8%).
--   2. If an asset's IRCM rate is reconfigured AFTER a redemption (rate
--      override, exemption flag flip), reading the rate from the current
--      asset config would be historically wrong.
--
-- This column captures the exact rate that drove the withholding. PortfolioService
-- exposes it on RedemptionDetailResponse so the screen displays the historically
-- accurate rate without recomputation.
--
-- Nullable for legacy rows written before this migration. The endpoint falls
-- back to ircm_withheld / capital_gain on legacy rows (the old behaviour).

ALTER TABLE principal_redemptions
    ADD COLUMN ircm_rate_applied DECIMAL(10,8);

COMMENT ON COLUMN principal_redemptions.ircm_rate_applied IS
    'Effective IRCM rate at redemption time (e.g. 0.16500000 = 16.5%). Source: TaxService.getEffectiveIrcmRate(asset). Null for legacy rows pre-V4.';
