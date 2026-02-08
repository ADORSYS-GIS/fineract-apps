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
