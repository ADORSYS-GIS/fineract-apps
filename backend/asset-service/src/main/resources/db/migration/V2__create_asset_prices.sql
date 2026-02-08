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
