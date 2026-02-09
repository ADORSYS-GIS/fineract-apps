-- Remove unused annual_yield column
ALTER TABLE assets DROP COLUMN annual_yield;

-- Make treasury_cash_account_id nullable (now auto-derived during provisioning)
ALTER TABLE assets ALTER COLUMN treasury_cash_account_id DROP NOT NULL;
