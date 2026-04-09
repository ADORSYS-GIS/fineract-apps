-- Separate idempotency key from transaction ID.
-- Previously transactionId = idempotencyKey; now transactionId is a server-generated UUID
-- and idempotencyKey is stored separately for deduplication.

ALTER TABLE payment_transactions ADD COLUMN idempotency_key VARCHAR(255);

UPDATE payment_transactions SET idempotency_key = transaction_id WHERE idempotency_key IS NULL;

ALTER TABLE payment_transactions ALTER COLUMN idempotency_key SET NOT NULL;

CREATE UNIQUE INDEX idx_idempotency_key ON payment_transactions(idempotency_key);
