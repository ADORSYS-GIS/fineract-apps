-- Index for order → trade log lookups
CREATE INDEX idx_trade_log_order ON trade_log(order_id);

-- Index for user_positions by asset (covers portfolio queries filtered by asset)
CREATE INDEX idx_user_positions_asset ON user_positions(asset_id);

-- Increase avg_purchase_price precision to support WAP with 4 decimal places
ALTER TABLE user_positions ALTER COLUMN avg_purchase_price TYPE DECIMAL(20,4);
