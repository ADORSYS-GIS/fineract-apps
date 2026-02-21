-- V8: Add bid/ask price columns and per-asset exposure limits

-- Bid/ask prices on asset_prices (computed from currentPrice +/- spreadPercent)
ALTER TABLE asset_prices ADD COLUMN bid_price DECIMAL(20, 0);
ALTER TABLE asset_prices ADD COLUMN ask_price DECIMAL(20, 0);

-- Per-asset exposure limits
ALTER TABLE assets ADD COLUMN max_position_percent DECIMAL(5, 2);
ALTER TABLE assets ADD COLUMN max_order_size DECIMAL(20, 8);
ALTER TABLE assets ADD COLUMN daily_trade_limit_xaf DECIMAL(20, 0);
