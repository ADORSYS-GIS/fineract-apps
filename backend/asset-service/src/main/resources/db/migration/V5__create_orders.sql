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
