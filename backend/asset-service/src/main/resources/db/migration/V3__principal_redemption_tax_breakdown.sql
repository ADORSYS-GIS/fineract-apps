-- Adds tax-breakdown columns to principal_redemptions for full audit trail.
--
-- Background: PrincipalRedemptionService.redeemHolder() already withholds IRCM on
-- BTA capital gain (units × (faceValue − avgPurchasePrice) × ircmRate) and splits
-- the cash transfer into a net leg to the user and an IRCM leg to the tax account.
-- However, the entity only persisted the NET cash_amount, losing the breakdown.
--
-- These new columns let us:
--   1. Reconstruct the full redemption (gross / capital gain / IRCM / net) from the
--      audit table without joining tax_transactions.
--   2. Expose the breakdown via OrderResponse so the mobile redemption screen (09b)
--      can render the four-line summary (gross, capital gain, IRCM withheld, net)
--      without recomputing on the client.
--
-- All columns are nullable to keep historical rows valid; new redemptions written
-- by the service after this migration will populate them.

ALTER TABLE principal_redemptions
    ADD COLUMN gross_cash_amount    DECIMAL(20,0),
    ADD COLUMN avg_purchase_price   DECIMAL(20,8),
    ADD COLUMN capital_gain         DECIMAL(20,0),
    ADD COLUMN ircm_withheld        DECIMAL(20,0);

COMMENT ON COLUMN principal_redemptions.gross_cash_amount  IS 'units * faceValue, before IRCM withholding';
COMMENT ON COLUMN principal_redemptions.avg_purchase_price IS 'Weighted-average cost basis per unit at redemption time, copied from user_position';
COMMENT ON COLUMN principal_redemptions.capital_gain       IS 'units * (faceValue - avgPurchasePrice), clamped at 0 for losses';
COMMENT ON COLUMN principal_redemptions.ircm_withheld      IS 'IRCM withholding paid to the tax account: capital_gain * ircmRate';
