-- =============================================================================
-- Asset Service Schema
-- =============================================================================

-- Assets (tokenized digital assets backed by Fineract products)
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
    version BIGINT DEFAULT 0,
    CONSTRAINT chk_circulating_supply_non_negative CHECK (circulating_supply >= 0),
    CONSTRAINT chk_circulating_supply_max CHECK (circulating_supply <= total_supply)
);

CREATE INDEX idx_assets_status ON assets(status);
CREATE INDEX idx_assets_category ON assets(category);

-- Current asset prices (one row per asset)
CREATE TABLE asset_prices (
    asset_id VARCHAR(36) PRIMARY KEY REFERENCES assets(id),
    current_price DECIMAL(20,0) NOT NULL,
    previous_close DECIMAL(20,0),
    change_24h_percent DECIMAL(10,4),
    day_open DECIMAL(20,0),
    day_high DECIMAL(20,0),
    day_low DECIMAL(20,0),
    day_close DECIMAL(20,0),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Price history snapshots
CREATE TABLE price_history (
    id BIGSERIAL PRIMARY KEY,
    asset_id VARCHAR(36) NOT NULL REFERENCES assets(id),
    price DECIMAL(20,0) NOT NULL,
    captured_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_price_history_asset_captured ON price_history(asset_id, captured_at);

-- User portfolio positions
CREATE TABLE user_positions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    asset_id VARCHAR(36) NOT NULL REFERENCES assets(id),
    fineract_savings_account_id BIGINT NOT NULL,
    total_units DECIMAL(20,8) NOT NULL DEFAULT 0,
    avg_purchase_price DECIMAL(20,4) NOT NULL DEFAULT 0,
    total_cost_basis DECIMAL(20,0) NOT NULL DEFAULT 0,
    realized_pnl DECIMAL(20,0) NOT NULL DEFAULT 0,
    last_trade_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    version BIGINT DEFAULT 0,
    CONSTRAINT uq_user_positions UNIQUE (user_id, asset_id)
);

CREATE INDEX idx_user_positions_user ON user_positions(user_id);
CREATE INDEX idx_user_positions_asset ON user_positions(asset_id);

-- Trade orders
CREATE TABLE orders (
    id VARCHAR(36) PRIMARY KEY,
    idempotency_key VARCHAR(36) UNIQUE,
    user_id BIGINT NOT NULL,
    user_external_id VARCHAR(36) NOT NULL,
    asset_id VARCHAR(36) NOT NULL REFERENCES assets(id),
    side VARCHAR(4) NOT NULL,
    xaf_amount DECIMAL(20,0) NOT NULL,
    units DECIMAL(20,8),
    execution_price DECIMAL(20,0),
    fee DECIMAL(20,0),
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    failure_reason VARCHAR(500),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ,
    version BIGINT DEFAULT 0
);

CREATE INDEX idx_orders_user_status ON orders(user_id, status);
CREATE INDEX idx_orders_asset ON orders(asset_id, created_at);
CREATE INDEX idx_orders_user_created ON orders(user_id, created_at DESC);
CREATE INDEX idx_orders_user_asset ON orders(user_id, asset_id, created_at DESC);
CREATE INDEX idx_orders_stale_cleanup ON orders(status, created_at)
    WHERE status IN ('PENDING', 'EXECUTING');

-- Executed trade log
CREATE TABLE trade_log (
    id VARCHAR(36) PRIMARY KEY,
    order_id VARCHAR(36) NOT NULL REFERENCES orders(id),
    user_id BIGINT NOT NULL,
    asset_id VARCHAR(36) NOT NULL REFERENCES assets(id),
    side VARCHAR(4) NOT NULL,
    units DECIMAL(20,8) NOT NULL,
    price_per_unit DECIMAL(20,0) NOT NULL,
    total_amount DECIMAL(20,0) NOT NULL,
    fee DECIMAL(20,0) NOT NULL DEFAULT 0,
    realized_pnl DECIMAL(20,0),
    fineract_cash_transfer_id BIGINT,
    fineract_asset_transfer_id BIGINT,
    executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_trade_log_user ON trade_log(user_id, executed_at);
CREATE INDEX idx_trade_log_asset ON trade_log(asset_id, executed_at DESC);
CREATE INDEX idx_trade_log_order ON trade_log(order_id);
CREATE INDEX idx_trade_log_user_asset ON trade_log(user_id, asset_id);

-- User favorite assets
CREATE TABLE user_favorites (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    asset_id VARCHAR(36) NOT NULL REFERENCES assets(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_user_favorites UNIQUE (user_id, asset_id)
);

CREATE INDEX idx_user_favorites_user ON user_favorites(user_id);
