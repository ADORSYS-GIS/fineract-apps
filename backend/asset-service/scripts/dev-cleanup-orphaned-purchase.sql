-- Dev-only cleanup: orphaned partial purchase on asset 404f8030-d780-455d-8c15-6cacf8c17397
--
-- Root cause: Fineract batch failed mid-execution but asset-service DB writes partially committed,
-- leaving the DB in an inconsistent state (POSITION_MISMATCH, SUPPLY_MISMATCH, TAX_ACCOUNT_MISMATCH).
--
-- Prerequisites:
--   1. Confirm the Resolve button works (permitAllAdmin: true deployed to dev).
--   2. Verify exact row counts match expectations before running COMMIT.
--   3. Run SELECT statements first to inspect affected rows.
--   4. After cleanup, click Resolve on each open reconciliation report.

BEGIN;

-- 1. Reset circulating_supply: 2 units are stuck in LP asset account (not with any user).
--    Set supply to match what Fineract LP account actually holds.
UPDATE assets
SET circulating_supply = (total_supply - 2)
WHERE id = '404f8030-d780-455d-8c15-6cacf8c17397';

-- Verify before continuing:
-- SELECT id, symbol, total_supply, circulating_supply FROM assets WHERE id = '404f8030-d780-455d-8c15-6cacf8c17397';

-- 2. Remove orphaned user position (user holds 2 units in DB but 0 in Fineract).
DELETE FROM user_positions
WHERE asset_id = '404f8030-d780-455d-8c15-6cacf8c17397'
  AND total_units = 2;

-- 3. Remove orphaned tax_transaction created during the failed purchase.
--    Targets the most recent COMMITTED tax record for this asset.
DELETE FROM tax_transactions
WHERE asset_id = '404f8030-d780-455d-8c15-6cacf8c17397'
  AND status = 'COMMITTED'
  AND created_at = (
      SELECT MAX(created_at)
      FROM tax_transactions
      WHERE asset_id = '404f8030-d780-455d-8c15-6cacf8c17397'
  );

-- 4. Revert the orphaned order to FAILED so it doesn't appear as a ghost FILLED order.
UPDATE orders
SET status = 'FAILED',
    failure_reason = 'Orphaned order: Fineract batch failed but DB wrote partial state. Cleaned up manually.'
WHERE asset_id = '404f8030-d780-455d-8c15-6cacf8c17397'
  AND status IN ('EXECUTING', 'FILLED')
  AND created_at > NOW() - INTERVAL '30 days';

COMMIT;
