-- V19: Add buyback premium tracking to orders
--
-- When LP bid price > issuer price on SELL, the premium is funded from LP Spread.
-- This column tracks the premium amount per order for reporting:
--   net_lp_margin = SUM(spread_amount) - SUM(buyback_premium)

ALTER TABLE orders ADD COLUMN buyback_premium DECIMAL(20, 0) DEFAULT 0;
