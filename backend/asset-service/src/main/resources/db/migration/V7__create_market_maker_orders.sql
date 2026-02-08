CREATE TABLE market_maker_orders (
    id VARCHAR(36) PRIMARY KEY,
    asset_id VARCHAR(36) NOT NULL REFERENCES assets(id),
    side VARCHAR(4) NOT NULL,
    price DECIMAL(20,0) NOT NULL,
    quantity DECIMAL(20,8) NOT NULL,
    remaining_quantity DECIMAL(20,8) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);

CREATE INDEX idx_mm_orders_asset_side ON market_maker_orders(asset_id, side, is_active, price);
