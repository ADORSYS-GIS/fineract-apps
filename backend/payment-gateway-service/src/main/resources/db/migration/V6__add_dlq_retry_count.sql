-- Add retry_count column to track automated DLQ retry attempts.
-- The ReversalDlqRetryScheduler increments this on each failed retry
-- and stops retrying once max-retries is exceeded.
ALTER TABLE reversal_dead_letters ADD COLUMN retry_count INTEGER DEFAULT 0;
