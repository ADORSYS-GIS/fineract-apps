-- Composite indexes to support user-facing order history queries that filter by status.
-- The NOT IN predicate on status means the planner uses user_id to seek, then filters
-- status in the index rather than fetching heap pages for every row.
CREATE INDEX idx_orders_user_status_created
    ON orders(user_id, status, created_at DESC);

CREATE INDEX idx_orders_user_asset_status_created
    ON orders(user_id, asset_id, status, created_at DESC);
