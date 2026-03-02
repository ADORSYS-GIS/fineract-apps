-- Clean up any existing data (order matters due to FK constraints)
DELETE FROM notification_log;
DELETE FROM audit_log;
DELETE FROM income_distributions;
DELETE FROM reconciliation_reports;
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
    decimal_places, subscription_start_date, subscription_end_date,
    lp_client_id, lp_asset_account_id, lp_cash_account_id,
    fineract_product_id, version, created_at, updated_at)
VALUES ('asset-001', 'TST', 'TST', 'Test Asset', 'STOCKS', 'ACTIVE', 'MANUAL',
    100.00, 1000, 0, 0.005, 0,
    DATEADD('MONTH', -1, CURRENT_DATE), DATEADD('YEAR', 1, CURRENT_DATE),
    1, 400, 300, 10, 0, NOW(), NOW());

-- Pending asset for admin lifecycle tests
INSERT INTO assets (id, symbol, currency_code, name, category, status, price_mode,
    issuer_price, total_supply, circulating_supply, trading_fee_percent,
    decimal_places, subscription_start_date, subscription_end_date,
    lp_client_id, lp_asset_account_id, lp_cash_account_id,
    fineract_product_id, version, created_at, updated_at)
VALUES ('asset-002', 'PND', 'PND', 'Pending Asset', 'COMMODITIES', 'PENDING', 'MANUAL',
    50.00, 500, 0, 0.01, 0,
    DATEADD('MONTH', -1, CURRENT_DATE), DATEADD('YEAR', 1, CURRENT_DATE),
    1, 401, 301, 11, 0, NOW(), NOW());

-- Price data for active asset
INSERT INTO asset_prices (asset_id, current_price, day_open, day_high, day_low,
    day_close, change_24h_percent, updated_at, bid_price, ask_price)
VALUES ('asset-001', 100.00, 100.00, 100.00, 100.00, 100.00, 0, NOW(), 99.00, 101.00);

-- Price data for pending asset
INSERT INTO asset_prices (asset_id, current_price, day_open, day_high, day_low,
    day_close, change_24h_percent, updated_at)
VALUES ('asset-002', 50.00, 50.00, 50.00, 50.00, 50.00, 0, NOW());

-- Price history entries for history endpoint (id is auto-generated IDENTITY)
INSERT INTO price_history (asset_id, price, captured_at)
VALUES ('asset-001', 99.00, DATEADD('HOUR', -2, NOW()));

INSERT INTO price_history (asset_id, price, captured_at)
VALUES ('asset-001', 100.00, NOW());
