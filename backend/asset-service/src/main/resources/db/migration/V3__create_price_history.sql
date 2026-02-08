CREATE TABLE price_history (
    id BIGSERIAL PRIMARY KEY,
    asset_id VARCHAR(36) NOT NULL REFERENCES assets(id),
    price DECIMAL(20,0) NOT NULL,
    captured_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_price_history_asset_captured ON price_history(asset_id, captured_at);
