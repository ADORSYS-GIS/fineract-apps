ALTER TABLE payment_transactions ADD COLUMN stale_resolution_retry_count INT NOT NULL DEFAULT 0;
