-- Clean up any existing data (order matters due to FK constraints)
DELETE FROM notification_log;
DELETE FROM audit_log;
DELETE FROM income_distributions;
DELETE FROM reconciliation_reports;
DELETE FROM purchase_lots;
DELETE FROM price_history;
DELETE FROM trade_log;
DELETE FROM orders;
DELETE FROM user_positions;
DELETE FROM user_favorites;
DELETE FROM asset_prices;
DELETE FROM assets;

-- Active asset for integration tests
INSERT INTO assets (id, symbol, currency_code, name, category, status, price_mode,
    issuer_price, total_supply, circulating_supply, trading_fee_percent,
    decimal_places,
    lp_client_id, lp_asset_account_id, lp_cash_account_id,
    fineract_product_id, version, created_at, updated_at,
    registration_duty_enabled, registration_duty_rate, ircm_enabled, ircm_rate_override,
    ircm_exempt, capital_gains_tax_enabled, capital_gains_rate, is_bvmac_listed, is_government_bond)
VALUES ('asset-001', 'TST', 'TST', 'Test Asset', 'STOCKS', 'ACTIVE', 'MANUAL',
    100.00, 1000, 0, 0.005, 0,
    1, 400, 300, 10, 0, NOW(), NOW(),
    true, 0.0200, true, null, false, true, 0.1650, false, false);

-- Pending asset for admin lifecycle tests
INSERT INTO assets (id, symbol, currency_code, name, category, status, price_mode,
    issuer_price, total_supply, circulating_supply, trading_fee_percent,
    decimal_places,
    lp_client_id, lp_asset_account_id, lp_cash_account_id,
    fineract_product_id, version, created_at, updated_at,
    registration_duty_enabled, registration_duty_rate, ircm_enabled, ircm_rate_override,
    ircm_exempt, capital_gains_tax_enabled, capital_gains_rate, is_bvmac_listed, is_government_bond)
VALUES ('asset-002', 'PND', 'PND', 'Pending Asset', 'COMMODITIES', 'PENDING', 'MANUAL',
    50.00, 500, 0, 0.01, 0,
    1, 401, 301, 11, 0, NOW(), NOW(),
    true, 0.0200, true, null, false, true, 0.1650, false, false);

-- Price data for active asset
INSERT INTO asset_prices (asset_id, bid_price, ask_price, day_open, day_high, day_low,
    day_close, change_24h_percent, updated_at)
VALUES ('asset-001', 99.00, 101.00, 100.00, 100.00, 100.00, 100.00, 0, NOW());

-- Price data for pending asset
INSERT INTO asset_prices (asset_id, bid_price, ask_price, day_open, day_high, day_low,
    day_close, change_24h_percent, updated_at)
VALUES ('asset-002', 49.00, 51.00, 50.00, 50.00, 50.00, 50.00, 0, NOW());

-- Price history entries for history endpoint (id is auto-generated IDENTITY)
INSERT INTO price_history (asset_id, price, captured_at)
VALUES ('asset-001', 99.00, DATEADD('HOUR', -2, NOW()));

INSERT INTO price_history (asset_id, price, captured_at)
VALUES ('asset-001', 100.00, NOW());
