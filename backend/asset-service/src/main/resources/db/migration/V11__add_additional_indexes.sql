-- Additional indexes for query performance optimization

-- Covers findByUserId with pagination (user_id, created_at DESC for ORDER BY)
CREATE INDEX IF NOT EXISTS idx_orders_user_created ON orders(user_id, created_at DESC);

-- Covers findByUserIdAndAssetId with pagination
CREATE INDEX IF NOT EXISTS idx_orders_user_asset ON orders(user_id, asset_id, created_at DESC);

-- Covers trade_log queries by user+asset (portfolio analysis)
CREATE INDEX IF NOT EXISTS idx_trade_log_user_asset ON trade_log(user_id, asset_id);

-- Partial index for stale order cleanup (only PENDING/EXECUTING orders)
CREATE INDEX IF NOT EXISTS idx_orders_stale_cleanup ON orders(status, created_at)
    WHERE status IN ('PENDING', 'EXECUTING');
