-- Widen status column to accommodate NEEDS_RECONCILIATION (22 chars)
ALTER TABLE orders ALTER COLUMN status TYPE VARCHAR(25);

-- Update stale cleanup index to include new status
DROP INDEX IF EXISTS idx_orders_stale_cleanup;
CREATE INDEX idx_orders_stale_cleanup ON orders(status, created_at)
    WHERE status IN ('PENDING', 'EXECUTING', 'NEEDS_RECONCILIATION');
