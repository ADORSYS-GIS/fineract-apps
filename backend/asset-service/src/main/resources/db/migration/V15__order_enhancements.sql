-- Indexes for order filtering performance
CREATE INDEX idx_orders_asset_status ON orders(asset_id, status);
CREATE INDEX idx_orders_user_external_id ON orders(user_external_id);

-- Allow admin broadcast notifications (userId = NULL)
ALTER TABLE notification_log ALTER COLUMN user_id DROP NOT NULL;
