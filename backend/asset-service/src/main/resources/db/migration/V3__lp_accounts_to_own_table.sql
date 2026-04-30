-- Move LP savings account IDs from the assets table to a dedicated liquidity_providers table.
-- Each LP (Fineract client) gets exactly one set of 3 accounts shared across all their assets.

CREATE TABLE liquidity_providers (
    client_id         BIGINT       PRIMARY KEY,
    client_name       VARCHAR(200),
    cash_account_id   BIGINT,
    spread_account_id BIGINT,
    tax_account_id    BIGINT,
    cash_account_no   VARCHAR(32),
    spread_account_no VARCHAR(32),
    tax_account_no    VARCHAR(32)
);

-- Seed from existing data: one row per LP, using accounts from their earliest-created asset.
INSERT INTO liquidity_providers (client_id, client_name, cash_account_id, spread_account_id, tax_account_id)
SELECT DISTINCT ON (lp_client_id)
    lp_client_id,
    lp_client_name,
    lp_cash_account_id,
    lp_spread_account_id,
    lp_tax_account_id
FROM assets
WHERE lp_client_id IS NOT NULL
ORDER BY lp_client_id, id ASC;

-- Capture orphan account IDs (per-asset accounts that are no longer the LP's canonical accounts).
-- The cleanup script reads this table to close them in Fineract after deployment.
CREATE TABLE orphan_lp_accounts (
    account_id   BIGINT,
    product_type VARCHAR(4),
    lp_client_id BIGINT
);

INSERT INTO orphan_lp_accounts (account_id, product_type, lp_client_id)
SELECT a.lp_cash_account_id, 'LSAV', a.lp_client_id
FROM assets a
JOIN liquidity_providers lp ON lp.client_id = a.lp_client_id
WHERE a.lp_cash_account_id IS NOT NULL
  AND a.lp_cash_account_id != lp.cash_account_id

UNION ALL

SELECT a.lp_spread_account_id, 'LSPD', a.lp_client_id
FROM assets a
JOIN liquidity_providers lp ON lp.client_id = a.lp_client_id
WHERE a.lp_spread_account_id IS NOT NULL
  AND a.lp_spread_account_id != lp.spread_account_id

UNION ALL

SELECT a.lp_tax_account_id, 'LTAX', a.lp_client_id
FROM assets a
JOIN liquidity_providers lp ON lp.client_id = a.lp_client_id
WHERE a.lp_tax_account_id IS NOT NULL
  AND a.lp_tax_account_id != lp.tax_account_id;

-- Remove the now-redundant columns from assets.
ALTER TABLE assets
    DROP COLUMN lp_cash_account_id,
    DROP COLUMN lp_spread_account_id,
    DROP COLUMN lp_tax_account_id,
    DROP COLUMN lp_client_name;
