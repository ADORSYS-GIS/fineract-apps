-- V13: Add issue_date to assets (for BTA price accretion) and
--      gross_amount_per_unit to interest_payments (for IRCM breakdown accuracy).

-- BTA issue date: the actual auction/settlement date when the bond was issued.
-- Used by BtaPriceAccretionScheduler in place of the createdAt proxy.
ALTER TABLE assets
    ADD COLUMN issue_date DATE;

-- Gross coupon amount per unit before IRCM withholding, snapshotted at payment time.
-- Allows getPaymentResults() to show gross/ircm/net breakdown using actual ACT-day amounts
-- rather than the less-accurate months/12 approximation.
ALTER TABLE interest_payments
    ADD COLUMN gross_amount_per_unit NUMERIC(20, 4);
