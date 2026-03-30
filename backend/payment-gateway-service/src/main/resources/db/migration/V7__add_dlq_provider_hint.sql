-- Add provider_hint to store underlying payment provider for CinetPay reversals.
-- Without this, DLQ retry for CinetPay entries always posts to the wrong GL account.
ALTER TABLE reversal_dead_letters ADD COLUMN provider_hint VARCHAR(50);
