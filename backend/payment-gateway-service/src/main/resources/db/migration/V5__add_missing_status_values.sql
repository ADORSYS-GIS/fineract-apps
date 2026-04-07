-- Add EXPIRED, CANCELLED, REFUNDED to the status CHECK constraint.
-- The PaymentStatus enum has 7 values but V1 only allowed 4.
-- This caused the StaleTransactionCleanupScheduler to fail with a constraint violation
-- whenever it tried to set a transaction to EXPIRED.
-- Flyway wraps this in a transaction automatically on PostgreSQL.
ALTER TABLE payment_transactions DROP CONSTRAINT IF EXISTS chk_status;
ALTER TABLE payment_transactions ADD CONSTRAINT chk_status
  CHECK (status IN ('PENDING', 'PROCESSING', 'SUCCESSFUL', 'FAILED', 'EXPIRED', 'CANCELLED', 'REFUNDED'));
