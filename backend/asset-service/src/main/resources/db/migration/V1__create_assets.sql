CREATE TABLE assets (
    id VARCHAR(36) PRIMARY KEY,
    fineract_product_id INTEGER UNIQUE,
    symbol VARCHAR(10) NOT NULL UNIQUE,
    currency_code VARCHAR(10) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(1000),
    image_url VARCHAR(500),
    category VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    price_mode VARCHAR(10) NOT NULL DEFAULT 'MANUAL',
    manual_price DECIMAL(20,8),
    decimal_places INTEGER NOT NULL DEFAULT 0,
    total_supply DECIMAL(20,8) NOT NULL,
    circulating_supply DECIMAL(20,8) NOT NULL DEFAULT 0,
    trading_fee_percent DECIMAL(5,4) DEFAULT 0.0050,
    spread_percent DECIMAL(5,4) DEFAULT 0.0100,
    expected_launch_date DATE,
    treasury_client_id BIGINT NOT NULL,
    treasury_asset_account_id BIGINT,
    treasury_cash_account_id BIGINT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ,
    version BIGINT DEFAULT 0
);

CREATE INDEX idx_assets_status ON assets(status);
CREATE INDEX idx_assets_category ON assets(category);
