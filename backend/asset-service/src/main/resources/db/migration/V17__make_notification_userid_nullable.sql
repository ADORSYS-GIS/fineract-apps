-- Allow user_id to be NULL for admin broadcast notifications
ALTER TABLE notification_log ALTER COLUMN user_id DROP NOT NULL;

-- Index for admin notification queries (user_id IS NULL)
CREATE INDEX idx_notif_admin_created ON notification_log(created_at DESC)
    WHERE user_id IS NULL;
