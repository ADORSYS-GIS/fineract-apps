CREATE TABLE user_positions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    asset_id VARCHAR(36) NOT NULL REFERENCES assets(id),
    fineract_savings_account_id BIGINT NOT NULL,
    total_units DECIMAL(20,8) NOT NULL DEFAULT 0,
    avg_purchase_price DECIMAL(20,0) NOT NULL DEFAULT 0,
    total_cost_basis DECIMAL(20,0) NOT NULL DEFAULT 0,
    realized_pnl DECIMAL(20,0) NOT NULL DEFAULT 0,
    last_trade_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    version BIGINT DEFAULT 0,
    CONSTRAINT uq_user_positions UNIQUE (user_id, asset_id)
);

CREATE INDEX idx_user_positions_user ON user_positions(user_id);
