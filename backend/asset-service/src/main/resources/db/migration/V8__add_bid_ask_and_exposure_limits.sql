-- V8: Add per-asset exposure limits

-- Per-asset exposure limits
ALTER TABLE assets ADD COLUMN max_position_percent DECIMAL(5, 2);
ALTER TABLE assets ADD COLUMN max_order_size DECIMAL(20, 8);
ALTER TABLE assets ADD COLUMN daily_trade_limit_xaf DECIMAL(20, 0);
ALTER TABLE assets ADD COLUMN min_order_size DECIMAL(20, 8);
ALTER TABLE assets ADD COLUMN min_order_cash_amount DECIMAL(20, 0);
