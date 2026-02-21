-- V9: Add lock-up period support

-- Per-asset lockup period in days (NULL = no lockup)
ALTER TABLE assets ADD COLUMN lockup_days INTEGER;

-- Track first purchase date on each position (set on first BUY, never updated on subsequent BUYs)
ALTER TABLE user_positions ADD COLUMN first_purchase_date TIMESTAMPTZ;
