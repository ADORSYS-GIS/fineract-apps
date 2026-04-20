-- V16: Track cumulative fees and taxes paid per position.
-- Allows GET /portfolio and GET /portfolio/positions/{id} to surface total transaction
-- costs without aggregating the full order history at read time.

ALTER TABLE user_positions
    ADD COLUMN total_fees_paid  NUMERIC(20, 0) NOT NULL DEFAULT 0,
    ADD COLUMN total_taxes_paid NUMERIC(20, 0) NOT NULL DEFAULT 0;

-- Backfill from existing FILLED order history so existing positions show correct totals.
-- total_fees_paid  = sum of platform fee + TVA for all filled orders
-- total_taxes_paid = sum of registration duty + capital gains tax for all filled orders
UPDATE user_positions up
SET
    total_fees_paid = (
        SELECT COALESCE(SUM(COALESCE(fee, 0) + COALESCE(tva_amount, 0)), 0)
        FROM orders
        WHERE user_id = up.user_id
          AND asset_id = up.asset_id
          AND status = 'FILLED'
    ),
    total_taxes_paid = (
        SELECT COALESCE(SUM(COALESCE(registration_duty_amount, 0) + COALESCE(capital_gains_tax_amount, 0)), 0)
        FROM orders
        WHERE user_id = up.user_id
          AND asset_id = up.asset_id
          AND status = 'FILLED'
    );
