-- V18: Refactor from Treasury (direct issuer) to Liquidity Partner (reseller) model
--
-- Key changes:
--   1. Add issuer_name and issuer_price fields (issuer = original asset creator)
--   2. Rename treasury → liquidity partner (LP = reseller who sells on platform)
--   3. Add per-asset LP spread collection account
--   4. Drop old treasury columns (no production data exists)
--   5. Drop spread_percent (LP sets bid/ask directly)

-- ============================================================================
-- 1. Add issuer fields
-- ============================================================================

-- issuerName: required for bonds, optional for others
ALTER TABLE assets ADD COLUMN issuer_name VARCHAR(255);

-- issuerPrice: face value (bonds) or wholesale price (other types)
ALTER TABLE assets ADD COLUMN issuer_price DECIMAL(20, 8);

-- Migrate existing bond issuer data
UPDATE assets SET issuer_name = issuer WHERE issuer IS NOT NULL;

-- Set issuer_price from manual_price for any existing assets
UPDATE assets SET issuer_price = manual_price WHERE manual_price IS NOT NULL;

-- ============================================================================
-- 2. Add LP columns (replacing treasury)
-- ============================================================================

ALTER TABLE assets ADD COLUMN lp_client_id BIGINT;
ALTER TABLE assets ADD COLUMN lp_client_name VARCHAR(200);
ALTER TABLE assets ADD COLUMN lp_asset_account_id BIGINT;
ALTER TABLE assets ADD COLUMN lp_cash_account_id BIGINT;
ALTER TABLE assets ADD COLUMN lp_spread_account_id BIGINT;

-- Migrate existing treasury data to LP columns
UPDATE assets SET
    lp_client_id = treasury_client_id,
    lp_client_name = treasury_client_name,
    lp_asset_account_id = treasury_asset_account_id,
    lp_cash_account_id = treasury_cash_account_id;

-- Make lp_client_id NOT NULL after migration
ALTER TABLE assets ALTER COLUMN lp_client_id SET NOT NULL;

-- ============================================================================
-- 3. Drop old columns (safe — no production data)
-- ============================================================================

ALTER TABLE assets DROP COLUMN treasury_client_id;
ALTER TABLE assets DROP COLUMN treasury_client_name;
ALTER TABLE assets DROP COLUMN treasury_asset_account_id;
ALTER TABLE assets DROP COLUMN treasury_cash_account_id;
ALTER TABLE assets DROP COLUMN issuer;
ALTER TABLE assets DROP COLUMN spread_percent;
